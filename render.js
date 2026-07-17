function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 100);
    updateQuestTracker();
    updateKeyTracker();
    renderSlayerMaster();
}


function drawWorld() {
    push();

    translate(width / 2, height / 2);
    scale(state.camera.zoom);
    translate(state.camera.x - tileSize / 2, state.camera.y - tileSize / 2);

    for (const tile of state.tileBoard) {
        renderTile(tile);
    }

    drawTileFocusHighlight();

    pop();
}


function updateCameraHome() {
    if (!state.camera.returnHome) return;

    state.camera.x = lerp(state.camera.x, 0, 0.03);
    state.camera.y = lerp(state.camera.y, 0, 0.03);
    state.camera.zoom = lerp(state.camera.zoom, 1, 0.03);
}


function draw() {
    image(map, 0, 0, width, height);
    textFont('Palatino');
    textSize(18);
    drawWorld();
    updateCameraHome();
}


window.tileSize = 150;
const TILE_DRAW_ANIMATION_MS = 1000;
const TILE_CORNER_ORNAMENT_SIZE = 22;
const TILE_CORNER_ORNAMENT_OUTER_INSET = 4;
const TILE_CORNER_ORNAMENT_ALPHA = 30;
const TILE_CORNER_DIAGONAL_LENGTH = 2;
const RECIPE_FOR_DISASTER_ICON_SIZE = 58;
const RECIPE_FOR_DISASTER_ICON_ALPHA = 58;
const RECIPE_FOR_DISASTER_TEXT_COLOR = [46, 82, 92];
const DARK_TIER_LOCKED_TEXT_COLOR = [0, 0, 10];


function getTileDrawAnimation(tile) {

    if (!tile.drawAnimation || tile.confirm === true)
        return null;

    const elapsed = Date.now() - tile.drawAnimation.startedAt;

    if (elapsed >= TILE_DRAW_ANIMATION_MS) {
        tile.drawAnimation = null;
        return null;
    }

    const rawProgress = constrain(elapsed / TILE_DRAW_ANIMATION_MS, 0, 1);
    const progress = 1 - Math.pow(1 - rawProgress, 3);
    const direction = tile.drawAnimation.direction;
    const vertical = direction === "north" || direction === "south";

    return {
        progress: progress,
        scaleX: vertical ? 1 : progress,
        scaleY: vertical ? progress : 1,
        anchorX: direction === "east" ? 0 : direction === "west" ? 1 : 0.5,
        anchorY: direction === "south" ? 0 : direction === "north" ? 1 : 0.5
    };
}


function drawTileFrame(tile, x, y) {

    if (tile.unlocked === true)
        return;

    noFill();
    strokeWeight(4);
    stroke(0, 0, 88, 70);
    line(x + 2, y + 2, x + tileSize - 3, y + 2);
    line(x + 2, y + 2, x + 2, y + tileSize - 3);
    line(x + 2, y + tileSize - 3, x + tileSize - 3, y + tileSize - 3);
    line(x + tileSize - 3, y + 2, x + tileSize - 3, y + tileSize - 3);

    strokeWeight(1);
    stroke(0, 0, 100, 22);
    rect(x + 6, y + 6, tileSize - 12, tileSize - 12);
}


function drawTileCornerOrnaments(tile, x, y) {

    if (tile.unlocked === true)
        return;

    const size = TILE_CORNER_ORNAMENT_SIZE;
    const inset = TILE_CORNER_ORNAMENT_OUTER_INSET;
    const left = x + inset;
    const top = y + inset;
    const right = x + tileSize - inset;
    const bottom = y + tileSize - inset;
    const innerLeft = x + size;
    const innerTop = y + size;
    const innerRight = x + tileSize - size;
    const innerBottom = y + tileSize - size;

    noStroke();
    fill(36, 90, 12, TILE_CORNER_ORNAMENT_ALPHA);

    triangle(left, top, innerLeft, top, left, innerTop);
    triangle(right, top, innerRight, top, right, innerTop);
    triangle(left, bottom, innerLeft, bottom, left, innerBottom);
    triangle(right, bottom, innerRight, bottom, right, innerBottom);

    strokeWeight(1);
    stroke(42, 55, 85, 42);
    line(left + 2, top + 2, innerLeft - 3, top + 2);
    line(left + 2, top + 2, left + 2, innerTop - 3);

    line(right - 2, top + 2, innerRight + 3, top + 2);
    line(right - 2, top + 2, right - 2, innerTop - 3);

    line(left + 2, bottom - 2, innerLeft - 3, bottom - 2);
    line(left + 2, bottom - 2, left + 2, innerBottom + 3);

    line(right - 2, bottom - 2, innerRight + 3, bottom - 2);
    line(right - 2, bottom - 2, right - 2, innerBottom + 3);

    const diagonal = TILE_CORNER_DIAGONAL_LENGTH;
    const diagonalGap = -12;

    stroke(42, 55, 85, 48);
    line(
        innerLeft + diagonalGap,
        innerTop + diagonalGap,
        innerLeft + diagonalGap + diagonal,
        innerTop + diagonalGap + diagonal
    );
    line(
        innerRight - diagonalGap,
        innerTop + diagonalGap,
        innerRight - diagonalGap - diagonal,
        innerTop + diagonalGap + diagonal
    );
    line(
        innerLeft + diagonalGap,
        innerBottom - diagonalGap,
        innerLeft + diagonalGap + diagonal,
        innerBottom - diagonalGap - diagonal
    );
    line(
        innerRight - diagonalGap,
        innerBottom - diagonalGap,
        innerRight - diagonalGap - diagonal,
        innerBottom - diagonalGap - diagonal
    );
}


function drawTileOuterBorder(tile, x, y) {

    if (tile.unlocked === true)
        return;

    noFill();
    stroke(0, 0, 8, 88);
    strokeWeight(2);
    rect(x, y, tileSize, tileSize);
}


function drawRecipeForDisasterIcon(tile, x, y) {

    if (tile.name !== "Recipe for Disaster" || typeof cakeIcon === "undefined" || !cakeIcon)
        return;

    push();
    imageMode(CENTER);
    tint(0, 0, 100, tile.unlocked ? RECIPE_FOR_DISASTER_ICON_ALPHA * 0.55 : RECIPE_FOR_DISASTER_ICON_ALPHA);
    image(
        cakeIcon,
        x + tileSize / 2,
        y + tileSize / 2,
        RECIPE_FOR_DISASTER_ICON_SIZE,
        RECIPE_FOR_DISASTER_ICON_SIZE
    );
    noTint();
    pop();
}


function usesDarkTierLockedText(tile) {

    const tier = String(tile.tier || "").trim();

    return (
        (tile.type === "Quest" && (tier === "Master" || tier === "Grandmaster")) ||
        tile.type === "Miniquest" && (tier === "Master" || tier === "Grandmaster") ||
        (tile.type === "Diary" && tier === "Elite") ||
        (tile.type === "Resource" && tier === "VII")
    );
}


function getLockedTileTextColor(tile) {

    return usesDarkTierLockedText(tile) ? DARK_TIER_LOCKED_TEXT_COLOR : [0];
}


function renderTile(tile) 
{
    push();

    let x = tile.x * tileSize;
    let y = tile.y * tileSize;
    const drawAnimation = getTileDrawAnimation(tile);

    if (drawAnimation) {
        translate(
            x + tileSize * drawAnimation.anchorX,
            y + tileSize * drawAnimation.anchorY
        );
        scale(drawAnimation.scaleX, drawAnimation.scaleY);
        translate(
            -x - tileSize * drawAnimation.anchorX,
            -y - tileSize * drawAnimation.anchorY
        );
    }

    const { x: wx, y: wy } = screenToWorld(mouseX, mouseY);

    // label
    let label;
    if (tile.type === 'Resource') {
        label = tile.name + " (" + tile.tier.trim() + ")";
    } else if (tile.type === 'Diary') {
        label = tile.name + "\n(" + tile.tier.trim() + ")";
    } else {
        label = tile.name;
    }

    // color
    const [h, s, b] = window.tileColors[tile.type][tile.tier.trim()];
    let alpha = (tile.unlocked === false) ? 100 : 35;

    // =========================
    // TILE FILL
    // =========================
    noStroke();
    fill(h, s, b, alpha);
    rect(x, y, tileSize, tileSize);

    // =========================
    // BASE BORDER (ALL TILES)
    // =========================
    noFill();
    stroke(0, 0, 10, 40);
    strokeWeight(1);
    rect(x, y, tileSize, tileSize);
    drawTileFrame(tile, x, y);
    drawTileCornerOrnaments(tile, x, y);
    drawTileOuterBorder(tile, x, y);
    drawRecipeForDisasterIcon(tile, x, y);

    // =========================
    // TEXT
    // =========================
    noStroke();
    textSize(18);
    textWrap(WORD);

    if (tile.confirm === true || tile.rerollConfirm === true) 
    {
        const isReroll = tile.rerollConfirm === true;
        fill(isReroll ? 0 : 0, isReroll ? 80 : 0, isReroll ? 45 : 0, 200);
        rect(x, y, tileSize, tileSize);

        fill(36, 70, 77);
        textSize(16);
        textWrap(WORD);
        textAlign(CENTER, CENTER);
        push();
        rectMode(CENTER);

        text(
            (isReroll ? "Reroll " : "Unlock ") + tile.name + "?",
            x + tileSize / 2,
            y + tileSize * 0.375,
            tileSize * 0.9,
            tileSize * 0.5
        );

        text("YES", x + tileSize/4, y + tileSize*0.75 + 10);
        text("NO", x + tileSize*0.75, y + tileSize*0.75 + 10);
        pop();

        const hoverYes =
            wx > x &&
            wx < x + tileSize / 2 &&
            wy > y + tileSize / 2 &&
            wy < y + tileSize;

        const hoverNo =
            wx > x + tileSize / 2 &&
            wx < x + tileSize &&
            wy > y + tileSize / 2 &&
            wy < y + tileSize;

        if (hoverYes) 
        {
            fill(60, 20, 100);      // bright white
            stroke(0);              // black outline
            strokeWeight(2);
        } 
        else 
        {
            fill(36, 70, 77);
            noStroke();
        }

        text("YES", x + tileSize/4, y + tileSize*0.75 + 10);

        if (hoverNo) 
        {
            fill(60, 20, 100);
            stroke(0);
            strokeWeight(2);
        } 
        else 
        {
            fill(36, 70, 77);
            noStroke();
        }

text("NO", x + tileSize*0.75, y + tileSize*0.75 + 10);

noStroke();
        pop();
        return;
    }

    if (tile.name === "Recipe for Disaster" && tile.unlocked === false) 
    {
        fill(...RECIPE_FOR_DISASTER_TEXT_COLOR);
        stroke(0);
        strokeWeight(1);
    } 
    else if (tile.unlocked === true) 
    {
        fill(100);
        stroke(0);
        strokeWeight(1);
    } 
    else 
    {fill(...getLockedTileTextColor(tile));}

    textSize(18);
    textAlign(CENTER, CENTER);
    text(label, x + 5, y + 5, tileSize - 10, tileSize - 10);

    let hovered =
        wx > x &&
        wx < x + tileSize &&
        wy > y &&
        wy < y + tileSize;

        if (hovered) {
        noFill();
        stroke(60, 20, 100, 60);
        strokeWeight(2);
        rect(
            x - 1,
            y - 1,
            tileSize + 2,
            tileSize + 2
        );
    }

    pop();
}


function drawTileFocusHighlight() {

    const highlight = window.tileFocusHighlight;

    if (!highlight)
        return;

    const tile = state.tileBoard.find(boardTile => boardTile.id === highlight.tileId);

    if (!tile)
        return;

    const duration = 1200;
    const rawElapsed = Date.now() - highlight.startedAt;
    const elapsed = highlight.hold ? rawElapsed % duration : rawElapsed;

    if (!highlight.hold && elapsed > duration) {
        window.tileFocusHighlight = null;
        return;
    }

    const pulse = sin((elapsed / duration) * TWO_PI * 3);
    const alpha = 95 * (1 - elapsed / duration);
    const inset = 3 + pulse * 2;
    const x = tile.x * tileSize;
    const y = tile.y * tileSize;

    noFill();
    stroke(36, 75, 100, alpha);
    strokeWeight(4);
    rect(
        x - inset,
        y - inset,
        tileSize + inset * 2,
        tileSize + inset * 2
    );
}
