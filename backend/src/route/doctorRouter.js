const express = require("express");
const crudOperations = require("../services/crudOperations");
const router = express.Router();

// Import middleware
const auth = require("../middleware/auth")
const { admin, doctor } = require("../middleware/roles")

/*
    =============================================================
    -- crud operation [ get - add - update - delete] on router --
    =============================================================
*/

// 1. get all doctor with secure api 
router.get("/", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.getALL("doctor"));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// 2. add new doctor
router.post("/add", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.createtObject("doctor", ["name", "password", "specialist", "clinic_id"], req.body.name, req.body.password, req.body.specialist, req.body.clinic_id));
        // res.json(await crudOperations.addObject("doctor", req.body.name, req.body.password, req.body.specialist, req.body.clinic_id,));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// 3. Update doctor with secure api 
router.put("/update/:id", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.updateObject("doctor", req.params.id, ["name", "password", "specialist", "clinic_id"], req.body.name, req.body.password, req.body.specialist, req.body.clinic_id));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// 4. delete exist a doctor
router.delete("/delete/:id", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.deleteObject("doctor", req.params.id));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

/*
    ====================================================================
    -- custom crud operation [ get - add - update - delete] on router --
    ====================================================================
*/

// get not available doctor in one clinic
router.get("/get-doctor-not-available/:id", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.customGetNotAvailable(req.params.id));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// control with doctor router
// get patient
router.get("/control-get-patient", [ auth, doctor ], async function (req, res) {
    try {
        res.json(await crudOperations.con_getPatient(req.profileInfo.clinic_id));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// update patient ticket router
// 3. Update doctor with secure api 
router.put("/control-update/:id", [ auth, doctor ], async function (req, res) {
    try {
        res.json(await crudOperations.con_updatePatientTicket("0", req.params.id));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

module.exports = router;
