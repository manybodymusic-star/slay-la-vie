/* 
The purpose of this file is to set up the tileStack, tileReqs, board, and QPR arrays

tileStack:  - comprehensive list of all tiles, imported from tilebase.csv
            - N rows, each contains data such as name, tier, type, length, etc
            - used in filling tileBoard
            - does not change

tileBoard:  - list of tiles on board 
            - includes all data from tileStack + (x,y) location of each tile
            - used to render game board
            - updated each time a tile is unlocked

tileReqs:   - NxN binary array that keeps track of tiles' prerequisites
            - tilereqs(a,b) = 1 -> tile b is a prerequisite for tile a
            - used with board to draw new tiles
            - does not change 

board:      - 1xN binary array that tracks which tiles are on the board
            - board(a) = 1 -> tile a is on the board
            - used to prevent tile duplication
            - updated each time a tile is unlocked

unlocked:   - 1xN binary array that tracks which tiles unlocked on the board
            - board(a) = 1 -> tile a is on the board
            - used with prereqs to draw new tiles
            - updated each time a tile is unlocked

QPR:        - contains nunber of quest points required (QPR) for certain quest tiles
            - QPR(a) = b -> tile a requires at least b quest points to be available in order to be drawn
            - final eligibility check after prereqs + board have determined a tile to be drawn
            - does not change            

QPA:        - keeps track of number of quest points earned 
            - quest points are earned by unlocking quest tiles
            - updated each time a tile is unlocked
*/  


// Add Learning the Ropes to tileStack data

window.tileStack = [["1","Cook's Assistant","Quest","Novice","Very Short","1"],["2","Demon Slayer","Quest","Novice","Short","3"],["3","The Restless Ghost","Quest","Novice","Short","1"],["4","Romeo & Juliet","Quest","Novice","Short","5"],["5","Sheep Shearer","Quest","Novice","Very Short","1"],["6","Shield of Arrav","Quest","Novice","Short","1"],["7","Ernest the Chicken","Quest","Novice","Very Short","4"],["8","Vampyre Slayer","Quest","Intermediate","Very Short","3"],["9","Imp Catcher","Quest","Novice","Short","1"],["10","Prince Ali Rescue","Quest","Novice","Short","3"],["11","Doric's Quest","Quest","Novice","Very Short","1"],["12","Black Knights' Fortress","Quest","Intermediate","Very Short","3"],["13","Witch's Potion","Quest","Novice","Very Short","1"],["14","The Knight's Sword","Quest","Intermediate","Short","1"],["15","Goblin Diplomacy","Quest","Novice","Very Short","5"],["16","Pirate's Treasure","Quest","Novice","Very Short","2"],["17","Dragon Slayer","Quest","Experienced","Medium","2"],["18","Druidic Ritual","Quest","Novice","Very Short","4"],["19","Lost City","Quest","Intermediate","Short","3"],["20","Witch's House","Quest","Intermediate","Very Short","4"],["21","Merlin's Crystal","Quest","Intermediate","Short","6"],["22","Heroes' Quest","Quest","Experienced","Medium","1"],["23","Scorpion Catcher","Quest","Intermediate","Short","1"],["24","Family Crest","Quest","Experienced","Medium","1"],["25","Tribal Totem","Quest","Intermediate","Very Short","1"],["26","Fishing Contest","Quest","Novice","Very Short","1"],["27","Monk's Friend","Quest","Novice","Very Short","1"],["28","Temple of Ikov","Quest","Intermediate","Medium","1"],["29","Clock Tower","Quest","Novice","Very Short","1"],["30","Holy Grail","Quest","Intermediate","Short","2"],["31","Tree Gnome Village","Quest","Intermediate","Short","2"],["32","Fight Arena","Quest","Intermediate","Short","2"],["33","Hazeel Cult","Quest","Novice","Very Short","1"],["34","Sheep Herder","Quest","Novice","Short","4"],["35","Plague City","Quest","Novice","Very Short","1"],["36","Sea Slug","Quest","Intermediate","Short","1"],["37","Waterfall Quest","Quest","Intermediate","Short","1"],["38","Biohazard","Quest","Novice","Short","3"],["39","Jungle Potion","Quest","Novice","Short","1"],["40","The Grand Tree","Quest","Intermediate","Medium","5"],["41","Shilo Village","Quest","Intermediate","Medium","2"],["42","Underground Pass","Quest","Experienced","Long","5"],["43","Observatory Quest","Quest","Intermediate","Short","2"],["44","The Tourist Trap","Quest","Intermediate","Medium","2"],["45","Watchtower","Quest","Intermediate","Medium","4"],["46","Dwarf Cannon","Quest","Novice","Short","1"],["47","Murder Mystery","Quest","Novice","Short","3"],["48","The Dig Site","Quest","Intermediate","Medium","2"],["49","Gertrude's Cat","Quest","Novice","Very Short","1"],["50","Legends' Quest","Quest","Master","Long","4"],["51","Rune Mysteries","Quest","Novice","Short","1"],["52","Big Chompy Bird Hunting","Quest","Intermediate","Short","2"],["53","Elemental Workshop","Quest","Novice","Very Short","1"],["54","Priest in Peril","Quest","Novice","Short","1"],["55","Nature Spirit","Quest","Intermediate","Short","2"],["56","Death Plateau","Quest","Novice","Short","1"],["57","Troll Stronghold","Quest","Intermediate","Short","1"],["58","Tai Bwo Wannai Trio","Quest","Intermediate","Medium","2"],["59","Regicide","Quest","Experienced","Long","3"],["60","Eadgar's Ruse","Quest","Intermediate","Medium","1"],["61","Shades of Mort'ton","Quest","Intermediate","Short","3"],["62","The Fremennik Trials","Quest","Intermediate","Medium","3"],["63","Horror from the Deep","Quest","Intermediate","Short","2"],["64","Throne of Miscellania","Quest","Experienced","Medium","1"],["65","Monkey Madness","Quest","Master","Long","3"],["66","Haunted Mine","Quest","Experienced","Short","2"],["67","Troll Romance","Quest","Intermediate","Short","2"],["68","In Search of the Myreque","Quest","Intermediate","Short","2"],["69","Creature of Fenkenstrain","Quest","Intermediate","Medium","2"],["70","Roving Elves","Quest","Experienced","Short","1"],["71","Ghosts Ahoy","Quest","Intermediate","Medium","2"],["72","One Small Favour","Quest","Experienced","Long","2"],["73","Mountain Daughter","Quest","Intermediate","Medium","2"],["74","Between a Rock...","Quest","Experienced","Medium","2"],["75","The Feud","Quest","Intermediate","Medium","1"],["76","The Golem","Quest","Intermediate","Short","1"],["77","Desert Treasure","Quest","Master","Long","3"],["78","Icthlarin's Little Helper","Quest","Intermediate","Medium","2"],["79","Tears of Guthix","Quest","Intermediate","Very Short","1"],["80","Zogre Flesh Eaters","Quest","Intermediate","Short","1"],["81","The Lost Tribe","Quest","Intermediate","Short","1"],["82","The Giant Dwarf","Quest","Intermediate","Medium","2"],["83","Recruitment Drive","Quest","Novice","Short","1"],["84","Mourning's End Part I","Quest","Master","Medium","2"],["85","Forgettable Tale...","Quest","Intermediate","Long","2"],["86","Garden of Tranquillity","Quest","Intermediate","Long","2"],["87","A Tail of Two Cats","Quest","Intermediate","Medium","2"],["88","Wanted!","Quest","Intermediate","Medium","1"],["89","Mourning's End Part II","Quest","Master","Long","2"],["90","Rum Deal","Quest","Experienced","Medium","2"],["91","Shadow of the Storm","Quest","Intermediate","Medium","1"],["92","Making History","Quest","Intermediate","Short","3"],["93","Ratcatchers","Quest","Intermediate","Medium","2"],["94","Spirits of the Elid","Quest","Intermediate","Short","2"],["95","Devious Minds","Quest","Experienced","Short","1"],["96","The Hand in the Sand","Quest","Intermediate","Short","1"],["97","Enakhra's Lament","Quest","Experienced","Medium","2"],["98","Cabin Fever","Quest","Experienced","Short","2"],["99","Fairytale I: Growing Pains","Quest","Intermediate","Medium","2"],["100","Recipe for Disaster","Quest","Special","Very Long","10"],["101","In Aid of the Myreque","Quest","Intermediate","Medium","2"],["102","A Soul's Bane","Quest","Intermediate","Short","1"],["103","Rag and Bone Man","Quest","Novice","Short","1"],["104","Swan Song","Quest","Master","Medium","2"],["105","Royal Trouble","Quest","Experienced","Medium","1"],["106","Death to the Dorgeshuun","Quest","Intermediate","Medium","1"],["107","Fairytale II: Cure a Queen","Quest","Experienced","Medium","2"],["108","Lunar Diplomacy","Quest","Experienced","Long","2"],["109","The Eyes of Glouphrie","Quest","Intermediate","Medium","2"],["110","Darkness of Hallowvale","Quest","Experienced","Long","2"],["111","The Slug Menace","Quest","Intermediate","Medium","1"],["112","Elemental Workshop II","Quest","Intermediate","Short","1"],["113","My Arm's Big Adventure","Quest","Experienced","Medium","1"],["114","Enlightened Journey","Quest","Intermediate","Short","1"],["115","Eagles' Peak","Quest","Novice","Short","2"],["116","Animal Magnetism","Quest","Intermediate","Medium","1"],["117","Contact!","Quest","Experienced","Short","1"],["118","Cold War","Quest","Intermediate","Medium","1"],["119","The Fremennik Isles","Quest","Experienced","Medium","1"],["120","Tower of Life","Quest","Novice","Medium","2"],["121","The Great Brain Robbery","Quest","Experienced","Medium","2"],["122","What Lies Below","Quest","Intermediate","Short","1"],["123","Olaf's Quest","Quest","Intermediate","Short","1"],["124","Another Slice of H.A.M.","Quest","Intermediate","Short","1"],["125","Dream Mentor","Quest","Master","Medium","2"],["126","Grim Tales","Quest","Master","Medium","1"],["127","King's Ransom","Quest","Experienced","Medium","1"],["128","Monkey Madness II","Quest","Grandmaster","Very Long","4"],["129","Misthalin Mystery","Quest","Novice","Short","1"],["130","Client of Kourend","Quest","Novice","Short","1"],["131","Rag and Bone Man II","Quest","Experienced","Medium","1"],["132","Bone Voyage","Quest","Intermediate","Short","1"],["133","The Queen of Thieves","Quest","Intermediate","Very Short","1"],["134","The Depths of Despair","Quest","Intermediate","Short","1"],["135","The Corsair Curse","Quest","Intermediate","Short","2"],["136","Dragon Slayer II","Quest","Grandmaster","Very Long","5"],["137","Tale of the Righteous","Quest","Intermediate","Short","1"],["138","A Taste of Hope","Quest","Experienced","Medium","1"],["139","Making Friends with My Arm","Quest","Master","Medium","2"],["140","The Forsaken Tower","Quest","Intermediate","Short","1"],["141","The Ascent of Arceuus","Quest","Intermediate","Short","1"],["142","X Marks the Spot","Quest","Novice","Very Short","1"],["143","Song of the Elves","Quest","Grandmaster","Very Long","4"],["144","The Fremennik Exiles","Quest","Master","Medium","2"],["145","Sins of the Father","Quest","Master","Long","2"],["146","A Porcine of Interest","Quest","Novice","Very Short","1"],["147","Getting Ahead","Quest","Intermediate","Short","1"],["148","Below Ice Mountain","Quest","Novice","Short","1"],["149","A Night at the Theatre","Quest","Master","Medium","2"],["150","A Kingdom Divided","Quest","Experienced","Long","2"],["151","Land of the Goblins","Quest","Experienced","Medium","2"],["152","Temple of the Eye","Quest","Intermediate","Short","1"],["153","Beneath Cursed Sands","Quest","Master","Medium","2"],["154","Sleeping Giants","Quest","Intermediate","Very Short","1"],["155","The Garden of Death","Quest","Intermediate","Short","1"],["156","Secrets of the North","Quest","Master","Medium","2"],["157","Desert Treasure II","Quest","Grandmaster","Very Long","5"],["158","The Path of Glouphrie","Quest","Experienced","Medium","2"],["159","Children of the Sun","Quest","Novice","Very Short","1"],["160","Defender of Varrock","Quest","Experienced","Medium","2"],["161","Twilight's Promise","Quest","Intermediate","Short","1"],["162","At First Light","Quest","Intermediate","Short","1"],["163","Perilous Moons","Quest","Master","Medium","2"],["164","The Ribbiting Tale of a Lily Pad Labour Dispute","Quest","Novice","Very Short","1"],["165","While Guthix Sleeps","Quest","Grandmaster","Very Long","5"],["166","The Heart of Darkness","Quest","Experienced","Medium","2"],["167","Death on the Isle","Quest","Intermediate","Medium","2"],["168","Meat and Greet","Quest","Experienced","Short","1"],["169","Ethically Acquired Antiquities","Quest","Novice","Short","1"],["170","The Curse of Arrav","Quest","Master","Medium","2"],["171","The Final Dawn","Quest","Master","Long","3"],["172","Shadows of Custodia","Quest","Experienced","Short","2"],["173","Scrambled!","Quest","Intermediate","Short","1"],["174","Pandemonium","Quest","Novice","Short","1"],["175","Prying Times","Quest","Intermediate","Short","1"],["176","Current Affairs","Quest","Novice","Short","1"],["177","Troubled Tortugans","Quest","Experienced","Medium","1"],["178","The Ides of Milk","Quest","Novice","Short","1"],["179","The Red Reef","Quest","Intermediate","Medium","2"],["180","Alfred Grimhand's Barcrawl","Miniquest","Novice","Medium","0"],["181","Barbarian Training","Miniquest","Experienced","Medium","0"],["182","Bear Your Soul","Miniquest","Intermediate","Short","0"],["183","Curse of the Empty Lord","Miniquest","Experienced","Medium","0"],["184","Daddy's Home","Miniquest","Novice","Short","0"],["185","The Enchanted Key","Miniquest","Intermediate","Medium","0"],["186","Enter the Abyss","Miniquest","Intermediate","Very Short","0"],["187","Family Pest","Miniquest","Intermediate","Short","0"],["188","The Frozen Door","Miniquest","Master","Short","0"],["189","The General's Shadow","Miniquest","Experienced","Medium","0"],["190","His Faithful Servants","Miniquest","Experienced","Very Short","0"],["191","Hopespear's Will","Miniquest","Master","Short","0"],["192","In Search of Knowledge","Miniquest","Experienced","Medium","0"],["193","Into the Tombs","Miniquest","Master","Medium","0"],["194","Lair of Tarn Razorlor","Miniquest","Experienced","Medium","0"],["195","Mage Arena I","Miniquest","Experienced","Short","0"],["196","Mage Arena II","Miniquest","Master","Medium","0"],["197","Natural History","Miniquest","Novice","Very Short","0"],["198","Skippy and the Mogres","Miniquest","Novice","Very Short","0"],["199","Vale Totems","Miniquest","Novice","Very Short","0"],["200","Woodwork","Resource","I ","","0"],["201","Woodwork","Resource","II","","0"],["202","Woodwork","Resource","III","","0"],["203","Woodwork","Resource","IV","","0"],["204","Woodwork","Resource","V","","0"],["205","Woodwork","Resource","VI","","0"],["206","Woodwork","Resource","VII","","0"],["207","Metallurgy","Resource","I ","","0"],["208","Metallurgy","Resource","II","","0"],["209","Metallurgy","Resource","III","","0"],["210","Metallurgy","Resource","IV","","0"],["211","Metallurgy","Resource","V","","0"],["212","Metallurgy","Resource","VI","","0"],["213","Metallurgy","Resource","VII","","0"],["214","Fish ","Resource","I ","","0"],["215","Fish ","Resource","II","","0"],["216","Fish ","Resource","III","","0"],["217","Fish ","Resource","IV","","0"],["218","Fish ","Resource","V","","0"],["219","Fish ","Resource","VI","","0"],["220","Fish ","Resource","VII","","0"],["221","Flora","Resource","I ","","0"],["222","Flora","Resource","II","","0"],["223","Flora","Resource","III","","0"],["224","Flora","Resource","IV","","0"],["225","Flora","Resource","V","","0"],["226","Flora","Resource","VI","","0"],["227","Flora","Resource","VII","","0"],["228","Fauna","Resource","I ","","0"],["229","Fauna","Resource","II","","0"],["230","Fauna","Resource","III","","0"],["231","Fauna","Resource","IV","","0"],["232","Fauna","Resource","V","","0"],["233","Fauna","Resource","VI","","0"],["234","Fauna","Resource","VII","","0"],["235","Runic","Resource","I ","","0"],["236","Runic","Resource","II","","0"],["237","Runic","Resource","III","","0"],["238","Runic","Resource","IV","","0"],["239","Runic","Resource","V","","0"],["240","Runic","Resource","VI","","0"],["241","Runic","Resource","VII","","0"],["242","Homestead","Resource","I ","","0"],["243","Homestead","Resource","II","","0"],["244","Homestead","Resource","III","","0"],["245","Homestead","Resource","IV","","0"],["246","Homestead","Resource","V","","0"],["247","Homestead","Resource","VI","","0"],["248","Homestead","Resource","VII","","0"],["249","Seastead","Resource","I ","","0"],["250","Seastead","Resource","II","","0"],["251","Seastead","Resource","III","","0"],["252","Seastead","Resource","IV","","0"],["253","Seastead","Resource","V","","0"],["254","Seastead","Resource","VI","","0"],["255","Seastead","Resource","VII","","0"],["256","Mischief","Resource","I ","","0"],["257","Mischief","Resource","II","","0"],["258","Mischief","Resource","III","","0"],["259","Mischief","Resource","IV","","0"],["260","Mischief","Resource","V","","0"],["261","Mischief","Resource","VI","","0"],["262","Mischief","Resource","VII","","0"],["263","Swiftness","Resource","I ","","0"],["264","Swiftness","Resource","II","","0"],["265","Swiftness","Resource","III","","0"],["266","Swiftness","Resource","IV","","0"],["267","Swiftness","Resource","V","","0"],["268","Swiftness","Resource","VI","","0"],["269","Swiftness","Resource","VII","","0"],["270","Mortis","Resource","I ","","0"],["271","Mortis","Resource","II","","0"],["272","Mortis","Resource","III","","0"],["273","Mortis","Resource","IV","","0"],["274","Mortis","Resource","V","","0"],["275","Mortis","Resource","VI","","0"],["276","Mortis","Resource","VII","","0"],["277","Ardougne","Diary","Easy","","0"],["278","Ardougne","Diary","Medium","","0"],["279","Ardougne","Diary","Hard","","0"],["280","Ardougne","Diary","Elite","","0"],["281","Desert","Diary","Easy","","0"],["282","Desert","Diary","Medium","","0"],["283","Desert","Diary","Hard","","0"],["284","Desert","Diary","Elite","","0"],["285","Falador","Diary","Easy","","0"],["286","Falador","Diary","Medium","","0"],["287","Falador","Diary","Hard","","0"],["288","Falador","Diary","Elite","","0"],["289","Fremennik","Diary","Easy","","0"],["290","Fremennik","Diary","Medium","","0"],["291","Fremennik","Diary","Hard","","0"],["292","Fremennik","Diary","Elite","","0"],["293","Kandarin","Diary","Easy","","0"],["294","Kandarin","Diary","Medium","","0"],["295","Kandarin","Diary","Hard","","0"],["296","Kandarin","Diary","Elite","","0"],["297","Karamja","Diary","Easy","","0"],["298","Karamja","Diary","Medium","","0"],["299","Karamja","Diary","Hard","","0"],["300","Karamja","Diary","Elite","","0"],["301","Kourend & Kebos","Diary","Easy","","0"],["302","Kourend & Kebos","Diary","Medium","","0"],["303","Kourend & Kebos","Diary","Hard","","0"],["304","Kourend & Kebos","Diary","Elite","","0"],["305","Lumbridge & Draynor","Diary","Easy","","0"],["306","Lumbridge & Draynor","Diary","Medium","","0"],["307","Lumbridge & Draynor","Diary","Hard","","0"],["308","Lumbridge & Draynor","Diary","Elite","","0"],["309","Morytania","Diary","Easy","","0"],["310","Morytania","Diary","Medium","","0"],["311","Morytania","Diary","Hard","","0"],["312","Morytania","Diary","Elite","","0"],["313","Varrock","Diary","Easy","","0"],["314","Varrock","Diary","Medium","","0"],["315","Varrock","Diary","Hard","","0"],["316","Varrock","Diary","Elite","","0"],["317","Western Provinces","Diary","Easy","","0"],["318","Western Provinces","Diary","Medium","","0"],["319","Western Provinces","Diary","Hard","","0"],["320","Western Provinces","Diary","Elite","","0"],["321","Wilderness","Diary","Easy","","0"],["322","Wilderness","Diary","Medium","","0"],["323","Wilderness","Diary","Hard","","0"],["324","Wilderness","Diary","Elite","","0"],["325","Blood Moon Rises","Quest","Grandmaster","Very long","5"],["326","Fallen from Grace","Quest","Experienced","Short","2"]]
window.tileStack.unshift(["0", "Learning the Ropes", "Quest", "Novice", "Very short", "0"]);
/* state.tileBoard = [ {
    id: 0,
    name: "Learning the Ropes",
    type: "Quest",
    tier: "Novice",
    length: "Very short",
    qp: 0,
    x: 0,
    y: 0,
    unlocked: false,
    confirm: false
} ] */



// Initialize tileReqs and QPR as static reference data.

let N = window.tileStack.length;  
window.tileReqs = null;        
{
    window.tileReqs = Array(N)
        .fill()
        .map(() => Array(N).fill(0));
}
window.QPR = Array(N).fill(0);

// Input QPR data
{
window.QPR[12] = 12;
window.QPR[17] = 32;
window.QPR[22] = 55;
window.QPR[50] = 107;
window.QPR[79] = 43;
window.QPR[88] = 32;
window.QPR[104] = 100;
window.QPR[114] = 20;
window.QPR[136] = 200;
window.QPR[148] = 16;
window.QPR[165] = 180;
}


// Populate tileReqs array with quest / miniquest perequisites (last update: The Red Reef)

const prereqs = 
[
    {
        r: 14,
        c: [207]
    },
    {
        r: 19,
        c: [200]
    },
    {
        r: 22,
        c: [6,17,19,21,207,217,222]
    },
    {
        r: 23,
        c: [180]
    },
    {
        r: 24,
        c: [210]
    },
    {
        r: 25,
        c: [256]
    },
    {
        r: 26,
        c: [214]
    },
    {
        r: 28,
        c: [256]
    },
    {
        r: 30,
        c: [21]
    },
    {
        r: 36,
        c: [200]
    },
    {
        r: 38,
        c: [35]
    },
    {
        r: 39,
        c: [18]
    },
    {
        r: 40,
        c: [263]
    },
    {
        r: 41,
        c: [39,263]
    },
    {
        r: 42,
        c: [38]
    },
    {
        r: 44,
        c: [207,200]
    },
    {
        r: 45,
        c: [221,207,256,263]
    },
    {
        r: 48,
        c: [257,221,263]
    },
    {
        r: 50,
        c: [24,22,41,42,37,205,210,221,236,260,267]
    },
    {
        r: 52,
        c: [200,270]
    },
    {
        r: 53,
        c: [209]
    },

    {
        r: 55,
        c: [3,54]
    },
    {
        r: 57,
        c: [56,263]
    },
    {
        r: 58,
        c: [39,214,265]
    },
    {
        r: 59,
        c: [42,208,263]
    },
    {
        r: 60,
        c: [18,57,223]
    },
    {
        r: 61,
        c: [54,200,222]
    },
    {
        r: 63,
        c: [180,264]
    },
    {
        r: 64,
        c: [22,62]
    },
    {
        r: 65,
        c: [40, 31]
    },
    {
        r: 66,
        c: [54]
    },
    {
        r: 67,
        c: [57,263]
    },
    {
        r: 68,
        c: [55,263]
    },
    {
        r: 69,
        c: [54,3,208,256]
    },
    {
        r: 70,
        c: [59,37]
    },
    {
        r: 71,
        c: [54,3,264,270]
    },
    {
        r: 72,
        c: [51,41,222,209,263]
    },
    {
        r: 73,
        c: [263]
    },
    {
        r: 74,
        c: [46,26,210]
    },
    {
        r: 75,
        c: [257]
    },
    {
        r: 76,
        c: [256,207]
    },
    {
        r: 77,
        c: [48,28,44,57,54,37,259,200]
    },
    {
        r: 78,
        c: [49]
    },
    {
        r: 79,
        c: [200,207]
    },
    {
        r: 80,
        c: [39,52,207,221]
    },
    {
        r: 81,
        c: [51,15,207,256,263]
    },
    {
        r: 82,
        c: [200,208,238,256]
    },
    {
        r: 83,
        c: [18,12]
    },
    {
        r: 84,
        c: [70,52,34,256]
    },
    {
        r: 85,
        c: [82,26,221]
    },
    {
        r: 86,
        c: [69,222]
    },
    {
        r: 87,
        c: [78]
    },
    {
        r: 88,
        c: [83,81,54,186]
    },
    {
        r: 89,
        c: [84]
    },
    {
        r: 90,
        c: [80,54,221,214]
    },
    {
        r: 91,
        c: [76,2,208]
    },
    {
        r: 92,
        c: [3,54]
    },
    {
        r: 93,
        c: [78,82]
    },
    {
        r: 94,
        c: [207,238,256]
    },
    {
        r: 95,
        c: [88,57,11,210,235,200]
    },
    {
        r: 96,
        c: [256]
    },
    {
        r: 97,
        c: [203,210]
    },
    {
        r: 98,
        c: [16,90,242,263,207]
    },
    {
        r: 99,
        c: [19,55]
    },
    {
        r: 100,
        c: [1]
    },
    {
        r: 101,
        c: [68,209,236,242,263]
    },
    {   
        r: 103,
        c: [270]
    },
    {
        r: 104,
        c: [72,86,200,208,218]
    },
    {
        r: 105,
        c: [64,263]
    },
    {
        r: 106,
        c: [81,263,256]
    },
    {
        r: 107,
        c: [99,224,256]
    },
    {
        r: 108,
        c: [62,19,51,41,221,211,238,200]
    },
    {
        r: 109,
        c: [40,203,242]
    },
    {
        r: 110,
        c: [101,242,238,256,263,207]
    },
    {
        r: 111,
        c: [88,36,238,256]
    },
    {
        r: 112,
        c: [53,209]
    },
    {
        r: 113,
        c: [60,75,39,221,200]
    },
    {
        r: 114,
        c: [200,223]
    },
    {
        r: 115,
        c: [228]
    },
    {
        r: 116,
        c: [3,7,54,208,203]
    },
    {
        r: 117,
        c: [10,78]
    },
    {
        r: 118,
        c: [245,265,257,228]
    },
    {
        r: 119,
        c: [62,242,203]
    },
    {
        r: 120,
        c: [242]
    },
    {
        r: 121,
        c: [69,98,100,243]
    },
    {
        r: 122,
        c: [51,237]
    },
    {
        r: 123,
        c: [62,200]
    },
    {
        r: 124,
        c: [106,82,48]
    },
    {
        r: 125,
        c: [108,60]
    },
    {
        r: 126,
        c: [20,222,200,263,256]
    },
    {
        r: 127,
        c: [12,30,47,72,238]
    },
    {
        r: 128,
        c: [114,109,57,45,1,256,263,200,228]
    },
    {
        r: 130,
        c: [142]
    },
    {
        r: 131,
        c: [103,198,69,37]
    },
    {
        r: 132,
        c: [48]
    },
    {
        r: 133,
        c: [130,256]
    },
    {
        r: 134,
        c: [130,263]
    },
    {
        r: 136,
        c: [50,125,87,116,71,132,130,243,212,256,263]
    },
    {
        r: 137,
        c: [130,207]
    },
    {
        r: 138,
        c: [110,209,236,221,263]
    },
    {
        r: 139,
        c: [113,104,118,4,245,207,200,264]
    },
    {
        r: 140,
        c: [130]
    },
    {
        r: 141,
        c: [130,228]
    },
    {
        r: 143,
        c: [89,92,18,200,207,221,228,242,256,263]
    },
    {
        r: 144,
        c: [119,108,73,22,211,214,239]
    },
    {
        r: 145,
        c: [8,138,204,210,238,263]
    },
    {
        r: 147,
        c: [207,242]
    },
    {
        r: 149,
        c: [138]
    },
    {
        r: 150,
        c: [133,134,137,140,141,210,200,223,256,263]
    },
    {
        r: 151,
        c: [26,124,223,216,263,256]
    },
    {
        r: 152,
        c: [186,235]
    },
    {
        r: 153,
        c: [117,208,263,200]
    },
    {
        r: 154,
        c: [207,201,242]
    },
    {
        r: 155,
        c: [221]
    },
    {
        r: 156,
        c: [139,189,95,33,256,263,228]
    },
    {
        r: 157,
        c: [77,156,97,152,155,148,190,200,221,235,242,256]
    },
    {
        r: 158,
        c: [109,37,31,266,256]
    },
    {
        r: 160,
        c: [6,28,148,24,86,122,4,2,228,208]
    },
    {
        r: 161,
        c: [159]
    },
    {
        r: 162,
        c: [159,115,230,221,242]
    },
    {
        r: 163,
        c: [161,215,229,235,242]
    },
    {
        r: 164,
        c: [159,200]
    },
    {
        r: 165,
        c: [160,158,32,125,96,88,152,79,55,87,239,225,261,263,228,200]
    },
    {
        r: 166,
        c: [161,207,256,263]
    },
    {
        r: 167,
        c: [159,256,263]
    },
    {
        r: 168,
        c: [159]
    },
    {
        r: 169,
        c: [159,6,256]
    },
    {
        r: 170,
        c: [160,67,207,256,263]
    },
    {
        r: 171,
        c: [166,163,200,235,256]
    },
    {
        r: 172,
        c: [159,242,214,228]
    },
    {
        r: 173,
        c: [159,207,242]
    },
    {
        r: 174,
        c: [249]
    },
    {
        r: 175,
        c: [174,14,209]
    },
    {
        r: 176,
        c: [174,214]
    },
    {
        r: 177,
        c: [174,202,242,228]
    },
    {
        r: 179,                            
        c: [177,207]                
    },
    {
        r: 325,                            
        c: [149,145,204,207,228,221]
    },
    {
        r: 326,                            // Fallen from Grace (last quest)
        c: [174,210,235]
    },
    {                                      // Beginning of miniquests
        r: 181,
        c: []
    },
    {
        r: 183,
        c: [77,3]
    },
    {
        r: 184,
        c: [242]
    },
    {
        r: 185,
        c: [92]
    },
    {
        r: 186,
        c: [18]
    },
    {
        r: 187,
        c: [24]
    },
    {
        r: 188,
        c: [77,266]
    },
    {
        r: 189,
        c: [183,32]
    },
    {
        r: 190,
        c: [54]
    },
    {
        r: 191,
        c: [3,77,107,151]
    },
    {
        r: 193,
        c: [153]
    },
    {
        r: 194,
        c: [66]
    },
    {
        r: 195,
        c: [239]
    },
    {
        r: 196,
        c: [195,240]
    },
    {
        r: 199,                     // end of miniquests
        c: [159,201]
    },
    {
        r: 277,                    // beginning of diaries 
        c: [51,38,256]
    },
    {
        r: 278,
        c: [277,99,223,266,238,35,114,96,214,258,120,42,99]
    },
    {
        r: 279,
        c: [278,50,261,45,232,226,210,247,89,239]
    },
    {
        r: 280,
        c: [279,262,213,204,66,269,77]
    },
    {
        r: 281,                     
        c: [78,229,207,256]
    },
    {
        r: 282,
        c: [281,266,231,256,76,222,97,244,202]
    },
    {
        r: 283,
        c: [282,261,211,125,239,268,77,117,204]
    },
    {
        r: 284,
        c: [283,245,262]
    },
    {
        r: 285,                     
        c: [14,11,242,265,207]
    },
    {
        r: 286,
        c: [238,223,198,267,258,83,210,202]
    },
    {
        r: 287,
        c: [266,22,260,111,126]
    },
    {
        r: 288,
        c: [88,226,268]
    },
    {
        r: 289,                     
        c: [62,82,57,231,208,256,201,119]
    },
    {
        r: 290,
        c: [289,123,115,119,231,245,63,210,99]
    },
    {
        r: 291,
        c: [290,60,239,226,261,203,212,108]
    },
    {
        r: 292,
        c: [108,239,212,269,57]
    },
    {
        r: 293,                     
        c: [53,215,223,265]
    },
    {
        r: 294,
        c: [293,266,224,215,238,203,53,259,209,99]
    },
    {
        r: 295,
        c: [294,218,267,204,127,236,256,242,212]
    },
    {
        r: 296,
        c: [295,219,213,205,238,108]
    },
    {
        r: 297,
        c: [223,210,264,214]
    },
    {
        r: 298,
        c: [297,41,39,202,219,40,222,231,263,210]
    },
    {
        r: 299,
        c: [298,58,219,50,266,41,200,237]
    },
    {
        r: 300,
        c: [299,237,266]
    },
    {
        r: 301,                     
        c: [18,208,257,244,222,18,215]
    },
    {
        r: 302,
        c: [301,99,134,137,140,141,133,210,221,242,217,264,204,115,231,203]
    },
    {
        r: 303,
        c: [302,140,205,226,259,125,239]
    },
    {
        r: 304,
        c: [303,240,206,220,227]
    },
    {
        r: 305,                     
        c: [1,51,263,236,201,214,208,256]
    },
    {
        r: 306,
        c: [305,266,116,99,238,215,202,258,19,230]
    },
    {
        r: 307,
        c: [306,238,19,267,200,79,124,100,225]
    },
    {
        r: 308,
        c: [307,262,106,269,205,236]
    },
    {
        r: 309,                     
        c: [55,270,221]
    },
    {
        r: 310,
        c: [309,229,265,203,194,98,46,209,71,221]
    },
    {
        r: 311,
        c: [310,77,208,247,240,262,224,203,98,101,55,127,210,66]
    },
    {
        r: 312,
        c: [311,101,219,61,205,239,108]
    },
    {
        r: 313,                     
        c: [51,208,242,265,200,237,215,256]
    },
    {
        r: 314,
        c: [313,49,31,102,238,245,86,114,264]
    },
    {
        r: 315,
        c: [314,228,77,238,204,242,225,268]
    },
    {
        r: 316,
        c: [315,227,125,239,245,213,44]
    },
    {
        r: 317,                     
        c: [51,52,230,208,201]
    },
    {
        r: 318,
        c: [317,31,40,263,202,230,215,52,115,109,210]
    },
    {
        r: 319,
        c: [318,70,104,218,233,266,203,212,226,52,245,238,261]
    },
    {
        r: 320,
        c: [319,205,226,264,42,52,262]
    },
    {
        r: 321,                                        
        c: [186,237,264,208,186]
    },
    {
        r: 322,
        c: [321,210,268,236]
    },
    {
        r: 323,
        c: [322,239,236,233,212,264,217] 
    },
    {
        r: 324,
        c: [323,77,238,220,213,262,205]         // end of diary tiles
    }
]


for (const entry of prereqs) 
{
    for (const col of entry.c) 
        {window.tileReqs[entry.r][col] = 1;}
}


// Implement resource tile sequencing

for (let i=0; i<11; i++) 
{
    for (let j=1; j<7; j++) 
        {window.tileReqs[200+7*i+j][200+7*i+j-1] = 1;}
}


// Color palette 
window.tileColors = 
{
    Quest: 
    {
        Novice:       [223, 35, 80],
        Intermediate: [223, 45, 75],
        Experienced:  [223, 55, 70],
        Master:       [223, 65, 65],
        Grandmaster:  [223, 75, 60],
        Special:      [223, 75, 60],
    },

    Miniquest: 
    {
        Novice:       [273, 35, 80],
        Intermediate: [273, 45, 75],
        Experienced:  [273, 55, 70],
        Master:       [273, 65, 65],
        Grandmaster:  [273, 85, 65]
    },

    Diary:     
    {
        Easy:     [143, 40, 70],
        Medium:   [143, 50, 60],
        Hard:     [143, 60, 50],
        Elite:    [143, 70, 40]
    },

    Resource:
    {
        I:   [35, 35, 80],
        II:  [35, 45, 75],
        III: [35, 55, 70],
        IV:  [35, 65, 65],
        V:   [35, 75, 60],
        VI:  [35, 85, 55],
        VII: [35, 95, 50]
    },
}


window.resourceTileData = [
    // Fauna
    {
        "name": "Fauna",
        "caption": "Fauna tiles allow one to trap animals and creatures using Hunter and cook, craft with, or otherwise process their remains.",
        "clarifications": ["Requisite Woodwork unlocks are required to fashion traps from logs"],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [130, 92, 92, 92, 116, 116, 116, 108],
        "rows": 
        [
            [
                "Bird Snare",
                "Crimson swift",
                "Golden warbler",
                "Copper longtail",
                "Cerullian twitch",
                "Tropical wagtail",
                "",
                ""
            ],
            [
                "Birdhouse",
                "Regular",
                "Oak",
                "Willow, Teak",
                "Maple, Mahogany",
                "Yew",
                "Magic",
                "Redwood"
            ],
            [
                "Box Trap",
                "",
                "Ferret",
                "Jerboa",
                "Gray chinchompa",
                "Red chinchompa",
                "Black chinchompa",
                ""
            ],
            [
                "Implings",
                "Baby",
                "Young, Gourmet",
                "Earth, \nEssence",
                "Eclectic, Nature",
                "Ninja, \nMagpie",
                "Crystal, Dragon",
                "Lucky"
            ],
            [
                "Butterflies",
                "",
                "Ruby harvest",
                "Sapphire glacialis",
                "Snowy \nkight",
                "Black warlock",
                "Sunlight moth",
                "Moonlight moth"
            ],
            [
                "Bats",
                "",
                "Guanic",
                "Prael",
                "Giral",
                "Phluxia",
                "Murng",
                "Psykk"
            ],
            [
                "Deadfall",
                "",
                "Wild kebbit",
                "Barb-tailed kebbit",
                "Prickly kebbit",
                "Sabre-toothed kebbit",
                "Pyre fox",
                "Maniacal monkey"
            ],
            [
                "Falconry",
                "",
                "",
                "",
                "Spotted kebbit",
                "Dark kebbit",
                "Dashing kebbit",
                ""
            ],
            [
                "Net Trap",
                "",
                "Swamp lizard",
                "",
                "Orange salamander",
                "Red salamander",
                "Black salamander",
                "Tecu salamander"
            ],
            [
                "Pitfall",
                "",
                "",
                "Spined larupia",
                "Horned graahk",
                "Sabre-toothed kyatt",
                "Sunlight antelope",
                "Moonlight antelope"
            ],
            [
                "Tracking",
                "Polar kebbit",
                "Common kebbit",
                "Feldip \nweasel",
                "Desert \ndevil",
                "Razor-backed kebbit",
                "",
                "Herbiboar"
            ],
            [
                "Crabs",
                "",
                "Red",
                "",
                "Blue",
                "",
                "Rainbow",
                ""
            ],
            [
                "Other",
                "",
                "Rabbit",
                "",
                "",
                "Goat pit",
                "Imp",
                "Stymphike"
            ],
            [
                "# of traps",
                "1",
                "",
                "2",
                "3",
                "4",
                "",
                "5"
            ],
        ]
    },

    // Fish
    {
        "name": "Fish",
        "caption": "Fish tiles allow one to catch, cook, and process the remains of fish.",
        "clarifications": [],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [130, 116, 100, 92, 124, 116, 108, 100],
        "rows": 
        [
            [
                "Small Net",
                "Shrimp, Anchovies, Karambwanji",
                "",
                "Frog spawn",
                "",
                "Monkfish",
                "Minnows",
                ""
            ],
            [
                "Big Net",
                "",
                "Mackerel, Cod, Bream, Bass",
                "",
                "",
                "",
                "Leechfin",
                ""
            ],
            [
                "Fishing rod",
                "Sardine, Herring",
                "Pike",
                "Slimy eel, Cave eel",
                "",
                "",
                "",
                "Anglerfish, Sacred eel"
            ],
            [
                "Fly fishing",
                "",
                "Trout, Salmon",
                "",
                "",
                "",
                "",
                ""
            ],
            [
                "Oily rod",
                "",
                "",
                "",
                "Lava eel",
                "",
                "",
                "Infernal eel"
            ],
            [
                "Harpoon",
                "",
                "",
                "Tuna, Swordfish",
                "Harpoonfish",
                "Swordtip, Jumbo squid",
                "Shark",
                ""
            ],
            [
                "Cage",
                "",
                "",
                "Lobster",
                "",
                "",
                "",
                "Dark crab"
            ],
            [
                "Trawling",
                "",
                "",
                "",
                "",
                "Shallow",
                "Moderate",
                "Deep"
            ],
            [
                "Other",
                "",
                "Camdozaal fish",
                "",
                "Aerial fishing, Drift net",
                "Barbarian",
                "Karambwan",
                ""
            ]
        ]
    },

    // Flora
    {
        "name": "Flora",
        "caption": "Flora tiles allow one to farm and harvest crops as well as cook, make potions with, or otherwise process them.",
        "clarifications": 
        [
            "Unlocked flora may be picked freely across Gielinor", 
            "Wheat may be picked and processed at tier I"
        ],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [130, 92, 120, 92, 108, 116, 108, 108],
        "rows": 
        [
            [
                "Allotment",
                "Potato, Onion",
                "Cabbage, Tomato",
                "Sweetcorn, Strawberry",
                "Watermelon",
                "Snape grass",
                "",
                ""
            ],
            [
                "Flowers",
                "Marigold",
                "Rosemary",
                "Nasturtium",
                "Woad",
                "Limpwurt",
                "White lily",
                ""
            ],
            [
                "Herbs",
                "Guam, Marrentil",
                "Tarromin, Harralander",
                "Ranarr, Toadflax",
                "Irit, Avantoe",
                "Kwuarm, Snapdragon, Huasca",
                "Cadantine, Lantadyme",
                "Dwarf weed, Torstol"
            ],
            [
                "Hops",
                "Barley",
                "Hammerstone, Asgarnian",
                "Jute, Flax",
                "Yanillian, Krandorian",
                "Wildblood, Hemp",
                "Cotton",
                ""
            ],
            [
                "Berries",
                "Red",
                "Cadava",
                "Dwell",
                "Janger",
                "White",
                "Poison Ivy",
                ""
            ],
            [
                "Trees",
                "",
                "Oak",
                "Willow",
                "Maple",
                "Yew",
                "Magic",
                "Redwood"
            ],
            [
                "Hardwood",
                "",
                "",
                "Teak",
                "Mahogany",
                "Camphor",
                "Ironwood",
                "Rosewood"
            ],
            [
                "Fruit trees",
                "",
                "Apple",
                "Orange, Banana",
                "Curry",
                "Pineapple, Papaya",
                "Palm",
                "Dragonfruit"
            ],
            [
                "Other trees",
                "",
                "",
                "",
                "",
                "Hespori, Calquat",
                "Crystal tree",
                "Spirit tree, Celastrus"
            ],
            [
                "Coral",
                "",
                "Elkhorn",
                "",
                "Pillar",
                "",
                "Umbral",
                ""
            ],
            [
                "Special",
                "",
                "Giant seaweed",
                "Grapes",
                "Mushroom, Starflower",
                "Belladonna",
                "Anima",
                ""
            ],
            [
                "Sorcerer’s Garden",
                "",
                "Winter \nherbs",
                "",
                "Spring \n herbs",
                "",
                "Autumn \nherbs",
                "Summer \nherbs"
            ],
            [
                "Tithe Farm",
                "",
                "Golovanova",
                "",
                "Bologanova",
                "",
                "Logovanova",
                ""
            ]
        ]
    },

    // Homestead
    {
        "name": "Homestead",
        "caption": "Homestead tiles allow one to use construction materials to build and repair items in the game, as well as move and decorate their player owned house.",
        "clarifications":
        [
            "Outside of STASH units, any object may be built or repaired once the required planks and nails have been unlocked",
            "A player owned house may not be bought - only received as a reward from Daddy's Home",
            "Homestead unlocks are not required for shipbuilding"
        ],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [130, 108, 92, 108, 108, 92, 116, 116],
        "rows": 
        [
            [
                "Planks",
                "Regular",
                "Oak",
                "Teak",
                "Mahogany",
                "Camphor",
                "Ironwood",
                "Rosewood"
            ],
            [
                "Nails",
                "Bronze",
                "Iron",
                "Steel",
                "Mithril",
                "Adamant",
                "Rune",
                "Dragon"
            ],
            [
                "Locations / house style",
                "Rimmington",
                "Taverley",
                "Pollnivneach, Hosidius",
                "Rellekka, Aldarin",
                "Brimhaven",
                "Yanille",
                "Prifddinas"
            ],
            [
                "Rooms",
                "Parlour, Garden, Kitchen",
                "Dining room, Workshop, Bedroom",
                "Skill hall, League hall, Games room",
                "Combat room, Quest hall, Menagerie",
                "Study, Costume room, Chapel",
                "Portal chamber, Formal garden, Throne room",
                "Superior garden, Portal nexus, Achievement gallery"
            ],
            [
                "Mahogany Homes",
                "Beginner",
                "Novice",
                "",
                "Adept",
                "",
                "Expert",
                ""
            ],
            [
                "Servants",
                "",
                "Rick",
                "Maid",
                "Cook",
                "Butler",
                "Demon Butler",
                ""
            ],
            [
                "STASH units",
                "",
                "Beginner",
                "Easy",
                "Medium",
                "Hard",
                "Elite",
                "Master"
            ],
            [
                "House size \n (with yard)",
                "3x3 \n (5x5)",
                "4x4 \n (6x6)",
                "5x5 \n (7x7)",
                "6x6 \n (8x8)",
                "7x7 \n (9x9)",
                "Basement",
                ""
            ],
        ]
    },

    // Metallurgy
    {
        "name": "Metallurgy",
        "caption": "Metallurgy tiles allow one to mine, smelt, smith, craft with, or otherwise process any materials gained using Mining.",
        "clarifications": ["Metallurgy unlocks are not required for Construction, Runecrafting, or shipbuilding"],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [130, 92, 92, 92, 92, 92, 116, 92],
        "rows": 
        [
            [
                "Primary",
                "Copper, blurite",
                "Iron",
                "",
                "Mithril",
                "Lovakite",
                "Adamantite",
                "Runite"
            ],
            [
                "Secondary",
                "Tin",
                "Silver",
                "Coal, Lead",
                "Gold",
                "",
                "Nickel",
                ""
            ],
            [
                "Other",
                "Stardust",
                "Barronite",
                "Pay-dirt",
                "Sunstone",
                "Lunar",
                "",
                "Infernal shale"
            ],
            [
                "Deposits",
                "Saltpetre",
                "Ash pile",
                "Calcified",
                "Volcanic sulphur",
                "Rubium splinters",
                "Rubium, geodes, Salts",
                ""
            ],
            [
                "Unrefined",
                "Clay",
                "Limestone",
                "Sandstone",
                "Gem rocks",
                "Granite",
                "Soft clay",
                "Amethyst"
            ],
            [
                "Gems",
                "Opal",
                "Jade, Sapphire",
                "Red topaz, Emerald",
                "Ruby",
                "Diamond",
                "Dragonstone",
                "Onyx, Zenyte"
            ],
            [
                "Essence",
                "Rune essence, Pure essence",
                "Daeyalt ore",
                "Dense essence",
                "",
                "Daeyalt shards",
                "Runic extracts",
                "Ancient essence"
            ],
            [
                "Pickaxe",
                "Bronze",
                "Iron",
                "Steel",
                "Mithril",
                "Adamant",
                "Rune",
                "Dragon"
            ]
        ]
    },

    // Mischief
    {
        "name": "Mischief",
        "caption": "Mischief tiles unlocks access to Thieving",
        "clarifications": ["Requisite Flora tiles must be unlocked to steal herbs from Sorceress's Garden"],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [116, 108, 108, 92, 100, 116, 108, 116],
        "rows": 
        [
            [
                "Pickpocket \n(civilians)",
                "Men, Women",
                "Villagers",
                "Cave Goblins",
                "Fremennik Citizens",
                "Wealthy Citizens",
                "Gnomes",
                "Vyre, Elves"
            ],
            [
                "Pickpocket (warriors)",
                "",
                "Warriors",
                "Guards",
                "Knights",
                "Yanille Watchmen",
                "Paladin",
                "Hero"
            ],
            [
                "Pickpocket \n(bandits)",
                "",
                "H.A.M Members",
                "Rogues",
                "Pollnivnian, Desert bandits",
                "Pirates",
                "Menaphite",
                ""
            ],
            [
                "Pickpocket \n(craftspeople)",
                "Farmers",
                "Digsite Workers",
                "Master Farmers",
                "",
                "",
                "",
                "Tzhaar-Hur"
            ],
            [
                "Stalls",
                "Vegetable, Bakery, Tea, Crafting, Monkey",
                "Silk, Wine, Fruit, Seed",
                "Fur, Fish",
                "Crossbow, Silver",
                "Spice, Magic, Scimitar",
                "Gem",
                "Cannonball, Ore"
            ],
            [
                "Chests",
                "Underwater, 10-coin",
                "Nature rune, Isle of Souls",
                "Rusty pirate, Aldarin villas",
                "50-coin, Steel arrowtips",
                "Tarnished pirate, Dorgesh-kaan average, \nBlood rune",
                "Stone, \nArdougne castle",
                "Reinforced pirate, Dorgesh-kaan rich, Rogue’s castle"
            ],
            [
                "Doors",
                "10-coin chest, H.A.M",
                "Ross’s house, Nature rune chest",
                "Magic axe hut door, Ardougne sewers",
                "Pirates’ hideout, Chaos druid",
                "Underground pass gate, Ancient gate",
                "Grubby door, Ardougne castle door",
                "Yanille dungeon"
            ],
            [
                "Other",
                "",
                "Cowbells, Candles",
                "",
                "Goblin wire, Artefacts",
                "Wall safes, Valuables",
                "",
                ""
            ],
            [
                "Pyramid Plunder",
                "Room I",
                "Room II",
                "Room III",
                "Room IV",
                "Room V",
                "Room VI",
                "Rooms VII, VIII"
            ],
            [
                "Sorceress’s Garden",
                "Winter",
                "",
                "Spring",
                "",
                "Autumn",
                "",
                "Summer"
            ]
        ]
    },

    // Mortis
    {
        "name": "Mortis",
        "caption": "Unlocking mortis tiles allow one to process the remains of the dead.",
        "clarifications": 
        [
            "Players' bones cannot be buried",
            "The Chaos Altar can only be used to bury bones gained in the Wilderness",
            "Reanimated beings can only be killed on task",
            "(reanimated giants, horrors, demons, and dragons do not count towards slayer tasks)",
            "Mortis unlocks are not required to offer Camdozaal fish to the mysterious altar",
            "Only tier I is required for Rag and Bone Man quests"
        ],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [130, 92, 92, 108, 108, 92, 92, 92],
        "rows": 
        [
            [
                "Bones",
                "Regular",
                "Big",
                "Bull",
                "Giant",
                "",
                "Dagannoth",
                ""
            ],
            [
                "Ogre",
                "",
                "Jogre",
                "Zogre",
                "",
                "Fayrg",
                "Raurg",
                "Ourg"
            ],
            [
                "Draconic",
                "",
                "Wyrmling",
                "Wyrm",
                "Strykewyrm",
                "Wyvern",
                "Drake",
                "Hydra"
            ],
            [
                "Dragon",
                "",
                "",
                "Babydragon",
                "Dragon",
                "Lava Dragon",
                "Frost Dragon",
                "Superior"
            ],
            [
                "Ashes",
                "",
                "Fiendish",
                "Vile",
                "",
                "Malicious",
                "Abyssal",
                "Infernal"
            ],
            [
                "Shades",
                "",
                "Loar",
                "Phrin",
                "Riyl",
                "Asyn",
                "Fiyr",
                "Urium"
            ],
            [
                "Reanimation",
                "",
                "Basic",
                "",
                "Adept",
                "",
                "Expert",
                "Master"
            ],
            [
                "Tanning",
                "Leather",
                "Hard leather",
                "Snakeskin",
                "Green d’hide",
                "Blue d’hide",
                "Red d’hide",
                "Black d’hide"
            ],
        ]
    },

    // Runic
    {
        "name": "Runic",
        "caption": "Unlocking Runic tiles enables one to craft runes and cast spells.",
        "clarifications":
        [
            "Runic unlocks are not required to cast combat spells",
            "Non-combat spells cannot be cast until all their required runes have been unlocked",
            "Access to crafting combination runes is granted once each constituent rune is unlocked"
        ],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [116, 92, 92, 92, 92, 92, 92, 92],
        "rows": [
            [
                "Elemental",
                "Air",
                "Water",
                "Earth",
                "Fire",
                "Sunfire",
                "",
                ""
            ],
            [
                "Catalytic",
                "Mind",
                "",
                "Chaos",
                "",
                "Death",
                "Blood",
                "Wrath"
            ],
            [
                "Utility",
                "Body",
                "Cosmic",
                "Nature",
                "Law",
                "Astral",
                "Soul",
                "Aether"
            ],
            [
                "Extracts",
                "",
                "",
                "",
                "Warped",
                "Twisted",
                "Mangled",
                "Scarred"
            ],
            [
                "Areanas",
                "",
                "",
                "",
                "Mage training arena",
                "Mage arena I",
                "Mage arena II",
                ""
            ]
        ]
    },

    // Seastead
    {
        "name": "Seastead",
        "caption": "Unlocking Seasted tiles enables one to upgrade their boat and gather resources via Sailing.",
        "clarifications": 
        [ 
            "Ship metal means keel, cannon, and salvaging hook",
            "Ship wood means mast and cargo; lost crates can always be looted",
            "Homestead unlocks are not required for shipbuilding"
        ],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [130, 92, 108, 116, 116, 116, 116, 116],
        "rows": [
            [
                "Ship",
                "Raft",
                "",
                "Skiff",
                "",
                "Sloop",
                "",
                ""
            ],
            [
                "Seacharting",
                "Generic, Spyglass",
                "Crates",
                "Current",
                "Diving",
                "",
                "Weather",
                ""
            ],
            [
                "Salvaging",
                "Small shipwreck",
                "Fisherman’s",
                "Barracuda",
                "Large",
                "Pirate",
                "Mercenary",
                "Fremennik, Merchant"
            ],
            [
                "Caskets",
                "",
                "Beginner",
                "Easy",
                "Medium",
                "Hard",
                "Elite",
                "Master"
            ],
            [
                "Barracuda Trials",
                "",
                "",
                "Tempor Tantrum",
                "",
                "Jubbly Jive",
                "",
                "Gwenith Glide"
            ],
            [
                "Ship metal",
                "Bronze",
                "Iron",
                "Steel",
                "Mithril",
                "Adamant",
                "Rune",
                "Dragon"
            ],
            [
                "Ship wood",
                "Regular",
                "Oak",
                "Teak",
                "Mahogany",
                "Camphor",
                "Ironwood",
                "Rosewood"
            ],
            [
                "Stations",
                "Range",
                "Keg",
                "Innoculation station, Salvaging station",
                "Chum station",
                "Advanced chum station, Bosun's workbench",
                "Chum spreader",
                ""
            ],
            [
                "Trawling net",
                "",
                "",
                "",
                "Rope",
                "Linen",
                "Hemp",
                "Cotton"
            ],
            [
                "Wind",
                "",
                "",
                "",
                "Wind catcher",
                "Crystal extractor",
                "Gale catcher",
                ""
            ],
            [
                "Crewmates",
                "",
                "",
                "Jobless Jim, Ex-Captain Siad",
                "Adventurer Ada, Cabin Boy Jenkins",
                "Oarswoman Olga, \nJittery Jim",
                "Bosun Zarah, Jolly Jim",
                "Spotter Virginia, Sailor Jakob"
            ],
            [
                "Crew size",
                "",
                "",
                "1",
                "2",
                "3",
                "4",
                "5"
            ],
            [
                "Port tasks",
                "1",
                "2",
                "3",
                "",
                "4",
                "",
                "5"
            ],
            [
                "Ships",
                "1",
                "2",
                "",
                "3",
                "",
                "4",
                "5"
            ]
        ]
    },

    // Swiftness
    {
        "name": "Swiftness",
        "caption": "Swiftness unlocks affords one access to Agility courses and shortcuts, as well as the graceful outfit.",
        "clarifications": ["Jutting wall shortcut (cosmic altar) count as cracks/crevices, not walls"],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [130, 116, 116, 116, 92, 92, 116, 92],
        "rows": 
        [
            [
                "Rooftop courses",
                "Draynor Village",
                "Al Kharid, Varrock",
                "Canifis",
                "Falador",
                "Seers’ VIllage",
                "Pollnivneach",
                "Relleka, Ardougne"
            ],
            [
                "Regular courses",
                "Gnome Stronghold, Shayzien I",
                "Barbarian",
                "Penguin, Shayzien II",
                "Ape Atoll, Colossal Wyrm",
                "Colossal Wyrm II",
                "Wilderness",
                "Prifddnas"
            ],
            [
                "Special courses",
                "",
                "Pyramid",
                "Brimhaven",
                "",
                "Hallowed Sepulchre",
                "Werewolf",
                "Dorgesh-Kaan"
            ],
            [
                "Graceful pieces",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                ""
            ],
            [
                "Shortcuts",
                "Stones",
                "Rocks, Monkey bars",
                "Walls, Windows, Railings, Fences, Logs",
                "Tunnels, Holes, Caves, Grapple",
                "Cracks, Crevices",
                "Pipes, Strange floor",
                "Pillars, Ropes, Vines, Chains"
            ]
        ]
    },

    // Woodwork
    {
        "name": "Woodwork",
        "caption": "Woodwork tiles enable one to chop trees and fletch, light, craft, make planks from, or otherwise process their logs.",
        "clarifications": 
        [
            "Woodwork unlocks are not required to harvest logs from felled ents",
            "Woodwork unlocks are not required to fuel hot air balloons"
        ],
        "headers": ["", "I", "II", "III", "IV", "V", "VI", "VII"],
        "columnWidths": [130, 92, 76, 92, 116, 108, 108, 92],
        "rows": 
        [
            [
                "Standard trees",
                "Regular",
                "Oak",
                "Willow",
                "Maple",
                "Yew",
                "Magic",
                "Redwood"
            ],
            [
                "Hardwood trees",
                "",
                "",
                "Teak",
                "Mahogany",
                "Camphor",
                "Ironwood",
                "Rosewood"
            ],

            [
                "Special trees",
                "Achey",
                "",
                "Jatoba",
                "Arctic Pine",
                "Blisterwood",
                "Bloodwood",
                ""
            ],
            [
                "Other",
                "Charcoal",
                "Light jungle",
                "Medium jungle",
                "Dense jungle, Hollow bark",
                "Sulliuscep, Bruma",
                "",
                ""
            ],
            [
                "Sawmill",
                "Regular",
                "Oak",
                "Teak",
                "Mahogany",
                "Camphor",
                "Ironwood",
                "Rosewood"
            ],
            [
                "Axe",
                "Bronze",
                "Iron",
                "Steel",
                "Mithril",
                "Adamant",
                "Rune",
                "Dragon"
            ]
        ]
    }
];

// Store all mutables in state
window.state = {

    slayerMasters : 
    [
        // Turael
        {
        name: "Turael",
        combat: "None!",
        slayer: null,
        quest: null,
        complete: false,
        tasks: 
        [
            { name: "Banshees", combat: 20, slayer: 15, quest: 54, complete: false },
            { name: "Bats", combat: 5, slayer: null, quest: null, complete: false },
            { name: "Bears", combat: 13, slayer: null, quest: null, complete: false },
            { name: "Birds", combat: null, slayer: null, quest: null, complete: false },
            { name: "Cave bugs", combat: 7, slayer: 7, quest: null, complete: false },
            { name: "Cave crawlers", combat: 10, slayer: 10, quest: null, complete: false },
            { name: "Cave slime", combat: 15, slayer: 17, quest: null, complete: false },
            { name: "Cows", combat: null, slayer: null, quest: null, complete: false },
            { name: "Crawling hands", combat: null, slayer: 5, quest: 54, complete: false },
            { name: "Dogs", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Dwarves", combat: 6, slayer: null, quest: null, complete: false },
            { name: "Ghosts", combat: 13, slayer: null, quest: null, complete: false },
            { name: "Goblins", combat: null, slayer: null, quest: null, complete: false },
            { name: "Icefiends", combat: 20, slayer: null, quest: null, complete: false },
            { name: "Kalphites", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Lizards", combat: 22, slayer: 22, quest: null, complete: false },
            { name: "Minotaurs", combat: 7, slayer: null, quest: null, complete: false },
            { name: "Monkeys", combat: null, slayer: null, quest: null, complete: false },
            { name: "Rats", combat: null, slayer: null, quest: null, complete: false },
            { name: "Scorpions", combat: 7, slayer: null, quest: null, complete: false },
            { name: "Skeletons", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Spiders", combat: null, slayer: null, quest: null, complete: false },
            { name: "Wolves", combat: 20, slayer: null, quest: null, complete: false },
            { name: "Zombies", combat: 10, slayer: null, quest: null, complete: false }
        ]
        },

        // Spria
        {
        name: "Spria",
        combat: null,
        slayer: null,
        quest: 146,
        complete: false,
        tasks: 
        [
            { name: "Banshees", combat: 20, slayer: 15, quest: 54, complete: false },
            { name: "Bats", combat: 5, slayer: null, quest: null, complete: false },
            { name: "Bears", combat: 13, slayer: null, quest: null, complete: false },
            { name: "Birds", combat: null, slayer: null, quest: null, complete: false },
            { name: "Cave bugs", combat: 7, slayer: 7, quest: null, complete: false },
            { name: "Cave crawlers", combat: 10, slayer: 10, quest: null, complete: false },
            { name: "Cave slime", combat: 15, slayer: 17, quest: null, complete: false },
            { name: "Cows", combat: null, slayer: null, quest: null, complete: false },
            { name: "Crawling hands", combat: null, slayer: 5, quest: 54, complete: false },
            { name: "Dogs", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Dwarves", combat: 6, slayer: null, quest: null, complete: false },
            { name: "Ghosts", combat: 13, slayer: null, quest: null, complete: false },
            { name: "Goblins", combat: null, slayer: null, quest: null, complete: false },
            { name: "Icefiends", combat: 20, slayer: null, quest: null, complete: false },
            { name: "Kalphites", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Lizards", combat: 22, slayer: 22, quest: null, complete: false },
            { name: "Minotaurs", combat: 7, slayer: null, quest: null, complete: false },
            { name: "Monkeys", combat: null, slayer: null, quest: null, complete: false },
            { name: "Rats", combat: null, slayer: null, quest: null, complete: false },
            { name: "Scorpions", combat: 7, slayer: null, quest: null, complete: false },
            { name: "Skeletons", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Sourhogs", combat: null, slayer: null, quest: null, complete: false },
            { name: "Spiders", combat: null, slayer: null, quest: null, complete: false },
            { name: "Wolves", combat: 20, slayer: null, quest: null, complete: false },
            { name: "Zombies", combat: 10, slayer: null, quest: null, complete: false }
        ]
        },

        // Krystilia
        {
        name: "Krystilia",
        combat: "None!",
        slayer: null,
        quest: null,
        complete: false,
        tasks:
        [
            { name: "Abyssal demons", combat: null, slayer: 85, quest: null, complete: false },
            { name: "Ankou", combat: null, slayer: null, quest: null, complete: false },
            { name: "Aviansie", combat: null, slayer: null, quest: null, complete: false },
            { name: "Bandits", combat: null, slayer: null, quest: null, complete: false },
            { name: "Bears", combat: null, slayer: null, quest: null, complete: false },
            { name: "Black demons", combat: null, slayer: null, quest: null, complete: false },
            { name: "Black dragons", combat: null, slayer: null, quest: null, complete: false },
            { name: "Black knights", combat: null, slayer: null, quest: null, complete: false },
            { name: "Bloodveld", combat: null, slayer: 50, quest: null, complete: false },
            { name: "Boss", combat: null, slayer: null, quest: null, complete: false },
            { name: "Chaos druids", combat: null, slayer: null, quest: null, complete: false },
            { name: "Dark warriors", combat: null, slayer: null, quest: null, complete: false },
            { name: "Dust devils", combat: null, slayer: 65, quest: null, complete: false },
            { name: "Earth warriors", combat: null, slayer: null, quest: null, complete: false },
            { name: "Ents", combat: null, slayer: null, quest: null, complete: false },
            { name: "Fire giants", combat: null, slayer: null, quest: null, complete: false },
            { name: "Greater demons", combat: null, slayer: null, quest: null, complete: false },
            { name: "Green dragons", combat: null, slayer: null, quest: null, complete: false },
            { name: "Hellhounds", combat: null, slayer: null, quest: null, complete: false },
            { name: "Hill giants", combat: null, slayer: null, quest: null, complete: false },
            { name: "Ice giants", combat: null, slayer: null, quest: null, complete: false },
            { name: "Ice warriors", combat: null, slayer: null, quest: null, complete: false },
            { name: "Jellies", combat: null, slayer: 52, quest: null, complete: false },
            { name: "Lava dragons", combat: null, slayer: null, quest: null, complete: false },
            { name: "Lesser demons", combat: null, slayer: null, quest: null, complete: false },
            { name: "Magic axes", combat: null, slayer: null, quest: null, complete: false },
            { name: "Mammoths", combat: null, slayer: null, quest: null, complete: false },
            { name: "Moss giants", combat: null, slayer: null, quest: null, complete: false },
            { name: "Nechryael", combat: null, slayer: 80, quest: null, complete: false },
            { name: "Pirates", combat: null, slayer: null, quest: null, complete: false },
            { name: "Revenants", combat: null, slayer: null, quest: null, complete: false },
            { name: "Rogues", combat: null, slayer: null, quest: null, complete: false },
            { name: "Scorpions", combat: null, slayer: null, quest: null, complete: false },
            { name: "Skeletons", combat: null, slayer: null, quest: null, complete: false },
            { name: "Spiders", combat: null, slayer: null, quest: null, complete: false },
            { name: "Spiritual creatures", combat: null, slayer: 63, quest: null, complete: false },
            { name: "Zombies", combat: null, slayer: null, quest: null, complete: false }
        ]
        },

        // Mazchna
        {
        name: "Mazchna",
        combat: 20,
        slayer: null,
        quest: 54,
        complete: false,
        tasks: 
        [
            { name: "Banshees", combat: 20, slayer: 15, quest: null, complete: false },
            { name: "Bats", combat: 5, slayer: null, quest: null, complete: false },
            { name: "Bears", combat: 13, slayer: null, quest: null, complete: false },
            { name: "Catablepon", combat: 35, slayer: null, quest: null, complete: false },
            { name: "Cave bugs", combat: null, slayer: 7, quest: null, complete: false },
            { name: "Cave crawlers", combat: 10, slayer: 10, quest: null, complete: false },
            { name: "Cave slime", combat: 15, slayer: 17, quest: null, complete: false },
            { name: "Cockatrice", combat: 25, slayer: 25, quest: null, complete: false },
            { name: "Crabs", combat: null, slayer: null, quest: null, complete: false },
            { name: "Crawling hands", combat: null, slayer: 5, quest: null, complete: false },
            { name: "Dogs", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Flesh crawlers", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Ghosts", combat: 13, slayer: null, quest: null, complete: false },
            { name: "Ghouls", combat: 25, slayer: null, quest: null, complete: false },
            { name: "Hill giants", combat: 25, slayer: null, quest: null, complete: false },
            { name: "Hobgoblins", combat: 20, slayer: null, quest: null, complete: false },
            { name: "Ice warriors", combat: 45, slayer: null, quest: null, complete: false },
            { name: "Kalphites", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Killerwatts", combat: 50, slayer: 37, quest: 7, complete: false },
            { name: "Lizards", combat: null, slayer: 22, quest: null, complete: false },
            { name: "Mogres", combat: 30, slayer: 32, quest: 198, complete: false },
            { name: "Pyrefiends", combat: 25, slayer: 30, quest: null, complete: false },
            { name: "Rockslugs", combat: 20, slayer: 20, quest: null, complete: false },
            { name: "Scorpions", combat: 7, slayer: null, quest: null, complete: false },
            { name: "Shades", combat: 30, slayer: null, quest: null, complete: false },
            { name: "Skeletons", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Vampyres", combat: 35, slayer: null, quest: null, complete: false },
            { name: "Venators", combat: null, slayer: 75, quest: 180, complete: false },
            { name: "Wall beasts", combat: 30, slayer: 35, quest: null, complete: false },
            { name: "Wolves", combat: 20, slayer: null, quest: null, complete: false },
            { name: "Zombies", combat: 10, slayer: null, quest: null, complete: false },
        ]
        },

        // Vannaka
        {
        name: "Vannaka",
        combat: 40,
        slayer: null,
        quest: null,
        complete: false,
        tasks: 
        [
            { name: "Aberrant spectres", combat: 65, slayer: 60, quest: 54, complete: false },
            { name: "Abyssal demons", combat: 85, slayer: 85, quest: "54 or 107", complete: false },
            { name: "Ankou", combat: 40, slayer: null, quest: null, complete: false },
            { name: "Basilisks", combat: 40, slayer: 40, quest: null, complete: false },
            { name: "Bloodvelds", combat: 50, slayer: 50, quest: 54, complete: false },
            { name: "Blue dragons", combat: 65, slayer: null, quest: 17, complete: false },
            { name: "Brine rats", combat: 45, slayer: 47, quest: 123, complete: false },
            { name: "Cockatrice", combat: 25, slayer: 25, quest: null, complete: false },
            { name: "Crabs", combat: null, slayer: null, quest: null, complete: false },
            { name: "Crocodiles", combat: 50, slayer: null, quest: null, complete: false },
            { name: "Dagannoth", combat: 75, slayer: null, quest: 63, complete: false },
            { name: "Dust devils", combat: 70, slayer: 65, quest: 77, complete: false },
            { name: "Elves", combat: 70, slayer: null, quest: 59, complete: false },
            { name: "Fever spiders", combat: 40, slayer: 42, quest: 90, complete: false },
            { name: "Fire giants", combat: 65, slayer: null, quest: null, complete: false },
            { name: "Gargoyles", combat: 80, slayer: 75, quest: 54, complete: false },
            { name: "Ghouls", combat: 25, slayer: null, quest: 54, complete: false },
            { name: "Gryphons", combat: null, slayer: 51, quest: 177, complete: false },
            { name: "Harpie bug swarms", combat: 45, slayer: 33, quest: null, complete: false },
            { name: "Hellhounds", combat: 75, slayer: null, quest: null, complete: false },
            { name: "Hill giants", combat: 25, slayer: null, quest: null, complete: false },
            { name: "Hobgoblins", combat: 20, slayer: null, quest: null, complete: false },
            { name: "Ice giants", combat: 50, slayer: null, quest: null, complete: false },
            { name: "Ice warriors", combat: 45, slayer: null, quest: null, complete: false },
            { name: "Infernal mages", combat: 40, slayer: 45, quest: 54, complete: false },
            { name: "Jellies", combat: 57, slayer: 52, quest: null, complete: false },
            { name: "Jungle horrors", combat: 65, slayer: null, quest: 98, complete: false },
            { name: "Kalphite", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Kurask", combat: 65, slayer: 70, quest: null, complete: false },
            { name: "Lesser demons", combat: 60, slayer: null, quest: null, complete: false },
            { name: "Mogres", combat: 30, slayer: 32, quest: 198, complete: false },
            { name: "Molanisks", combat: 50, slayer: 39, quest: null, complete: false },
            { name: "Moss giants", combat: 40, slayer: null, quest: null, complete: false },
            { name: "Nechryael", combat: 85, slayer: 80, quest: 54, complete: false },
            { name: "Ogres", combat: 40, slayer: null, quest: null, complete: false },
            { name: "Otherworldly beings", combat: 40, slayer: null, quest: 19, complete: false },
            { name: "Pyrefiends", combat: 25, slayer: 30, quest: null, complete: false },
            { name: "Sea snakes", combat: 50, slayer: 40, quest: 105, complete: false },
            { name: "Shades", combat: 30, slayer: null, quest: null, complete: false },
            { name: "Shadow warriors", combat: 60, slayer: null, quest: 50, complete: false },
            { name: "Spiritual creatures", combat: 60, slayer: 63, quest: 56, complete: false },
            { name: "Terror dogs", combat: 60, slayer: 40, quest: 66, complete: false },
            { name: "Trolls", combat: 60, slayer: null, quest: null, complete: false },
            { name: "Turoth", combat: 60, slayer: 55, quest: null, complete: false },
            { name: "Vampyres", combat: 35, slayer: null, quest: 54, complete: false },
            { name: "Venators", combat: null, slayer: 75, quest: 180, complete: false },
            { name: "Werewolves", combat: 60, slayer: null, quest: 54, complete: false },
        ]
        },

        // Chaeldar
        {
        name: "Chaeldar",
        combat: 70,
        slayer: null,
        quest: 19,
        complete: false,
        tasks:
        [
            { name: "Aberrant spectres", combat: 65, slayer: 60, quest: 54, complete: false },
            { name: "Abyssal demons", combat: 85, slayer: 85, quest: "54 or 107", complete: false },
            { name: "Aviansie", combat: null, slayer: null, quest: 56, complete: false },
            { name: "Basilisks", combat: 40, slayer: 40, quest: null, complete: false },
            { name: "Black demons", combat: 80, slayer: null, quest: null, complete: false },
            { name: "Bloodveld", combat: 50, slayer: 50, quest: 54, complete: false },
            { name: "Blue dragons", combat: 65, slayer: null, quest: 17, complete: false },
            { name: "Brine rats", combat: 45, slayer: 47, quest: 123, complete: false },
            { name: "Cave horrors", combat: 85, slayer: 58, quest: 98, complete: false },
            { name: "Cave kraken", combat: 80, slayer: 87, quest: null, complete: false },
            { name: "Crabs", combat: null, slayer: null, quest: null, complete: false },
            { name: "Custodian stalker", combat: null, slayer: 54, quest: 172, complete: false },
            { name: "Dagannoth", combat: 75, slayer: null, quest: 63, complete: false },
            { name: "Dust devils", combat: 70, slayer: 65, quest: 77, complete: false },
            { name: "Elves", combat: 70, slayer: null, quest: 59, complete: false },
            { name: "Fever spiders", combat: 40, slayer: 42, quest: 90, complete: false },
            { name: "Fire giants", combat: 65, slayer: null, quest: null, complete: false },
            { name: "Fossil Island wyverns", combat: 60, slayer: 66, quest: "132 and 53", complete: false },
            { name: "Gargoyles", combat: 80, slayer: 75, quest: 54, complete: false },
            { name: "Greater demons", combat: 70, slayer: null, quest: null, complete: false },
            { name: "Gryphons", combat: null, slayer: 51, quest: 177, complete: false },
            { name: "Hellhounds", combat: 75, slayer: null, quest: null, complete: false },
            { name: "Jellies", combat: 57, slayer: 52, quest: null, complete: false },
            { name: "Jungle horrors", combat: 65, slayer: null, quest: 98, complete: false },
            { name: "Kalphite", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Kurask", combat: 65, slayer: 70, quest: null, complete: false },
            { name: "Lesser demons", combat: 60, slayer: null, quest: null, complete: false },
            { name: "Lesser Nagua", combat: null, slayer: 48, quest: 163, complete: false },
            { name: "Lizardmen", combat: null, slayer: null, quest: null, complete: false },
            { name: "Mutated zygomites", combat: 60, slayer: 57, quest: 19, complete: false },
            { name: "Nechryael", combat: 85, slayer: 80, quest: 54, complete: false },
            { name: "Shadow warriors", combat: 60, slayer: null, quest: 50, complete: false },
            { name: "Skeletal wyverns", combat: 70, slayer: 72, quest: 53, complete: false },
            { name: "Spiritual creatures", combat: 60, slayer: 63, quest: 56, complete: false },
            { name: "Trolls", combat: 60, slayer: null, quest: null, complete: false },
            { name: "Turoth", combat: 60, slayer: 55, quest: null, complete: false },
            { name: "TzHaar", combat: null, slayer: null, quest: null, complete: false },
            { name: "Vampyres", combat: 35, slayer: null, quest: 54, complete: false },
            { name: "Venators", combat: null, slayer: 75, quest: 180, complete: false },
            { name: "Warped creatures", combat: null, slayer: 56, quest: 158, complete: false },
            { name: "Wyrms", combat: null, slayer: 62, quest: null, complete: false },
        ]
        },

        // Konar
        {
        name: "Konar",
        combat: 75,
        slayer: null,
        quest: null,
        complete: false,
        tasks:
        [
            { name: "Aberrant spectres", combat: 65, slayer: 60, quest: null, complete: false },
            { name: "Abyssal demons", combat: 85, slayer: 85, quest: "54 or 107", complete: false },
            { name: "Ankou", combat: 40, slayer: null, quest: null, complete: false },
            { name: "Aviansie", combat: null, slayer: null, quest: 56, complete: false },
            { name: "Basilisks", combat: 40, slayer: 40, quest: null, complete: false },
            { name: "Black demons", combat: 80, slayer: null, quest: null, complete: false },
            { name: "Black dragons", combat: 80, slayer: null, quest: 17, complete: false },
            { name: "Bloodveld", combat: 50, slayer: 50, quest: 54, complete: false },
            { name: "Blue dragons", combat: 65, slayer: null, quest: "17 and 45", complete: false },
            { name: "Boss", combat: null, slayer: null, quest: null, complete: false },
            { name: "Brine rats", combat: 45, slayer: 47, quest: 123, complete: false },
            { name: "Cave kraken", combat: 80, slayer: 87, quest: null, complete: false },
            { name: "Dagannoth", combat: 75, slayer: null, quest: 63, complete: false },
            { name: "Dark beasts", combat: 90, slayer: 90, quest: 89, complete: false },
            { name: "Drakes", combat: null, slayer: 84, quest: null, complete: false },
            { name: "Dust devils", combat: 70, slayer: 65, quest: 77, complete: false },
            { name: "Fire giants", combat: 65, slayer: null, quest: null, complete: false },
            { name: "Fossil Island wyverns", combat: 60, slayer: 66, quest: "132 and 53", complete: false },
            { name: "Gargoyles", combat: 80, slayer: 75, quest: 54, complete: false },
            { name: "Greater demons", combat: 70, slayer: null, quest: null, complete: false },
            { name: "Hellhounds", combat: 75, slayer: null, quest: null, complete: false },
            { name: "Hydras", combat: null, slayer: 95, quest: null, complete: false },
            { name: "Jellies", combat: 57, slayer: 52, quest: null, complete: false },
            { name: "Kalphite", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Kurask", combat: 65, slayer: 70, quest: null, complete: false },
            { name: "Lesser Nagua", combat: null, slayer: 48, quest: 163, complete: false },
            { name: "Lizardmen", combat: null, slayer: null, quest: null, complete: false },
            { name: "Metal dragons", combat: null, slayer: null, quest: 17, complete: false },
            { name: "Mutated zygomites", combat: 60, slayer: 57, quest: 19, complete: false },
            { name: "Nechryael", combat: 85, slayer: 80, quest: 54, complete: false },
            { name: "Red dragons", combat: 68, slayer: null, quest: 17, complete: false },
            { name: "Skeletal wyverns", combat: 70, slayer: 72, quest: 53, complete: false },
            { name: "Smoke devils", combat: 85, slayer: 93, quest: null, complete: false },
            { name: "Trolls", combat: 60, slayer: null, quest: null, complete: false },
            { name: "Turoth", combat: 60, slayer: 55, quest: null, complete: false },
            { name: "TzHaar", combat: null, slayer: null, quest: null, complete: false },
            { name: "Vampyres", combat: 35, slayer: null, quest: 54, complete: false },
            { name: "Venators", combat: null, slayer: 75, quest: 180, complete: false },
            { name: "Warped creatures", combat: null, slayer: 56, quest: 158, complete: false },
            { name: "Waterfiends", combat: 75, slayer: null, quest: 181, complete: false },
            { name: "Wyrms", combat: null, slayer: 62, quest: null, complete: false }
        ]
        },

        // Nieve 
        {
        name: "Nieve",
        combat: 85,
        slayer: null,
        quest: null,
        complete: false,
        tasks:
        [
            { name: "Aberrant spectres", combat: 65, slayer: 60, quest: null, complete: false },
            { name: "Abyssal demons", combat: 85, slayer: 85, quest: "54 or 107", complete: false },
            { name: "Ankou", combat: 40, slayer: null, quest: null, complete: false },
            { name: "Aquanites", combat: null, slayer: 78, quest: null, complete: false },
            { name: "Araxytes", combat: null, slayer: 92, quest: 54, complete: false },
            { name: "Aviansie", combat: null, slayer: null, quest: 56, complete: false },
            { name: "Basilisks", combat: 40, slayer: 40, quest: null, complete: false },
            { name: "Black demons", combat: 80, slayer: null, quest: null, complete: false },
            { name: "Black dragons", combat: 80, slayer: null, quest: 17, complete: false },
            { name: "Bloodveld", combat: 50, slayer: 50, quest: 54, complete: false },
            { name: "Blue dragons", combat: 65, slayer: null, quest: "17 and 45", complete: false },
            { name: "Boss", combat: null, slayer: null, quest: null, complete: false },
            { name: "Brine rats", combat: 45, slayer: 47, quest: 123, complete: false },
            { name: "Cave horrors", combat: 85, slayer: 58, quest: 98, complete: false },
            { name: "Cave kraken", combat: 80, slayer: 87, quest: null, complete: false },
            { name: "Custodian stalker", combat: null, slayer: 54, quest: 172, complete: false },
            { name: "Dagannoth", combat: 75, slayer: null, quest: 63, complete: false },
            { name: "Dark beasts", combat: 90, slayer: 90, quest: 89, complete: false },
            { name: "Drakes", combat: null, slayer: 84, quest: null, complete: false },
            { name: "Dust devils", combat: 70, slayer: 65, quest: 77, complete: false },
            { name: "Elves", combat: 70, slayer: null, quest: 59, complete: false },
            { name: "Fire giants", combat: 65, slayer: null, quest: null, complete: false },
            { name: "Fossil Island wyverns", combat: 60, slayer: 66, quest: "132 and 53", complete: false },
            { name: "Frost dragons", combat: null, slayer: 85, quest: null, complete: false },
            { name: "Gargoyles", combat: 80, slayer: 75, quest: 54, complete: false },
            { name: "Greater demons", combat: 70, slayer: null, quest: null, complete: false },
            { name: "Gryphons", combat: null, slayer: 51, quest: 177, complete: false },
            { name: "Hellhounds", combat: 75, slayer: null, quest: null, complete: false },
            { name: "Kalphite", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Kurask", combat: 65, slayer: 70, quest: null, complete: false },
            { name: "Lizardmen", combat: null, slayer: null, quest: null, complete: false },
            { name: "Metal dragons", combat: null, slayer: null, quest: 17, complete: false },
            { name: "Mutated zygomites", combat: 60, slayer: 57, quest: 19, complete: false },
            { name: "Nechryael", combat: 85, slayer: 80, quest: 54, complete: false },
            { name: "Red dragons", combat: 68, slayer: null, quest: 17, complete: false },
            { name: "Scabarites", combat: 85, slayer: null, quest: 117, complete: false },
            { name: "Skeletal wyverns", combat: 70, slayer: 72, quest: 53, complete: false },
            { name: "Smoke devils", combat: 85, slayer: 93, quest: null, complete: false },
            { name: "Spiritual creatures", combat: 60, slayer: 63, quest: 56, complete: false },
            { name: "Suqah", combat: 85, slayer: null, quest: 108, complete: false },
            { name: "Trolls", combat: 60, slayer: null, quest: null, complete: false },
            { name: "Turoth", combat: 60, slayer: 55, quest: null, complete: false },
            { name: "TzHaar", combat: null, slayer: null, quest: null, complete: false },
            { name: "Vampyres", combat: 35, slayer: null, quest: 54, complete: false },
            { name: "Venators", combat: null, slayer: 75, quest: 180, complete: false },
            { name: "Warped creatures", combat: null, slayer: 56, quest: 158, complete: false },
            { name: "Waterfiends", combat: 75, slayer: null, quest: 181, complete: false },
            { name: "Wyrms", combat: null, slayer: 62, quest: null, complete: false }
        ]
        },

        // Duradel
        {
        name: "Duradel",
        combat: 100,
        slayer: 50,
        quest: 41,
        complete: false,
        tasks:
        [
            { name: "Aberrant spectres", combat: 65, slayer: 60, quest: null, complete: false },
            { name: "Abyssal demons", combat: 85, slayer: 85, quest: "54 or 107", complete: false },
            { name: "Ankou", combat: 40, slayer: null, quest: null, complete: false },
            { name: "Aquanites", combat: null, slayer: 78, quest: null, complete: false },
            { name: "Araxytes", combat: null, slayer: 92, quest: 54, complete: false },
            { name: "Aviansie", combat: null, slayer: null, quest: 56, complete: false },
            { name: "Basilisks", combat: 40, slayer: 40, quest: null, complete: false },
            { name: "Black demons", combat: 80, slayer: null, quest: null, complete: false },
            { name: "Black dragons", combat: 80, slayer: null, quest: 17, complete: false },
            { name: "Bloodveld", combat: 50, slayer: 50, quest: 54, complete: false },
            { name: "Blue dragons", combat: 65, slayer: null, quest: "17 and 45", complete: false },
            { name: "Boss", combat: null, slayer: null, quest: null, complete: false },
            { name: "Cave horrors", combat: 85, slayer: 58, quest: 98, complete: false },
            { name: "Cave kraken", combat: 80, slayer: 87, quest: null, complete: false },
            { name: "Dagannoth", combat: 75, slayer: null, quest: 63, complete: false },
            { name: "Dark beasts", combat: 90, slayer: 90, quest: 89, complete: false },
            { name: "Drakes", combat: null, slayer: 84, quest: null, complete: false },
            { name: "Dust devils", combat: 70, slayer: 65, quest: 77, complete: false },
            { name: "Elves", combat: 70, slayer: null, quest: 59, complete: false },
            { name: "Fire giants", combat: 65, slayer: null, quest: null, complete: false },
            { name: "Fossil Island wyverns", combat: 60, slayer: 66, quest: "132 and 53", complete: false },
            { name: "Frost dragons", combat: null, slayer: 85, quest: null, complete: false },
            { name: "Gargoyles", combat: 80, slayer: 75, quest: 54, complete: false },
            { name: "Greater demons", combat: 70, slayer: null, quest: null, complete: false },
            { name: "Gryphons", combat: null, slayer: 51, quest: 177, complete: false },
            { name: "Hellhounds", combat: 75, slayer: null, quest: null, complete: false },
            { name: "Kalphite", combat: 15, slayer: null, quest: null, complete: false },
            { name: "Kurask", combat: 65, slayer: 70, quest: null, complete: false },
            { name: "Lizardmen", combat: null, slayer: null, quest: null, complete: false },
            { name: "Metal dragons", combat: null, slayer: null, quest: 17, complete: false },
            { name: "Mutated zygomites", combat: 60, slayer: 57, quest: 19, complete: false },
            { name: "Nechryael", combat: 85, slayer: 80, quest: 54, complete: false },
            { name: "Red dragons", combat: 68, slayer: null, quest: 17, complete: false },
            { name: "Skeletal wyverns", combat: 70, slayer: 72, quest: 53, complete: false },
            { name: "Smoke devils", combat: 85, slayer: 93, quest: null, complete: false },
            { name: "Spiritual creatures", combat: 60, slayer: 63, quest: 56, complete: false },
            { name: "Suqah", combat: 85, slayer: null, quest: 108, complete: false },
            { name: "Trolls", combat: 60, slayer: null, quest: null, complete: false },
            { name: "Turoth", combat: 60, slayer: 55, quest: null, complete: false },
            { name: "TzHaar", combat: null, slayer: null, quest: null, complete: false },
            { name: "Vampyres", combat: 35, slayer: null, quest: 54, complete: false },
            { name: "Venators", combat: null, slayer: 75, quest: 180, complete: false },
            { name: "Warped creatures", combat: null, slayer: 56, quest: 158, complete: false },
            { name: "Wyrms", combat: null, slayer: 62, quest: null, complete: false }
        ]
        },

        // Mortimer
        {
        name: "Mortimer",
        combat: 100,
        slayer: 70,
        quest: 326,
        complete: false,
        tasks:
        [
            { name: "Crawling hands", combat: null, slayer: 5, quest: 54, complete: false },
            { name: "Banshees", combat: 20, slayer: 15, quest: 54, complete: false },
            { name: "Cave crawlers", combat: 10, slayer: 10, quest: null, complete: false },
            { name: "Rockslugs", combat: 20, slayer: 20, quest: null, complete: false },
            { name: "Cockatrice", combat: 25, slayer: 25, quest: null, complete: false },
            { name: "Pyrefiends", combat: 25, slayer: 30, quest: null, complete: false },
            { name: "Infernal mages", combat: 40, slayer: 45, quest: 54, complete: false },
            { name: "Bloodvelds", combat: 50, slayer: 50, quest: 54, complete: false },
            { name: "Gryphons", combat: null, slayer: 51, quest: 177, complete: false },
            { name: "Jellies", combat: 57, slayer: 52, quest: null, complete: false },
            { name: "Custodian stalker", combat: null, slayer: 54, quest: 172, complete: false },
            { name: "Turoth", combat: 60, slayer: 55, quest: null, complete: false },
            { name: "Warped creatures", combat: null, slayer: 56, quest: 158, complete: false },
            { name: "Cave horrors", combat: 85, slayer: 58, quest: 98, complete: false },
            { name: "Aberrant spectres", combat: 65, slayer: 60, quest: 54, complete: false },
            { name: "Basilisks", combat: 40, slayer: 40, quest: null, complete: false },
            { name: "Wyrms", combat: null, slayer: 62, quest: null, complete: false },
            { name: "Dust devils", combat: 70, slayer: 65, quest: 77, complete: false },
            { name: "Kurask", combat: 65, slayer: 70, quest: null, complete: false },
            { name: "Venators", combat: null, slayer: 75, quest: 180, complete: false },
            { name: "Gargoyles", combat: 80, slayer: 75, quest: 54, complete: false },
            { name: "Aquanites", combat: null, slayer: 78, quest: null, complete: false },
            { name: "Nechryael", combat: 85, slayer: 80, quest: 54, complete: false },
            { name: "Drakes", combat: null, slayer: 84, quest: null, complete: false },
            { name: "Abyssal demons", combat: 85, slayer: 85, quest: "54 or 107", complete: false },
            { name: "Dark beasts", combat: 90, slayer: 90, quest: 89, complete: false },
            { name: "Araxytes", combat: null, slayer: 92, quest: 54, complete: false },
            { name: "Smoke devils", combat: 85, slayer: 93, quest: null, complete: false },
            { name: "Hydras", combat: null, slayer: 95, quest: null, complete: false },
        ]
        }
    ],

    camera: {x: 0, y: 0, zoom: 1, returnHome: false},

    QPA: 0,

    unlocked: Array(N).fill(0),

    board: Array(N).fill(0),

    tileBoard: [],

    keys: 0,

    notes: "",
};