const crypto = require("crypto");
const { getItemType } = require("./../../getters/config/getItemType");
const { getItemName } = require("./../../getters/config/getItemName");
const { assignWearable } = require(`./../wearable/assignWearable`);
const { assignChastity } = require(`./../chastity/assignChastity`);
const { assignChastityBra } = require(`./../chastity/assignChastityBra`);
const { assignCollar } = require("../collar/assignCollar");
const { assignGag } = require("../gag/assignGag");
const { assignMitten } = require("../mitten/assignMitten");
const { assignCorset } = require("../corset/assignCorset");
const { assignHeavy } = require("../heavy/assignHeavy");
const { assignHeadwear } = require("../headwear/assignHeadwear");
const { assignToy } = require("../toy/assignToy");
const { getChastity } = require("../../getters/chastity/getChastity");
const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { getCollar } = require("../../getters/collar/getCollar");
const { getGag } = require("../../getters/gag/getGag");
const { getMitten } = require("../../getters/mitten/getMitten");
const { getCorset } = require("../../getters/corset/getCorset");
const { getHeavy } = require("../../getters/heavy/getHeavy");
const { getSpecificHeadwear } = require("../../getters/headwear/getSpecificHeadwear");

/********
 * Given a restraint ID, applies the restraint to the user. Additional params can be supplied in the data object to tailor it. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is for
 * - (string) item - The item to apply to them
 * - (object) data? - Additional props to apply to the restraint:
 * - ---> (integer) intensity? - 0-10 (corsets and gags), 0-20 toys
 * - ---> (user id) origbinder? - The person putting the restraint on
 * - ---> (string) customname? - Used by Heavy Bondage to specify custom name
 * - ---> (integer) timedlock? - If specified in ms, sets a timer lock on the restraint for that duration. 
 ********/
function addRestraintToUser(serverID, userID, item, data = undefined) {
    let restrainttype = getItemType(item)
    let keyholder = data?.origbinder;
    switch(restrainttype) {
        case "wearable":
            assignWearable(serverID, userID, item);
        case "chastity":
            assignChastity(serverID, userID, data?.origbinder, item)     
            if (data?.timedlock) {
                let restraintobject = getChastity(serverID, userID)
                restraintobject.lock = {
                    serverID: serverID,
                    userID: userID,
                    keyholderID: data?.origbinder ?? process.client.user.id,
                    locktype: "timerlock",
                    restraintname: getItemName(restraintobject),
                    uuid: crypto.randomUUID(),
                    unlocktime: Date.now() + data.timedlock
                }
            }
        case "chastitybra":
            assignChastityBra(serverID, userID, data?.origbinder, item)
            if (data?.timedlock) {
                let restraintobject = getChastityBra(serverID, userID)
                restraintobject.lock = {
                    serverID: serverID,
                    userID: userID,
                    keyholderID: data?.origbinder ?? process.client.user.id,
                    locktype: "timerlock",
                    restraintname: getItemName(restraintobject),
                    uuid: crypto.randomUUID(),
                    unlocktime: Date.now() + data.timedlock
                }
            }
        case "collar":
            assignCollar(serverID, userID, keyholder, {}, false, item)
            if (data?.timedlock) {
                let restraintobject = getCollar(serverID, userID)
                restraintobject.lock = {
                    serverID: serverID,
                    userID: userID,
                    keyholderID: data?.origbinder ?? process.client.user.id,
                    locktype: "timerlock",
                    restraintname: getItemName(restraintobject),
                    uuid: crypto.randomUUID(),
                    unlocktime: Date.now() + data.timedlock
                }
            }
        case "gag":
            assignGag(serverID, userID, item, data?.intensity, data?.origbinder)
            if (data?.timedlock) {
                let restraintobject = getGag(serverID, userID, item)
                restraintobject.lock = {
                    serverID: serverID,
                    userID: userID,
                    keyholderID: data?.origbinder ?? process.client.user.id,
                    locktype: "timerlock",
                    restraintname: getItemName(restraintobject),
                    uuid: crypto.randomUUID(),
                    unlocktime: Date.now() + data.timedlock
                }
            }
        case "mitten":
            assignMitten(serverID, userID, item, data?.origbinder);
            if (data?.timedlock) {
                let restraintobject = getMitten(serverID, userID, item)
                restraintobject.lock = {
                    serverID: serverID,
                    userID: userID,
                    keyholderID: data?.origbinder ?? process.client.user.id,
                    locktype: "timerlock",
                    restraintname: getItemName(restraintobject),
                    uuid: crypto.randomUUID(),
                    unlocktime: Date.now() + data.timedlock
                }
            }
        case "corset":
            assignCorset(serverID, userID, item, data?.intensity, data?.origbinder);
            if (data?.timedlock) {
                let restraintobject = getCorset(serverID, userID, item)
                restraintobject.lock = {
                    serverID: serverID,
                    userID: userID,
                    keyholderID: data?.origbinder ?? process.client.user.id,
                    locktype: "timerlock",
                    restraintname: getItemName(restraintobject),
                    uuid: crypto.randomUUID(),
                    unlocktime: Date.now() + data.timedlock
                }
            }
        case "heavy":
            assignHeavy(serverID, userID, item, data?.origbinder, data?.customname)
            if (data?.timedlock) {
                let restraintobject = getHeavy(serverID, userID, item)
                restraintobject.lock = {
                    serverID: serverID,
                    userID: userID,
                    keyholderID: data?.origbinder ?? process.client.user.id,
                    locktype: "timerlock",
                    restraintname: getItemName(restraintobject),
                    uuid: crypto.randomUUID(),
                    unlocktime: Date.now() + data.timedlock
                }
            }
        case "mask":
            assignHeadwear(serverID, userID, item, data?.origbinder);
            if (data?.timedlock) {
                let restraintobject = getSpecificHeadwear(serverID, userID, item)
                restraintobject.lock = {
                    serverID: serverID,
                    userID: userID,
                    keyholderID: data?.origbinder ?? process.client.user.id,
                    locktype: "timerlock",
                    restraintname: getItemName(restraintobject),
                    uuid: crypto.randomUUID(),
                    unlocktime: Date.now() + data.timedlock
                }
            }
        case "toy":
            assignToy(serverID, userID, data?.origbinder, data?.intensity, item, data?.origbinder);
        default:
            console.log(`Unknown item name - ${item}`)
            break;
    }
}

exports.addRestraintToUser = addRestraintToUser;