const { WebhookClient } = require('discord.js');

const messageSend = async (str, avatarURL, username) => {
    // When called, we want to do something with str and then send it.
    const webhookClient = new WebhookClient({ 
        id: process.env.WEBHOOKID, 
        token: process.env.WEBHOOKTOKEN 
    })

    webhookClient.send({
        content: str,
        username: username,
        avatarURL: avatarURL
    }).then(() => {
        return true
    })
}

const messageSendDev = async (str, avatarURL, username) => {
    // When called, we want to do something with str and then send it.
    const webhookClient = new WebhookClient({ 
        id: process.env.WEBHOOKIDDEV, 
        token: process.env.WEBHOOKTOKENDEV 
    })

    webhookClient.send({
        content: str,
        username: username,
        avatarURL: avatarURL
    }).then(() => {
        return true
    })
}

exports.messageSend = messageSend;
exports.messageSendDev = messageSendDev;