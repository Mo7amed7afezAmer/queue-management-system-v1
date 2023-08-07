const linksName = {
    "adminRole": ["dashboard", "clinics", "doctor", "patient", "settings"],
    "doctorRole": ["dashboard", "patient", "medications", "documents", "finances", "settings"],
};
const adminLinks = ["dashboard", "clinics", "doctor", "patient", "settings", "logout"];

// langs
function langs(...phrase) {

    let stmt = "";

    let dataReference = {
        name: "name",
        select: "select",
        password: "password",
        specialist: "specialist",
        enter: "enter",
        add: "add",
        edit: "edit",
        delete: "delete",
        save: "save",
        cancel: "cancel",
        print: "print",
        age: "age",
        login: "login",
        register: "register",
        dashboard: "dashboard",
        clinic: "clinic",
        doctor: "doctor",
        patient: "patient",
        settings: "settings",
        all: "all",
        available: "available",
        notAvailable: "not available",
        duration: "duration",
        filter: "filter",
        create: "create",
        prescription: "prescription",
        // messages
        confirmDeleteMessage: `Do you really want to execute delete`,
        ticketMessage: `Book an appointment at a clinic`,
        startTicketMessage: `Have you ever booked his clinic?`,
        confirmAppointment: `Are you sure confirm appointment?`
    };

    for (let i = 0; i < phrase.length; i++) {
        stmt = `${stmt} ${dataReference[phrase[i]]}` 
    }

    return stmt;
}


export {
    linksName,
    adminLinks,
    langs
}