function admin(req, res, next) {

    if (req.user.roles[0].specialist.indexOf("admin") === -1) return res.status(403).send({
        ok: false,
        error: "Access denied."
    });
    console.log(req.user.roles[0].clinic_id)
    next();
    
}

function doctor(req, res, next) {

    if (req.user.roles[0].specialist.indexOf("admin") != -1) return res.status(403).send({
        ok: false,
        error: "Access denied."
    });

    req.profileInfo = req.user.roles[0];
    next();
    
}

function patient(req, res, next) {

    if (typeof req.user.roles[0].specialist !== "undefined") return res.status(403).send({
        ok: false,
        error: "Access denied."
    });

    req.patient_id = req.user.roles[0].id;
    console.log(req.patient_id);

    next();
    
}

module.exports = {
    admin,
    doctor,
    patient
}