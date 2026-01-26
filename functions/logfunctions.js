// Will print a message to console assuming args severity
// is at least number. I think. It sounds cool anyway.
// To use this effectively, do a node ___.js --log-level 1
// 1: Informational (low level)
// 2: Informational 
// 4: Warning
// 7: Error
//
// This will probably take a bit to adapt existing logs lol
function logConsole(message, severity = 0) {
    const args = process.argv.slice(2);
    let loglevel = args.indexOf("--log-level") + 1
    if ((loglevel > 0) && (severity >= loglevel)) {
        console.log(message)
    } 
}

exports.logConsole = logConsole