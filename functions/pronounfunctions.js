const fs = require('fs');
const path = require('path');
const https = require('https');


// Pronoun types
const pronounsMap = new Map([
    ["she/her",{
        subject                 : "she",
        object                  : "her",
        possessive              : "hers",
        possessiveDeterminer    : "her",
        reflexive               : "herself",
    }],
    ["he/him",{
        subject                 : "he",
        object                  : "him",
        possessive              : "his",
        possessiveDeterminer    : "his",
        reflexive               : "himself",
    }],
    ["they/them",{
        subject                 : "they",
        object                  : "them",
        possessive              : "theirs",
        possessiveDeterminer    : "their",
        reflexive               : "themself",
    }],
    ["it/its",{
        subject                 : "it",
        object                  : "it",
        possessive              : "its",
        possessiveDeterminer    : "its",
        reflexive               : "itself",
    }]
])


//console.log(...pronounsMap.keys())


/***************************************************************
 * process.pronouns File Structure
 * 
 * JSON Object of JSON Objects with the following format:
 * 
 *  process.pronouns = {
 *      125093095405518850 : {
 *          subject: "she",
 *          object: "her",
 *          possessive: "hers",
 *          possessiveDeterminer: "her",
 *          reflexive: "herself"
 *      }
 *  }
 ***************************************************************/




/********************************************
 * getPronoun()
 * Get a user's pronoun of the necessary form.
 * 
 * If no form specified, give the object containing all.  Useful to reduce calls?
 *  > To create "she/her", you need subject/object
 *******************************************/
const getPronouns = (user, form) => {
    if (process.pronouns == undefined) { process.pronouns = {} }
    return form ? process.pronouns[user].form : process.pronouns[user]
}

const setPronouns = (user, pronouns) => {

    console.log("IT GOT CALLED")

    if (process.pronouns == undefined) { process.pronouns = {} }

    process[user] = pronounsMap.get(pronouns);

    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/pronounsusers.txt`, JSON.stringify(process.pronouns));
}


exports.setPronouns = setPronouns
exports.getPronouns = getPronouns
exports.pronounsMap = pronounsMap