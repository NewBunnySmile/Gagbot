const { setUserVar, getUserVar } = require("../../functions/usercontext");

function msgfunction(userid, data) {
    const honorifictitles = [
        // Oh god its hard to type these without caps
        "miss",
        "master",
        "masters",
        "sir",
        "sirs",
        "ma\'am",
        "maam",
        "lady",
        "ladies",
        "lord",
        "lords",
        "queen",
        "queens",
        "king",
        "kings",
        "mistress",
        "mistresses",
        "goddess",
        "goddesses",
        "maitresse",
        "administrator",
        "administrators",
        "mommy",
        "mommies",
        "daddy",
        "daddies",
        "mxtress",
        "overseer",
        "headmaid",
        "head\ maid",
        "mx",
        "duke",
        "dukes",
        "dame",
        "count",
        "overlord",
        "(\\w|\\d)+-sama",
        "(\\w|\\d)+-sensei",
        "(\\w|\\d)+-san",
        "(\\w|\\d)+-senpai",
    ];

    let honorificsmap = honorifictitles.join("|");
	let regexpattern = new RegExp(`\\b(${honorificsmap})\\b`, "i");

    if (regexpattern.test(data.msgcontent)) {
		// They were polite, make them horny for 3 minutes.
        // This will be scaled HIGHLY over on the vibe side.
        setUserVar(userid, "politeSubVibeTime", Date.now() + 180000)
        setTimeout(() => {
            // Clear the variable after 3 minutes if it has NOT been triggered again. 
            if (getUserVar(userid, "politeSubVibeTime") < Date.now()) {
                setUserVar(userid, "politeSubVibeTime", undefined)
            }
        }, 181000)
		return;
	}
}

exports.msgfunction = msgfunction;