const express = require("express");
const ctrl = require("../../controllers/contacts")
const {validateBody} = require("../../utils");
const { schemas } = require("../../models/contacts")
const { authenticate } = require("../../middlewares/");

const router = express.Router();

router.get("/",authenticate, ctrl.listContacts)

router.get("/:id", authenticate,  ctrl.getById)

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.addContact)

router.put("/:id", authenticate,  validateBody(schemas.updateSchema), ctrl.updateContact)

router.patch("/:id/favorite", authenticate, validateBody(schemas.updateStatusSchema), ctrl.updateStatusContact);

router.delete("/:id", authenticate, ctrl.removeContact)

module.exports = router;
