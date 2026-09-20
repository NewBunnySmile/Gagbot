/*********
 * All of the outcomes that can result from /gamba pull. These include the item and a weight, and is a list of objects. The entire data is passed to the gamba roll function when selected.
 *********/
const gamba_pull_low = [
    { type: "coins", weight: 5, quantity: 100 },
    { type: "coins", weight: 3, quantity: 200 },
    { type: "coins", weight: 1, quantity: 500 },
    { type: "coins", weight: 1, quantity: 750 },
    { type: "nothing", weight: 20 },
    { type: "bondage_random", weight: 15, lock: 0 },
    { type: "bondage_random", weight: 5, lock: 300000 },
]

exports.gamba_pull_low = gamba_pull_low;