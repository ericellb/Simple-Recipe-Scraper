export const findAll = (name, attribs, query, recipe, found) => {
  // Recipe Image
  if (name === "img" && attribs.class === "fela-xum59n") {
    recipe.src = attribs.src;
    recipe.title = attribs.alt;
    recipe.type = query;
  }
  // Recipe Description
  if (name === "p" && (attribs.class === "fela-1ou4ovv" || attribs.class === "fela-1p9iewq")) {
    found.description = true;
  }
  // Recipe Link
  if (name === "a" && attribs.class === "fela-ksgbu1") {
    recipe.link = `http://hellofresh.com${attribs.href}`;
  }
  if (name === 'span' && attribs.class === "fela-18emzam") {
    found.extra = true;
  }

  return recipe;
}