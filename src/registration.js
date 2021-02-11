const express = require('express');
const path = require('path');
const pool = require("./db");
const dotenv = require('dotenv').config();
const utf8 = require('utf8');
const bodyParser = require('body-parser');

errors = [false,false,false];
async function register(usrdata){
    if(name(usrdata.name)) errors[0] = true;
    if(await duplicateId(usrdata.kennitala)) errors[1] = true;
    if(!formatId(usrdata.kennitala)) errors[2] = true;
    formatId(usrdata.kennitala);
    let err = 0;
    for(let i = 0; i<errors.length; i++){
        if (errors[i]) err++;
    }
    console.log(err);
    if(err>0) return errors;
    else{
        const insert = pool.query(
            'INSERT INTO signatures(name, nationalid, comment) VALUES($1, $2, $3) RETURNING *',
          [usrdata.name, usrdata.kennitala, usrdata.athugasemd]
          );
    }
}

function name(name){
    return name.trim() === "";
}

async function duplicateId(id){
    const exists = await pool.query(
        'SELECT id from signatures WHERE id = $1',
        [id]
      );
    return exists.rows.length>0;
}

function formatId(id){
    const idtest = /\d{6}-?\d{4}/gm;
    return idtest.test(id);
}


module.exports = { register};
