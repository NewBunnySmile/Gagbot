const fs = require('fs');
const path = require('path');
const https = require('https');

const assignChastity = (user, keyholder) => {
    if (process.chastity == undefined) { process.chastity = {} }
    process.chastity[user] = {
        keyholder: keyholder ? keyholder : "unlocked"
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
}

const getChastity = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    return process.chastity[user];
}

const removeChastity = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    delete process.chastity[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
}

const assignVibe = (user, intensity) => {
    if (process.vibe == undefined) { process.vibe = {} }
    process.vibe[user] = {
        intensity: intensity
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/vibeusers.txt`, JSON.stringify(process.vibe));
}

const getVibe = (user) => {
    if (process.vibe == undefined) { process.vibe = {} }
    return process.vibe[user];
}

const removeVibe = (user) => {
    if (process.vibe == undefined) { process.vibe = {} }
    delete process.vibe[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/vibeusers.txt`, JSON.stringify(process.vibe));
}

const getChastityKeys = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    let keysheld = [];
    Object.keys(process.chastity).forEach((k) => {
        if (process.chastity[k].keyholder == user) {
            keysheld.push(k)
        }
    })
    return keysheld
}

const getChastityKeyholder = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    return process.chastity[user]?.keyholder;
}

// transfer keys and returns whether the transfer was successful
const transferChastityKey = (user, to) => {
    if (process.chastity == undefined) { process.chastity = {} }
    if (!process.chastity[user]) { return false }
    if (process.chastity[user].keyholder == to) { return false }
    process.chastity[user].keyholder = to;
    return true
}

const arousedtexts = [
  "ah~", "mm~", "ahh~", "mmm~", "ooh!~",
  "mmmf~", "aah! <3", "aaahh!~", "mmm!~ <3", "aahhhhh!~",
  "oooohhff!!~", "aaahaahhh!~", "mmmff~  so good...", "oohf!~  t-thank youuu~  <3", "ahh mmf ahhh!!!~",
  "mmff more... aahh!!~"
]
const arousedtextshigh = [
  "MMMM~ <3", "OOOOHHHF~", "AAHHH!!~",
  "AAH! YES!~", "MMMFF...  MORE PLEAASEEE!!~", "MMMFFF AAHH AAHHHH!!!~  <3"
]

// Given a string, randomly provides a stutter and rarely provides an arousal text per word.
const stutterText = (text, userid) => {
    let outtext = `${text}`;
    if (Math.random() > (1.0 - (0.2 * getVibe(userid).intensity))) { // 2-20% to cause a stutter
        let stuttertimes = Math.max(Math.floor(Math.random() * (0.3 * getVibe(userid).intensity)), 1) // Stutter between 1, 1-2 and 1-3 times, depending on intensity
        outtext = '';
        for (let i = 0; i < stuttertimes; i++) {
            outtext = `${outtext}${text.charAt(0)}-`
        }
        outtext = `${outtext}${text}`
    }
    if (Math.random() > (1.0 - (0.05 * getVibe(userid).intensity))) { // 0.5-5% to insert an arousal text
        let arousedlist = arousedtexts;
        if (getVibe(userid).intensity > 7) {
            for (let i = 0; i < arousedtextshigh; i++) { // Remove the first 5 elements to give the high arousal texts higher chance to show up
                arousedlist[i] = arousedtextshigh[i]
            }
        }
        let arousedtext = arousedtexts[Math.floor(Math.random() * arousedtexts.length)]
        outtext = `${outtext}${arousedtext}`
    }
    return outtext
}

const vibeText = (text, userid) => {
    let newtextparts = text.split(" ");
    let outtext = ''
    for (let i = 0; i < newtextparts.length; i++) {
        outtext = `${outtext} ${stutterText(newtextparts[i], userid)}`
    }
    return outtext;
}

exports.assignChastity = assignChastity
exports.getChastity = getChastity
exports.removeChastity = removeChastity
exports.assignVibe = assignVibe
exports.getVibe = getVibe
exports.removeVibe = removeVibe

exports.vibeText = vibeText;
exports.getChastityKeys = getChastityKeys;
exports.getChastityKeyholder = getChastityKeyholder;
exports.transferChastityKey = transferChastityKey

console.log(getChastityKeys("125093095405518850"))