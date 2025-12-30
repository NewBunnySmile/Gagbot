const { ButtonStyle, ActionRowBuilder, SectionBuilder, StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder, PermissionsBitField, ButtonBuilder,
    ComponentType, MessageFlags,
    RoleSelectMenuBuilder} = require("discord.js")
const fs = require('fs');
const path = require('path');
const https = require('https');
const { getHeavyBinder } = require('./../functions/heavyfunctions.js')
const { getCorsetBinder } = require('./../functions/corsetfunctions.js')
const { getVibe, getChastityKeyholder } = require('./../functions/vibefunctions.js')
const { getMittenBinder, getGagBinder } = require('./../functions/gagfunctions.js')
const { getHeadwearBinder } = require('./../functions/headwearfunctions.js');
const { getCollarKeyholder } = require("./collarfunctions");

const configoptions = {
    "Arousal": {
        "arousalsystem": {
            name: "Arousal System",
            desc: "Which Arousal system to use?",
            choices: [
                {
                    name: "Off",
                    helptext: "*Arousal disabled*",
                    select_function: (userID) => { 
                        removeVibe(userID) // Delete vibes when disabling arousal
                    },
                    value: 0,
                    style: ButtonStyle.Danger
                },
                {
                    name: "Static Arousal",
                    helptext: "Static Arousal (when vibed)",
                    select_function: (userID) => { return false },
                    value: 1,
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Dynamic Arousal",
                    helptext: "Dynamic Arousal",
                    select_function: (userID) => { return false },
                    value: 2,
                    style: ButtonStyle.Secondary
                }
            ],
            default: 2,
            disabled: () => { return false } // if true, button is greyed out
        },
        "fumbling": {
            name: "Key Fumbling",
            desc: "Who can fumble your keys (from Arousal) and fail to unlock you?",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Fumbling is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Self Only",
                    helptext: "Can fumble your own keys",
                    select_function: (userID) => { return false },
                    value: "self",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Self and Others",
                    helptext: "You and others can fumble your keys",
                    select_function: (userID) => { return false },
                    value: "everyone",
                    style: ButtonStyle.Secondary
                }
            ],
            default: "self",
            disabled: () => { return false } // if true, button is greyed out
        },
        "keyloss": {
            name: "Key Loss",
            desc: "Can fumbling keys cause the keys to be lost?",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Key Loss is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Enabled",
                    helptext: "**Your keys can be lost**",
                    select_function: (userID) => { return false },
                    value: "enabled",
                    style: ButtonStyle.Secondary
                }
            ],
            default: "disabled",
            disabled: (userID) => { return (getOption(userID,"fumbling") == "disabled") } // if true, button is greyed out
        },
        "blessed_luck": {
            name: "Blessed Luck",
            desc: "Should failed rolls from fumbling contribute to future rolls?",
            choices: [
                {
                    name: "No",
                    helptext: "*Blessed Luck is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Yes",
                    helptext: "Failed rolls add to future success chance",
                    select_function: (userID) => { return false },
                    value: "enabled",
                    style: ButtonStyle.Secondary
                },
            ],
            default: "enabled",
            disabled: (userID) => { return (getOption(userID,"fumbling") == "disabled") }
        }
    },
    "General": {
        "keygiving": {
            name: "Key Giving",
            desc: "Are keyholders allowed to give your keys to others?",
            choices: [
                {
                    name: "No",
                    helptext: "*Key giving is disabled*",
                    select_function: (userID) => { return false },
                    value: "disabled",
                    style: ButtonStyle.Danger
                },
                {
                    name: "Prompt",
                    helptext: "You will be prompted for key transfers",
                    select_function: (userID) => { return false },
                    value: "prompt",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Automatic",
                    helptext: "⚠️ **You will accept keygiving requests automatically**",
                    select_function: (userID) => { return false },
                    value: "prompt",
                    style: ButtonStyle.Secondary
                },
            ],
            default: "prompt",
            disabled: () => { return false }
        },
        "removebondage": {
            name: "Prompt to Modify Non-Keyed Bondage",
            desc: "Should you be prompted for others to **/ungag** you, etc?",
            choices: [
                {
                    name: "Everyone",
                    helptext: "Prompt for anyone to remove non-keyed bondage",
                    select_function: (userID) => { return false },
                    value: "all",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Everyone except Binder",
                    helptext: "Prompt for anyone besides who put something on you",
                    select_function: (userID) => { return false },
                    value: "all_binder",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Everyone except Binder and Keyholder(s)",
                    helptext: "Prompt for anyone besides who put something on you or keyholders",
                    select_function: (userID) => { return false },
                    value: "all_binder_and_keyholder",
                    style: ButtonStyle.Secondary
                },
                {
                    name: "Disabled",
                    helptext: "Automatically allow bondage to be removed",
                    select_function: (userID) => { return false },
                    value: "accept",
                    style: ButtonStyle.Secondary
                },
            ],
            default: "accept",
            disabled: () => { return false }
        }
    },
    "Server Settings": {
        "server_allowgags": {
            name: "Allow Gags",
            desc: "Allows /gag and /ungag",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Gags are disabled*",
                    select_function: (serverID) => { return false } // We will need to have this update commands
                },
                {
                    name: "Enabled",
                    helptext: "Gags are enabled",
                    select_function: (serverID) => { return false } // We will need to have this update commands
                },
            ],
            default: "Enabled",
            disabled: () => { return false }
        } 
        // And so on for other features
    },
    "Bot Settings": {
        "bot_enablebot": {
            name: "Global Enable Bot",
            desc: "Should the bot be active and respond to messages",
            choices: [
                {
                    name: "Disabled",
                    helptext: "*Bot will not respond to messages*",
                    select_function: (userID) => { return false } // We will need to have this update commands
                },
                {
                    name: "Enabled",
                    helptext: "Bot responds to messages",
                    select_function: (userID) => { return false } // We will need to have this update commands
                },
            ],
            default: "Enabled",
            disabled: () => { return false }
        }
    }
} 

function generateConfigModal(interaction, menuset = "General", page) {
    // Construct the list of options for a given menu set
    let pagecomponents = [];
    Object.keys(configoptions[menuset]).forEach((k) => {
        let buttonsection = new SectionBuilder()
            .addTextDisplayComponents(
                (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}`),
                (textdisplay) => textdisplay.setContent(`${configoptions[menuset][k].desc}`),
                (textdisplay) => textdisplay.setContent(`-# ‎   ⤷ ${configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.helptext}`)
            )
            .setButtonAccessory((button) =>
                button.setCustomId(`config_pageopt_${menuset}_${k}`)
                    .setLabel(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.name)
                    .setStyle(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.style)
                    .setDisabled(configoptions[menuset][k].disabled(interaction.user.id))
            )
        pagecomponents.push(buttonsection)
    })

    // If manage messages on the server, user is considered a moderator.
    // Give them server specific components, namely to designate a safeword role
    if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && menuset == "Server Settings") {
        let currrole // Get current safeword role that's set here
        pagecomponents.push(new ActionRowBuilder()
            .addComponents(new RoleSelectMenuBuilder()
                .setCustomId(`roleselectopt_${interaction.guildId}`)
                .setPlaceholder(`Select Safeword role for /reset`)
                .setMinValues(0)
                .setMaxValues(1)
                //.setDefaultRoles() -- Set the current safeword role here if theres one already
            )
        )
    }

    // If bot owner, construct a selector for servers here and allow them to make the client leave them

    // Construct the menu selector
    let menupageoptions = new StringSelectMenuBuilder()
        .setCustomId('config_menuselector')
        .setPlaceholder('Choose Menu Section')
    
    let menupageoptionsarr = []
    Object.keys(configoptions).forEach((k) => {
        if ((k != "Server Settings") && (k != "Bot Settings")) {
            let opt = new StringSelectMenuOptionBuilder()
                .setLabel(k)
                .setValue(`menuopt_${k}`)
            menupageoptionsarr.push(opt)
        }
    })

    // If the user is a moderator on that server, allow configuration of that server
    // Note, they must have global manage messages permission.
    if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        let opt = new StringSelectMenuOptionBuilder()
            .setLabel("Server Settings")
            .setValue(`menuopt_Server Settings`)
        menupageoptionsarr.push(opt)
    }

    // If the user is the owner of the bot
    // The application should already be retrieved during the index.js initialization. 
    if (interaction.user.id == interaction.client.application.owner.id) {
        let opt = new StringSelectMenuOptionBuilder()
            .setLabel("Bot Settings")
            .setValue(`menuopt_Bot Settings`)
        menupageoptionsarr.push(opt)
    }

    // Add all of the available options we have for the menu selection
    menupageoptions.addOptions(...menupageoptionsarr);

    pagecomponents.push(new ActionRowBuilder()
        .addComponents(menupageoptions)
    )

    return {
        components: pagecomponents,
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
    }
}

function setOption(userID, option, choice) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.users == undefined) { process.configs.users = {} } 
    if (process.configs.users[userID] == undefined) { process.configs.users[userID] = {} } 
    process.configs.users[userID][option] = choice;
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/configs.txt`, JSON.stringify(process.configs));
}

function getOption(userID, option) {
    if (process.configs == undefined) { process.configs = {} } 
    if (process.configs.users == undefined) { process.configs.users = {} } 
    if (process.configs.users[userID] == undefined) { 
        process.configs.users[userID] = {} 
        initializeOptions(userID)
    } 
    if (process.configs.users[userID][option] == undefined) {
        let arousaloptionpages = Object.keys(configoptions["Arousal"])
        let generaloptionpages = Object.keys(configoptions["General"])
        arousaloptionpages.forEach((k) => {
            if (k == option) { process.configs.users[userID][k] = configoptions["Arousal"][k].default }
        })
        generaloptionpages.forEach((k) => {
            if (k == option) { process.configs.users[userID][k] = configoptions["General"][k].default }
        })
        fs.writeFileSync(`${process.GagbotSavedFileDirectory}/configs.txt`, JSON.stringify(process.configs));
    }
    return process.configs.users[userID][option];
}

function initializeOptions(userID) {
    let arousaloptionpages = Object.keys(configoptions["Arousal"])
    let generaloptionpages = Object.keys(configoptions["General"])
    arousaloptionpages.forEach((k) => {
        process.configs.users[userID][k] = configoptions["Arousal"][k].default
    })
    generaloptionpages.forEach((k) => {
        process.configs.users[userID][k] = configoptions["General"][k].default
    })
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/configs.txt`, JSON.stringify(process.configs));
}

// Returns a blocking function which can be awaited
// Will immediately resolve if the user allows everyone to remove bondage
// else, will prompt them. Will resolve false if rejected. 
function checkBondageRemoval(userID, targetID, type) {
    let useroption = getOption(targetID, "removebondage");
    
    console.log(useroption);
    console.log(userID == targetID)
    console.log((useroption == "all_binder_and_keyholder") && ((getCollarKeyholder(targetID) == userID) || (getChastityKeyholder(targetID) == userID)))


    // Return true immediately if it's accepted without question
    if (useroption == "accept") { return true }
    
    // Return true immediately if the targetID and userID are the same
    // The user probably wants to remove their own stuff! 
    if (userID == targetID) { return true }

    // If keyholder and keyholders allowed, return true 
    if ((useroption == "all_binder_and_keyholder") && ((getCollarKeyholder(targetID) == userID) || (getChastityKeyholder(targetID) == userID))) {
        return true;
    }

    // if binder or KH, return true if target ID is origbinder
    if ((useroption == "all_binder") || (useroption == "all_binder_and_keyholder")) {
        let restraintobject;
        if (type == "heavy") { restraintobject = getHeavyBinder(targetID) } 
        if (type == "gag") { restraintobject = getGagBinder(targetID) } 
        if (type == "mitten") { restraintobject = getMittenBinder(targetID) } 
        if (type == "corset") { restraintobject = getCorsetBinder(targetID) } 
        if (type == "headwear") { restraintobject = getHeadwearBinder(targetID) } 
        // if (type == "vibe") { restraintobject = getVibe(targetID) } 

        if (restraintobject) {
            if (restraintobject == userID) { return true }
        }
    }

    return false
}

async function handleBondageRemoval(user, target, type, change = false) {
    return new Promise(async (res,rej) => {
        let buttons = [
            new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)
        ]
        let dmchannel = await target.createDM();
        await dmchannel.send({
            content: `${user} would like to ${change ? "change" : "remove"} your ${type}. Do you want to allow this action?`,
            components: [new ActionRowBuilder().addComponents(...buttons)]
        }).then((mess) => {
            // Create a collector for up to 30 seconds
            const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30_000, max: 1 })

            collector.on('collect', async (i) => {
                console.log(i)
                if (i.customId == "acceptButton") {
                    await mess.delete().then(() => {
                        i.reply(`Confirmed - ${user} is permitted to ${change ? `change your ${type}` : `take your ${type} off`}!`)
                    })
                    res(true);
                }
                else {
                    await mess.delete().then(() => {
                        i.reply(`Rejected - ${user} is blocked from ${change ? `changing your ${type}` : `taking your ${type} off`}!`)
                    })
                    rej(true);
                }
            })

            collector.on('end', async (collected) => {
                // timed out
                if (collected.length == 0) {
                    await mess.delete().then(() => {
                        i.reply(`Timed out - ${user} is blocked from ${change ? `changing your ${type}` : `taking your ${type} off`}!`)
                    })
                    rej(true);
                }
            })
        })
    })/*.then(
        (res) => {
            console.log("We got ALLOWED")
            return true
    }, 
        (rej) => {
            console.log("We got REJECTED")
            return false
    })*/
}

exports.generateConfigModal = generateConfigModal;
exports.configoptions = configoptions;
exports.getOption = getOption;
exports.setOption = setOption;

exports.handleBondageRemoval = handleBondageRemoval;
exports.checkBondageRemoval = checkBondageRemoval;