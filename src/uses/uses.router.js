const router = require("express").Router({mergeParams: true});
const controller = require("./uses.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/:useId")
    .get(controller.readUseId)
    .delete(controller.destroy)
//     .post(controller.create)
    .all(methodNotAllowed)

router
    .route("/")
    .get(controller.readUse)
//     .post(controller.create)
    .all(methodNotAllowed)

module.exports = router;
