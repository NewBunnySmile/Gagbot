const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { mittentypes, getMittenName, getGag, convertGagText, assignMitten, getMitten } = require('./../functions/gagfunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getText } = require("./../functions/textfunctions.js");
const { getHeadwear } = require('../functions/headwearfunctions.js');
const { getCorset } = require('../functions/corsetfunctions.js');
const { getChastity, getChastityName } = require('../functions/vibefunctions.js');
const { getCollar, getCollarName } = require('../functions/collarfunctions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Struggle with one of your restraints...')
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('Which restraint to struggle with?')
            .setAutocomplete(true)
		),
    async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
		try {
            let heavybondage = getHeavy(interaction.user.id);
            let gagbondage = getGag(interaction.user.id);
            let mittenbondage = getMitten(interaction.user.id);
            let chastitybondage = getChastity(interaction.user.id);
            let headbondage = getHeadwear(interaction.user.id);
            let corsetbondage = getCorset(interaction.user.id);
            let collarbondage = getCollar(interaction.user.id);

            let outopts = [];
            if (heavybondage) { outopts.push({ name: `Heavy Bondage: ${getHeavy(interaction.user.id).type}`, value: "heavy" }) } 
            if (gagbondage) { outopts.push({ name: `Gag: ${convertGagText(getGag(interaction.user.id).gagtype)}`, value: "gag" }) } 
            if (mittenbondage) { outopts.push({ name: `Mittens${(mittenbondage.mittenname ? `: ${getMittenName(interaction.user.id)}` : "")}`, value: "mitten" }) } 
            if (chastitybondage) { outopts.push({ name: `Chastity${(chastitybondage.chastitytype ? `: ${getChastityName(interaction.user.id)}` : "")}`, value: "chastity" }) } 
            if (headbondage) { outopts.push({ name: `Head Restraints`, value: "head" }) } 
            if (corsetbondage) { outopts.push({ name: `Corset`, value: "corset" }) } 
            if (collarbondage) { outopts.push({ name: `Collar${(collarbondage.collartype ? `: ${getCollarName(interaction.user.id)}` : "")}`, value: "collar" }) }
                                                                                                        
            if (outopts.length == 0) { outopts = [{ name: "Nothing", value: "nothing" }]}
            await interaction.respond(outopts)
        }
        catch (err) {
            console.log(err);
        }
	},
    async execute(interaction) {
        try {
            if (interaction.user.id !== interaction.client?.application?.owner?.id) {
                await interaction.reply(`You're not ${interaction.client?.application?.owner?.displayName}. Go away.`)
                return
            }

            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            let heavybondage = getHeavy(interaction.user.id)?.type;
            let gagbondage = getGag(interaction.user.id);
            let mittenbondage = getMitten(interaction.user.id);
            let chastitybondage = getChastity(interaction.user.id);
            let headbondage = getHeadwear(interaction.user.id);
            let corsetbondage = getCorset(interaction.user.id);
            let collarbondage = getCollar(interaction.user.id);

            // Build data tree:
            let data = {
                textarray: "texts_struggles",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: interaction.user, // Doesn't really matter but we're adding to avoid a crash
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                    c2: getGag(interaction.user.id),
                    c3: getMittenName(interaction.user.id),
                    c4: getChastityName(interaction.user.id),
                    c5: getCollarName(interaction.user.id)
                }
            }

            let chosenopt = interaction.options.getString('type')

            if (!chosenopt) {
                // Something went CRITICALLY wrong. Eject, eject!
                interaction.reply({ content: `Something went wrong with your input. Please let Enraa know with the exact thing you put in the Type field!`, flags: MessageFlags.Ephemeral })
                return;
            }

            // This way of doing it is gonna be fucky.
            // From the top. Lets do an if/else for what kind we chose
            // heavy, gag, mitten, chastity, head, corset, collar
            if (chosenopt == "heavy") {
                data.heavy = true;
                // Heavy Bondage is... pretty uniquely only influenced by itself. 
                // It will also only ever have named bondage.
                interaction.reply(getText(data))
            }
            else if (chosenopt == "gag") {
                data.gag = true;
                // Gags are influenced by heavy bondage or mittens. 
                if (heavybondage) {
                    // Heavy Bondage is disabling.
                    data.heavy = true;
                    interaction.reply(getText(data))
                }
                else {
                    data.noheavy = true;
                    if (mittenbondage) {
                        data.mitten = true;
                        interaction.reply(getText(data))
                    }
                    else {
                        data.nomitten = true;
                        interaction.reply(getText(data))
                    }
                }
            }
            else if (chosenopt == "mitten") {
                data.mitten = true;
            }
            else if (chosenopt == "chastity") {

            }
            else if (chosenopt == "head") {

            }
            else if (chosenopt == "corset") {

            }
            else if (chosenopt == "collar") {

            }
            
            if (getHeavy(interaction.user.id)) {
                data.heavy = true
                interaction.reply(getText(data))
            }
            else if (getMitten(interaction.user.id)) {
                data.mitten = true
                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
            }
            else {
                // Not mittened
                data.nomitten = true
                if (chosenmittens) {
                    // Chose to wear named mittens
                    data.namedmitten = true
                    if (getGag(interaction.user.id)) {
                        // Wearing a gag already. 
                        data.gag = true
                        interaction.reply(getText(data))
                        assignMitten(interaction.user.id, chosenmittens);
                    }
                    else {
                        // Not wearing a gag
                        data.nogag = true
                        interaction.reply(getText(data))
                        assignMitten(interaction.user.id, chosenmittens);
                    }
                }
                else {
                    // Chose to wear regular mittens
                    data.nonamedmitten = true
                    if (getGag(interaction.user.id)) {
                        // Wearing a gag already. 
                        data.gag = true
                        interaction.reply(getText(data))
                        assignMitten(interaction.user.id, chosenmittens);
                    }
                    else {
                        // Not wearing a gag
                        data.nogag = true
                        interaction.reply(getText(data))
                        assignMitten(interaction.user.id, chosenmittens);
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}