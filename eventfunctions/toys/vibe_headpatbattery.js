const { getCollar } = require("../../functions/collarfunctions");
const { getBotOption, getOption } = require("../../functions/configfunctions");
const { assignGag } = require("../../functions/gagfunctions");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { getPronouns } = require("../../functions/pronounfunctions");
const { getTextGeneric } = require("../../functions/textfunctions");
const { getUserVar, setUserVar } = require("../../functions/usercontext");

// Successful headpats will recharge the battery on the recipient's vibe by 5%. Each minute drains 2%. 
function headpatfunction(recipient, data) {
    let newcharge = (getUserVar(recipient, "headpatvibecharge") ?? 0.0)
    if (data.returnedobject.hit) {
        if (newcharge == 0.0) {
            messageSendChannel(`The headpat gives enough charge to start up a vibrator...`, process.recentmessages[recipient])
        }
        newcharge = newcharge + (0.05 * getOption(recipient, "headpatrestraintpotency"))
        if (data.returnedobject.crit) {
            newcharge = newcharge + (0.05 * getOption(recipient, "headpatrestraintpotency")) // double charge for crits
        }
    }
    setUserVar(recipient, "headpatvibecharge", newcharge);
}

// Update battery
async function tick(userid) {
    let newcharge = 0.0
    if (getUserVar(userid, "headpatvibecharge")) {
        newcharge = getUserVar(userid, "headpatvibecharge") - 0.02 * (getBotOption("bot-timetickrate") / 60000)
    }
    if (getUserVar(userid, "headpatvibecharge") > 1.0) { 
        newcharge = 1.0
    }
    if (getUserVar(userid, "headpatvibecharge") < 0.0) {
        newcharge = 0.0
    }
    setUserVar(userid, "headpatvibecharge", newcharge);
}

exports.tick = tick;
exports.headpatfunction = headpatfunction;