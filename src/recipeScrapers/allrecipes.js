export const findAll = (name, attribs, query, recipe) => {
  // Specific to how data is stored on allrecipes.com
  if (name === "a" && attribs.class === "fixed-recipe-card__title-link ng-isolate-scope") {
    recipe.link = attribs.href;
  }
  if (name === "img" && attribs.class === "fixed-recipe-card__img ng-isolate-scope") {
    recipe.title = attribs.title;
    recipe.description = attribs.alt.split('-')[1];
    recipe.src = attribs['data-original-src'];
    recipe.type = query;
    recipe.extra = '';
  }

  return recipe;
}