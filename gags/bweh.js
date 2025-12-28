const garbleText = (text, intensity) => {
    let sentenceregex = /[^.?!]*(?<=[.?\\s!])(?=[\\s.?!])[^.?!]*[.?!]/g // Find all sentences!
    // Honestly, I may just need to have Doll check this, I'm not confident in the results...
    let allsentences = text.match(sentenceregex);
    if (allsentences == null) {
        allsentences = [text]; // Regex couldnt match a sentence, just assume the entire part is a bweh.
    }

    let outtext = ''
    for (let t = 0; t < allsentences.length; t++) {
        if (allsentences[t].charAt(0) == " ") {
            outtext = `${outtext} ` // Add initial space between sentences of bweh!~
            allsentences[t] = allsentences[t].slice(1)
        }
        for (let i = 0; i < allsentences[t].length; i++) {
            // If the character is punctuation, use that instead. 
            if ((/[.?!]/).test(allsentences[t].charAt[i])) {
                outtext = `${outtext}${allsentences[t].charAt[i]}`
            }

            // Else, using tightness, lets determine whether to garble!
            // 60-100% chance to garble a letter
            if (Math.random() < ((intensity * 0.04)) + 0.6) {
                let chartoreplacewith = "e"
                if (i == 0) { chartoreplacewith = "b" }
                if (i == 1) { chartoreplacewith = "w" }
                if (i == (allsentences[t].length - 1)) { 
                    chartoreplacewith = "h" 
                } // should be last char in a sentence!
                if (allsentences[t].charAt([i]) === allsentences[t].charAt([i]).toUpperCase()) {
                    chartoreplacewith = chartoreplacewith.toUpperCase();
                }
                outtext = `${outtext}${chartoreplacewith}`
            }

            /*if (!(/[hH.?!]/).test(allsentences[t].charAt[i])) {
                outtext = `${outtext.slice(0, -1)}h` // Just in case the match did not make an h or punctuation!
            }*/
        }
        // 10-40% chance to add a ~ at the end of the sentence!
        if (Math.random() < ((intensity * 0.03)) + 0.1) {
            outtext = `${outtext}~`
        }
    }
    return outtext
}

exports.garbleText = garbleText;
exports.choicename = "Bweh Gag"