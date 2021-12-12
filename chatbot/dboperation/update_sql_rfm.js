'use strict';

const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const mysql = require('mysql');
const moment = require('moment');

//Connecting to DB
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rocketteamplus',
    database: 'rocketteam'
    
});

const startDate = moment().startOf('month').toDate();
const endDate = new Date();

for (let index = 1; index < 555; index++) {
    //let gender_rnd = Math.floor(Math.random() * 2);
    //let age_rnd = Math.floor(Math.random() * (70 - 18 + 1)) + 18;
    let gender = null;
    let random_date = moment(rndDate(startDate, endDate)).format('YYYY-MM-DD HH:mm:ss');
    //if (gender_rnd == 1) {
    //    gender = "男";
    //} else {
    //    gender = "女";
    //}
    connection.query(`UPDATE rfm_table SET last_purchase = '${random_date}' WHERE RFM_id = ${index}`);
}

function rndDate(start, end) {
    let date = new Date(+startDate + Math.random() * (endDate - startDate));
    let hour = Math.floor(Math.random() * 24);
    let minute = Math.floor(Math.random() * 60);
    let second = Math.floor(Math.random() * 60);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);

    return date;
}