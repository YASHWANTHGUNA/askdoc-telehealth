const express = require("express");
const streamController = require("../controller/streamController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

// Protect all routes in this file
router.use(isAuthenticated);

router.get("/get-token", streamController.getToken);

module.exports = router;