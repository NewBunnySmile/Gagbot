const fs = require("fs");

const MAX_BREATH_TABLE = [2000, 620, 500, 410, 330, 280, 240, 195, 160, 130, 105, 70, 40, 20, 10];

const BREATH_RECOVERY_EXPONENT = 1.1;
const BREATH_RECOVERY_COEFFICIENT = 0.01;

const gaspSounds = ["*hff*", "*hnnf*", "*ahff*", "*hhh*", "*nnn*", "*hnn*"];
const silenceReplacers = [" ", ".", ",", ""];

const assignCorset = (user, tightness = 5) => {
  if (process.corset == undefined) process.corset = {};
  const currentBreath = getBreath(user);
  const maxBreath = calcMaxBreath(tightness);
  const breathRecovery = calcBreathRecovery(maxBreath);
  process.corset[user] = {
    tightness: tightness,
    maxBreath: maxBreath,
    breathRecovery: breathRecovery,
    breath: currentBreath ? (currentBreath > maxBreath ? maxBreath : currentBreath) : maxBreath,
    timestamp: Date.now(),
  };
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
};

const getCorset = (user) => {
  if (process.corset == undefined) process.corset = {};
  return process.corset[user];
};

const removeCorset = (user) => {
  if (process.corset == undefined) process.corset = {};
  delete process.corset[user];
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
};

// Consumes breath and returns possibly modified text
function corsetLimitWords(user, text) {
  // Bad bottom for shouting! Corsets should make you SILENT. Double all breath used.
  let globalMultiplier = text.match(/^\s*#+\s/) ? 2 : 1;
  const corset = calcBreath(user);
  // Tightlaced bottoms must only whisper
  if (corset.tightness >= 7 && !text.match(/^\s*-#\s/)) globalMultiplier *= 2;
  let silence = false;
  let wordsinmessage = text.split(" ");
  let newwordsinmessage = [];
  for (const i in wordsinmessage) {
    if (!corset.maxBreath) break;

    let word = wordsinmessage[i];
    if (word.length == 0) {
      if (!silence) newwordsinmessage.push(word);
    } else {
      corset.breath -= (word.length > 3 ? word.length : 3) * globalMultiplier;
      for (const char of word) {
        // Capitals cost more breath
        if (char > 64 && char < 91) corset.breath -= globalMultiplier;
        // I said SILENCE bottom
        if (char == "!") corset.breath -= 5 * globalMultiplier;
      }

      if (corset.breath < -corset.maxBreath && newwordsinmessage.length > 5 - Math.ceil(corset.tightness / 2)) silence = true;

      // add gasping sounds once at half of max breath
      if (!silence && corset.breath < corset.maxBreath / 2 && Math.random() > (corset.breath + corset.maxBreath) / (corset.tightness * corset.maxBreath * 0.2)) {
        newwordsinmessage.push(gaspSounds[Math.floor(Math.random() * gaspSounds.length)]);
      }

      // SILENCE BOTTOM
      if (!silence && corset.tightness >= 5) word = word.replace(/\!+/, "");

      // remove letters if out of breath
      if (!silence && corset.breath < 0) {
        const toRemove = Math.floor((Math.random() * word.length * -corset.breath) / corset.maxBreath);
        if (toRemove >= word.length) {
          // shortcut if all silence
          let newWord = "";
          for (let i = 0; i < word.length; i++) newWord += silenceReplacers[Math.floor((1 - Math.random() * Math.random()) * silenceReplacers.length)];
          word = newWord;
        } else {
          // inneffient for long words but shouldnt be a problem
          const removeIdxs = [];
          while (removeIdxs.length < toRemove) {
            const idx = Math.floor(Math.random() * word.length);
            if (!removeIdxs.includes(idx)) removeIdxs.push(idx);
          }

          let newWord = "";
          for (const idx in word) {
            if (removeIdxs.includes(idx)) newWord += silenceReplacers[Math.floor(Math.random() * silenceReplacers.length)];
            else newWord += word[idx];
          }
          word = newWord;
        }
      }

      if (!silence) newwordsinmessage.push(word);
    }
  }
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
  if (newwordsinmessage.length == 0) return "";
  let outtext = newwordsinmessage.join(" ");
  // Replace other instances of small speak so we only have one.
  if (getCorset(user).tightness >= 7)
    return outtext
      .split("\n")
      .map((line) => (line.length > 0 ? `-# ${line.replace("-#", "")}` : ""))
      .join("\n");
  return outtext;
}

function calcMaxBreath(tightness) {
  if ((tightness | 0) >= MAX_BREATH_TABLE.length) return 0;
  return MAX_BREATH_TABLE[tightness | 0];
}

function calcBreathRecovery(maxBreath) {
  return BREATH_RECOVERY_COEFFICIENT * Math.pow(maxBreath, BREATH_RECOVERY_EXPONENT);
}

// calculates current breath and returns corset. Does not save to file.
function calcBreath(user) {
  if (process.corset == undefined) process.corset = {};
  const corset = process.corset[user];
  if (!corset) return null;
  const now = Date.now();
  const newBreath = corset.breath + corset.breathRecovery * ((now - corset.timestamp) / 1000);
  if (newBreath > corset.maxBreath) corset.breath = corset.maxBreath;
  else corset.breath = newBreath;
  corset.timestamp = now;
  return corset;
}

function getBreath(user) {
  const corset = calcBreath(user);
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
  return corset.breath;
}

// consumes specified breath and returns true if user had enough
function tryExpendBreath(user, exertion) {
  const corset = calcBreath(user);
  corset.breath -= exertion;
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
  return corset.breath > 0;
}

exports.assignCorset = assignCorset;
exports.getCorset = getCorset;
exports.removeCorset = removeCorset;
exports.corsetLimitWords = corsetLimitWords;

exports.getBreath = getBreath;
exports.tryExpendBreath = tryExpendBreath;
