// Import dependencies
const express = require("express");
const db = require("../services/db");
const crudOperations = require("../services/crudOperations")  // Import crud operations

// Create router object
const router = express.Router();

// auth router => admin
router.post("/", async function (req, res, next) {
    try {
        // res.json(await crudOperations.isLogin(req.body.name, req.body.password));
        req.authData = await crudOperations.isLogin("doctor", req.body.name, req.body.password);
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
    next();
});

// login patient router
router.post("/patient-login", async function (req, res, next) {
    try {
        // res.json(await crudOperations.isLogin(req.body.name, req.body.password));
        req.authData = await crudOperations.isLogin("patient", req.body.name, req.body.password);
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
    next();
});
// register patient router
router.post("/patient-register", async function (req, res, next) {
    try {
        // res.json(await crudOperations.isLogin(req.body.name, req.body.password));
        req.isRegister = await crudOperations.createtObject("patient", ["name", "password", "age", "register_date"], req.body.name, req.body.password, req.body.age, new Date());
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
    next();
}, async function (req, res, next) {
    try {
        if (req.isRegister.ok) {
            req.authData = await crudOperations.isLogin("patient", req.body.name, req.body.password);
        } else {
            req.authData = req.isRegister;
        }
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
    next();
});

module.exports = router