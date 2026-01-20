const { getCollarName, getCollar, assignCollar } = require("../../functions/collarfunctions.js");
const { assignMitten, getMitten, getMittenName, getGag, convertGagText, assignGag } = require("../../functions/gagfunctions.js");
const { getHeadwear, DOLLVISORS, getHeadwearName, assignHeadwear } = require("../../functions/headwearfunctions.js");
const { removeHeavy, getHeavy, assignHeavy } = require("../../functions/heavyfunctions.js");
const { messageSendChannel } = require("../../functions/messagefunctions.js");
const { getText } = require("../../functions/textfunctions.js");
const { getChastityBra } = require("../../functions/vibefunctions.js");
const { assignChastityBra } = require("../../functions/vibefunctions.js");
const { getChastityBraName } = require("../../functions/vibefunctions.js");
const { getChastityName, assignChastity } = require("../../functions/vibefunctions.js");
const { getChastity } = require("../../functions/vibefunctions.js");
const { getWearable, getLockedWearable, deleteWearable, getWearableName, assignWearable } = require("../../functions/wearablefunctions.js");
//const { mimicCostumes } = require('./mimic/mimicCostumes.js')

// File Containing Costumer Mimic Outfits - Wearables, Headwear, Mittens, Gags, Heavy. Only one Heavy item per outfit, and always at the end.
const maid_outfit = [
    {category: "wearable", itemtowear: "maiddress_latex", color: "Black" },
    {category: "wearable", itemtowear: "maidapron_latex", color: null },
    {category: "wearable", itemtowear: "maid_headdress", color: null },
    {category: "wearable", itemtowear: "garters_latex", color: "White" },
    {category: "wearable", itemtowear: "stockings", color: "White" },
    {category: "wearable", itemtowear: "gloves_latex", color: "black" },
    {category: "mittens", itemtowear: "mittens_latex", color: null },
    {category: "collar", itemtowear: "collar_latex", color: null },
    {category: "chastitybelt", itemtowear: "belt_maid", color: null },
    {category: "gag", itemtowear: "politeSub", color: null },
    {category: "heavy", itemtowear: "straitjacket_maid", color: null },
];

const bunnygirl_outfit = [
    {category: "wearable", itemtowear: "outfit_playbunny_headwear", color: "black" },  
    {category: "wearable", itemtowear: "suit_outfit", color: "Playbunny" },  
    {category: "wearable", itemtowear: "bunnytights_latex", color: "black" },
    {category: "wearable", itemtowear: "balletheels_latex", color: "red" },
    {category: "wearable", itemtowear: "cuffswrist_latex", color: "red" },
    {category: "wearable", itemtowear: "cuffsankle_latex", color: "red" },
    {category: "wearable", itemtowear: "cuffsthigh_latex", color: "red" },
    {category: "mittens", itemtowear: "mittens_latex", color: null },
    {category: "gag", itemtowear: "ball", color: null },
    {category: "headwear", itemtowear: "mask_bunny", color: null },
    {category: "heavy", itemtowear: "armbinder_latex", color: null },
];

const kitsune_outfit = [
    {category: "wearable", itemtowear: "panties_latex", color: "Indigo" },
    {category: "wearable", itemtowear: "thighhighs_latex", color: "Starry" },
    {category: "wearable", itemtowear: "kimono_latex", color: "Shadow" },
    {category: "wearable", itemtowear: "sleeves_detached_latex", color: "Starry" },
    {category: "wearable", itemtowear: "bigcute_ribbon", color: "purple" },    
    {category: "wearable", itemtowear: "balletheels_latex", color: "starry" },
    {category: "wearable", itemtowear: "veil", color: "Starry" },
    {category: "wearable", itemtowear: "mask_kitsune", color: null },
    {category: "mittens", itemtowear: "mittens_latex", color: null },
    {category: "gag", itemtowear: "ball", color: null },
    {category: "collar", itemtowear: "collar_latex", color: null },
    {category: "heavy", itemtowear: "boxbinder_latex", color: null },
];

const librarian_outfit = [
    {category: "wearable", itemtowear: "rope_karada", color: "green" },
    {category: "wearable", itemtowear: "pencil_skirt", color: "Latex" },
    {category: "wearable", itemtowear: "buttonup_blouse", color: "Latex" },
    {category: "wearable", itemtowear: "glasses_librarian", color: null },
    {category: "wearable", itemtowear: "highheels_latex", color: "Black" },
    {category: "mittens", itemtowear: "mittens_latex", color: null },
    {category: "headwear", itemtowear: "mask_kigu_shy", color: null },
    {category: "gag", itemtowear: "ball", color: null },
    {category: "collar", itemtowear: "collar_posture", color: null },
];

const witch_outfit = [
    {category: "wearable", itemtowear: "bra_latex", color: "Purple" },
    {category: "wearable", itemtowear: "panties_latex", color: "purple" },
    {category: "wearable", itemtowear: "stockings_latex", color: "starry" },
    {category: "wearable", itemtowear: "gloves_opera_latex", color: "starry" },    
    {category: "wearable", itemtowear: "evening_dress_latex", color: "starry" },
    {category: "wearable", itemtowear: "witchhat_normal", color: "starry" },
    {category: "wearable", itemtowear: "tome", color: "Tome of Bondage" },
    {category: "wearable", itemtowear: "thighhighboots_latex", color: "Purple" },
    {category: "headwear", itemtowear: "blindfold_latex", color: null },
    {category: "mittens", itemtowear: "mittens_latex", color: null },
    {category: "gag", itemtowear: "ball", color: null },
    {category: "collar", itemtowear: "collar_latex", color: null },
    {category: "heavy", itemtowear: "shadowhands", color: null },
];


const mimicCostumes = {
    maid_outfit: maid_outfit, 
    bunnygirl_outfit: bunnygirl_outfit,
    kitsune_outfit: kitsune_outfit,
    librarian_outfit: librarian_outfit,
    witch_outfit: witch_outfit,
};

// Costumer Mimic Event Function
// Rapidly strips the victim of all unprotected clothing and restraints
// Then it will slowly apply a random outfit and set of restraints!
// Then it will spit them out and apply a new heavy item at the end!

let functiontick = async (userID) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (process.userevents[userID] == undefined) { process.userevents[userID] = {} }
    if (process.userevents[userID].costumermimiclatex == undefined) { process.userevents[userID].costumermimiclatex = { stage: 0 } }
    if (process.userevents[userID].costumermimiclatex.costumeidx == undefined) { process.userevents[userID].costumermimiclatex.costumeidx = 0 }
    if (process.userevents[userID].costumermimiclatex.origbinder == undefined) { process.userevents[userID].costumermimiclatex.origbinder = getHeavy(userID).origbinder }

    // Randomly select an outfit from mimicCostumes.js
    if (process.userevents[userID].costumermimiclatex.outfit == undefined) { process.userevents[userID].costumermimiclatex.outfit = Object.keys(mimicCostumes)[Math.floor(Math.random() * Object.keys(mimicCostumes).length)]; }
    let currclothes = getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f))); // Current clothes that can be removed

    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person in the processing terminal!
    let targetobject = await process.client.users.fetch(getHeavy(userID).origbinder ?? userID); // The cruel person who threw this person in the terminal!
    // Something's wrong. 
    if (!userobject || !targetobject || !(process.recentmessages && process.recentmessages[userID])) {
        return;
    }

    // Only update a max of once every 20 seconds. 
    if ((process.userevents[userID].costumermimiclatex.nextupdate ?? 0) < Date.now()) {
        process.userevents[userID].costumermimiclatex.nextupdate = Date.now() + 20000;
    }
    else { return };

    // Build data tree:
    let data = {
        textarray: "texts_eventfunctions",
        textdata: {
            interactionuser: userobject,
            targetuser: targetobject,
        }
    }

    console.log(process.userevents[userID].costumermimiclatex)

    // Select Item from Chosen Outfit based in index
    let nextitem = mimicCostumes[process.userevents[userID].costumermimiclatex.outfit][process.userevents[userID].costumermimiclatex.costumeidx];
    let itemtoequipcolored = null;

    data.heavy = true;
    data.costumer_mimic = true;

    if (process.userevents[userID].costumermimiclatex.stage == 0) {
        if (currclothes.length > 0) {
            console.log(currclothes)
            console.log(getWearableName(undefined, currclothes[0]))
            // Fetch Wearable name and remove it 
            data.textdata.c1 = getWearableName(undefined, currclothes[0]);
            data.removeclothing = true;
            deleteWearable(userID, currclothes[0]);

            // Send a message saying it stripped something off the wearer <3
            messageSendChannel(getText(data), process.recentmessages[userID])
            return;
        } 
        else {
            // Victim Stripped of all unprotected clothing, progress to next stage
            process.userevents[userID].costumermimiclatex.stage = 1;
            data.donestripping = true;
            messageSendChannel(getText(data), process.recentmessages[userID])
            return;
        }
    }

    // Apply Outfit Items once stripped until last index of array is reached or a heavy item is found
    if (process.userevents[userID].costumermimiclatex.stage == 1 && process.userevents[userID].costumermimiclatex.costumeidx < mimicCostumes[process.userevents[userID].costumermimiclatex.outfit].length && nextitem.category != "heavy") {

        data.applyingOutfit = true;
        switch (nextitem.category) {
            case "wearable":
                data.wearable = true;
                itemtoequipcolored = colourItem(nextitem.itemtowear, nextitem.color);
                if (itemtoequipcolored != null) {
                    data.textdata.c1 = getWearableName(undefined, itemtoequipcolored)
                    assignWearable(userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                else {
                    data.textdata.c1 = getWearableName(undefined, nextitem.itemtowear)
                    assignWearable(userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimiclatex.costumeidx++;
                break;

            case "headwear":
                if (!getHeadwear(userID) || (getHeadwear(userID) && (getHeadwear(userID).getHeadwearName != nextitem.itemtowear))) {
                    data.headwear = true;
                    data.textdata.c1 = getHeadwearName(undefined, nextitem.itemtowear), // headwear name

                        // Apply the headwear    
                        assignHeadwear(userID, nextitem.itemtowear, targetobject.id)

                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimiclatex.costumeidx++;
                break;

            case "gag":
                if (!getGag(userID) || (getGag(userID) && (getGag(userID).getGagName != nextitem.itemtowear))) {
                    data.gag = true;
                    data.textdata.c1 = convertGagText(nextitem.itemtowear), // gag name
                    // Apply the gag    
                    assignGag(userID, nextitem.itemtowear, Math.floor(Math.random() * 10) + 1, process.userevents[userID].costumermimiclatex.origbinder)
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimiclatex.costumeidx++;
                break;

            case "mittens":
                if (!getMitten(userID) || (getMitten(userID) && (getMitten(userID).getMittenName != nextitem.itemtowear))) {
                    data.mitten = true;
                    if (getMitten(userID)) {
                        data.textdata.c1 = getMittenName(undefined, getMitten(userID).mittenname) ?? "mittens", // mitten name
                            data.textdata.c2 = getMittenName(undefined, nextitem.itemtowear), // new mitten name
                            assignMitten(userID, nextitem.itemtowear, getMitten(userID).origbinder)

                        data.replace = true;
                    }
                    else {
                        data.textdata.c1 = getMittenName(undefined, nextitem.itemtowear), // mitten name
                        assignMitten(userID, nextitem.itemtowear, process.userevents[userID].costumermimiclatex.origbinder)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimiclatex.costumeidx++;
                break;
                
            case "chastitybelt":
                if (!getChastity(userID) || (getChastity(userID) && (getChastity(userID).getChastityName != nextitem.itemtowear))) {
                    data.chastitybelt = true;
                    if (getChastity(userID)) {
                        data.textdata.c1 = getChastityName(undefined, getChastity(userID).getChastityName) ?? "chastity belt", // chastity name
                            data.textdata.c2 = getChastityName(undefined, nextitem.itemtowear), // new chastity name

                            // Update Chastity Belt Name with new type
                            process.chastity[userID].chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityName(undefined, nextitem.itemtowear), // chastity name
                        assignChastity(userID, process.userevents[userID].costumermimiclatex.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimiclatex.costumeidx++;
                break;
                
            case "chastitybra":
                if (!getChastityBra(userID) || (getChastityBra(userID) && (getChastityBra(userID).getChastityBraName != nextitem.itemtowear))) {
                    data.chastitybra = true;
                    if (getChastityBra(userID)) {
                        data.textdata.c1 = getChastityBraName(undefined, getChastityBra(userID).getChastityBraName) ?? "chastity bra", // chastity bra name
                            data.textdata.c2 = getChastityBraName(undefined, nextitem.itemtowear), // new chastity bra name
                            
                            // Update Chastity Bra Name with new type
                            process.chastitybra[userID].chastitytype =  nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityBraName(undefined, nextitem.itemtowear), // chastity bra name
                        assignChastityBra(userID, process.userevents[userID].costumermimiclatex.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimiclatex.costumeidx++;
                break;
                
            case "collar":
                if (!getCollar(userID) || (getCollar(userID) && (getCollar(userID).getCollarName != nextitem.itemtowear))) {
                    data.collar = true;
                    if (getCollar(userID)) {
                        data.textdata.c1 = getCollarName(undefined, getCollar(userID).getCollarName) ?? "collar", // collar name
                            data.textdata.c2 = getCollarName(undefined, nextitem.itemtowear), // new collar name

                            // Update Collar Name with new type
                            process.collar[userID].collartype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getCollarName(undefined, nextitem.itemtowear), // collar name
                        assignCollar(userID, process.userevents[userID].costumermimiclatex.origbinder, { }, false, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimiclatex.costumeidx++;
                break;

            default:
                // Unknown Item Category in Outfit
                data.unknown = true;
                data.textdata.c1 = nextitem.itemtowear; // item name
                messageSendChannel(getText(data), process.recentmessages[userID]);

                // Increment Costume Index to bypass unknown item
                process.userevents[userID].costumermimiclatex.costumeidx++;
                break;
        }

    } else if (nextitem.category == "heavy" || process.userevents[userID].costumermimiclatex.costumeidx >= mimicCostumes[process.userevents[userID].costumermimiclatex.outfit].length) {
        // Final Stage - Remove Mimic Heavy and spit them out, then apply Outfit Heavy!
        // heavy item reached or end of outfit reached        

        // Remove Current Heavy (Mimic)
        removeHeavy(userID);
        data.spitout = true;

        // Apply New Heavy
        if (nextitem.itemtowear && nextitem.category == "heavy") {
            assignHeavy(userID, nextitem.itemtowear, process.userevents[userID].costumermimiclatex.origbinder);
            data.textdata.c1 = getHeavy(userID).type; // heavy name
            data.add = true;
            messageSendChannel(getText(data), process.recentmessages[userID]);
        } else {
            data.none = true;
            messageSendChannel(getText(data), process.recentmessages[userID]);
        }

        // Remove Event and exit (Does this automatically go to Garbage Collector?)
        delete process.userevents[userID].costumermimiclatex;
    }
}

const colourItem = (itemtowear, color) => {
    if (color && getWearableName(undefined, `${itemtowear}_${color.toLowerCase()}`)) {
        return `${itemtowear}_${color.toLowerCase()}`;
    }
    else {
        return `${itemtowear}`
    }
}

exports.functiontick = functiontick;