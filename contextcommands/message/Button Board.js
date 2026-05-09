const { ContextMenuCommandBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require('discord.js');
const { getTextGeneric } = require('../../functions/textfunctions');



module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Button Board')
        .setType(ApplicationCommandType.Message), // This command will appear when right-clicking a message
    async execute(interaction) {
        try {
            let buttons = [
                [ "💢", "❔", "❕", "💕", "✅"],
                [ "🍔", "🔑", "🔒", "🔗", "🥽"],
                [ "👀", "🥺", "💤", "💼", "☕︎" ]
            ]
            let buttonmap = buttons.map((ba) => {
                return ba.map((bb) => {
                    return new ButtonBuilder()
                        .setCustomId(`buttonboard_${bb}`)
                        .setLabel(bb)
                        .setStyle(ButtonStyle.Secondary)
                })
            })
            let buttoncomponents = [];
            for (let i = 0; i < buttonmap.length; i++) {
                buttoncomponents[i] = new ActionRowBuilder().addComponents(...buttonmap[i])
            }
            interaction.reply({ components: buttoncomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
        } catch (err) {
            console.log(err);
        }
    },
    async buttonboard(interaction) {
        interaction.deferUpdate();
        // interaction.message.reference points to the message we evoked the board from!
        let buttonemoji = interaction.customId.split("_")[1]
        let data_in = {
            interactionuser: interaction.user,
            targetuser: interaction.user,
            c1: buttonemoji
        }

        let channelwithmessage = interaction.client.channels.cache.get(interaction.channelId);
        channelwithmessage.messages.fetch(interaction.message.reference.messageId).then((msg) => {
            msg.reply(getTextGeneric(`buttonboard`, data_in))
        })
    }
}