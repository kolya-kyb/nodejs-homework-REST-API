
const express = require("express");

const ctrl = require("../../controllers/auth")

const {validateBody} = require("../../utils");

const {authenticate, upload, resizeAvatar} = require("../../middlewares");

const {schemas} = require("../../models/users");

const router = express.Router();

// signup
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

// // signing
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
//
router.get("/current", authenticate, ctrl.getCurrent);
//
router.post("/logout", authenticate, ctrl.logout);
//
router.patch("/", authenticate, validateBody(schemas.updateSubscription), ctrl.updateSubscription )

router.patch("/avatars", authenticate, upload.single("avatar"), resizeAvatar, ctrl.updateAvatar)

module.exports = router;