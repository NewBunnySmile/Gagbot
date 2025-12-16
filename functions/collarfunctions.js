const fs = require('fs');
const path = require('path');
const https = require('https');

const assignCollar = (user, keyholder, only) => {
    if (process.collar == undefined) { process.collar = {} }
    process.collar[user] = {
        keyholder: keyholder,
        keyholder_only: only
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
}

const getCollar = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    return process.collar[user];
}

const removeCollar = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    delete process.collar[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
}

const getCollarKeys = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    let keysheld = [];
    Object.keys(process.collar).forEach((k) => {
        if (process.collar[k].keyholder == user) {
            keysheld.push(k)
        }
    })
    return keysheld
}

const getCollarKeyholder = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    return process.collar[user]?.keyholder;
}

// transfer keys and returns whether the transfer was successful
const transferCollarKey = (user, to) => {
    if (process.collar == undefined) { process.collar = {} }
    if (!process.collar[user]) { return false }
    if (process.collar[user].keyholder == to) { return false }
    process.collar[user].keyholder = to;
    return true
}

exports.assignCollar = assignCollar
exports.getCollar = getCollar
exports.removeCollar = removeCollar
exports.getCollarKeys = getCollarKeys
exports.getCollarKeyholder = getCollarKeyholder;
exports.transferCollarKey = transferCollarKey