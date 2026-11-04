const { SlashCommandBuilder, TextDisplayBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");
const { gambaDeathrollStart, gambaRPSStart } = require(`./../functions/gamefunctions.js`);
const { getMitten } = require("../functions/getters/mitten/getMitten.js");
const { getHeavyRestrictions } = require("../functions/getters/heavy/getHeavyRestrictions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("gamba")
		.setDescription("Start a gamba game...")
        .addSubcommand((subc) => 
            subc.setName("deathroll")
                .setDescription("Deathroll someone with reducing numbers")
                /*.addNumberOption((opt) => 
                    opt.setName("startingvalue")
                       .setDescription("Starting Value? (Optional, defaults to 1000)")
                )*/
        )
        .addSubcommand((subc) => 
            subc.setName("rockpaperscissors")
                .setDescription("Rock Paper Scissors!")
                .addStringOption((opt) =>
                    opt.setName("choice")
                       .setDescription("What will you throw out?")
                       .setChoices(
                            { name: "Rock", value: "rock" },
                            { name: "Paper", value: "paper" },
                            { name: "Scissors", value: "scissors" },
                            { name: "Random", value: "random" }
                        )
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        try {
            let subcommand = interaction.options.getSubcommand();
            if (!subcommand) {
                interaction.reply(`Please update your commands!`)
            }
            else if (subcommand == "deathroll") {
                interaction.reply(await gambaDeathrollStart(interaction));
            }
            else if (subcommand == "rockpaperscissors") {
                interaction.reply(await gambaRPSStart(interaction));
                let rep = await interaction.fetchReply()
                if (!process.RPSvars) { process.RPSvars = {}}
                // If they're mittened, they will ALWAYS use Rock! 
                process.RPSvars[rep.id] = (getMitten(interaction.guildId, interaction.user.id)) ? "rock" : interaction.options.getString("choice")
            }
            else if (subcommand == "interact") {
                interaction.reply(`Lock interactions haven't been implemented yet...`)
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}