function getData(table, [...cols], ...values) {
   // UPDATE `doctor` SET `id` = NULL, `name` = 'ADAddaFfF afWqw', `password` = 'DWqe', `specialist` = 'asdasdfe3t34tfadfgjasf', `clinic_id` = '4' WHERE `doctor`.`id` = 30;
   let sql = `UPDATE ${ table } SET`;

    let newCols = "";

    for (let i = 0; i < cols.length; i++) {
        newCols = `${newCols} ${cols[i]} = "${values[i]}",`;
    }
    newCols = `${newCols.slice(0, -1)}`;

    sql = `UPDATE ${ table } SET${ newCols } WHERE id = ?`

    return sql
}

// console.log(getData("doctor", ["name", "password", "email"], "mo7amed", "101", "mo7amed@gmail.com"));
console.log(getData("doctor", ["name"], "mo7amed"));