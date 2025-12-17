const fs = require('fs');
const path = require('path');
const https = require('https');

const assignCorset = (user, tightness) => {
    if (process.corset == undefined) { process.corset = {} }
    process.corset[user] = {
        tightness: tightness ? tightness : 5
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
}

const getCorset = (user) => {
    if (process.corset == undefined) { process.corset = {} }
    return process.corset[user];
}

const removeCorset = (user) => {
    if (process.corset == undefined) { process.corset = {} }
    delete process.corset[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
}

// Takes a wordcountremaining and outputs text 
const corsetLimitWords = (user, text, wordcountremaining) => {
    let tinysound = getCorset(user).tightness >= 7 ? "\n-# " : ""
    let wordsinmessage = text.split(" ");
    let newwordsinmessage = wordsinmessage.splice(0, Math.min(wordsinmessage.length, wordcountremaining));
    wordcountremaining = wordcountremaining - newwordsinmessage.length
    let outtext = `${tinysound}${newwordsinmessage.join(" ")}`
    return outtext
}

exports.assignCorset = assignCorset
exports.getCorset = getCorset
exports.removeCorset = removeCorset
exports.corsetLimitWords = corsetLimitWords;