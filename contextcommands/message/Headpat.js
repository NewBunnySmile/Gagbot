const { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags } = require('discord.js');
const { getAllSelectedOption } = require('../../functions/configfunctions');
const { handleConsent, getConsent } = require('../../functions/interactivefunctions');
const { handleTouchEvent, rollPatChance } = require('../../functions/touchfunctions');
const { getPronouns } = require('../../functions/pronounfunctions');
const { getText } = require('../../functions/textfunctions');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Headpat')
        .setType(ApplicationCommandType.Message), // This command will appear when right-clicking a message
    async execute(interaction) {
        try {
            let channel = await interaction.client.channels.fetch(interaction.channelId)
            if (channel) {
                let message = await channel.messages.fetch(interaction.targetId)
                let targetuser;
                if (message) {
                    if (message.webhookId == null) {
                        targetuser = await message.guild.members.fetch(message.author.id)
                    }
                    else {
                        let founduserid;
                        // Check for engraved pet tag
                        let engravedpettags = getAllSelectedOption("engravedcollarname")
                        Object.keys(engravedpettags).forEach((k) => {
                            // If the visor matches, then we found our pet!
                            if (message.author.username.startsWith(engravedpettags[k]) && (engravedpettags[k].length > 0)) {
                                console.log(`Matched ${k}`);
                                founduserid = k
                            }
                        })
                        let dollvisorids = getAllSelectedOption("dollvisorname")
                        Object.keys(dollvisorids).forEach((k) => {
                            // If the visor matches, then we found our doll!
                            if (message.author.username.startsWith(dollvisorids[k])) {
                                founduserid = k
                            }
                        })
                        // They're probably not visored, so lets search and see if we can find
                        // them in the guild list. 
                        if (!founduserid) {
                            let membername = await message.guild.members.search({ query: message.author.username, limit: 1 });
                            if (membername && membername.first()) {
                                founduserid = membername.first().user.id
                            }
                        }
                        if (founduserid) {
                            targetuser = await message.guild.members.fetch(founduserid)
                        }
                    }
                    if (targetuser) {
                        console.log(targetuser)
                        // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
                        if (!getConsent(targetuser.id)?.mainconsent) {
                            await handleConsent(interaction, targetuser.id);
                            return;
                        }
                        // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
                        if (!getConsent(interaction.user.id)?.mainconsent) {
                            await handleConsent(interaction, interaction.user.id);
                            return;
                        }
                        // Build data tree:
                        let data = {
                            textarray: "texts_touch",
                            textdata: {
                                interactionuser: interaction.user,
                                targetuser: targetuser,
                                //c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
                                //c2: getMittenName(interaction.user.id, chosenmittens) ?? "Standard Mittens",
                            },
                        };
                        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                        await handleTouchEvent(interaction.user, targetuser, "headpat").then(
                            async (success) => {
                                await interaction.followUp({ content: `Headpatting ${targetuser}`, flags: MessageFlags.Ephemeral })
                                let headpatattempt = rollPatChance(interaction.user.id, targetuser.id)
                                data.headpat = true;

                                if (interaction.user.id == targetuser.id) {
                                    data.self = true;
                                }
                                else {
                                    data.other = true;
                                }

                                if (headpatattempt.hit) {
                                    data.hit = true;
                                }
                                else {
                                    data.nohit = true;
                                }

                                if (headpatattempt.crit) {
                                    if (headpatattempt.doublecrit) {
                                        if (headpatattempt.triplecrit) {
                                            data.triplecrit = true;
                                        }
                                        else {
                                            data.doublecrit = true
                                        }
                                    }
                                    else {
                                        data.crit = true;
                                    }
                                }
                                else {
                                    data.nocrit = true;
                                }

                                if (headpatattempt.boundmiss) {
                                    data[headpatattempt.boundmiss] = true;
                                }
                                else {
                                    data.noboundmiss = true;
                                }

                                interaction.followUp({ content: getText(data) });
                            },
                            async (reject) => {
                                let nomessage = `${targetuser} rejected the headpat.`;
                                if (reject == "Error") {
                                    nomessage = `Something went wrong - Submit a bug report!`;
                                }
                                if (reject == "NoDM") {
                                    nomessage = `Something went wrong sending a DM to ${targetuser}, or ${getPronouns(chastityuser.id, "subject")} ${getPronouns(chastityuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent to touch.`;
                                }
                                await interaction.followUp({ content: nomessage });
                            },
                        )
                    }
                    else {
                        interaction.reply({ content: `Cannot determine user to headpat...`, flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    interaction.reply({ content: `Cannot determine user to headpat...`, flags: MessageFlags.Ephemeral })
                }
            }
            else {
                interaction.reply({ content: `Cannot determine user to headpat...`, flags: MessageFlags.Ephemeral })
            }
        } catch (err) {
            console.log(err);
        }
    },
}