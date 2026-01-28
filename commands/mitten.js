const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { mittentypes, getMittenName, getGag, assignMitten, getMitten, getBaseMitten } = require("./../functions/gagfunctions.js");
const { calculateTimeout } = require("./../functions/timefunctions.js");
const { getHeavy } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mitten")
		.setDescription("Put mittens on yourself, preventing /ungag on yourself and /gag on others")
		.addStringOption((opt) => opt.setName("type").setDescription("What flavor of helpless mittens to wear...").setAutocomplete(true)),
	async autoComplete(interaction) {
		try {
            const focusedValue = interaction.options.getFocused();
            let autocompletes = process.autocompletes.mitten;
            let matches = didYouMean(focusedValue, autocompletes, {
                matchPath: ['name'], 
                returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
            })
            console.log(matches.slice(0,25))
            if (matches.length == 0) {
                matches = autocompletes;
            }
            let tags = getUserTags(interaction.user.id);
            let newsorted = [];
            matches.forEach((f) => {
                let tagged = false;
                let i = getBaseMitten(f)
                tags.forEach((t) => {
                    if (i.tags && (Array.isArray(i.tags)) && i.tags.includes(t)) { tagged = true }
                    else if (i.tags && (i.tags[t])) { tagged = true }
                })
                if (!tagged) {
                    newsorted.push(f);
                }
            })
            interaction.respond(newsorted.slice(0,25))
        }
        catch (err) {
            console.log(err);
        }
	},
	async execute(interaction) {
		try {
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			// List all mittens if set.
			if (interaction.options.getBoolean("list_all_restraints")) {
				let restraints = mittentypes
					.map((h) => {
						return h.name;
					})
					.sort();
				let outtext = "## Full list of Mittens:\n\n";
				for (let i = 0; i < restraints.length; i++) {
					outtext = `${outtext}${restraints[i]}\n`;
				}
				await interaction.reply({ content: `${outtext}`, flags: MessageFlags.Ephemeral });
				return;
			}
			let chosenmittens = interaction.options.getString("type");
			// Build data tree:
			let data = {
				textarray: "texts_mitten",
				textdata: {
					interactionuser: interaction.user,
					targetuser: interaction.user,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getMittenName(interaction.user.id, chosenmittens),
				},
			};

			if (data.textdata.c2 == undefined) {
				// Something went CRITICALLY wrong. Eject, eject!
				interaction.reply({ content: `Something went wrong with your input. Please let Enraa know with the exact thing you put in the Type field!`, flags: MessageFlags.Ephemeral });
				return;
			}

			if (getHeavy(interaction.user.id)) {
				data.heavy = true;
				interaction.reply(getText(data));
			} else if (getMitten(interaction.user.id)) {
				data.mitten = true;
				interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
			} else {
				// Not mittened
				data.nomitten = true;
				if (chosenmittens) {
					// Chose to wear named mittens
					data.namedmitten = true;
					if (getGag(interaction.user.id)) {
						// Wearing a gag already.
						data.gag = true;
						interaction.reply(getText(data));
						assignMitten(interaction.user.id, chosenmittens);
					} else {
						// Not wearing a gag
						data.nogag = true;
						interaction.reply(getText(data));
						assignMitten(interaction.user.id, chosenmittens);
					}
				} else {
					// Chose to wear regular mittens
					data.nonamedmitten = true;
					if (getGag(interaction.user.id)) {
						// Wearing a gag already.
						data.gag = true;
						interaction.reply(getText(data));
						assignMitten(interaction.user.id, chosenmittens);
					} else {
						// Not wearing a gag
						data.nogag = true;
						interaction.reply(getText(data));
						assignMitten(interaction.user.id, chosenmittens);
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
};
