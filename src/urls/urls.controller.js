const path = require("path");
const urls = require(path.resolve("src/data/urls-data"));
const uses = require(path.resolve("src/data/uses-data"));

function readUrl(req, res, next) {
  const urlId = Number(req.params.urlId);
  const foundUrl = urls.find((url) => url.id === urlId);
  const foundUse = uses.find((use) => Number(use.urlId) === urlId);
  //Getting a bug when trying to return "records use of existing short url" because the uses array is empty for this route "/urls/:urlId"
  console.log(uses);// empty array
  console.log(foundUse)// undefined due to uses are empty
  if (foundUrl) {
      res.json({ data: foundUrl });
  }
  if (foundUse) {
      console.log(foundUse)
      res.json({ data: foundUse });
  }
  next({
    status: 404,
    message: `Url id not found: ${req.params.urlId}`,
  });
}

function urlExists(req, res, next) {
  const urlId = Number(req.params.urlId);
  const foundUrl = urls.find((url) => url.id === urlId);
  const foundUse = uses.find((use) => Number(use.urlId) === urlId);  
  if (foundUrl) {    
    res.locals.url = foundUrl;
    next();
  } 
  if (foundUse) { 
    res.locals.useUrl = foundUse;
    next();   
  } 
  next({
    status: 404,
    message: `Url id not found: ${req.params.urlId}`,
  });
}

function readUse(req, res) {
  res.json({data: [res.locals.use]})
}

function useIdExists(req, res, next) {
    const useId = Number(req.params.useId);
    const foundUseId = uses.find((use) => use.id === useId);
    if (!foundUseId) {
       next({
            status: 404,
            message: `Use id not found: ${req.params.useId}`,
          });        
    } else {
        res.locals.useId = foundUseId;
        return next(); 
    }
}
function useExists(req, res, next) {
  const urlId = Number(req.params.urlId);
  const foundUse = uses.find((use) => use.urlId === urlId);     
  if (foundUse) {
    res.locals.use = foundUse
    return next();
  }
  next({
    status: 404,
    message: `Use id not found: ${req.params.urlId}`,
  });
}

function hasHref(req, res, next) {
  const { data: { href } = {} } = req.body;
  if (href) {
    return next();
  }
  next({ status: 400, message: "A 'href' property is required." });
}

function readUseId(req, res) {
  res.json({ data: res.locals.useId });
}

function list(req, res) {
  res.json({ data: urls });
}

function create(req, res) {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    id: urls.length + 1,
    href 
  };
  res.status(201).json({ data: newUrl });
}


function update(req, res) {
    const originalHref = res.locals.url.href;
    const { data : { href }} = req.body;
    if (originalHref !== href ) {
        res.locals.url.href = href;
    }
    res.json({data: res.locals.url})
}

function destroy(req, res) {
    const { useId } = req.params;
    const idx = uses.findIndex((use) => use.id === Number(useId));
    const deletedUses = uses.splice(idx, 1);
    res.sendStatus(204);
}


function readUseOfUrlId (req, res, next) {
    const { urlId } = req.params;
    const foundUse = uses.find((use,idx) => use.urlId === Number(urlId));
    if (foundUse !== undefined) {
    res.json({data : foundUse})
    } next({
    status: 404,
    message: `Uses id not found: ${req.params.urlId}`,
    })
}
module.exports = {  
    create: [hasHref, create],
//     read: [urlExists, readUrl],
    read: [readUrl],
    readUse: [useExists, readUse],
    readUseId: [urlExists, useIdExists, readUseId],
    update: [urlExists, hasHref, update],
    destroy: [urlExists, useIdExists, destroy],
    list
}