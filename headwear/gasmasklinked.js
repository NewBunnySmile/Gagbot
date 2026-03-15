// Strictly speaking, this is unnecessary for most of these. 
// But some are going to use extra properties! 
exports.name = "Gasmask (Linked)";

exports.tags = ["latex"];

// Remove the shared hose if it is present
exports.onUnlock = (data) => {
    if (process.headwear && process.headwear[data.userID] && process.headwear[data.userID].sharedbreathhose) {
        delete process.headwear[data.userID].sharedbreathhose;
    }
}

exports.hidden = false; // Disable it from showing in the list!