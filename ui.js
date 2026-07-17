let map;
let qpIcon;
let cakeIcon;
let slayerSortBy = "combat";
let slayerSortDir = 1;
let tileListSortBy = "id";
let tileListSortDir = 1;
let questStatusFilter = null;
let questNameSearch = "";
let questNameSearchActive = false;
const soundCues = {
    keyFlash: new Audio("sounds/keyFlash.wav"),
    masterComplete: new Audio("sounds/masterComplete.wav"),
    taskComplete: new Audio("sounds/taskComplete.wav"),
    taskIncomplete: new Audio("sounds/taskIncomplete.wav"),
    unlockTile: new Audio("sounds/unlockTile.wav"),
    flashTile: new Audio("sounds/flashTile.ogg")
};


function playSoundCue(cueName) {

    const cue = soundCues[cueName];

    if (!cue)
        return;

    cue.currentTime = 0;
    cue.play().catch(() => {});
}

function preload() {
    map = loadImage('map.png');
    qpIcon = loadImage("icons/quest_icon.png");
    cakeIcon = loadImage("icons/cake_icon.png");
}




document.getElementById("slayerContainer").addEventListener("wheel", (e) => {
    e.stopPropagation();
}, { passive: true });


document.getElementById("resourceTilePanel").addEventListener("wheel", (e) => {
    e.stopPropagation();
}, { passive: true });


document.getElementById("notesInput").addEventListener("wheel", (e) => {
    e.stopPropagation();
}, { passive: true });


document.querySelector(".resourceTileButton").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleTilePanel("Resource");
});


document.querySelector(".questTileButton").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleTilePanel("Quest");
});


document.querySelector(".miniquestTileButton").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleTilePanel("Miniquest");
});


document.querySelector(".diaryTileButton").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleTilePanel("Diary");
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".tilePrereqPopover") && !event.target.closest(".tileListTable tbody tr.tileListUnavailable")) {
        closeTilePrereqPopover();
    }

    if (!event.target.closest(".tileStatusFilterMenu") && !event.target.closest(".tileStatusFilterButton")) {
        closeTileStatusFilterMenus();
    }
});


document.addEventListener("dblclick", (event) => {
    if (event.target.closest("#hud"))
        return;

    collapseAllHudMenus();
});


document.getElementById("notesInput").addEventListener("input", (event) => {
    state.notes = event.target.value;

    if (typeof markProgressChanged === "function")
        {markProgressChanged();}
});


document.getElementById("notesResizeHandle").addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const notesInput = document.getElementById("notesInput");
    const startY = event.clientY;
    const startHeight = notesInput.offsetHeight;

    const getLimit = (property, fallback) => {
        const value = parseFloat(getComputedStyle(notesInput)[property]);
        return Number.isFinite(value) ? value : fallback;
    };

    const minHeight = getLimit("minHeight", 80);
    const maxHeight = getLimit("maxHeight", window.innerHeight - 84);

    const resizeNotes = (moveEvent) => {
        const nextHeight = constrain(startHeight + startY - moveEvent.clientY, minHeight, maxHeight);
        notesInput.style.height = `${nextHeight}px`;
    };

    const stopResize = () => {
        document.removeEventListener("pointermove", resizeNotes);
        document.removeEventListener("pointerup", stopResize);
    };

    document.addEventListener("pointermove", resizeNotes);
    document.addEventListener("pointerup", stopResize);
});


document.querySelectorAll(".slayerCheckbox").forEach(cb => {
    cb.addEventListener("change", (e) => {

        const tileId = e.target.dataset.id;

        state.tasksCompleted[tileId] = e.target.checked ? 1 : 0;
    });
});


function updateQuestTracker() 
{   document.getElementById("questPoints").textContent = state.QPA;   }


function updateKeyTracker() 
{   document.getElementById("keyCount").textContent = state.keys;   }


function updateNotesUI()
{
    const notesInput = document.getElementById("notesInput");

    if (notesInput && notesInput.value !== state.notes)
        {notesInput.value = state.notes || "";}
}


function renderSlayerMaster() {

    const container = document.getElementById("slayerContainer");
    container.innerHTML = "";

    for (const master of state.slayerMasters) {
        container.appendChild(createSlayerMaster(master));
    }
}


function collapseSlayerMasters() {

    const container = document.getElementById("slayerContainer");

    for (const details of container.querySelectorAll(":scope > details")) {
        details.open = false;
    }

    container.classList.remove("hasExpandedMaster");
}


function syncSlayerMasterVisibility(activeDetails) {

    const container = document.getElementById("slayerContainer");
    const openMasters = [...container.querySelectorAll(":scope > details[open]")];
    const activeMaster = activeDetails && activeDetails.open ? activeDetails : openMasters[0];

    for (const details of openMasters) {
        if (details !== activeMaster)
            {details.open = false;}
    }

    container.classList.toggle("hasExpandedMaster", Boolean(activeMaster && activeMaster.open));
}


document.getElementById("slayerMenu").addEventListener("toggle", (event) => {
    if (event.target.open)
        {collapseSlayerMasters();}
});


function collapseAllHudMenus() {

    const slayerMenu = document.getElementById("slayerMenu");
    const saveMenu = document.getElementById("saveMenu");
    const notesMenu = document.getElementById("notesMenu");
    const tileMenu = document.getElementById("tileMenu");
    const tilePanel = document.getElementById("resourceTilePanel");

    closeTilePrereqPopover();
    closeTileStatusFilterMenus();
    collapseSlayerMasters();

    if (slayerMenu)
        {slayerMenu.open = false;}

    if (saveMenu)
        {saveMenu.open = false;}

    if (notesMenu)
        {notesMenu.open = false;}

    if (tileMenu)
        {tileMenu.open = false;}

    if (tilePanel) {
        tilePanel.classList.remove("active", "hasExpandedResource");
    }

    setActiveTileTypeButton(null);
}


function toggleTilePanel(type) {

    const container = document.getElementById("resourceTilePanel");

    if (container.classList.contains("active") && container.dataset.tilePanelType === type) {
        container.classList.remove("active");
        setActiveTileTypeButton(null);
        return;
    }

    container.classList.add("active");
    setActiveTileTypeButton(type);

    if (type === "Resource")
        {renderResourceTileMenu();}
    else if (type === "Diary")
        {renderDiaryTileMenu();}
    else
        {renderTileListMenu(type);}
}


function setActiveTileTypeButton(type) {

    for (const button of document.querySelectorAll(".tileTypeButton")) {
        button.classList.toggle("activeTileTypeButton", button.dataset.tilePanel === type);
    }
}


function resetTilePanel(container, type) {

    container.innerHTML = "";
    container.classList.remove("hasExpandedResource");
    container.dataset.tilePanelType = type;
    container.dataset.rendered = "false";
}


function renderResourceTileMenu() {

    const container = document.getElementById("resourceTilePanel");

    if (container.dataset.rendered === "true" && container.dataset.tilePanelType === "Resource")
        return;

    resetTilePanel(container, "Resource");

    for (const resource of window.resourceTileData) {
        container.appendChild(createResourceTileType(resource));
    }

    setActiveTileTypeButton("Resource");
    container.dataset.rendered = "true";
}


function renderTileListMenu(type) {

    const container = document.getElementById("resourceTilePanel");

    resetTilePanel(container, type);
    container.appendChild(createTileListTable(type));
    setActiveTileTypeButton(type);
    container.dataset.rendered = "true";
}


function renderDiaryTileMenu() {

    const container = document.getElementById("resourceTilePanel");

    if (container.dataset.rendered === "true" && container.dataset.tilePanelType === "Diary")
        return;

    resetTilePanel(container, "Diary");
    container.appendChild(createDiaryTable());
    setActiveTileTypeButton("Diary");
    container.dataset.rendered = "true";
}


function createDiaryTable() {

    const wrapper = document.createElement("div");
    const table = document.createElement("table");

    wrapper.className = "resourceTableWrapper diaryTableWrapper";
    table.className = "resourceTable diaryTable";

    table.appendChild(createDiaryColGroup());
    table.appendChild(createDiaryTableBody());
    wrapper.appendChild(table);

    return wrapper;
}


function createDiaryColGroup() {

    const colgroup = document.createElement("colgroup");

    colgroup.innerHTML = `
        <col class="diaryAreaCol">
        <col class="diaryTierCol">
        <col class="diaryTierCol">
        <col class="diaryTierCol">
        <col class="diaryTierCol">
    `;

    return colgroup;
}


function createDiaryTableBody() {

    const tbody = document.createElement("tbody");
    const diaryTiles = getDiaryTileLookup();

    for (const area of getDiaryAreaOrder(diaryTiles)) {
        const row = document.createElement("tr");
        const areaCell = document.createElement("th");

        areaCell.textContent = area;
        row.appendChild(areaCell);

        for (const tier of getDiaryTierOrder()) {
            const tile = diaryTiles.get(area).get(tier);
            const cell = document.createElement("td");

            cell.textContent = tier;
            decorateDiaryTierCell(cell, tile);
            cell.addEventListener("click", (event) => handleDiaryTierClick(event, cell));
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }

    return tbody;
}


function getDiaryTileLookup() {

    const lookup = new Map();

    for (const tile of window.tileStack) {
        if (!tile || String(tile[2] || "").trim() !== "Diary")
            continue;

        const area = String(tile[1] || "").trim();
        const tier = String(tile[3] || "").trim();

        if (!lookup.has(area))
            {lookup.set(area, new Map());}

        lookup.get(area).set(tier, tile);
    }

    return lookup;
}


function getDiaryAreaOrder(diaryTiles) {

    return [...diaryTiles.keys()];
}


function getDiaryTierOrder() {

    return ["Easy", "Medium", "Hard", "Elite"];
}


function decorateDiaryTierCell(cell, tile) {

    if (!tile)
        return;

    const tileId = Number(tile[0]);
    const unlocked = isTileCompleteForDisplay(tileId);
    const onBoard = state.board[tileId] === 1;

    cell.dataset.tileId = tileId;
    cell.classList.toggle("resourceTierUnlocked", unlocked);
    cell.classList.toggle("resourceTierOnBoard", !unlocked && onBoard);
    cell.classList.toggle("resourceTierUnavailable", !unlocked && !onBoard);
}


function handleDiaryTierClick(event, cell) {

    event.stopPropagation();

    const tileId = Number(cell.dataset.tileId);

    if (!tileId)
        return;

    if (cell.classList.contains("resourceTierUnavailable")) {
        toggleTilePrereqPopover(cell);
        return;
    }

    centerCameraOnTile(tileId);
}


function createTileListTable(type) {

    const wrapper = document.createElement("div");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    wrapper.className = "tileListWrapper";
    table.className = "tileListTable";
    table.dataset.tileType = type;

    thead.innerHTML = `
        <tr>
            <th data-sort="name" class="${type === "Quest" ? "tileNameHeader" : ""}">
                ${createTileNameHeaderHTML(type)}
            </th>
            <th data-sort="difficulty">Difficulty</th>
            <th data-sort="length">Length</th>
            <th data-sort="qp">Quest Points</th>
            <th data-sort="status" class="${type === "Quest" ? "tileStatusHeader" : ""}">
                ${type === "Quest" ? createQuestStatusHeaderHTML() : "Status"}
            </th>
        </tr>
    `;

    thead.querySelectorAll("[data-sort]").forEach(header => {
        header.addEventListener("click", () => {
            setTileListSort(header.dataset.sort);
        });
    });

    bindQuestStatusFilterControls(thead);
    bindQuestNameSearchControls(thead);

    table.appendChild(createTileListColGroup());

    for (const tile of getSortedTileListRows(type)) {
        tbody.appendChild(createTileListRow(tile));
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    wrapper.appendChild(table);

    return wrapper;
}


function createTileNameHeaderHTML(type) {

    if (type !== "Quest")
        return "Name";

    if (questNameSearchActive) {
        return `
            <div class="questNameSearchActive">
                <input
                    class="questNameSearchInput"
                    type="text"
                    value="${escapeHTML(questNameSearch)}"
                    aria-label="Search quests by name"
                    autocomplete="off"
                >
                ${questNameSearch ? `<button class="questNameSearchClear" type="button" aria-label="Clear quest search">X</button>` : ""}
            </div>
        `;
    }

    return `
        <div class="tileNameHeaderContent">
            <span>Name</span>
            <button class="questNameSearchButton" type="button" aria-label="Search quests by name">
                <img src="icons/search_icon.png" alt="">
            </button>
        </div>
    `;
}


function bindQuestNameSearchControls(thead) {

    const searchButton = thead.querySelector(".questNameSearchButton");
    const searchInput = thead.querySelector(".questNameSearchInput");
    const clearButton = thead.querySelector(".questNameSearchClear");

    if (searchButton) {
        searchButton.addEventListener("click", (event) => {
            event.stopPropagation();
            questNameSearchActive = true;
            renderTileListMenu("Quest");
            focusQuestNameSearchInput();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        searchInput.addEventListener("keydown", (event) => {
            event.stopPropagation();
        });

        searchInput.addEventListener("input", (event) => {
            event.stopPropagation();
            questNameSearch = event.currentTarget.value;
            renderTileListMenu("Quest");
            focusQuestNameSearchInput();
        });

        focusQuestNameSearchInput();
    }

    if (clearButton) {
        clearButton.addEventListener("click", (event) => {
            event.stopPropagation();
            questNameSearch = "";
            questNameSearchActive = false;
            renderTileListMenu("Quest");
        });
    }
}


function focusQuestNameSearchInput() {

    requestAnimationFrame(() => {
        const input = document.querySelector(".questNameSearchInput");

        if (!input)
            return;

        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    });
}


function createQuestStatusHeaderHTML() {

    return `
        <div class="tileStatusHeaderContent">
            <span>Status</span>
            <button class="tileStatusFilterButton" type="button" aria-label="Filter quest status"></button>
            <div class="tileStatusFilterMenu">
                <div class="tileStatusFilterTitle">Filter</div>
                <button class="tileStatusFilterOption ${questStatusFilter === "unlocked" ? "active" : ""}" type="button" data-filter="unlocked">Unlocked</button>
                <button class="tileStatusFilterOption ${questStatusFilter === "locked" ? "active" : ""}" type="button" data-filter="locked">Locked</button>
                <button class="tileStatusFilterOption ${questStatusFilter === "hidden" ? "active" : ""}" type="button" data-filter="hidden">Hidden</button>
            </div>
        </div>
    `;
}


function bindQuestStatusFilterControls(thead) {

    const filterButton = thead.querySelector(".tileStatusFilterButton");

    if (!filterButton)
        return;

    filterButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const header = event.currentTarget.closest(".tileStatusHeader");
        const willOpen = !header.classList.contains("filterOpen");
        closeTileStatusFilterMenus();
        header.classList.toggle("filterOpen", willOpen);
    });

    thead.querySelectorAll(".tileStatusFilterOption").forEach(option => {
        option.addEventListener("click", (event) => {
            event.stopPropagation();
            const filter = event.currentTarget.dataset.filter;
            questStatusFilter = questStatusFilter === filter ? null : filter;
            renderTileListMenu("Quest");
        });
    });
}


function closeTileStatusFilterMenus() {

    document.querySelectorAll(".tileStatusHeader.filterOpen").forEach(header => {
        header.classList.remove("filterOpen");
    });
}


function createTileListColGroup() {

    const colgroup = document.createElement("colgroup");

    colgroup.innerHTML = `
        <col class="tileListNameCol">
        <col class="tileListDifficultyCol">
        <col class="tileListLengthCol">
        <col class="tileListQPCol">
        <col class="tileListStatusCol">
    `;

    return colgroup;
}


function getTileListRows(type) {

    return window.tileStack
        .filter(tile => tile && String(tile[2] || "").trim() === type)
        .filter(tile => type !== "Quest" || !questNameSearch || String(tile[1] || "").toLowerCase().includes(questNameSearch.toLowerCase()))
        .filter(tile => type !== "Quest" || !questStatusFilter || getTileListStatusFilter(Number(tile[0])) === questStatusFilter)
        .map(tile => ({
            id: Number(tile[0]),
            name: tile[1],
            difficulty: tile[3],
            length: tile[4],
            qp: tile[5]
        }));
}


function getTileListStatusFilter(tileId) {

    if (isTileCompleteForDisplay(tileId))
        return "unlocked";

    if (state.board[tileId] === 1)
        return "locked";

    return "hidden";
}


function getSortedTileListRows(type) {

    return getTileListRows(type).sort((a, b) =>
        compareTileListRows(a, b, tileListSortBy) * tileListSortDir
    );
}


function setTileListSort(sortBy) {

    if (tileListSortBy === sortBy)
        {tileListSortDir *= -1;}
    else {
        tileListSortBy = sortBy;
        tileListSortDir = sortBy === "status" ? -1 : 1;
    }

    const container = document.getElementById("resourceTilePanel");
    const type = container.dataset.tilePanelType;

    if (type && type !== "Resource")
        {renderTileListMenu(type);}
}


function getTileListStatusRank(tileId) {

    if (isTileCompleteForDisplay(tileId))
        return 2;

    if (state.board[tileId] === 1)
        return 1;

    return 0;
}


function isTileCompleteForDisplay(tileId) {

    if (tileId === 0) {
        const boardTile = state.tileBoard.find(tile => tile.id === 0);
        return boardTile ? boardTile.unlocked === true : false;
    }

    return isTileUnlocked(tileId);
}


function getRank(value, order) {

    const normalized = String(value || "").trim();
    const index = order.indexOf(normalized);

    return index === -1 ? order.length : index;
}


function compareTileListRows(a, b, sortBy) {

    const difficultyOrder = ["Novice", "Intermediate", "Experienced", "Master", "Grandmaster", "Special"];
    const lengthOrder = ["Very Short", "Short", "Medium", "Long", "Very Long"];

    if (sortBy === "name")
        {return a.name.localeCompare(b.name) || a.id - b.id;}

    if (sortBy === "difficulty")
        {return getRank(a.difficulty, difficultyOrder) - getRank(b.difficulty, difficultyOrder) || a.id - b.id;}

    if (sortBy === "length")
        {return getRank(a.length, lengthOrder) - getRank(b.length, lengthOrder) || a.id - b.id;}

    if (sortBy === "qp")
        {return Number(a.qp) - Number(b.qp) || a.id - b.id;}

    if (sortBy === "status")
        {return getTileListStatusRank(a.id) - getTileListStatusRank(b.id) || a.id - b.id;}

    return a.id - b.id;
}


function createTileListRow(tile) {

    const row = document.createElement("tr");

    row.dataset.tileId = tile.id;
    row.innerHTML = `
        <td>${escapeHTML(tile.name)}</td>
        <td>${escapeHTML(tile.difficulty)}</td>
        <td>${escapeHTML(tile.length)}</td>
        <td>${escapeHTML(tile.qp)}</td>
        <td class="tileListStatus"></td>
    `;

    updateTileListRowStatus(row);
    row.addEventListener("click", (event) => handleTileListRowClick(event, row));
    return row;
}


function updateTileListRowStatus(row) {

    const tileId = Number(row.dataset.tileId);
    const status = row.querySelector(".tileListStatus");
    const unlocked = isTileCompleteForDisplay(tileId);
    const onBoard = state.board[tileId] === 1;

    row.classList.toggle("tileListUnlocked", unlocked);
    row.classList.toggle("tileListOnBoard", !unlocked && onBoard);
    row.classList.toggle("tileListUnavailable", !unlocked && !onBoard);

    status.innerHTML = "";

    if (!unlocked && !onBoard)
        return;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "tileStatusCheckbox";
    checkbox.checked = unlocked;
    checkbox.tabIndex = -1;
    checkbox.setAttribute("aria-readonly", "true");
    status.appendChild(checkbox);
}


function refreshTileListStatuses() {

    const container = document.getElementById("resourceTilePanel");
    closeTilePrereqPopover();

    if (tileListSortBy === "status" && container.dataset.tilePanelType && container.dataset.tilePanelType !== "Resource") {
        renderTileListMenu(container.dataset.tilePanelType);
        return;
    }

    for (const row of document.querySelectorAll(".tileListTable tbody tr")) {
        updateTileListRowStatus(row);
    }
}


function handleTileListRowClick(event, row) {

    event.stopPropagation();

    if (row.classList.contains("tileListUnavailable")) {
        const clickedCell = event.target.closest("td");

        if (!clickedCell || clickedCell.cellIndex !== 0)
            return;

        toggleTilePrereqPopover(row);
        return;
    }

    centerCameraOnTile(Number(row.dataset.tileId));
}


function toggleTilePrereqPopover(row) {

    const tileId = row.dataset.tileId;
    const existing = document.querySelector(`.tilePrereqPopover[data-tile-id="${tileId}"]`);

    if (existing) {
        existing.remove();
        return;
    }

    closeTilePrereqPopover();
    showTilePrereqPopover(row);
}


function closeTilePrereqPopover() {

    for (const popover of document.querySelectorAll(".tilePrereqPopover")) {
        popover.remove();
    }
}


function centerCameraOnTile(tileId) {

    const tile = state.tileBoard.find(boardTile => boardTile.id === tileId);

    if (!tile)
        return;

    closeTilePrereqPopover();

    state.camera.x = -tile.x * tileSize;
    state.camera.y = -tile.y * tileSize;
    state.camera.zoom = 1;
    state.camera.returnHome = false;
    flashBoardTile(tileId);

    if (typeof saveGame === "function")
        {saveGame();}
}


function flashBoardTile(tileId, hold = false) {

    playSoundCue("flashTile");

    window.tileFocusHighlight = {
        tileId: tileId,
        startedAt: Date.now(),
        hold: hold
    };
}


function stopBoardTileFlash(tileId = null) {

    if (
        window.tileFocusHighlight &&
        (tileId === null || window.tileFocusHighlight.tileId === tileId)
    ) {
        window.tileFocusHighlight = null;
    }
}


function showTilePrereqPopover(row) {

    const resourcePanel = document.getElementById("resourceTilePanel");
    const inResourcePanel = Boolean(row.closest("#resourceTilePanel"));
    const hud = document.getElementById("hud");
    const container = inResourcePanel ? hud : hud;
    const tileId = Number(row.dataset.tileId);
    const popover = document.createElement("div");
    const rowRect = row.getBoundingClientRect();
    const panelRect = resourcePanel.getBoundingClientRect();
    const viewportGap = -2;

    popover.className = "tilePrereqPopover";
    popover.dataset.tileId = row.dataset.tileId;
    popover.addEventListener("click", (event) => {
        if (event.target.closest(".tilePrereqItem"))
            return;

        event.stopPropagation();
        closeTilePrereqPopover();
    });

    popover.appendChild(createTilePrereqPopoverTitle(tileId));
    popover.appendChild(createTilePrereqPopoverList(tileId));

    container.appendChild(popover);

    if (!inResourcePanel) {
        const popoverWidth = 260;
        const left = Math.max(0, Math.min(
            rowRect.left,
            window.innerWidth - popoverWidth
        ));

        popover.style.left = `${left}px`;
        popover.style.width = `${popoverWidth}px`;
        popover.style.top = `${getBoundedPopoverTop(rowRect, popover)}px`;
    } else {
        const popoverWidth = row.matches(".diaryTable td")
            ? Math.min(260, Math.max(180, panelRect.width))
            : Math.min(260, Math.max(180, rowRect.width));
        const left = Math.max(viewportGap, panelRect.left - popoverWidth - viewportGap);

        popover.style.left = `${left}px`;
        popover.style.width = `${popoverWidth}px`;
        popover.style.top = `${getBoundedPopoverTop(rowRect, popover)}px`;
    }
}


function getBoundedPopoverTop(rowRect, popover) {

    const viewportGap = 8;
    const popoverHeight = popover.offsetHeight;
    const maxTop = window.innerHeight - popoverHeight - viewportGap;
    const topAligned = rowRect.top;

    if (topAligned <= maxTop)
        return Math.max(viewportGap, topAligned);

    return Math.max(viewportGap, Math.min(rowRect.bottom - popoverHeight, maxTop));
}


function createTilePrereqPopoverTitle(tileId) {

    const title = document.createElement("div");
    const tile = window.tileStack[tileId];

    title.className = "tilePrereqTitle";
    title.textContent = tile ? getPrereqTileLabel(tile, tileId) : "Prerequisites";

    return title;
}


function createTilePrereqPopoverList(tileId) {

    const list = document.createElement("div");
    const prereqIds = getSafeTilePrereqIds(tileId);
    const questPointsRequired = Number(window.QPR[tileId]) || 0;

    list.className = "tilePrereqList";

    if (prereqIds.length === 0 && questPointsRequired === 0) {
        const empty = document.createElement("div");
        empty.className = "tilePrereqItem tileListUnavailable";
        empty.textContent = "[No prerequisites]";
        list.appendChild(empty);
        return list;
    }

    for (const prereqId of prereqIds) {
        list.appendChild(createTilePrereqItem(prereqId));
    }

    if (questPointsRequired > 0)
        {list.appendChild(createQuestPointPrereqItem(questPointsRequired));}

    return list;
}


function getSafeTilePrereqIds(tileId) {

    if (!Array.isArray(window.tileReqs[tileId]))
        return [];

    return getTilePrereqIds(tileId);
}


function createTilePrereqItem(tileId) {

    const item = document.createElement("div");
    const tile = window.tileStack[tileId];
    const unlocked = isTileCompleteForDisplay(tileId);
    const onBoard = state.board[tileId] === 1;

    item.className = "tilePrereqItem";
    item.dataset.tileId = tileId;
    item.classList.toggle("tileListUnlocked", unlocked);
    item.classList.toggle("tileListOnBoard", !unlocked && onBoard);
    item.classList.toggle("tileListUnavailable", !unlocked && !onBoard);
    item.textContent = getPrereqTileLabel(tile, tileId);

    if (tile && canShowTileInList(tile)) {
        item.classList.add("tilePrereqItemClickable");
        item.addEventListener("click", (event) => {
            event.stopPropagation();
            if (unlocked || onBoard)
                {centerCameraOnTile(tileId);}
            else
                {jumpToTileListRow(tileId);}
        });
    } else if (unlocked || onBoard) {
        item.classList.add("tilePrereqItemClickable");
        item.addEventListener("click", (event) => {
            event.stopPropagation();
            centerCameraOnTile(tileId);
        });
    }

    return item;
}


function createQuestPointPrereqItem(questPointsRequired) {

    const item = document.createElement("div");
    const icon = document.createElement("img");
    const value = document.createElement("span");

    item.className = "tilePrereqItem tilePrereqQuestPoints";
    item.classList.toggle("tileListUnlocked", state.QPA >= questPointsRequired);
    item.classList.toggle("tileListOnBoard", state.QPA < questPointsRequired);

    icon.src = "icons/quest_icon.png";
    icon.alt = "";
    value.textContent = questPointsRequired;

    item.appendChild(icon);
    item.appendChild(value);

    return item;
}


function getPrereqTileLabel(tile, tileId) {

    if (!tile)
        return `Tile ${tileId}`;

    const type = String(tile[2] || "").trim();

    if (type === "Resource" || type === "Diary")
        return `${tile[1].trim()} ${String(tile[3] || "").trim()}`;

    return tile[1];
}


function canShowTileInList(tile) {

    const type = String(tile[2] || "").trim();

    return type === "Quest" || type === "Miniquest";
}


function jumpToTileListRow(tileId) {

    const tile = window.tileStack[tileId];

    if (!tile || !canShowTileInList(tile))
        return;

    const type = String(tile[2] || "").trim();
    const container = document.getElementById("resourceTilePanel");
    let shouldRerender = container.dataset.tilePanelType !== type;

    if (type === "Quest" && questStatusFilter && getTileListStatusFilter(tileId) !== questStatusFilter) {
        questStatusFilter = null;
        shouldRerender = true;
    }

    if (type === "Quest" && questNameSearch && !String(tile[1] || "").toLowerCase().includes(questNameSearch.toLowerCase())) {
        questNameSearch = "";
        questNameSearchActive = false;
        shouldRerender = true;
    }

    if (shouldRerender)
        {renderTileListMenu(type);}

    container.classList.add("active");
    closeTilePrereqPopover();

    const targetRow = document.querySelector(`.tileListTable tbody tr[data-tile-id="${tileId}"]`);

    if (!targetRow)
        return;

    targetRow.scrollIntoView({block: "center"});
    targetRow.classList.remove("tileListRowJump");
    void targetRow.offsetWidth;
    targetRow.classList.add("tileListRowJump");

    if (targetRow.classList.contains("tileListUnavailable"))
        {showTilePrereqPopover(targetRow);}
}


function createResourceTileType(resource) {

    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const wrapper = document.createElement("div");
    const table = document.createElement("table");
    const columnWidths = getResourceColumnWidths(resource);
    const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);

    summary.className = "resourceSummary";
    summary.dataset.resourceName = resource.name;
    details._resource = resource;
    createResourceSummaryContent(summary, resource);
    wrapper.className = "resourceTableWrapper";
    table.className = "resourceTable";
    table.dataset.resourceName = resource.name;
    table.style.width = `${tableWidth}px`;
    wrapper.style.maxWidth = `${tableWidth + 32}px`;
    details.style.setProperty("--resource-current-table-width", `${tableWidth}px`);

    table.appendChild(createResourceColGroup(columnWidths));
    table.appendChild(createResourceTableHead(resource));
    table.appendChild(createResourceTableBody(resource));

    wrapper.appendChild(table);
    details.appendChild(summary);
    details.appendChild(wrapper);

    details.addEventListener("toggle", () => {
        syncResourceTileVisibility(details);
    });

    updateResourceSummary(details);

    return details;
}


function getResourceColumnWidths(resource) {

    if (Array.isArray(resource.columnWidths) && resource.columnWidths.length === resource.headers.length) {
        return resource.columnWidths.map(width => Number(width) || 92);
    }

    return resource.headers.map((_, index) => index === 0 ? 130 : 92);
}


function createResourceColGroup(columnWidths) {

    const colgroup = document.createElement("colgroup");

    for (const width of columnWidths) {
        const col = document.createElement("col");
        col.style.width = `${width}px`;
        colgroup.appendChild(col);
    }

    return colgroup;
}


function normalizeResourceName(value) {

    return String(value || "").trim().toLowerCase();
}


function normalizeResourceTier(value) {

    return String(value || "").trim().toUpperCase();
}


function isResourceTierUnlocked(resourceName, tier) {

    const status = getResourceTierStatus(resourceName, tier);

    return status.unlocked;
}


function getResourceTierStatus(resourceName, tier) {

    const targetName = normalizeResourceName(resourceName);
    const targetTier = normalizeResourceTier(tier);

    if (!targetName || !targetTier)
        return {
            unlocked: false,
            onBoard: false
        };

    for (const tile of window.tileStack) {
        if (!tile)
            continue;

        const tileId = Number(tile[0]);
        const tileType = String(tile[2] || "").trim();

        if (tileType !== "Resource")
            continue;

        if (
            normalizeResourceName(tile[1]) === targetName &&
            normalizeResourceTier(tile[3]) === targetTier
        ) {
            return {
                unlocked: isTileUnlocked(tileId),
                onBoard: state.board[tileId] === 1
            };
        }
    }

    return {
        unlocked: false,
        onBoard: false
    };
}


function getResourceUnlockSummary(resource) {

    const tiers = resource.headers.slice(1);
    let highestTier = "";
    let unlockedCount = 0;

    for (const tier of tiers) {
        if (isResourceTierUnlocked(resource.name, tier)) {
            highestTier = tier;
            unlockedCount++;
        }
    }

    return {
        highestTier,
        unlockedCount,
        allComplete: tiers.length > 0 && unlockedCount === tiers.length
    };
}


function createResourceSummaryContent(summary, resource) {

    const name = document.createElement("span");
    const tier = document.createElement("span");

    name.className = "resourceName";
    tier.className = "resourceTierBadge";

    name.textContent = resource.name;

    summary.appendChild(name);
    summary.appendChild(tier);
}


function updateResourceSummary(details) {

    const resource = details._resource;

    if (!resource)
        return;

    const summary = details.querySelector(":scope > summary");
    const name = summary.querySelector(".resourceName");
    const tier = summary.querySelector(".resourceTierBadge");
    const progress = getResourceUnlockSummary(resource);

    tier.textContent = progress.highestTier ? `(${progress.highestTier})` : "";
    name.classList.toggle("complete", progress.allComplete);
    tier.classList.toggle("complete", progress.allComplete);
}


function decorateResourceTierCell(cell, resource, columnIndex) {

    if (columnIndex === 0)
        return;

    const tier = resource.headers[columnIndex];
    const status = getResourceTierStatus(resource.name, tier);

    cell.dataset.resourceTier = tier;
    cell.classList.toggle("resourceTierUnlocked", status.unlocked);
    cell.classList.toggle("resourceTierOnBoard", !status.unlocked && status.onBoard);
    cell.classList.toggle("resourceTierUnavailable", !status.unlocked && !status.onBoard);
}


function refreshResourceTileHighlights() {

    for (const table of document.querySelectorAll(".resourceTable[data-resource-name]")) {
        const resourceName = table.dataset.resourceName;

        for (const cell of table.querySelectorAll("[data-resource-tier]")) {
            const status = getResourceTierStatus(resourceName, cell.dataset.resourceTier);

            cell.classList.toggle("resourceTierUnlocked", status.unlocked);
            cell.classList.toggle("resourceTierOnBoard", !status.unlocked && status.onBoard);
            cell.classList.toggle("resourceTierUnavailable", !status.unlocked && !status.onBoard);
        }
    }

    for (const details of document.querySelectorAll("#resourceTilePanel > details")) {
        updateResourceSummary(details);
    }

    refreshDiaryTileHighlights();
}


function refreshDiaryTileHighlights() {

    for (const cell of document.querySelectorAll(".diaryTable [data-tile-id]")) {
        const tileId = Number(cell.dataset.tileId);
        const unlocked = isTileCompleteForDisplay(tileId);
        const onBoard = state.board[tileId] === 1;

        cell.classList.toggle("resourceTierUnlocked", unlocked);
        cell.classList.toggle("resourceTierOnBoard", !unlocked && onBoard);
        cell.classList.toggle("resourceTierUnavailable", !unlocked && !onBoard);
    }
}


function createResourceTableHead(resource) {

    const thead = document.createElement("thead");
    const row = document.createElement("tr");

    for (let i = 0; i < resource.headers.length; i++) {
        const th = document.createElement("th");

        if (i === 0)
            {th.appendChild(createResourceInfoButton(resource));}
        else
            {th.textContent = resource.headers[i];}

        decorateResourceTierCell(th, resource, i);
        row.appendChild(th);
    }

    thead.appendChild(row);
    return thead;
}


function createResourceInfoButton(resource) {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "resourceInfoButton";
    button.textContent = "i";
    button.setAttribute("aria-label", `${resource.name} information`);
    button.title = `${resource.name} information`;
    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleResourceInfoPopover(button, resource);
    });

    return button;
}


function toggleResourceInfoPopover(anchor, resource) {

    const existing = document.querySelector(`.resourceInfoPopover[data-resource-name="${resource.name}"]`);

    if (existing) {
        existing.remove();
        return;
    }

    closeTilePrereqPopover();
    showResourceInfoPopover(anchor, resource);
}


function showResourceInfoPopover(anchor, resource) {

    const container = document.getElementById("resourceTilePanel");
    const popover = document.createElement("div");
    const title = document.createElement("div");
    const caption = document.createElement("div");
    const anchorRect = anchor.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const popoverWidth = Math.min(300, Math.max(220, containerRect.width));
    const left = Math.max(0, Math.min(
        anchorRect.left - containerRect.left + container.scrollLeft,
        container.scrollWidth - popoverWidth
    ));

    popover.className = "tilePrereqPopover resourceInfoPopover";
    popover.dataset.resourceName = resource.name;
    popover.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    title.className = "tilePrereqTitle";
    title.textContent = resource.name;

    caption.className = "resourceInfoCaption";
    caption.textContent = resource.caption || "No resource notes yet.";

    popover.appendChild(title);
    popover.appendChild(caption);

    if (Array.isArray(resource.clarifications) && resource.clarifications.length > 0) {
        const list = document.createElement("ul");
        list.className = "resourceInfoClarifications";

        for (const clarification of resource.clarifications) {
            const item = document.createElement("li");
            item.textContent = clarification;
            list.appendChild(item);
        }

        popover.appendChild(list);
    }

    container.appendChild(popover);
    popover.style.top = `${anchorRect.bottom - containerRect.top + container.scrollTop + 4}px`;
    popover.style.left = `${left}px`;
    popover.style.width = `${popoverWidth}px`;
}


function createResourceTableBody(resource) {

    const tbody = document.createElement("tbody");

    for (const resourceRow of resource.rows) {
        if (!Array.isArray(resourceRow))
            continue;

        const row = document.createElement("tr");
        const centerData = shouldCenterResourceRow(resource.name, resourceRow[0]);

        for (let i = 0; i < resourceRow.length; i++) {
            const cell = document.createElement(i === 0 ? "th" : "td");
            cell.textContent = resourceRow[i];
            cell.classList.toggle("resourceDataCentered", i > 0 && centerData);
            decorateResourceTierCell(cell, resource, i);
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }

    return tbody;
}


function shouldCenterResourceRow(resourceName, rowLabel) {

    const centeredRows = {
        "fauna": new Set(["# of traps"]),
        "homestead": new Set(["house size", "(with yard)"]),
        "seastead": new Set(["crew size", "port tasks", "ships"]),
        "swiftness": new Set(["graceful pieces"])
    };

    const resourceKey = String(resourceName || "").trim().toLowerCase();
    const rowKey = String(rowLabel || "").trim().toLowerCase();

    return Boolean(centeredRows[resourceKey] && centeredRows[resourceKey].has(rowKey));
}


function syncResourceTileVisibility(activeDetails) {

    const container = document.getElementById("resourceTilePanel");
    const openTypes = [...container.querySelectorAll(":scope > details[open]")];
    const activeType = activeDetails && activeDetails.open ? activeDetails : openTypes[0];

    for (const details of openTypes) {
        if (details !== activeType)
            {details.open = false;}
    }

    container.classList.toggle("hasExpandedResource", Boolean(activeType && activeType.open));

    if (activeType && activeType.open)
        {container.scrollTop = 0;}
}


function getQuestRequirementDisplay(tileId) {

    if (tileId === null) {
        return {
            text: "",
            html: "",
            color: ""
        };
    }

    const requirementText = String(tileId);
    const isNumericTileId = typeof tileId === "number" || /^\d+$/.test(requirementText);

    if (!isNumericTileId) {
        return {
            text: requirementText,
            html: getComplexQuestRequirementHTML(requirementText),
            color: ""
        };
    }

    return getSingleQuestRequirementDisplay(Number(tileId));
}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getQuestRequirementColor(tileId) {

    if (state.unlocked[tileId - 1])
        {return "green";}

    if (state.board[tileId])
        {return "red";}

    return "rgb(137, 137, 137)";
}


function getSingleQuestRequirementDisplay(tileId) {

    const tile = window.tileStack[tileId];
    const text = tile ? tile[1] : String(tileId);
    const color = getQuestRequirementColor(tileId);

    return {
        text,
        html: createSlayerQuestRequirementHTML(tileId, text, color),
        color
    };
}


function getComplexQuestRequirementHTML(requirementText) {

    return requirementText
        .split(/(\d+)/g)
        .map(part => {
            if (!/^\d+$/.test(part))
                {return escapeHTML(part);}

            const tileId = Number(part);
            const tile = window.tileStack[tileId];
            const text = tile ? tile[1] : part;
            const color = getQuestRequirementColor(tileId);

            return createSlayerQuestRequirementHTML(tileId, text, color);
        })
        .join("");
}


function createSlayerQuestRequirementHTML(tileId, text, color) {

    return `<span class="slayerQuestRequirement" data-tile-id="${tileId}" style="color:${color}">${escapeHTML(text)}</span>`;
}


function bindSlayerQuestRequirementLinks(root) {

    root.querySelectorAll(".slayerQuestRequirement").forEach(requirement => {
        requirement.addEventListener("click", handleSlayerQuestRequirementClick);
    });
}


function handleSlayerQuestRequirementClick(event) {

    event.stopPropagation();

    const tileId = Number(event.currentTarget.dataset.tileId);

    if (!tileId)
        return;

    if (isTileCompleteForDisplay(tileId) || state.board[tileId] === 1) {
        centerCameraOnTile(tileId);
        return;
    }

    toggleTilePrereqPopover(event.currentTarget);
}


function createSlayerMaster(master) {

    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const complete = master.tasks.filter(task => task.complete).length;

    summary.innerHTML = `
        <span class="masterTitle">
            <span class="masterName">${master.name}</span>
            <span class="masterCounter">(${complete}/${master.tasks.length})</span>
        </span>
    `;

    master._summaryEl = summary;
    master._detailsEl = details;

    const wrapper = document.createElement("div");
    wrapper.className = "tableWrapper";

    const table = document.createElement("table");
    table.appendChild(createSlayerColGroup());

    table.appendChild(createSlayerHeader(master));
    table.appendChild(createSlayerBody(master));

    wrapper.appendChild(table);

    const content = document.createElement("div");
    content.className = "slayerContent";

    content.appendChild(wrapper);

    details.appendChild(summary);
    details.appendChild(content);

    details.addEventListener("toggle", () => {
        syncSlayerMasterVisibility(details);
        updateSlayerMasterUI(master);
    });

    updateSlayerMasterUI(master);

    return details;
}


function getTaskLevel(task, skill) {

    return Number(task[skill]) || 0;
}


function compareTaskName(a, b) {
    return a.name.localeCompare(b.name);
}


function compareCombat(a, b) {
    return (
        getTaskLevel(a, "combat") - getTaskLevel(b, "combat") ||
        getTaskLevel(a, "slayer") - getTaskLevel(b, "slayer") ||
        compareTaskName(a, b)
    );
}


function compareSlayer(a, b) {
    return (
        getTaskLevel(a, "slayer") - getTaskLevel(b, "slayer") ||
        getTaskLevel(a, "combat") - getTaskLevel(b, "combat") ||
        compareTaskName(a, b)
    );
}


function getTaskQuestSortValue(task) {

    if (task.quest === null || task.quest === undefined || task.quest === "")
        return Number.POSITIVE_INFINITY;

    const match = String(task.quest).match(/\d+/);

    return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}


function compareQuest(a, b) {
    const aQuest = getTaskQuestSortValue(a);
    const bQuest = getTaskQuestSortValue(b);
    const aHasQuest = Number.isFinite(aQuest);
    const bHasQuest = Number.isFinite(bQuest);

    if (aHasQuest !== bHasQuest)
        return aHasQuest ? -1 : 1;

    if (!aHasQuest)
        return compareCombat(a, b);

    return aQuest - bQuest || compareCombat(a, b);
}


function compareComplete(a, b) {
    return (
        Number(a.complete === true) - Number(b.complete === true) ||
        compareCombat(a, b)
    );
}


function compareTasks(a, b, sortBy) {

    if (sortBy === "task")
        {return compareTaskName(a, b);}

    if (sortBy === "slayer")
        {return compareSlayer(a, b);}

    if (sortBy === "quest")
        {return compareQuest(a, b);}

    if (sortBy === "complete")
        {return compareComplete(a, b);}

    return compareCombat(a, b);
}


function getSortedTasks(master) {

    return [...master.tasks].sort((a, b) => {
        if (slayerSortBy === "quest") {
            const aQuest = getTaskQuestSortValue(a);
            const bQuest = getTaskQuestSortValue(b);
            const aHasQuest = Number.isFinite(aQuest);
            const bHasQuest = Number.isFinite(bQuest);

            if (aHasQuest !== bHasQuest)
                return aHasQuest ? -1 : 1;

            if (!aHasQuest)
                return compareCombat(a, b);

            return (aQuest - bQuest) * slayerSortDir || compareCombat(a, b);
        }

        return compareTasks(a, b, slayerSortBy) * slayerSortDir;
    });
}


function setSlayerSort(sortBy) {

    if (slayerSortBy === sortBy)
        {slayerSortDir *= -1;}
    else {
        slayerSortBy = sortBy;
        slayerSortDir = 1;
    }

    refreshSlayerBodies();
}


function refreshSlayerBodies() {

    for (const master of state.slayerMasters) {
        refreshSlayerBody(master);
    }
}


function refreshSlayerBody(master) {

    if (!master._tbody)
        return;

    const oldBody = master._tbody;
    const nextBody = createSlayerBody(master);
    oldBody.replaceWith(nextBody);
}


function createSlayerColGroup() {

    const colgroup = document.createElement("colgroup");

    colgroup.innerHTML = `
        <col class="taskCol">
        <col class="combatCol">
        <col class="slayerCol">
        <col class="questCol">
        <col class="checkCol">
    `;

    return colgroup;
}


function createSlayerHeader(master) {

    const thead = document.createElement("thead");
    const quest = getQuestRequirementDisplay(master.quest);

    thead.innerHTML = `
        <tr class="masterInfoRow">
            <th>Requirements</th>
            <th>${master.combat ?? ""}</th>
            <th>${master.slayer ?? ""}</th>
            <th class="questRequirementText" style="color:${quest.color}">${quest.html}</th>
            <th>
                <span class="masterInfoProgress">
                    <span class="masterInfoProgressFill"></span>
                </span>
            </th>
        </tr>
        <tr class="taskHeaderRow">
            <th data-sort="task">Task</th>
            <th data-sort="combat"><img class="combatHeaderIcon" src="icons/combat_icon.png"></th>
            <th data-sort="slayer"><img class="slayerHeaderIcon" src="icons/slayer_icon.png"></th>
            <th data-sort="quest"><img class="questHeaderIcon" src="icons/quest_icon.png"></th>
            <th data-sort="complete"></th>
        </tr>
    `;

    master._requirementProgressFill = thead.querySelector(".masterInfoProgressFill");
    bindSlayerQuestRequirementLinks(thead);

    thead.querySelectorAll("[data-sort]").forEach(header => {
        header.addEventListener("click", () => {
            setSlayerSort(header.dataset.sort);
        });
    });

    return thead;
}


function createSlayerBody(master) {

    const tbody = document.createElement("tbody");
    master._tbody = tbody;

    const sortedTasks = getSortedTasks(master);

    for (const task of sortedTasks) {

        const row = document.createElement("tr");

        const quest = getQuestRequirementDisplay(task.quest);

        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.combat ?? ""}</td>
            <td>${task.slayer ?? ""}</td>
            <td class="questRequirementText" style="color:${quest.color}">${quest.html}</td>
            <td><input type="checkbox"></td>
        `;

        const checkbox = row.querySelector("input");
        bindSlayerQuestRequirementLinks(row);

        // IMPORTANT: reflect state
        checkbox.checked = task.complete || false;

        checkbox.addEventListener("change", () => {
            const wasMasterComplete = master.tasks.length > 0 && master.tasks.every(t => t.complete);
            task.complete = checkbox.checked;
            if (checkbox.checked) {
                state.keys += 1;
                playSoundCue("taskComplete");
            } else {
                state.keys -= 1;
                playSoundCue("taskIncomplete");
            }
        updateKeyTracker();
        updateSlayerMasterUI(master);
        if (!wasMasterComplete && master.tasks.length > 0 && master.tasks.every(t => t.complete))
            {playSoundCue("masterComplete");}
        markProgressChanged();
        refreshSlayerBodies();
        });
        tbody.appendChild(row);
    }

    return tbody;
}

function updateSlayerMasterUI(master) {

    const complete = master.tasks.filter(t => t.complete).length;
    const allComplete = complete === master.tasks.length;
    const progress = master.tasks.length === 0 ? 0 : complete / master.tasks.length;

    const name = master._summaryEl.querySelector(".masterName");
    const counter = master._summaryEl.querySelector(".masterCounter");

    name.textContent = master.name;
    counter.textContent = `(${complete}/${master.tasks.length})`;
    name.classList.toggle("complete", allComplete);
    counter.classList.toggle("complete", allComplete);

    if (master._requirementProgressFill)
        {master._requirementProgressFill.style.width = `${progress * 100}%`;}
}


function flashKeys() {

    const box = document.querySelector("#keyTracker .iconBox");

    playSoundCue("keyFlash");
    box.classList.remove("flash");

    // Restart the animation if it's already flashing
    void box.offsetWidth;

    box.classList.add("flash");
}
