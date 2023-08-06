// Import dependecies
const jwt = require("jsonwebtoken");
const db = require("./db");
const { langs } = require("./langs");

/*
    ======================
    -- services methods --
    ======================
*/

// isLogin
async function isLogin(table, name, pass) {
    try {

        // variables
        let sql = `SELECT * FROM ${table} WHERE name = ? AND password = ?`;

        // execute query on db, get user
        let user = await db.execute(sql, [name, pass]) // {id: 1, name: "mohamed", password: "101"}
        
        // Check if the user is not there in db return error
        if (!user[0].length > 0) return {
            ok: false,
            error: `invalid name or password`
        }
        console.log(user[0])
        // Create token
        const token = jwt.sign({
            id: user[0].id,
            roles: user[0],
        }, "jwtPrivateKey", { expiresIn: "7d" });

        // return user to client
        return {
            ok: true,
            token: token,
            profileInfo: user[0]
        };

    } catch(err) {
        return err.message;
    }

}

// check the data
async function checkData(table, col, val) {
    try {
        // variables
        let sql = `SELECT * from ${table} WHERE ${ col } = ?`;
        let rows = await db.execute(sql, [ val ]);
        if (rows[0].length > 0) {
            return {
                ok: true,
                message: langs("checkMessage", rows[0].length)
            }
        } else {
            return {
                ok: false,
                error: langs("checkError", rows[0].length)
            }
        }

    } catch(err) {
        return err.message;
    }
}

// restore default value
async function resetDoctorStatus() {
    try {
        
        // variables
        let sql = `
                    UPDATE clinic 
                    INNER JOIN doctor ON doctor.clinic_id = clinic.id 
                    SET doctor.d_available = 0
                    WHERE clinic.end_time < TIME(NOW()) OR (clinic.end_time > TIME(NOW()) AND doctor.d_available = 0 )
                    `;

        
        // update data from DB
        let rows = await db.execute(sql);
        // true 
        if (rows[0].affectedRows > 0) {
            return {
                ok: true,
                message: langs("addMessage", rows[0].affectedRows),
            }
        } else {
            return {
                ok: false,
                error: langs("addMessage", rows[0].affectedRows)
            }
        }

    } catch(err) {
        return err.message;
    }
}
async function deleteTickets() {
    try {
        
        // variables
        let sql = `
                    DELETE ticket FROM ticket 
                    INNER JOIN clinic ON ticket.clinic_id = clinic.id 
                    WHERE clinic.end_time < TIME(NOW())
                    `;

        
        // update data from DB
        let rows = await db.execute(sql);
        // true 
        if (rows[0].affectedRows > 0) {
            return {
                ok: true,
                message: langs("addMessage", rows[0].affectedRows),
            }
        } else {
            return {
                ok: false,
                error: langs("addMessage", rows[0].affectedRows)
            }
        }

    } catch(err) {
        return err.message;
    }
}


/*
    ===============================================================
    -- crud operation [ get - add - update - delete] on Database --
    ===============================================================
*/

// 1. Get all
async function getALL(table) {
    try {
        
        // Variables
        let sql = `SELECT * FROM ${table} WHERE ?`;

        // Execute query on DB
        let rows = await db.execute(sql, [1]);

        // Check if doctors are not there in db return error
        if (rows[0].length < 1) return {
            ok: false,
            error: `not found doctors`
        }

        return {
            ok: true,
            length: rows[0].length,
            content: rows[0]
        };

    } catch (err) {
        return err.message;
    }
}

// 2. add
async function createtObject(table, [...cols], ...values) {
    try {
         /*
             ------------------------------------
             --- Steps to insert data into DB ---
             ------------------------------------
             a. check the data is exist or is not
             b. validation on server
             c. validation on DB  ==> not exist
             d. insert data into DB
         */
 
         // general settings ******************************
         // to create dynamic sql query
         let newCols = "";
         let placeValue = "";
     
         for (let i = 1; i <= cols.length; i++) {
             newCols = `${newCols} ${cols[i-1]},`;
             placeValue = `${placeValue} ?,`;
         }
         newCols = `(${newCols.slice(0, -1)} )`;            //  (  name, password, email )
         placeValue = `(${placeValue.slice(0, -1)} )`;     //  (?, ?, ?)
 
         // *************************************** end settings
 
         // variables 🚩 ✅
         let sql = `INSERT INTO ${ table } ${ newCols } VALUES ${ placeValue }`;
 
         // a. check the data is exist or is not
         if (values[0] === "" && isNaN(values[0])) {
             return {
                 ok: false,
                 error: langs("checkData", "insert") // msg method
             }
         }
         // b. validation on server
         if (values[0].length < 10 && isNaN(values[0])) {
             return {
                 ok: false,
                 error: langs("checkDataServer")
             }
         }
         // c. validation on DB
         let checkDb = await checkData(table, cols[0], values[0]); // { ok: false, error: '0 row exsit' }
         if (checkDb.ok) return {
             ok: false,
             error: checkDb.message
         }
         // d. insert data into DB
         let rows = await db.execute(sql, values);

         // true 
         if (rows[0].affectedRows > 0) {
             return {
                 ok: true,
                 message: langs("addMessage", rows[0].affectedRows),
             }
         } else {
             return {
                 ok: false,
                 error: langs("addMessage", rows[0].affectedRows)
             }
         }

 
    } catch(err) {
         return err.message;
    }
  }
// 3. update
 async function updateObject(table, id, [...cols], ...values) {
    try {
         /*
             ------------------------------------
             --- Steps to update data into DB ---
             ------------------------------------
             a. check data in DB 
             b. check the data is exist or is not
             c. validation on server
             d. validation on DB  ==> not exist
             e. insert data into DB
         */
 
         // general settings ******************************
         // to create dynamic sql query
         let newCols = "";
 
         for (let i = 0; i < cols.length; i++) {
             newCols = `${newCols} ${cols[i]} = "${values[i]}",`;
         }
         newCols = `${newCols.slice(0, -1)}`;
 
         // *************************************** end settings
 
         // variables 🚩 ✅
         let sql = `UPDATE ${ table } SET ${ newCols } WHERE id = ?`
 
        // a. check check data in DB
        let checkModify = await checkData(table, "id", id);
        if (!checkModify.ok) return checkModify;

        // b. check the data is exist or is not
        if (values[0] === "") {
            return {
                ok: false,
                error: langs("checkData", "insert") // msg method
            }
        }
        // c. validation on server
        if (values[0].length < 10) {
            return {
                ok: false,
                error: langs("checkDataServer")
            }
        }
        // d. validation on DB
        let checkDb = await checkData(table, cols[0], values[0]); // { ok: false, error: '0 row exsit' }
        if (checkDb.ok) return {
            ok: false,
            error: checkDb.message
        }
        // e. insert data into DB
        let rows = await db.execute(sql, [ id ]);
        // true 
        if (rows[0].affectedRows > 0) {
            return {
                ok: true,
                message: langs("addMessage", rows[0].affectedRows),
            }
        } else {
            return {
                ok: false,
                error: langs("addMessage", rows[0].affectedRows)
            }
        }
 
    } catch(err) {
         return err.message;
    }
  }

// 4. delete with id
async function deleteObject(table, id) {
    try {
        /*
           ------------------------------------
           --- Steps to delete data from DB ---
           ------------------------------------
           a. check the data is exist or is not
           b. validation on server
           c. delete data
        */
        
        // variables
        let sql = `DELETE FROM ${ table } WHERE id = ?`;
        // a. check the data is exist or is not
        if (typeof id !== "undefined") {
            // b. validation on server
            if (isNaN(id)) {
                return {
                    ok: false,
                    error: langs("deleteErrorNotNumber") // msg method
                }
            }
            // c. delete data [true - false]
            let rows = await db.execute(sql, [id]);
            if (rows[0].affectedRows > 0) {
                return {
                    ok: true,
                    message: langs("deleteMessage", "", rows[0].affectedRows)  // msg method
                }
            } else {
                return {
                    ok: false,
                    error: langs("deleteMessage")  // msg method
                }
            }

        } else {
            return {
                ok: false,
                error: langs("deleteErrorNotFound") // msg method
            }
        }
        
    } catch(err) {
        return err.message;
    }
}

/*
    ======================================================================
    -- custom crud operation [ get - add - update - delete] on Database --
    ======================================================================
*/

/* ========== clinic ================= */
// custom fetch clinic data
async function customFetchClinic(pstatus) {
    try {

        let sql = ``;
        if (pstatus === "1") {
            // available
            sql = `SELECT * FROM clinic WHERE end_time > TIME(NOW())`;
        } else if (pstatus === "0") {
            // not available
            sql = `SELECT * FROM clinic WHERE end_time < TIME(NOW())`;
            resetDoctorStatus();
        } else {
            sql = `SELECT * FROM clinic WHERE ?`;
        }
        
        // execute query
        let rows = await db.execute(sql, [ pstatus ])
        if (rows[0].length > 0) {
            return {
                ok: true,
                length: rows[0].length,
                content: rows[0]
            }
        } else {
            return {
                ok: false,
                error: `not data found`
            }
        } 
    } catch(err) {
        return err.message;
    }
}
// get not available doctor in one clinic
async function customGetNotAvailable(id) {
    try {
        let sql = `SELECT * FROM doctor WHERE clinic_id = ?`
        // execute query on DB
        let rows = await db.execute(sql, [ id ]);
        if (rows[0].length > 0) {
            return {
                ok: true,
                length: rows[0].length,
                content: rows[0]
            }
        } else {
            return {
                ok: false,
                error: `not data found`
            }
        } 
    } catch(err) {
        return err.message;
    }
}
// update clinic status 
async function simpleUpdate(table, newValue, id) {
    try {
        
        // variables
        let sql = `UPDATE ${ table } SET doctor_status = ${ newValue } WHERE id = ?`;
        
        // a. check data in DB
        let checkModify = await checkData(table, "id", id);
        if (!checkModify.ok) return checkModify;

        
        // b. update data from DB
        let rows = await db.execute(sql, [ id ]);
        // true 
        if (rows[0].affectedRows > 0) {
            return {
                ok: true,
                message: langs("addMessage", rows[0].affectedRows),
            }
        } else {
            return {
                ok: false,
                error: langs("addMessage", rows[0].affectedRows)
            }
        }

    } catch(err) {
        return err.message;
    }
}
// important update (join)
async function customUpdateClinic(cname, stime, etime, clinicId, doctorId) {
    try {
        
        // variables
        let sql = `
                    UPDATE clinic
                    INNER JOIN doctor ON doctor.clinic_id = clinic.id
                    SET clinic.name = "${ cname }", clinic.start_time = "${ stime }", clinic.end_time = "${ etime }", doctor.d_available = ${ clinicId } 
                    WHERE doctor.id = ?
                    `;

        
        // update data from DB
        let rows = await db.execute(sql, [ doctorId ]);
        // true 
        if (rows[0].affectedRows > 0) {
            return {
                ok: true,
                message: langs("addMessage", rows[0].affectedRows),
            }
        } else {
            return {
                ok: false,
                error: langs("addMessage", rows[0].affectedRows)
            }
        }

    } catch(err) {
        return err.message;
    }
}

/* ************* media display *************** */
// get available all clinics
async function getClinicForDisplay() {
    try {
        // let sql = `
        //         SELECT clinic.*, doctor.name AS d_name, doctor.specialist, MIN(ticket.ticket_status) AS lowerValue
        //         FROM doctor
        //         INNER JOIN clinic ON clinic.id = doctor.clinic_id
        //         INNER JOIN ticket ON ticket.clinic_id = clinic.id
        //         WHERE clinic.end_time > TIME(NOW()) AND doctor.specialist != "admin"
        //         GROUP BY clinic.name`;
        let sql = `
                SELECT clinic.*, doctor.name AS d_name, doctor.specialist
                FROM doctor
                INNER JOIN clinic ON clinic.id = doctor.clinic_id
                WHERE clinic.end_time > TIME(NOW()) AND doctor.specialist != "admin"
                GROUP BY clinic.name`;
        deleteTickets();
        // execute query on DB
        let rows = await db.execute(sql);

        if (rows[0].length > 0) {
            return {
                ok: true,
                length: rows[0].length,
                content: rows[0]
            }
        } else {
            return {
                ok: false,
                error: `not data found`
            }
        } 
    } catch(err) {
        return err.message;
    }
}
async function DisplayDisplay() {
    try {
        let sql = `
                SELECT clinic.*, doctor.name AS d_name, doctor.specialist, MIN(ticket.ticket_status) AS lowerValue
                FROM doctor
                INNER JOIN clinic ON clinic.id = doctor.clinic_id
                INNER JOIN ticket ON ticket.clinic_id = clinic.id
                WHERE clinic.end_time > TIME(NOW()) AND doctor.specialist != "admin" AND ticket.ticket_status != 0
                GROUP BY clinic.name`;
        deleteTickets();
        // execute query on DB
        let rows = await db.execute(sql);

        if (rows[0].length > 0) {
            return {
                ok: true,
                length: rows[0].length,
                content: rows[0]
            }
        } else {
            return {
                ok: false,
                error: `not data found`
            }
        } 
    } catch(err) {
        return err.message;
    }
}
// get available all clinics
async function getMaxticketNumber(clinicId) {
    try {
        let sql = `
            SELECT MAX(ticket_status) AS higherValue FROM ticket
            WHERE clinic_id = ?`;
        // execute query on DB
        let rows = await db.execute(sql, [ clinicId ]);

        if (rows[0].length > 0) {
            return {
                ok: true,
                content: rows[0]
            }
        } else {
            return {
                ok: false,
                error: `not data found`
            }
        } 
    } catch(err) {
        return err.message;
    }
}
async function updatePatientForDisplay() {
    try {
        let sql = `
            SELECT MIN(ticket_status) AS lowerValue, clinic_id FROM ticket
            WHERE ticket_status != 0`;
        // execute query on DB
        let rows = await db.execute(sql);

        if (rows[0].length > 0) {
            return {
                ok: true,
                content: rows[0]
            }
        } else {
            return {
                ok: false,
                error: `not data found`
            }
        } 
    } catch(err) {
        return err.message;
    }
}



// Patient methods
// custom fetch patient data
async function customFetchPatient(pstatus, pdate, pclinic) {
    try {
        let sql = ``;
        let rows = "";
        if (pstatus === "" && pdate === "" && pclinic === "") {

            sql = `SELECT * FROM patient WHERE ?`;
            // execute query on DB
            rows = await db.execute(sql, [ 11 ]);

        } else if (pstatus !== "" && pdate === "" && pclinic === "") {

            sql = `
                    SELECT patient.name FROM patient
                    INNER JOIN ticket ON patient.id = ticket.patient_id
                    WHERE ?`;
            // execute query on DB
            rows = await db.execute(sql, [ 101 ]);

        } else if (pstatus !== "" && pdate !== "" && pclinic === "") {

            sql = `
                    SELECT patient.name FROM patient
                    INNER JOIN ticket ON patient.id = ticket.patient_id
                    WHERE patient.register_date = ?`;
            // execute query on DB
            rows = await db.execute(sql, [ pdate ]);

        } else if (pstatus !== "" && pdate === "" && pclinic !== "") {

            sql = `
                    SELECT patient.name FROM patient
                    INNER JOIN ticket ON patient.id = ticket.patient_id
                    WHERE ticket.clinic_id = ?`;
            // execute query on DB
            rows = await db.execute(sql, [ pclinic ]);

        } else if (pstatus !== "" && pdate !== "" && pclinic !== "") {

            sql = `
                    SELECT patient.name FROM patient
                    INNER JOIN ticket ON patient.id = ticket.patient_id
                    WHERE patient.register_date = ? AND ticket.clinic_id = ?`;
            // execute query on DB
            rows = await db.execute(sql, [ pclinic, pstatus ]);

        } else if (pstatus === "" && pdate !== "" && pclinic === "") {

            sql = `
                    SELECT patient.name FROM patient
                    WHERE patient.register_date = ?`;
            // execute query on DB
            rows = await db.execute(sql, [ pclinic, pstatus ]);

        } else {
            sql = `
                    SELECT patient.name FROM patient
                    INNER JOIN ticket ON patient.id = ticket.patient_id
                    WHERE patient.register_date = ? AND ticket.clinic_id = ?`;
            // execute query on DB
            rows = await db.execute(sql, [ pclinic, pstatus ]);
        }
        
        if (rows[0].length > 0) {
            return {
                ok: true,
                length: rows[0].length,
                content: rows[0]
            }
        } else {
            return {
                ok: false,
                error: `not data found`
            }
        } 
    } catch(err) {
        return err.message;
    }
}

// control doctor on patient
// get all patient belongs this doctor
async function con_getPatient(clinicId) {
    try {
        let sql = `
            SELECT patient.*, ticket.ticket_status AS ticket_number FROM patient
            INNER JOIN ticket ON patient.id = ticket.patient_id
            WHERE ticket.clinic_id = ?
            ORDER BY ticket.ticket_status ASC
            `;
        // execute query on DB
        let rows = await db.execute(sql, [ clinicId ]);

        if (rows[0].length > 0) {
            return {
                ok: true,
                length: rows[0].length,
                content: rows[0]
            }
        } else {
            return {
                ok: false,
                error: `not data found`
            }
        } 
    } catch(err) {
        return err.message;
    }
}
// update patient ticket
async function con_updatePatientTicket(tstatus, patientId) {
    try {
        
        // variables
        let sql = `
                    UPDATE ticket
                    INNER JOIN patient ON patient.id = ticket.patient_id
                    SET ticket.ticket_status = "${ tstatus }"
                    WHERE patient.id = ?
                `;

        // update data from DB
        let rows = await db.execute(sql, [ patientId ]);
        // true 
        if (rows[0].affectedRows > 0) {
            return {
                ok: true,
                message: langs("addMessage", rows[0].affectedRows),
            }
        } else {
            return {
                ok: false,
                error: langs("addMessage", rows[0].affectedRows)
            }
        }

    } catch(err) {
        return err.message;
    }
}


// test ===================
// getClinicForDisplay()
// .then(
//     (resolve) => console.log(resolve),
//     (rej) => console.log(rej)
// );

module.exports = {
    isLogin,
    // global
    getALL,
    createtObject,
    updateObject,
    deleteObject,
    // custom clinic methods
    customFetchClinic,
    getClinicForDisplay,
    DisplayDisplay,
    simpleUpdate,
    customGetNotAvailable,
    customUpdateClinic,
    getMaxticketNumber,
    updatePatientForDisplay,
    // patient custom methods
    customFetchPatient,
    // control with doctor
    con_getPatient,
    con_updatePatientTicket
}

// UPDATE doctor INNER JOIN clinic ON doctor.clinic_id = clinic.id SET doctor.doctor_status = 1, clinic.start_time = "2", clinic.end_time = "5" WHERE doctor.id = 41
