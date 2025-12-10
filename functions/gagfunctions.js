const fs = require('fs');
const path = require('path');
const { messageSend, messageSendDev } = require(`./../functions/messagefunctions.js`)

const assignGag = (userID, gagtype = "ball") => {
    if (process.gags == undefined) { process.gags = {} }
    process.gags[userID] = gagtype
    fs.writeFileSync(`./gaggedusers.txt`, JSON.stringify(process.gags));
}

const getGag = (userID) => {
    if (process.gags == undefined) { process.gags = {} }
    return process.gags[userID]
}

const deleteGag = (userID) => {
    if (process.gags == undefined) { process.gags = {} }
    delete process.gags[userID]
}

const garbleMessage = async (msg) => {
    try {
        if (process.gags == undefined) { process.gags = {} }
        if (process.gags[`<@${msg.author.id}>`]) {
            // Grab all the command files from the commands directory
            const gagtypes = [];
            const commandsPath = path.join(__dirname, '..', 'gags');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            if (commandFiles.includes(process.gags[`<@${msg.author.id}>`] + ".js")) {
                let gaggarble = require(path.join(commandsPath, `${process.gags[`<@${msg.author.id}>`]}.js`))
                let garbledtext = gaggarble.garbleText(msg.content);
                if (msg.channel.id == process.env.CHANNELIDDEV) {
                    let sentmessage = messageSendDev(garbledtext, msg.member.displayAvatarURL(), msg.member.displayName).then(() => {
                        msg.delete();
                    })
                }
                else {
                    let sentmessage = messageSend(garbledtext, msg.member.displayAvatarURL(), msg.member.displayName).then(() => {
                        msg.delete();
                    })
                }
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

exports.assignGag = assignGag;
exports.getGag = getGag;
exports.deleteGag = deleteGag;
exports.garbleMessage = garbleMessage;