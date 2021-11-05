const path = require("path");
const urls = require(path.resolve("src/data/urls-data"));
const uses = require(path.resolve("src/data/uses-data"));

function useExists(req, res, next) {
  const useId = Number(req.params.useId);
//   const foundUrl = urls.find((url) => url.id === urlId);
  const foundUse = uses.find((use) => use.id === useId);  
  if (foundUse) {
    res.locals.use = foundUse
    return next();
  }
  next({
    status: 404,
    message: `Use id not found: ${req.params.useId}`,
  });
}

function readUseId (req, res) {
    res.json({ data: res.locals.use });
}
function readUse(req, res) {
  res.json({ data: uses });
}

function destroy(req, res) {
    const { useId } = req.params;
    const idx = uses.find((use, idx) => use.id === Number(useId))
    const deleteUses = uses.splice(idx,1);
    res.sendStatus(204)
}

module.exports = {
    readUseId: [useExists, readUseId],
    destroy: [useExists, destroy],
    readUse,
    
}