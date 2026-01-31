const { findCollarKey, getBaseCollar } = require("./collarfunctions");
const { findChastityKey, getChastity, getArousal, calcFrustration } = require("./vibefunctions");
const { their } = require("./pronounfunctions");
const { getMitten } = require("./gagfunctions");
const fs = require("fs");
const { getUserVar, setUserVar } = require("./usercontext");
const { getHeavy } = require("./heavyfunctions");
const { config, getOption } = require("./configfunctions");
const { findChastityBraKey } = require("./vibefunctions");
const { messageSendChannel } = require("./messagefunctions.js");
const { PermissionsBitField } = require("discord.js");
const { frustrationPenalties } = require("./vibefunctions.js");
const { getCombinedTraits } = require("./vibefunctions.js");
const { logConsole } = require("./logfunctions.js");
const { getBaseChastity } = require("./chastityfunctions.js");
const { getTextGeneric } = require("./textfunctions.js");

const MAX_FUMBLE_CHANCE = 0.95;
const FUMBLE_AROUSAL_POTENCY = 11.7;
const FUMBLE_AROUSAL_COEFFICIENT = 0.38;

// returns how heavy the fumble was (usually 1 = regular, 2 = drop key)
function rollKeyFumble(keyholder, locked, maxFumbles = 1) {
	if (process.keyfumbling == undefined) {
		process.keyfumbling = {};
	}
	// get the initial fumble chance
	let fumbleChance = getFumbleChance(keyholder, locked);
	// just save time and skip this thing if they cannot fumble
	if (!fumbleChance) return 0;
	let i;
	// roll until they succeed or the maximum fumbles
	for (i = 0; i < maxFumbles; i++) {
		// the overcap for the current fumble chance is used for the next fumble, with a minimum of a 5% chance for all but the first roll
		const nextFumbleChance = Math.max(0.05, fumbleChance - MAX_FUMBLE_CHANCE);
		// if overcapped, reduce to the cap
		if (fumbleChance > MAX_FUMBLE_CHANCE) fumbleChance = MAX_FUMBLE_CHANCE;
		if (Math.random() < fumbleChance) {
			// user fumbled
			if (config.getBlessedLuck(keyholder)) {
				// if they use blessed luck, add the success chance to their saved blessing
				const blessing = getUserVar(keyholder, "blessed") ?? 0;
				setUserVar(keyholder, "blessing", blessing + 1 - fumbleChance);
			}

			// set the fumble chance for next roll
			fumbleChance = nextFumbleChance;

			// fumbling is frustrating
			const penalties = frustrationPenalties.get(keyholder) ?? [];
			penalties.push({ timestamp: Date.now(), value: 15, decay: 2 });
			frustrationPenalties.set(keyholder, penalties);
		} else {
			// user didn't fumble
			// if it was the first attempt, clear their saved up blessing
			if (i == 0) setUserVar(keyholder, "blessing", 0);
			// return how many fumbles it took before a success
			getCombinedTraits(locked).onFumble({ userID: locked, keyholderID: keyholder, fumbles: i});
			return i;
		}
	}
	// succeeding returns early so if we get here they failed every time
	getCombinedTraits(locked).onFumble({ userID: locked, keyholderID: keyholder, fumbles: maxFumbles});
	return maxFumbles;
}

function getFumbleChance(keyholder, locked) {
	// cannot fumble if disabled
	if (config.getDisabledKeyFumbling(locked)) return 0;
	// ... or if not using the dynamic arousal system
	if (!config.getDynamicArousal(keyholder)) return 0;
	// ... or if it's someone else and either has disable fumbling for others
	if (keyholder != locked && (!config.getKeyFumblingOthers(keyholder) || !config.getKeyFumblingOthers(locked))) return 0;

	// calculate the base chance from arousal (which affects it logarithmically) and frustration (which affects it exponentially until a point)
	let chance = FUMBLE_AROUSAL_POTENCY * Math.log(1 + FUMBLE_AROUSAL_COEFFICIENT * getArousal(keyholder)) + calcFrustration(keyholder);

	// chance is increased if the keyholder is wearing mittens
	if (getMitten(keyholder)) {
		chance += 10;
		chance *= 1.1;
	}

	// reduce the fumble chance by saved up blessing from prior unlucky rolls
	if (config.getBlessedLuck(keyholder)) chance -= getUserVar(keyholder, "blessed") ?? 0;

	// divine intervention
	if (Math.random() < 0.02) chance -= 50;

	return chance / 100;
}

async function handleKeyFinding(message) {
    let processvars = ["collar", "chastity", "chastitybra"];
    processvars.forEach((pv) => {
        if (processvars[pv] == undefined) { processvars[pv] = {}}
        Object.entries(processvars[pv]).forEach(async (en) => {
            try {
                if (en[1].fumbled) {
                    if (Math.random() < (Math.max(Math.min(message.content.length * 0.0005, 0.2), 0.01))) {
                        // Key was found! Lets make sure the sender AND the user can view the channel.
                        // Implicitly, the sender should be able to lol
                        let weareruser = await message.guild.members.fetch(en[0]);
                        if (message.channel.permissionsFor(weareruser).has(PermissionsBitField.Flags.ViewChannel)) {
                            // Wearer IS able to view this channel! Both people should be able to see this channel then.
                            // Determine which string sets to use, starting with other or self.
                            let finderpart = "other";
                            if (weareruser.id == message.member.id) {
                                finderpart = "self";
                            }
                            // Now an append if they're in mittens or heavy bondage
                            let extrafindkeypart = "";
                            let chance = 1.0
                            if (getMitten(message.member.id)) {
                                chance = 0.5;
                                extrafindkeypart = "_mitten"
                            }
                            if (getHeavy(message.member.id)) {
                                chance = 0.0;
                                extrafindkeypart = "_heavy"
                            }
                            let data = {
                                interactionuser: message.member,
                                targetuser: weareruser
                            }
                            if ((pv == "chastity") || (pv == "chastitybra")) {
                                data.c1 = getBaseChastity(en[1].chastitytype).name
                            }
                            else if (pv == "collar") {
                                data.c1 = getBaseCollar(en[1].collartype).name
                            }
                            if (Math.random() < chance) {
                                // Successfully found the key!
                                messageSendChannel(getTextGeneric(`find_key_${finderpart}${extrafindkeypart}`, data), message.channel.id)
                                // Destroy cloned keyholders if the keyholder is new!
                                if (message.member.id != processvars[pv][en[0]].keyholder) {
                                    processvars[pv][en[0]].clonedKeyholders = [];
                                }
                                // Assign the new keyholder and then delete the fumbled date. 
                                processvars[pv][en[0]].keyholder = message.member.id;
                                delete processvars[pv][en[0]].fumbled;
                            }
                            else {
                                // Fumbled finding the key lol
                                messageSendChannel(getTextGeneric(`find_keyfail_${finderpart}${extrafindkeypart}`, data), message.channel.id)
                            }
                        }
                    }
                }
            }
            catch (err) {
                logConsole(`handleKeyFinding: ${err}`, 4);
            }
        })
    })
}

function getFindFunction(restraint) {
	switch (restraint) {
		case "chastity belt":
			return findChastityKey;
		case "collar":
			return findCollarKey;
		case "chastity bra":
			return findChastityBraKey;
		default:
			console.log(`No find function for restraint ${restraint}`);
			return (_0, _1) => false;
	}
}

async function sendFindMessage(message, lockedUser, restraint) {
	try {
		if (message.author.id == lockedUser) message.channel.send(`${message.author} has found the key to ${their(message.author.id)} ${restraint}!`);
		else message.channel.send(`${message.author} has found the key to <@${lockedUser}>'s ${restraint}!`);
	} catch (err) {
		console.log(err); // Seriously plz dont crash
	}
}

async function sendFindFumbleMessage(message, lockedUser, restraint) {
	try {
		if (message.author.id == lockedUser) message.channel.send(`${message.author} has found the key to ${their(message.author.id)} ${restraint} but fumbles when trying to pick it up!`);
		else message.channel.send(`${message.author} has found the key to <@${lockedUser}>'s ${restraint} but fumbles when trying to pick it up!`);
	} catch (err) {
		console.log(err); // Seriously plz dont crash
	}
}

function calcFindSuccessChance(user) {
	if (getHeavy(user)) return 0;
	if (getMitten(user)) return 0.5;
	else return 1;
}

exports.getFumbleChance = getFumbleChance;
exports.rollKeyFumble = rollKeyFumble;
exports.handleKeyFinding = handleKeyFinding;
