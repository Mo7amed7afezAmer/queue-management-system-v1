const express = require("express");
const crudOperations = require("../services/crudOperations");
const router = express.Router();

// Import middleware
const auth = require("../middleware/auth")
const { admin, patient } = require("../middleware/roles")

/*
    =============================================================
    -- crud operation [ get - add - update - delete] on router --
    =============================================================
*/

// 1. get all clinics
router.get("/", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.getALL("clinic"));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// 2. add new clinic
router.post("/add", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.createtObject("clinic", ["name", "start_time", "end_time"], req.body.name, req.body.stime, req.body.etime));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// 3. update clinic
router.put("/update/:doctorId", [ auth, admin ], async function (req, res, next) {
    try {
        res.json(await crudOperations.customUpdateClinic(req.body.cname, req.body.cstart, req.body.cend, req.body.clinicId, req.params.doctorId));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});
// router.put("/update/:id", [ auth, admin ], async function (req, res, next) {
//     try {
//         // res.json(await crudOperations.updateObject("clinic", req.params.id, ["name", "start_time", "end_time"], req.body.name, req.body.cstart, req.body.cend));
//         req.updateClinic = await crudOperations.updateObject("clinic", req.params.id, ["name", "start_time", "end_time"], req.body.name, req.body.cstart, req.body.cend);
//     } catch (err) {
//         console.error(`Error while update user `, err.message);
//     }
//     next();
// }, async function (req, res) {
//     try {
//         res.json(await crudOperations.simpleUpdate("doctor", req.body.cstatus, req.body.doctorId) || req.updateClinic);
//         // res.send(req.updateClinic);
//     } catch (err) {
//         console.error(`Error while update user `, err.message);
//     }
// });

// testUpdate


// 4. delete exist a clinic
router.delete("/delete/:id", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.deleteObject("clinic", req.params.id));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

/*
    ====================================================================
    -- custom crud operation [ get - add - update - delete] on router --
    ====================================================================
*/

// get available or not available clinic data
router.get("/get-custom/:id", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.customFetchClinic(req.params.id));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// updataClinicStatus(cname, cstatus, cstart, cend, id)
// // update clinic status
router.put("/update-status", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.updataClinicStatus(req.body.name, req.body.cstart, req.body.cend, req.body.cstatus, req.body.clinicId, req.body.doctorId));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

/* ********* media display router *************** */
// get clinics for display
router.get("/data-for-display", async function (req, res) {
    try {
        res.json(await crudOperations.getClinicForDisplay());
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});
// get clinics for display === ?
router.get("/display-display", async function (req, res) {
    try {
        res.json(await crudOperations.DisplayDisplay());
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});
// get max numberTicket
router.get("/max-ticket-number/:clinicId", async function (req, res) {
    try {
        res.json(await crudOperations.getMaxticketNumber(req.params.clinicId));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});
// get min numberTicket
router.get("/update-patient-number-display", async function (req, res) {
    try {
        res.json(await crudOperations.updatePatientForDisplay());
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// ************************ ticket
router.post("/add-ticket", [ auth, patient ], async function (req, res) {
    try {
        res.json(await crudOperations.createtObject("ticket", ["patient_id", "ticket_status", "clinic_id"], req.body.patientId, req.body.ticketNumber, req.body.clinicId));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});


module.exports = router;
