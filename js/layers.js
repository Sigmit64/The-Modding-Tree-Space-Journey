
addLayer("c", {

    tabFormat: {
        "Main Controller": {
            content:
                [
                    "main-display",
                    ["display-text",
                        function () { return 'Power Controlling Center' }
                    ],
                    //["prestige-button"],
                    "blank",
                    ["display-text",
                        function () { return 'Current EP ' + format(player.points) }
                    ],
                    "blank",
                    //["toggle", ["c", "beep"]],
                    
                    "blank",
                    //"blank",
                    ["upgrade", 101]
                    
                ],
            glowColor: "blue",

        },
        "Solar panel": {
            
            content: [
                ["display-text",
                    function () { return 'Current EP ' + format(player.points) }
                ],
                ["buyable", 11],
                ["row", [["upgrade", 111],
                    ["upgrade", 112]]]
                
            ]
        },
        "Electrolyzer": {
            unlocked() {return hasUpgrade('c',101) },
            content: [
                ["display-text",
                    function () { return 'Current EP ' + format(player.points) }
                ],
                ["display-text",
                    function () { return 'Current Hydrogen ' + format(player[this.layer].hydrogen) },
                    { "color": "#00FFFF" }
                ],
                ["display-text",
                    function () { return 'Current Oxygen ' + format(player[this.layer].oxygen) },
                    { "color": "#1ABDE6" }
                ],
                ["infobox","ib1"],
                ["buyable", 12],
                ["row", [["buyable", 13], ["buyable", 15],
                    ["buyable", 14]]],
                ["buyable", 16]
                
            ]
        }
    },
    
    
    name: "cc", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CC", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        oxygen: d1,
        hydrogen: d2,
        ocRate: 0
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "level", // Name of prestige currency
    baseResource: "energy points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    //hotkeys: [
    //    {key: "c", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    //],
    layerShown() { return true },
    update(diff) {

   
        if (hasUpgrade('c', 101) && player['c'].ocRate >0) {
            let eleproduction = (d10.pow(player['c'].ocRate -1))
            let eleconsumption = (buyableEffect('c', 16).pow(player['c'].ocRate -1))
            if (player.points.gte(eleconsumption)) {
                //player.points=player.points.sub(eleconsumption)
                player[this.layer].oxygen = player[this.layer].oxygen.add(eleproduction)
                player[this.layer].hydrogen = player[this.layer].hydrogen.add(eleproduction.times(2))
                if (player.points.lte(eleconsumption.times(20))) {
                    player['c'].ocRate=0
                }
            } else {
                
            }
        }
    },
    buyables: {
        11: {
            title: "Solar panel upgrade",
            //solar panel
            cost(x) { return new Decimal(10).times(new Decimal(x.add(new Decimal(1))).times(new Decimal(x.add(new Decimal(1))))) },
            effect(x) {return x },
            display() {
                return "Solar panel produce more energy points" 
                    + "\nCost: " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " energy points"
                    + "\nCurrently: x" + format(getBuyableAmount(this.layer, this.id).add(new Decimal(1)))
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
            
        },
        12: {
            title: "Electrolyzer Overclock",
            //solar panel
            cost(x) { return d10.pow(x.add(d1)).times(1000) },
            effect(x) { return x },
            display() {
                return "Increase the maximize allowed overclocking rate"
                    + "\nCost: " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " energy points"
                    + "\nCurrently: " + format(getBuyableAmount(this.layer, this.id).add(new Decimal(1))) + " times"
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }

        },
        14: {
            title: "Overclocking rate UP",
            cost(x) { return d0 },
            display() {
                return "Set Overclocking rate to a higher level"
            },
            canAfford() {
                return player['c'].ocRate <= (getBuyableAmount(this.layer, 12) + 1) && (getPointGen().sub((buyableEffect('c', 16).pow(player['c'].ocRate)))).times(20).add(player.points).gte(d0)
            },
            buy() {
                player['c'].ocRate = player['c'].ocRate+1
            },
            style: { 'height': '90px', "width": "150px" }
        },
        13: {
            title: "Overclocking rate DOWN",
            cost(x) { return d0 },
            display() {
                return "Set Overclocking rate to a lower level"
            },
            canAfford() {
                return player['c'].ocRate > 0
            },
            buy() {
                player['c'].ocRate = player['c'].ocRate-1
            },
            style: { 'height': '90px' ,"width":"150px"}
        },
        15: {
            
            display() {
                let eleproduction = (d10.pow(player['c'].ocRate - 1))
                let eleconsumption = (buyableEffect('c',16).pow(player['c'].ocRate - 1))
                return "Current Overclocking rate: " + player['c'].ocRate + (player['c'].ocRate == 0 ? "(OFF)" : "\nProduction rate: x" + format(eleproduction)
                    + "\nEnergy consumption rate: x" + format(eleconsumption) )
            },
            cost: d0,
            canAfford() { return false },
            style: { 'height': '90px', "width": "150px" ,"font-size":"12px"}
        },
        16: {
            title: "Better Overclock",
            //electrolyzer
            cost(x) { return d100.pow(x.add(d1)).times(1000) },
            effect(x) { return d100.sub(d5.times(x)) },
            display() {
                return "Reduce overclocking energy comsumption scaling by 5"
                    + "\nCost: " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " energy points"
                    + "\nCurrently: x" + format(this.effect(getBuyableAmount(this.layer, this.id)))
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }

        }
        
    },
    infoboxes: {
        ib1: {
            title:"Electrolyzer",
            body() {
                return "The Electrolyzer consumes energy points and produces hydrogen and oxygen.\r"
                    + "Overclocking the Electrolyzer makes it production faster but also consumes more energy.\r"
                    + "If your energy points couldn't afford 20s of draining, the Electrolyzer(and other energy consuming mechanics) will shut down. You are also not allowed to increase your overclocking rate if your energy points couldn't afford 20s of draining after overclocking.\r"
                    + "It is not recommended to have your ep/s negative. Also, do not increase your overclocking rate once you can afford it since your energy "
                    + "production will be heavily reduced due to the second solar panel upgrade.\r"
                    + "Happy Overclocking!"
            }
            //style: { "width": "300px", "width": "150px" }
        }
        
    },
    upgrades: {
        101: {
            title: "Electrolyzer",
            description: "Gain access to the Electrolyzer",
            cost: new Decimal(0),
            costR: new Decimal(10000),
            currencyDisplayName: "level & " + "10000" + " energy points",
            //fullDisplay() {return title+'\n'+description+'\nCost:'+costR },
            canAfford() { return player.points.gte(this.costR) },
            pay() { player.points = player.points.sub(this.costR) }

        },
        111: {
            title: "Panel cleaner",
            description: "Solar panel produces energy twice as more",
            cost: new Decimal(0),
            costR: new Decimal(10),
            currencyDisplayName: "level & "+"10"+" energy points",
            //fullDisplay() {return title+'\n'+description+'\nCost:'+costR },
            canAfford() { return player.points.gte(this.costR) },
            pay() { player.points=player.points.sub(this.costR) }
      
        },
        112: {
            title: "Integrated panel",
            description: "Solar panel produces more energy based on current energy points",
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },


            cost: new Decimal(0),
            costR: new Decimal(150),
            effect() { return player.points.gte(new Decimal("e10")) ? d10 : player.points.log(10) },
            currencyDisplayName: "level & " + "150" + " energy points",
            //fullDisplay() {return title+'\n'+description+'\nCost:'+costR },
            canAfford() { return player.points.gte(this.costR) },
            pay() { player.points = player.points.sub(this.costR) }

        }
        
    }
})
