'use strict';

const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const mysql = require('mysql');
const moment = require('moment');
const { time } = require('console');

//Connecting to DB
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rocketteamplus',
    database: 'final_project'

});

var connection_2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rocketteamplus',
    database: 'rocketteam'
})

/*
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
*/

let rfm_result;
let product_result;
let streaming_result;
let order_count = 0;

connection_2.query('SELECT * FROM rocketteam.rfm_table', function (err, result) {
    if (err) {
        throw err;
    } else {
        rfm_result = result;
    }
})

connection.query('SELECT * FROM final_project.product', function (err, result) {
    if (err) {
        throw err;
    } else {
        product_result = result;
    }
})

connection.query('SELECT * FROM final_project.streaming', function (err, result) {
    if (err) {
        throw err;
    } else {
        streaming_result = result;
    }
})

connection.query('SELECT * FROM final_project.customer', function (c_err, customer_result) {
    if (c_err) {
        console.log(c_err);
        throw c_err;
    } else {
        for (let i = 0; i < customer_result.length; i++) {
            for (let j = 1; j <= rfm_result[i].frequency; j++) {
                let product_rnd = Math.floor(Math.random() * 4 + 1);
                console.log(product_result[product_rnd - 1].quantity);
                let streaming_rnd = Math.floor(Math.random() * 4 + 1);
                let time = new Date(streaming_result[streaming_rnd - 1].timestamp);
                time = `${time.getFullYear()}-${time.getMonth()}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
                connection.query(`INSERT INTO final_project.order(customer_id, price, streaming_id, timestamp)` +
                    ` VALUE(${customer_result[i].customer_id}, (SELECT price FROM final_project.product WHERE product_id = ${product_rnd}),` +
                    `${streaming_rnd}, '${time}')`)
                order_count++;
                connection.query(`INSERT INTO final_project.order_detail(order_id, product_id, quantity)` +
                    ` VALUE(${order_count}, ${product_rnd}, 1)`)
                connection.query(`UPDATE final_project.product SET quantity = quantity - 1 WHERE product_id = ${product_rnd}`)
            }
        }
    }
})

