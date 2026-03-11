const { getOption } = require("../functions/configfunctions");
const { getPronouns } = require("../functions/pronounfunctions");

const selfreplacements = [
    { regex: "i am", replace: `this SUBJECT is`}, // "I am"
    { regex: "i have", replace: `this SUBJECT has`}, // "I am"
    { regex: "i", replace: `this SUBJECT`}, // "I"
    { regex: "i'd", replace: `this SUBJECT'd`}, // "I'd"
    { regex: "i'?ve", replace: `this SUBJECT has`}, // "I've"
    { regex: "i'?ll", replace: `this SUBJECT'll`}, // "I've"
    { regex: "i'?m", replace: `this SUBJECT is`}, // "I'm"
    { regex: "my", replace: `this SUBJECT's`}, // "my"
    { regex: "me", replace: `this SUBJECT`}, // "me"
    { regex: "myself", replace: `this SUBJECT's self`}, // "myself"
    { regex: "gimmie", replace: `give this SUBJECT`}, // "me"
];

const garbleText = (text, parent, intensity, msg) => {
    let outtext = text;

    let replacementstring = "toy";
    if (getPronouns(msg.author.id, "subject") == "he") { replacementstring = "boy" }
    if (getPronouns(msg.author.id, "subject") == "she") { replacementstring = "girl" }
    if (getOption(msg.author.id, "deferentialgagsubject").length > 0) { replacementstring = getOption(msg.author.id, "deferentialgagsubject") }

    selfreplacements.forEach((r) => {
        let regexpattern = new RegExp(`\\b(${r.regex})\\b`, "ig");
        // I did not know replaceAll could take a function. 
        outtext = outtext.replaceAll(regexpattern, (match) => {
            let rep = r.replace.replace('SUBJECT', replacementstring);
            if (match[0] == match[0].toUpperCase()) {
                rep = `${rep.charAt(0).toUpperCase()}${rep.slice(1)}`
            }
            return rep;
        });
    })

    return outtext;
};

exports.garbleText = garbleText;
exports.choicename = "Deferential Gag";
