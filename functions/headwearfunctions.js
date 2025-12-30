const fs = require('fs');
const path = require('path');

const headweartypes = [
    { name: "Latex Hood", value: "hood_latex", },
    { name: "Leather Hood", value: "hood_leather", },
    { name: "Maid Hood", value: "hood_maid", },
    { name: "Leather Blindfold", value: "blindfold_leather", blockinspect: true },
    { name: "Blackout Lenses", value: "blindfold_blackout", blockinspect: true },
    { name: "Cloth Blindfold", value: "blindfold_cloth", blockinspect: true },
    { name: "High-Security Blindfold", value: "blindfold_highsec", blockinspect: true },
    { name: "Latex Blindfold", value: "blindfold_latex", blockinspect: true },
    { name: "Sleep Mask", value: "blindfold_sleep", blockinspect: true },
    { name: "Leather Head Harness", value: "headharness_leather" },
    { name: "Latex Hood (no eyes)", value: "hood_latexfull", blockinspect: true, blockemote: true },
    { name: "Hardlight Hood", value: "hood_hardlight", },
    { name: "Hardlight Hood (no eyes)", value: "hood_hardlightfull", blockinspect: true, blockemote: true },
    { name: "Kigu Mask", value: "mask_kigu", blockinspect: true, blockemote: true },
    { name: "Doll Visor", value: "doll_visor", blockinspect: true, blockemote: true },
    { name: "VR Headset", value: "vr_visor", blockinspect: true },
    { name: "Witchy Glasses", value: "glasses_witchy" },
    { name: "Full Frame Glasses", value: "glasses_fullframe" },
    { name: "Nostalgia Glasses", value: "glasses_nostalgia" },
    { name: "Ridiculously Big Witch Hat", value: "witchhat_big" },
    { name: "Princess Crown", value: "princess_crown" },
]

/**************
 * Discord API Requires an array of objects in form:
 * { name: "Latex Armbinder", value: "armbinder_latex" }
 ********************/
const loadHeadwearTypes = () => {
    process.headtypes = headweartypes.map((item) => {return { name: item.name, value: item.value }})
}

const assignHeadwear = (userID, headwear, origbinder) => {
    if (process.headwear == undefined) { process.headwear = {} }
    let originalbinder = process.headwear[userID]?.origbinder
    if (process.headwear[userID]) {
        process.headwear[userID].wornheadwear.push(headwear);
    }
    else {
        process.headwear[userID] = {
            wornheadwear: [headwear],
            origbinder: originalbinder ?? origbinder
        }
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/headwearusers.txt`, JSON.stringify(process.headwear));
}

const getHeadwear = (userID) => {
    if (process.headwear == undefined) { process.headwear = {} }
    return process.headwear[userID]?.wornheadwear ? process.headwear[userID]?.wornheadwear : [];
}

const getHeadwearBinder = (userID) => {
    if (process.headwear == undefined) { process.headwear = {} }
    return process.headwear[userID]?.origbinder;
}

const deleteHeadwear = (userID, headwear) => {
    if (process.headwear == undefined) { process.headwear = {} }
    if (!process.headwear[userID]) { return false }
    if (headwear && process.headwear[userID].wornheadwear.includes(headwear)) {
        process.headwear[userID].wornheadwear.splice(process.headwear[userID].wornheadwear.indexOf(headwear), 1)
        if (process.headwear[userID].wornheadwear.length == 0) {
            delete process.headwear[userID]
        }
    }
    else if (process.headwear[userID]) {
        delete process.headwear[userID];
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/headwearusers.txt`, JSON.stringify(process.headwear));
}

const getHeadwearName = (userID, headnname) => {
    if (process.headwear == undefined) { process.headwear = {} }
    let convertmittenarr = {}
    for (let i = 0; i < headweartypes.length; i++) {
        convertmittenarr[headweartypes[i].value] = headweartypes[i].name
    }
    if (headnname) {
        return convertmittenarr[headnname];
    }
    /*
    else if (process.headwear[userID]?.wornheadwear) {
        return convertmittenarr[process.mitten[userID]?.mittenname]
    }*/ // I honestly dont have a clean way to represent this. 
    else {
        return undefined;
    }
}

// Gets the full headwear entry
// There's a better way to do this.
// I didnt feel like doing some kind of .some condition checking. 
// Plz simplify.
const getHeadwearBlocks = (headnname) => {
    let convertmittenarr = {}
    for (let i = 0; i < headweartypes.length; i++) {
        convertmittenarr[headweartypes[i].value] = headweartypes[i]
    }
    if (headnname) {
        return convertmittenarr[headnname];
    }
    else {
        return undefined;
    }
}

// Returns an object with true/false if *ANY* headwear they're wearing 
// blocks a given function. 
// { canEmote: true, canInspect: true }
const getHeadwearRestrictions = (userID) => {
    let allowedperms = {
        canEmote: true,
        canInspect: true
    }
    let wornheadwear = getHeadwear(userID);
    for (let i = 0; i < wornheadwear.length; i++) {
        if (getHeadwearBlocks(wornheadwear[i]).blockemote) {
            allowedperms.canEmote = false
        }
        if (getHeadwearBlocks(wornheadwear[i]).blockinspect) {
            allowedperms.canInspect = false
        }
    }

    return allowedperms
}

exports.headweartypes = headweartypes
exports.loadHeadwearTypes = loadHeadwearTypes;
exports.assignHeadwear = assignHeadwear
exports.getHeadwear = getHeadwear
exports.getHeadwearBinder = getHeadwearBinder;
exports.deleteHeadwear = deleteHeadwear
exports.getHeadwearName = getHeadwearName;
exports.getHeadwearRestrictions = getHeadwearRestrictions;