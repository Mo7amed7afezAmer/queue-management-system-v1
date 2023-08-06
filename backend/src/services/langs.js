
function langs(phrase, table = "", id = 0) {
    // Data
    const lang = {
        // add
        addMessage: `${ table } row inserted`,
        addmessage: ``,
        updateMessage: `تم تحديث الصف رقم ${ id } `,
        // updateMessage: `update ${ table } set row id: ${ id }`,
        updateError: `problems occur during update operation`,
        // delete
        deleteErrorNotFound: `not found data to delete`,
        deleteErrorNotNumber: `data is not a number`,
        deleteMessage: `${ id } row deleted`,
        // check
        checkMessage: `${ table } row exsit`,
        checkError: `${ table } row exsit`,
        // steps insert data
        checkData: `there is\'t exist data to ${ table }`,
        checkDataServer: `data must be large than 10 char`,
        checkDataDb: `data must be large than 10 char`,

    }

    return lang[phrase]
}

module.exports = {
    langs,
}