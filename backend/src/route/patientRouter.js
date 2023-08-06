const express = require("express");
const crudOperations = require("../services/crudOperations");
const router = express.Router();

// Import middleware
const auth = require("../middleware/auth")
const { admin } = require("../middleware/roles")

/*
    =============================================================
    -- crud operation [ get - add - update - delete] on router --
    =============================================================
*/

// 1. get all patient with secure api 
router.get("/:pstatus?:pdate?:pclinic?", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.customFetchPatient(req.query.pstatus, req.query.pdate, req.query.pclinic))
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// 2. add new patient
router.post("/add", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.createtObject("patient", ["name", "password", "age", "register_date"], req.body.name, req.body.password, req.body.age, new Date()));
    } catch (err) {
        console.error(`Error while update user `, err.message);
    }
});

// 3. Update patient with secure api 
// router.put("/update/:id", [ auth, admin ], async function (req, res) {
//     try {
//         res.json(await crudOperations.updateObject("doctor", req.params.id, ["name", "password", "specialist", "clinic_id"], req.body.name, req.body.password, req.body.specialist, req.body.clinic_id));
//     } catch (err) {
//         console.error(`Error while update user `, err.message);
//     }
// });

// 4. delete exist a patient
router.delete("/delete/:id", [ auth, admin ], async function (req, res) {
    try {
        res.json(await crudOperations.deleteObject("patient", req.params.id));
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
// router.get("/get-doctor-not-available/:id", [ auth, admin ], async function (req, res) {
//     try {
//         res.json(await crudOperations.customGetNotAvailable(req.params.id));
//     } catch (err) {
//         console.error(`Error while update user `, err.message);
//     }
// });



module.exports = router;
