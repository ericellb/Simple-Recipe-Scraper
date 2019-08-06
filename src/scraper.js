var htmlparser = require("htmlparser2");
var _ = require('lodash');
var fs = require('fs');
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

// Includes specific endspoints for different sites were scraping from
let types = {
  allrecipes: {
    american: 'https://www.allrecipes.com/recipes/236/us-recipes/',
    chinese: 'https://www.allrecipes.com/recipes/695/world-cuisine/asian/chinese/',
    mexican: 'https://www.allrecipes.com/recipes/728/world-cuisine/latin-american/mexican/',
    italian: 'https://www.allrecipes.com/recipes/723/world-cuisine/european/italian/',
    japanese: 'https://www.allrecipes.com/recipes/699/world-cuisine/asian/japanese/',
    greek: 'https://www.allrecipes.com/recipes/731/world-cuisine/european/greek/',
    french: 'https://www.allrecipes.com/recipes/721/world-cuisine/european/french/',
    thai: 'https://www.allrecipes.com/recipes/702/world-cuisine/asian/thai/',
    indian: 'https://www.allrecipes.com/recipes/233/world-cuisine/asian/indian/',
    vegan: 'https://www.allrecipes.com/recipes/1227/everyday-cooking/vegan/',
    lowCarb: 'https://www.allrecipes.com/recipes/742/healthy-recipes/low-carb/',
    glutenFree: 'https://www.allrecipes.com/recipes/741/healthy-recipes/gluten-free/',
    default: 'https://www.allrecipes.com/search/results/?wt='
  },
  hellofresh: {
    american: 'https://www.hellofresh.com/recipes/american-cuisine?order=-rating',
    chinese: 'https://www.hellofresh.com/recipes/chinese-cuisine?order=-rating',
    mexican: 'https://www.hellofresh.com/recipes/mexican-cuisine?order=-rating',
    italian: 'https://www.hellofresh.com/recipes/italian-cuisine?order=-rating',
    japanese: 'https://www.hellofresh.com/recipes/japanese-cuisine?order=-rating',
    greek: 'https://www.hellofresh.com/recipes/greek-cuisine?order=-rating',
    french: 'https://www.hellofresh.com/recipes/french-cuisine?order=-rating',
    thai: 'https://www.hellofresh.com/recipes/thai-cuisine?order=-rating',
    indian: 'https://www.hellofresh.com/recipes/indian-cuisine?order=-rating',
    default: 'https://www.hellofresh.com/recipes/search/?q='
  }
}

let recipes = [];
let recipe = {
  title: null,
  description: null,
  src: null,
  link: null,
  type: null,
  extra: null
}

let found = {
  text: false,
  src: false,
  description: false,
  link: false,
  extra: false
}

// HTTP Request for data
const scraper = async (api, query) => {

  let queryURL = '';

  for (var type in types[api]) {
    if (query === type.toString()) {
      queryURL = types[api][type];
      break;
    }
    else if (type === 'default') {
      queryURL = types[api][type] + query;
    }
  }

  puppeteer.use(pluginStealth());

  // Hit puppeteer with our url
  puppeteer
    .launch({
      headless: true
    })
    .then(browser => browser.newPage())
    .then(page => {
      return page.goto(queryURL).then(function () {
        return page.waitFor(1000).then(function () {
          return page.content();
        })
      });
    })
    .then(html => {
      parser.write(html);
      parser.end();
      try {
        fs.writeFile(`./data/${api}-${query}.json`, JSON.stringify(recipes), (err) => {
          if (!err)
            console.log(`Successfully wrote data to /data/${api}-${query} using query : ${query}`);
        })
      }
      catch (err) {
      }
    })
    .catch(console.error);
}


// htmlparser2 
var parser = new htmlparser.Parser({
  onopentag: function (name, attribs) {
    // Specific to how data is stored on allrecipes.com
    recipe = findAll(name, attribs, query, recipe, found);
  },
  ontext: function (text) {
    if (found.description)
      recipe.description = text;
    if (found.extra)
      recipe.extra = text;

  },
  onclosetag: function (tagname) {
    // If recipe obj doesnt have empty param, push it to our array!
    if (recipe.title !== null && recipe.description !== null && recipe.src !== null && recipe.link !== null && recipe.query !== null && recipe.extra !== null) {
      // Clone our recipe into our recipes array
      recipes = [...recipes, _.cloneDeep(recipe)];

      // Empty the recipe to fill with next one!
      for (var key in recipe) {
        recipe[key] = null;
      }
    }

    // Set all our found values to false again
    for (var key in found) {
      found[key] = false;
    }
  }
}, { decodeEntities: true });



// Specify API Endpoint (allrecipes, hellofresh etc...)
const api = process.argv[2];

// Specify Search Query or cuisineType
const query = process.argv[3];

// Load findall function from api were using
var { findAll } = require(`./recipeScrapers/${api}`);

// Get data with HTTP Request and Scrape it
scraper(api, query);
