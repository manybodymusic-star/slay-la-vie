// Initialize variables for drag detection
let isDragging = false;
let pMouseX = 0;
let pMouseY = 0;


// Determine world coordinates from pixel clicked
    function screenToWorld(mx, my) {
        let x = mx;
        let y = my;

        // 1. undo center
        x -= width / 2;
        y -= height / 2;

        // 2. undo scale
        x /= state.camera.zoom;
        y /= state.camera.zoom;

        // 3. undo camera translation
        x -= state.camera.x;
        y -= state.camera.y;

        // 4. undo half-tile camera offset
        x += tileSize / 2;
        y += tileSize / 2;

        return {x, y};
    }


function isRerollModifierDown() {

    return keyIsDown(CONTROL) || keyIsDown(91) || keyIsDown(93) || keyIsDown(224);
}


function getTileConfirmationHit(tileX, tileY, x, y) {

    const yesBox = {x: tileX, y: tileY + tileSize/2, w: tileSize/2, h: tileSize/2};
    const noBox  = {x: tileX + tileSize/2, y: tileY + tileSize/2, w: tileSize/2, h: tileSize/2};

    const yes =
        x > yesBox.x &&
        x < yesBox.x + yesBox.w &&
        y > yesBox.y &&
        y < yesBox.y + yesBox.h;

    const no =
        x > noBox.x &&
        x < noBox.x + noBox.w &&
        y > noBox.y &&
        y < noBox.y + noBox.h;

    return {yes, no};
}


function finishTileUnlock(tile) {

    state.keys = state.keys - 1;

    updateKeyTracker();
    tile.confirm = false;
    markTileUnlocked(tile);
    state.QPA += tile.qp;
    updateQuestTracker();
    tileDraw(tile.x, tile.y);
    if (typeof refreshTileListStatuses === "function")
        {refreshTileListStatuses();}
    renderSlayerMaster();
    markProgressChanged();
}


function finishTileReroll(tile) {

    const rerolled = rerollTile(tile);

    tile.rerollConfirm = false;

    if (!rerolled)
        return;

    state.keys = state.keys - 1;
    updateKeyTracker();
    if (typeof refreshTileListStatuses === "function")
        {refreshTileListStatuses();}
    markProgressChanged();
}


// Click interactivity
function mousePressed() 
{ 
    // Initialize dragging  
    isDragging = true;
    pMouseX = mouseX;
    pMouseY = mouseY;

    // If shift is not held, skip rest of code
    if (!keyIsDown(SHIFT)) 
        return;

    const rerollModifierDown = isRerollModifierDown();

    // Convert mouse to click to board coordinates
    const {x, y} = screenToWorld(mouseX, mouseY);

    // Check if any tiles were clicked
    for (const tile of state.tileBoard) 

        {
        const tileX = tile.x * tileSize;
        const tileY = tile.y * tileSize;
        
        // If tile is clicked,
        if (x > tileX &&
            x < tileX + tileSize &&
            y > tileY &&
            y < tileY + tileSize)

            {
            // If unlock confirmation is requested,
            if (tile.confirm === true)
                {
                const {yes, no} = getTileConfirmationHit(tileX, tileY, x, y);

                // If YES
                if (yes) 
                {
                    // Flag error if insufficient keys
                    if (state.keys < 1) 
                    {
                        flashKeys();
                        tile.confirm = false;
                        return;
                    }

                    // Otherwise, spend key to draw tiles
                    finishTileUnlock(tile);
                    return;
                }

                // If NO, close request
                if (no) 
                    {tile.confirm = false;
                    return;}
                }

            if (tile.rerollConfirm === true)
                {
                if (!rerollModifierDown)
                    return;

                const {yes, no} = getTileConfirmationHit(tileX, tileY, x, y);

                if (yes)
                {
                    if (state.keys < 1)
                    {
                        flashKeys();
                        tile.rerollConfirm = false;
                        return;
                    }

                    finishTileReroll(tile);
                    return;
                }

                if (no)
                {
                    tile.rerollConfirm = false;
                    return;
                }
                }

            if (rerollModifierDown)
                {
                if (tile.unlocked !== true)
                    return;

                tile.drawAnimation = null;
                tile.confirm = false;
                tile.rerollConfirm = true;
                return;
                }

            if (tile.unlocked === true) 
                    return;    

            // Otherwise, request unlock confirmation and return
            if (tile.confirm === false) 
                {
                tile.drawAnimation = null;
                tile.rerollConfirm = false;
                tile.confirm = !tile.confirm;
                return;
                }
            } 
        }
}


function mouseReleased()
{   
    isDragging = false;
    saveGame();
}



function mouseDragged() {

    if (isDragging == false) 
        return;

    const dx = mouseX - pMouseX;
    const dy = mouseY - pMouseY;

    state.camera.x += dx / state.camera.zoom;
    state.camera.y += dy / state.camera.zoom;

    pMouseX = mouseX;
    pMouseY = mouseY;
}


function mouseWheel(event) {

    const zoomSensitivity = 0.001;

    let newZoom =
        state.camera.zoom - event.delta * zoomSensitivity;

    state.camera.zoom = constrain(newZoom, 0.3, 3);

    return false;
}

const homeBtn = document.getElementById("home");

homeBtn.addEventListener("pointerdown", (e) => {
    e.stopPropagation();   // important in your HUD system
    state.camera.returnHome = true;
    if (typeof flashBoardTile === "function")
        {flashBoardTile(0, true);}
});

homeBtn.addEventListener("pointerup", (e) => {
    e.stopPropagation();
    state.camera.returnHome = false;
    if (typeof stopBoardTileFlash === "function")
        {stopBoardTileFlash(0);}
});

homeBtn.addEventListener("pointerleave", () => {
    state.camera.returnHome = false;
    if (typeof stopBoardTileFlash === "function")
        {stopBoardTileFlash(0);}
});


document.getElementById("hud").addEventListener("mousedown", (e) => {
    e.stopPropagation();
});

document.querySelectorAll("#hud *").forEach(el => {
    el.addEventListener("mousedown", (e) => {
        e.stopPropagation();
    });
});
