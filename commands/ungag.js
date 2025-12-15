const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getGag, deleteGag, getMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ungag')
        .setDescription('Remove a gag from a user')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('The user to remove gag from (leave blank for yourself)')
            //.setRequired(true)
        ),
    async execute(interaction) {
        let gaggeduser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
        if (getHeavy(interaction.user.id)) {
            if (gaggeduser != interaction.user) {
                if (getGag(gaggeduser)) {
                    interaction.reply(`${interaction.user} bumps into ${gaggeduser}, trying to use ${getPronouns(interaction.user.id, "possessiveDeterminer")} useless arms to help them out of ${getPronouns(interaction.user.id, "possessiveDeterminer")} gag!`)
                }
                else {
                    interaction.reply({ content: `${gaggeduser} is not gagged!`, flags: MessageFlags.Ephemeral })
                }
            }
            else {
                if (getGag(gaggeduser)) {
                    interaction.reply(`${interaction.user} chews on ${getPronouns(interaction.user.id, "possessiveDeterminer")} gag, trying to spit it out because ${getPronouns(interaction.user.id, "subject")} can't use ${getPronouns(interaction.user.id, "possessiveDeterminer")} hands and arms!`)
                }
                else {
                    // User is in some form of heavy bondage and cannot put on a chastity belt
                    interaction.reply({ content: `You're not gagged, but you wouldn't be able to take it off anyway!`, flags: MessageFlags.Ephemeral })
                }
            }
        }
        else if (getGag(gaggeduser)) {
            if (interaction.user == gaggeduser) {
                if (!getMitten(interaction.user)) {
                    interaction.reply(`${interaction.user} has taken ${getPronouns(interaction.user.id, "possessiveDeterminer")} gag out!`)
                    deleteGag(gaggeduser)
                }
                else {
                    interaction.reply(`${interaction.user} attempts to take ${getPronouns(interaction.user.id, "possessiveDeterminer")} gag off, but struggles with the straps in ${getPronouns(interaction.user.id, "possessiveDeterminer")} mittens!`)
                }
            }
            else {
                deleteGag(gaggeduser)
                interaction.reply(`${interaction.user} has freed ${gaggeduser} from ${getPronouns(interaction.user.id, "possessiveDeterminer")} gag!`)
            }
        }
        else {
            interaction.reply({ content: `${gaggeduser} is not gagged!`, flags: MessageFlags.Ephemeral })
        }
    }
}