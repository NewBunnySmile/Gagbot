const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten, deleteMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmitten')
		.setDescription(`Take someone else's mittens off`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to free from their mittens')
		),
    async execute(interaction) {
		let mitteneduser = interaction.options.getUser('user')
		if (getHeavy(interaction.user.id)) {
			if (interaction.options.getUser('user') == interaction.user) {
            	interaction.reply(`${interaction.user} wriggles ${getPronouns(interaction.user.id, "possessiveDeterminer")} hands in ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, but can't get good leverage to take ${getPronouns(interaction.user.id, "possessiveDeterminer")} mittens off!`)
			}
			else {
				interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} nose because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, but can't help ${interaction.options.getUser('user')} out of ${getPronouns(interaction.user.id, "possessiveDeterminer")} mittens!`)
			}
        }
        else if (interaction.options.getUser('user') == interaction.user) {
            interaction.reply(`${interaction.user} tries to take ${getPronouns(interaction.user.id, "possessiveDeterminer")} mittens off, but can't get a good grip on the straps!`)
        }
		else if (getMitten(mitteneduser)) {
            deleteMitten(mitteneduser)
            interaction.reply(`${interaction.user} takes off ${interaction.options.getUser('user')}'s mittens so ${getPronouns(interaction.user.id, "subject")} can take off ${getPronouns(interaction.user.id, "possessiveDeterminer")} gag!`)
        }
		else {
			interaction.reply({ content: `${interaction.options.getUser('user')} is not wearing mittens!`, flags: MessageFlags.Ephemeral })
        }
    }
}