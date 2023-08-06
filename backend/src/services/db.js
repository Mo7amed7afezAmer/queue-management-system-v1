const mysql = require("mysql2/promise");
// const config = require("../config");

function createPool() {
    try {
      const mysql = require('mysql2');
  
      const pool = mysql.createPool({
        host: "db4free.net",
        user: "q_mo7amed7afez",
        password: "mo7amed7afez_",
        database: "queue_v1",
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0
      });
  
      const promisePool = pool.promise();
  
      return promisePool;
    } catch (error) {
      return console.log(`Could not connect - ${error}`);
    }
  }
  
  const pool = createPool();
  
  module.exports = {
    connection: async () => pool.getConnection(),
    execute: (...params) => pool.execute(...params)
  };
