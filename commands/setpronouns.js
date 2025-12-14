const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getPronouns, setPronouns, pronounsMap } = require('./../functions/pronounfunctions.js')


// Build the choice array
const pronounTypes = []

for(const x of pronounsMap.keys()){
	pronounTypes.push({
		name : x,
		value : x,
	})
}

console.log(...pronounTypes)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pronouns')
		.setDescription(`Set your pronouns, displayed in bot messages`)
		.addStringOption(opt =>
			opt.setName('pronouns')
			.setDescription('Your pronouns')
            .addChoices(...pronounTypes)
			.setRequired(true)
		),
    async execute(interaction) {
		console.log("It got called")
		setPronouns(interaction.user, interaction.options.getUser('pronouns'))
		interaction.reply({ content: `Your pronouns have been set to ${interaction.options.getUser('pronouns')}`, flags: MessageFlags.Ephemeral })
    }
}