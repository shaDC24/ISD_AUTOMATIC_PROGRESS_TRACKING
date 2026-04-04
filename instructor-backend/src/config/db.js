const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // This allows the connection to Supabase's proxy
  },
  family:4
});

pool.connect((err)=>{
  if(err){
    console.log("an error occured while connection to database"+err);
  }
  else{
    console.log("the connection to database was successful");
  }
});


module.exports = pool;