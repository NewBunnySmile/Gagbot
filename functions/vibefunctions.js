const fs = require('fs');
const path = require('path');
const https = require('https');
const { arousedtexts, arousedtextshigh } = require('../vibes/aroused/aroused_texts.js')

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

const assignVibe = (user, intensity, vibetype = "bullet vibe") => {
    if (process.vibe == undefined) { process.vibe = {} }
    if (!process.vibe[user]) {        
        process.vibe[user] = [{
            vibetype: vibetype,
            intensity: intensity
        }]
    } else {
        const existingVibe = process.vibe[user].find(v => v.vibetype === vibetype);
        if (existingVibe) {
            existingVibe.intensity = intensity;
        } else {
            process.vibe[user].push({
                vibetype: vibetype,
                intensity: intensity
            });
        }
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/vibeusers.txt`, JSON.stringify(process.vibe));
}

const getVibe = (user) => {
    if (process.vibe == undefined) { process.vibe = {} }
    return process.vibe[user];
}

const removeVibe = (user, vibetype=null) => {
    if (process.vibe == undefined) { process.vibe = {} }
    if (!vibetype) {
        delete process.vibe[user];
    } else {
        process.vibe[user] = process.vibe[user].filter(v => v.vibetype !== vibetype);
    }
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

function stutterText(text, intensity=5) {
    function aux(text) {
        outtext = '';
        if (!((text.charAt(0) == "<" && text.charAt(1) == "@") || 
            (text.charAt(0) == "\n") || 
            (!text.charAt(0).match(/[a-zA-Z0-9]/)))) { //Ignore pings, linebreaks and signs (preventively I dunno)

            if (Math.random() > (1.0 - (0.2 * intensity))) { // 2-20% to cause a stutter
                let stuttertimes = Math.max(Math.floor(Math.random() * (0.3 * intensity)), 1) // Stutter between 1, 1-2 and 1-3 times, depending on intensity
                for (let i = 0; i < stuttertimes; i++) {
                    outtext = `${outtext}${text.charAt(0)}-`
                }
                outtext = `${outtext}${text}`
            }
            if (Math.random() > (1.0 - (0.05 * intensity))) { // 0.5-5% to insert an arousal text
                let arousedlist = arousedtexts;
                if (intensity > 7) {
                    for (let i = 0; i < arousedtextshigh; i++) { // Remove the first 5 elements to give the high arousal texts higher chance to show up
                        arousedlist[i] = arousedtextshigh[i]
                    }
                }
                let arousedtext = arousedtexts[Math.floor(Math.random() * arousedtexts.length)]
                outtext = `${outtext} ${arousedtext}`
            }
            return outtext;
        } else {
            return text;
        }
    }

    let newtextparts = text.split(" ");
    let outtext = ''
    for (let i = 0; i < newtextparts.length; i++) {
        outtext = `${outtext} ${aux(newtextparts[i])}`
    }
    return outtext
}

exports.assignChastity = assignChastity
exports.getChastity = getChastity
exports.removeChastity = removeChastity
exports.assignVibe = assignVibe
exports.getVibe = getVibe
exports.removeVibe = removeVibe
exports.stutterText = stutterText

exports.getChastityKeys = getChastityKeys;

console.log(getChastityKeys("125093095405518850"))
