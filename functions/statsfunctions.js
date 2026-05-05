



/**********
 * Adds a point to a counter by name in user's stats. Specify amount for custom amount.
 * 
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 * - (number) amount - Amount to increment the counter by. Default to 1
 **********/
function statsAddCounter(user, countername, amount = 1) {
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }
    let newcount = (process.userstats[user][countername] ?? 0) + amount;
    process.userstats[user][countername] = newcount;
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.userstats = true;
}

/**********
 * Get the counter for a user by name.
 * 
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 **********/
function statsGetCounter(user, countername) {
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }
    return process.userstats[user][countername];
}

/**********
 * Set the counter for a user by name. Specify Value
 * 
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 * - (any) value - Value to store in countername
 **********/
function statsGetCounter(user, countername, value) {
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }
    process.userstats[user][countername] = value;
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.userstats = true;
}