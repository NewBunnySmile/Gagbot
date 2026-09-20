const { getChastity } = require("../chastity/getChastity");
const { getChastityBra } = require("../chastity/getChastityBra");
const { getCollar } = require("../collar/getCollar");
const { getCorset } = require("../corset/getCorset");
const { getGags } = require("../gag/getGags");
const { getHeadwear } = require("../headwear/getHeadwear");
const { getHeavyList } = require("../heavy/getHeavyList");
const { getMitten } = require("../mitten/getMitten");
const { getItemTags } = require("./getItemTags");
const { getUserTags } = require("./getUserTags");

/**********
 * Given a user, returns a random restraint they can equip, respecting their content tags and avoiding any already worn slots. Preferred tags will have a higher priority. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this should check against
 * - (string) bondagetype? - If specified, forces a particular bondage type
 * ---
 * ##### 
 **********/
function getRandomEquippableRestraint(serverID, userID, bondagetype_in) {
    let bondagetype = bondagetype_in;
    if (!bondagetype) {
        let eligibletypes = [];
        if (!getHeadwear(serverID, userID) || (getHeadwear(serverID, userID)?.length < process.autocompletes.headtypes.length)) {
            eligibletypes.push("headwear")
        }
        if (!getGags(serverID, userID) || (getGags(serverID, userID)?.length < process.autocompletes.gag.length)) {
            eligibletypes.push("gag")
        }
        if (!getChastity(serverID, userID)) {
            eligibletypes.push("chastity")
        }
        if (!getChastityBra(serverID, userID)) {
            eligibletypes.push("chastitybra")
        }
        if (!getCorset(serverID, userID)) {
            eligibletypes.push("corset")
        }
        if (!getMitten(serverID, userID)) {
            eligibletypes.push("mitten")
        }
        if (!getCollar(serverID, userID)) {
            eligibletypes.push("collar")
        }
        if (!getHeavyList(serverID, userID) || (getHeavyList(serverID, userID)?.length < process.autocompletes.heavy.length)) {
            eligibletypes.push("gag")
        }
        bondagetype = eligibletypes[Math.floor(eligibletypes.length * Math.random())]
    }
    if (bondagetype == "headwear") { bondagetype = "mask" }

    // Get tags
    let tags = getUserTags(serverID, userID);
    let preferredtags = getUserTags(serverID, userID, true)
    let eligiblerestraints;
    let preferredlist;
    let itemsworn;
    
    switch(itemtype) {
        case "chastity":
            eligiblerestraints = process.autocompletes.chastity.map((f) => f.value)
            // Filter out any restraints with a forbidden tag
            eligiblerestraints = eligiblerestraints.filter((f) => {
                let itemtags = getItemTags(f)
                let returnval = true;
                itemtags.forEach((it) => {
                    if (tags.includes(it)) {
                        returnval = false;
                    }
                })
                return returnval;
            })
            preferredlist = [];
            // Double any restraints which match a preferred tag
            eligiblerestraints.forEach((f) => {
                let itemtags = getItemTags(f)
                itemtags.forEach((it) => {
                    if (preferredtags.includes(it)) {
                        preferredlist.push(f)
                    }
                })
            })
            eligiblerestraints = eligiblerestraints.concat(preferredlist);
            return eligiblerestraints[Math.floor(eligiblerestraints.length * Math.random())]
        case "chastitybra":
            eligiblerestraints = process.autocompletes.chastitybra.map((f) => f.value)
            // Filter out any restraints with a forbidden tag
            eligiblerestraints = eligiblerestraints.filter((f) => {
                let itemtags = getItemTags(f)
                let returnval = true;
                itemtags.forEach((it) => {
                    if (tags.includes(it)) {
                        returnval = false;
                    }
                })
                return returnval;
            })
            preferredlist = [];
            // Double any restraints which match a preferred tag
            eligiblerestraints.forEach((f) => {
                let itemtags = getItemTags(f)
                itemtags.forEach((it) => {
                    if (preferredtags.includes(it)) {
                        preferredlist.push(f)
                    }
                })
            })
            eligiblerestraints = eligiblerestraints.concat(preferredlist);
            return eligiblerestraints[Math.floor(eligiblerestraints.length * Math.random())]
        case "collar":
            eligiblerestraints = process.autocompletes.collar.map((f) => f.value)
            // Filter out any restraints with a forbidden tag
            eligiblerestraints = eligiblerestraints.filter((f) => {
                let itemtags = getItemTags(f)
                let returnval = true;
                itemtags.forEach((it) => {
                    if (tags.includes(it)) {
                        returnval = false;
                    }
                })
                return returnval;
            })
            preferredlist = [];
            // Double any restraints which match a preferred tag
            eligiblerestraints.forEach((f) => {
                let itemtags = getItemTags(f)
                itemtags.forEach((it) => {
                    if (preferredtags.includes(it)) {
                        preferredlist.push(f)
                    }
                })
            })
            eligiblerestraints = eligiblerestraints.concat(preferredlist);
            return eligiblerestraints[Math.floor(eligiblerestraints.length * Math.random())]
        case "gag":
            eligiblerestraints = process.autocompletes.gag.map((f) => f.value)
            itemsworn = getGags(serverID, userID)?.map((f) => f.gagtype) ?? [];
            eligiblerestraints = eligiblerestraints.filter((f) => !itemsworn.includes(f));
            // Filter out any restraints with a forbidden tag
            eligiblerestraints = eligiblerestraints.filter((f) => {
                let itemtags = getItemTags(f)
                let returnval = true;
                itemtags.forEach((it) => {
                    if (tags.includes(it)) {
                        returnval = false;
                    }
                })
                return returnval;
            })
            preferredlist = [];
            // Double any restraints which match a preferred tag
            eligiblerestraints.forEach((f) => {
                let itemtags = getItemTags(f)
                itemtags.forEach((it) => {
                    if (preferredtags.includes(it)) {
                        preferredlist.push(f)
                    }
                })
            })
            eligiblerestraints = eligiblerestraints.concat(preferredlist);
            return eligiblerestraints[Math.floor(eligiblerestraints.length * Math.random())]
        case "mitten":
            eligiblerestraints = process.autocompletes.mitten.map((f) => f.value)
            // Filter out any restraints with a forbidden tag
            eligiblerestraints = eligiblerestraints.filter((f) => {
                let itemtags = getItemTags(f)
                let returnval = true;
                itemtags.forEach((it) => {
                    if (tags.includes(it)) {
                        returnval = false;
                    }
                })
                return returnval;
            })
            preferredlist = [];
            // Double any restraints which match a preferred tag
            eligiblerestraints.forEach((f) => {
                let itemtags = getItemTags(f)
                itemtags.forEach((it) => {
                    if (preferredtags.includes(it)) {
                        preferredlist.push(f)
                    }
                })
            })
            eligiblerestraints = eligiblerestraints.concat(preferredlist);
            return eligiblerestraints[Math.floor(eligiblerestraints.length * Math.random())]
        case "corset":
            eligiblerestraints = process.autocompletes.corset.map((f) => f.value)
            // Filter out any restraints with a forbidden tag
            eligiblerestraints = eligiblerestraints.filter((f) => {
                let itemtags = getItemTags(f)
                let returnval = true;
                itemtags.forEach((it) => {
                    if (tags.includes(it)) {
                        returnval = false;
                    }
                })
                return returnval;
            })
            preferredlist = [];
            // Double any restraints which match a preferred tag
            eligiblerestraints.forEach((f) => {
                let itemtags = getItemTags(f)
                itemtags.forEach((it) => {
                    if (preferredtags.includes(it)) {
                        preferredlist.push(f)
                    }
                })
            })
            eligiblerestraints = eligiblerestraints.concat(preferredlist);
            return eligiblerestraints[Math.floor(eligiblerestraints.length * Math.random())]
        case "heavy":
            eligiblerestraints = process.autocompletes.heavy.map((f) => f.value)
            itemsworn = getHeavyList(serverID, userID)?.map((f) => f.type) ?? [];
            eligiblerestraints = eligiblerestraints.filter((f) => !itemsworn.includes(f));
            // Filter out any restraints with a forbidden tag
            eligiblerestraints = eligiblerestraints.filter((f) => {
                let itemtags = getItemTags(f)
                let returnval = true;
                itemtags.forEach((it) => {
                    if (tags.includes(it)) {
                        returnval = false;
                    }
                })
                return returnval;
            })
            preferredlist = [];
            // Double any restraints which match a preferred tag
            eligiblerestraints.forEach((f) => {
                let itemtags = getItemTags(f)
                itemtags.forEach((it) => {
                    if (preferredtags.includes(it)) {
                        preferredlist.push(f)
                    }
                })
            })
            eligiblerestraints = eligiblerestraints.concat(preferredlist);
            return eligiblerestraints[Math.floor(eligiblerestraints.length * Math.random())]
        case "mask":
            eligiblerestraints = process.autocompletes.headtypes.map((f) => f.value)
            itemsworn = getHeadwear(serverID, userID)?.map((f) => f.type) ?? [];
            eligiblerestraints = eligiblerestraints.filter((f) => !itemsworn.includes(f));
            // Filter out any restraints with a forbidden tag
            eligiblerestraints = eligiblerestraints.filter((f) => {
                let itemtags = getItemTags(f)
                let returnval = true;
                itemtags.forEach((it) => {
                    if (tags.includes(it)) {
                        returnval = false;
                    }
                })
                return returnval;
            })
            preferredlist = [];
            // Double any restraints which match a preferred tag
            eligiblerestraints.forEach((f) => {
                let itemtags = getItemTags(f)
                itemtags.forEach((it) => {
                    if (preferredtags.includes(it)) {
                        preferredlist.push(f)
                    }
                })
            })
            eligiblerestraints = eligiblerestraints.concat(preferredlist);
            return eligiblerestraints[Math.floor(eligiblerestraints.length * Math.random())]
        default:
            console.log(`Unknown item type - ${itemtype}`)
            break;
    }
}

exports.getRandomEquippableRestraint = getRandomEquippableRestraint;