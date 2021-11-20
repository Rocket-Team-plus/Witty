'use strict';

const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const mysql = require('mysql');

//Connecting to DB
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rocketteamplus',
    database: 'rocketteam'
});

for (let index = 1; index < 555; index++) {
    let gender_rnd = Math.floor(Math.random() * 2);
    let age_rnd = Math.floor(Math.random() * (70 - 18 + 1)) + 18;
    let gender = null;
    if (gender_rnd == 1) {
        gender = "男";
    } else {
        gender = "女";
    }
    connection.query(`UPDATE rfm_table SET gender = '${gender}', age = ${age_rnd} WHERE RFM_id = ${index}`);
}