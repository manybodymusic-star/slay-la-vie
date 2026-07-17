// Add Learning Ropes to center of the board
tileToBoard(0,0,0);


function isTileUnlocked(tileId)
{
    if (tileId === 0)
        {return true;}

    return state.unlocked[tileId - 1] === 1;
}


function markTileUnlocked(tile)
{
    tile.unlocked = true;

    if (tile.id !== 0)
        {state.unlocked[tile.id - 1] = 1;}

    if (typeof refreshResourceTileHighlights === "function")
        {refreshResourceTileHighlights();}

    if (typeof refreshTileListStatuses === "function")
        {refreshTileListStatuses();}
}


function getTilePrereqIds(tileId)
{
    return window.tileReqs[tileId]
        .map((required, id) => required ? id : null)
        .filter(id => id !== null);
}


function getTileEligibility(tileId)
{
    const missingPrereqs = getTilePrereqIds(tileId)
        .filter(id => !isTileUnlocked(id));

    return {
        tileId: tileId,
        tile: window.tileStack[tileId],
        onBoard: state.board[tileId] === 1,
        questPointsRequired: window.QPR[tileId],
        questPointsAvailable: state.QPA,
        missingPrereqs: missingPrereqs,
        eligible:
            state.board[tileId] !== 1 &&
            window.QPR[tileId] <= state.QPA &&
            missingPrereqs.length === 0
    };
}


/* 
drawTile:
                input: state.board, state.unlocked, state.QPA
                output: ID of tile whose prerequisites are met by board
*/

function drawTile() 
{
    const eligibleTiles = []; 

    for (const [r, row] of window.tileReqs.entries()) 
    {     
        const eligibility = getTileEligibility(r);

        if (eligibility.eligible === true)                      // add eligible tiles to eligible array
            {eligibleTiles.push(r);}                                
    }

    if (eligibleTiles.length === 0)
        return;

    // Return random tile from eligible array
    const chosenIndex = Math.floor(Math.random() * eligibleTiles.length);
    const chosenTile = eligibleTiles[chosenIndex];
    return chosenTile;
}


/* 
tileToBoard:
                input: tile ID, (x,y) coordinates
                output: populates tileBoard with tile information and coordinates, updates board array
*/

function tileToBoard(id, x, y, drawDirection = null) 
{
    if (id === undefined)
        return;

    const tile = window.tileStack[id];
    const boardTile = {
        id: Number(tile[0]),
        name: tile[1],
        type: tile[2],
        tier: tile[3].trim(),
        length: tile[4],
        qp: Number(tile[5]),
        x: x,
        y: y,
        unlocked: false,
        confirm: false,
        rerollConfirm: false
    };

    if (drawDirection) {
        boardTile.drawAnimation = {
            direction: drawDirection,
            startedAt: Date.now()
        };
    }

    state.tileBoard.push(boardTile);
    state.board[id] = 1;
}


/* 
occupied:          
                input: (x,y) coordinate
                output: whether coordinate is occupied 
*/

function occupied(x,y) 
    {return state.tileBoard.some(point => point.x === x && point.y === y)};


function getTileDrawDirection(sourceTile, x, y) {

    if (x === sourceTile.x && y === sourceTile.y - 1)
        return "north";

    if (x === sourceTile.x && y === sourceTile.y + 1)
        return "south";

    if (x === sourceTile.x + 1 && y === sourceTile.y)
        return "east";

    if (x === sourceTile.x - 1 && y === sourceTile.y)
        return "west";

    return null;
}


function getAdjacentLockedTiles(tile) {

    const adjacentPositions = [
        {x: tile.x, y: tile.y - 1},
        {x: tile.x, y: tile.y + 1},
        {x: tile.x + 1, y: tile.y},
        {x: tile.x - 1, y: tile.y}
    ];

    return adjacentPositions
        .map(position => {
            const adjacentTile = state.tileBoard.find(boardTile =>
                boardTile.x === position.x &&
                boardTile.y === position.y
            );

            if (!adjacentTile || adjacentTile.unlocked === true)
                return null;

            return {
                tile: adjacentTile,
                x: position.x,
                y: position.y,
                direction: getTileDrawDirection(tile, position.x, position.y)
            };
        })
        .filter(Boolean);
}


function rerollTile(tile) {

    const rerollSlots = getAdjacentLockedTiles(tile);

    if (rerollSlots.length === 0)
        return false;

    const replacements = [];

    for (const slot of rerollSlots) {
        const replacementId = drawTile();

        if (replacementId === undefined)
            continue;

        replacements.push({
            id: replacementId,
            x: slot.x,
            y: slot.y,
            direction: slot.direction
        });

        state.board[replacementId] = 1;
    }

    if (replacements.length === 0)
        return false;

    for (const slot of rerollSlots) {
        state.board[slot.tile.id] = 0;
    }

    state.tileBoard = state.tileBoard.filter(boardTile =>
        !rerollSlots.some(slot => slot.tile === boardTile)
    );

    for (const replacement of replacements) {
        tileToBoard(replacement.id, replacement.x, replacement.y, replacement.direction);
    }

    if (typeof refreshResourceTileHighlights === "function")
        {refreshResourceTileHighlights();}

    if (typeof refreshTileListStatuses === "function")
        {refreshTileListStatuses();}

    if (typeof playSoundCue === "function")
        {playSoundCue("unlockTile");}

    return true;
}


/* 
tileDraw:
                input: (x,y) coordinate of tile
                output: draws new tiles on unccopied orthogonally adjacent gridpoints
*/

function tileDraw(x,y) 
{
    const boardLengthBeforeDraw = state.tileBoard.length;
    let n = y-1;
    let s = y+1;
    let e = x+1;
    let w = x-1;

    if (occupied(x,n) == false) 
        {tileToBoard(drawTile(), x, n, "north")}

    if (occupied(x,s) == false) 
        {tileToBoard(drawTile(), x, s, "south")}

    if (occupied(e,y) == false) 
        {tileToBoard(drawTile(), e, y, "east")} 

    if (occupied(w,y) == false) 
        {tileToBoard(drawTile(), w, y, "west")} 

    if (state.tileBoard.length > boardLengthBeforeDraw && typeof playSoundCue === "function")
        {playSoundCue("unlockTile");}
}
