var d0 = new Decimal(0)
var d1 = new Decimal(1)
var d2 = new Decimal(2)
var d3 = new Decimal(3)
var d4 = new Decimal(4)
var d5 = new Decimal(5)
var d6 = new Decimal(6)
var d7 = new Decimal(7)
var d8 = new Decimal(8)
var d9 = new Decimal(9)
var d10 = new Decimal(10)
var d100 = new Decimal(100)
var dh = new Decimal(100)
var dk = new Decimal(1000)
var dM = new Decimal(1000000)

let modInfo = {
	name: "The Tree of Space Journey",
	id: "space_journey",
	author: "Sigmit64",
	pointsName: "energy points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain=d0

	let solarPanelGain = new Decimal(0)
	solarPanelGain = solarPanelGain.add(10)

	let solarPanelGainMult = d100
	solarPanelGainMult = solarPanelGainMult.times(getBuyableAmount('c', 11).add(1))
	if (hasUpgrade('c', 111)) solarPanelGainMult =solarPanelGainMult.times(2)
	if (hasUpgrade('c', 112)) solarPanelGainMult = solarPanelGainMult.times(upgradeEffect('c', 112))
	solarPanelGain = solarPanelGain.times(solarPanelGainMult)

	gain = gain.add(solarPanelGain)

	let consumption=d0

	if (player['c'].ocRate != 0) {
		consumption = consumption.add(d100.pow(player['c'].ocRate -1))
    }

	gain = gain.sub(consumption)
	//if (player.points.add(gain.times(20)).lt(d0)) {
	//	setBuyableAmount('c',13,0)
		
    //}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
	return {
		
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}