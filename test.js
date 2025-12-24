const { getText } = require("./functions/textfunctions.js");

let object = {
    textarray: "texts_chastity",
    textdata: { 
        interactionuser: { id: "125093095405518850" },
        targetuser: { id: "185614860942442496" }
    },
    noheavy: true,
    chastity: true,
    key_self: true
}

console.log(getText(object))