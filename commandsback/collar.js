const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getCollar, assignCollar } = require('./../functions/collarfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('collar')
		.setDescription(`Put a collar on, allowing others to /chastity, /heavy and /mitten you`)
		.addUserOption(opt =>
			opt.setName('keyholder')
			.setDescription('Who can do anything to you (leave blank for anyone)')
		),
    async execute(interaction) {
		let collarkeyholder = interaction.options.getUser('keyholder')
		if (getHeavy(interaction.user.id)) {
			if (getCollar(interaction.user.id)) {
            	interaction.reply(`${interaction.user} crinks ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck, trying to adjust ${getPronouns(interaction.user.id, "possessiveDeterminer")} collar, but ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type} makes it impossible to adjust!`)
			}
			else {
				interaction.reply(`${interaction.user} shifts ${getPronouns(interaction.user.id, "possessiveDeterminer")} cheek on a collar, yearning to put it on, but ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type} makes it incredibly difficult to put on!`)
			}
        }
		else if (getCollar(interaction.user.id)) {
            interaction.reply({ content: `You already have a collar on!`, flags: MessageFlags.Ephemeral })
        }
		else {
            if (collarkeyholder) {
                if (collarkeyholder != interaction.user) {
                    interaction.reply(`${interaction.user} puts a collar on ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck, clicking a little lock in the lockable buckle and then hands ${collarkeyholder} the key!`)
                    assignCollar(interaction.user.id, collarkeyholder.id, true);
                }
                else {
                    interaction.reply(`${interaction.user} puts a collar on ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck, clicking a little lock in the lockable buckle and then hiding the key!`)
                    assignCollar(interaction.user.id, collarkeyholder.id, true);
                }
            }
            else {
                interaction.reply(`${interaction.user} puts a collar on ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck, but neglects to lock it!`)
                assignCollar(interaction.user.id, interaction.user.id, false);
            }
        }
    }
}