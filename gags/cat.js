const garbleText = (text) => {

    //replace m+vocal for meow and n+vocal for ny if word is 4+ letters long. or nya if end of word
    //+add random nya at end of sentences with 75% chance
    //+add random :3  ◕⩊◕  •⩊•  >⩊<  ^>w<^   at end of sentences with 25% chance

    const words = text.split(" ");

    let garbled = words.map(word => {
        if (word.length > 3) {
            const matches = word.matchAll(/m[aeiouAEIOU]|M[aeiouAEIOU]/g);
            for (const match of matches) {
                word = word.replace(match[0], "meow" + match[0].slice(1));
            }
            const matches2 = word.matchAll(/n[aeiouAEIOU]|N[aeiouAEIOU]/g);
            for (const match of matches2) {
                word = word.replace(match[0], "ny" + match[0].slice(1));
            }
            if (word.endsWith("ny-")) {
                word = word.slice(0, -3) + "nya";
            }

            let matches3 = word.matchAll(/[.,;?!]+/g);
            matches3 = Array.from(matches3);
            matches3 = matches3.concat(word.matchAll(/[\n\r]+/g) || []);
            for (const match of matches3) {
                if (Math.random() > 0.75) {
                    word = word.replace(match[0], match[0] + [" :3", "  ◕⩊◕", "  •⩊•", "  >⩊<", "  ^>w<^"][Math.floor(Math.random() * 5)]);
                }
                if (Math.random() > 0.25) {
                    word = word.replace(match[0], match[0] + [" nya", " nya", " nya~"][Math.floor(Math.random() * 3)]);
                }
            }

            return word;
        } else {
            return word;
        }
    });

    return garbled.join(" ");
}

exports.garbleText = garbleText;
exports.choicename = "Cat Gag";
