const { SlashCommandBuilder } = require("discord.js");
const { default: didYouMean, ReturnTypeEnums, ThresholdTypeEnums } = require("didyoumean2");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("toy")
		.setDescription("Add a vibrator/toy, causing stuttered speech and other effects")
		.addUserOption((opt) => opt.setName("user").setDescription("Who to add a fun toy to"))
		.addStringOption((opt) =>
			opt.setName("type")
			.setDescription("What kind of toy to add")
            .setAutocomplete(true)
		)
		.addNumberOption((opt) => opt.setName("intensity").setDescription("How intensely to run the toy").setMinValue(1).setMaxValue(20)),
	async autoComplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        let autocompletes = process.autocompletes.toys;
        console.log(autocompletes)
        let matches = didYouMean(focusedValue, autocompletes, {
            matchPath: ['name'], 
            returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
            threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
        })
        console.log(matches.slice(0,25))
        if (matches.length == 0) {
            matches = autocompletes;
        }
        interaction.respond(matches.slice(0,25))
    },
    async execute(interaction) {

    }
}