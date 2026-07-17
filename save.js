const SAVE_KEY = "slaydy-save-v1";
const BACKUP_DIRTY_KEY = "slaydy-backup-dirty-v1";

let backupDirty = localStorage.getItem(BACKUP_DIRTY_KEY) === "1";


function getSaveSummaryText()
{
    return backupDirty ? "Save" : "Saved";
}


function getSlayerCompletionState()
{
    return state.slayerMasters.map(master =>
        master.tasks.map(task => task.complete === true)
    );
}


function applySlayerCompletionState(completion)
{
    if (!Array.isArray(completion))
        return;

    for (let i = 0; i < state.slayerMasters.length; i++) {
        const savedMaster = completion[i];

        if (!Array.isArray(savedMaster))
            continue;

        for (let j = 0; j < state.slayerMasters[i].tasks.length; j++) {
            state.slayerMasters[i].tasks[j].complete = savedMaster[j] === true;
        }
    }
}


function serializeGame()
{
    return {
        version: 1,
        savedAt: new Date().toISOString(),
        QPA: state.QPA,
        keys: state.keys,
        board: [...state.board],
        unlocked: [...state.unlocked],
        tileBoard: state.tileBoard.map(tile => ({
            id: tile.id,
            x: tile.x,
            y: tile.y,
            unlocked: tile.unlocked === true
        })),
        camera: {
            x: state.camera.x,
            y: state.camera.y,
            zoom: state.camera.zoom
        },
        slayerCompletion: getSlayerCompletionState(),
        notes: state.notes || ""
    };
}


function restoreTileBoard(savedTileBoard)
{
    state.tileBoard = [];
    state.board = Array(N).fill(0);

    if (!Array.isArray(savedTileBoard) || savedTileBoard.length === 0) {
        tileToBoard(0, 0, 0);
        return;
    }

    for (const savedTile of savedTileBoard) {
        const id = Number(savedTile.id);

        if (!Number.isInteger(id) || !window.tileStack[id])
            continue;

        tileToBoard(id, Number(savedTile.x) || 0, Number(savedTile.y) || 0);

        const tile = state.tileBoard[state.tileBoard.length - 1];
        tile.unlocked = savedTile.unlocked === true;
        tile.confirm = false;
        tile.rerollConfirm = false;
    }

    if (state.tileBoard.length === 0)
        {tileToBoard(0, 0, 0);}
}


function applySaveData(saveData)
{
    if (!saveData || saveData.version !== 1)
        {throw new Error("Unsupported save file.");}

    state.QPA = Number(saveData.QPA) || 0;
    state.keys = Number(saveData.keys) || 0;

    state.unlocked = Array(N).fill(0);
    if (Array.isArray(saveData.unlocked)) {
        for (let i = 0; i < Math.min(N, saveData.unlocked.length); i++) {
            state.unlocked[i] = saveData.unlocked[i] === 1 ? 1 : 0;
        }
    }

    restoreTileBoard(saveData.tileBoard);

    if (saveData.camera) {
        state.camera.x = Number(saveData.camera.x) || 0;
        state.camera.y = Number(saveData.camera.y) || 0;
        state.camera.zoom = Number(saveData.camera.zoom) || 1;
    }

    applySlayerCompletionState(saveData.slayerCompletion);
    state.notes = typeof saveData.notes === "string" ? saveData.notes : "";

    updateAllUI();
}


function resetGame()
{
    if (!confirm("Reset all saved progress?"))
        return;

    localStorage.removeItem(SAVE_KEY);
    backupDirty = false;
    localStorage.setItem(BACKUP_DIRTY_KEY, "0");

    state.QPA = 0;
    state.keys = 0;
    state.unlocked = Array(N).fill(0);
    state.board = Array(N).fill(0);
    state.tileBoard = [];
    state.notes = "";
    state.camera.x = 0;
    state.camera.y = 0;
    state.camera.zoom = 1;
    state.camera.returnHome = false;

    for (const master of state.slayerMasters) {
        for (const task of master.tasks) {
            task.complete = false;
        }
    }

    tileToBoard(0, 0, 0);
    saveGame();
    updateAllUI();
    updateSaveStatus();
}


function saveGame()
{
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(serializeGame()));
        updateSaveStatus();
    } catch (error) {
        updateSaveStatus("Save failed");
        console.error(error);
    }
}


function markProgressChanged()
{
    backupDirty = true;
    localStorage.setItem(BACKUP_DIRTY_KEY, "1");
    saveGame();
    updateSaveStatus();
}


function loadGame()
{
    let rawSave = null;

    try {
        rawSave = localStorage.getItem(SAVE_KEY);

        if (!rawSave)
            return false;

        applySaveData(JSON.parse(rawSave));
        updateSaveStatus();
        return true;
    } catch (error) {
        updateSaveStatus("Load failed");
        console.error(error);
        return false;
    }
}


function exportSave()
{
    const saveText = JSON.stringify(serializeGame(), null, 2);
    const blob = new Blob([saveText], {type: "application/json"});
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = URL.createObjectURL(blob);
    link.download = `slaydy-save-${date}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    backupDirty = false;
    localStorage.setItem(BACKUP_DIRTY_KEY, "0");
    updateSaveStatus();
}


function importSave(file)
{
    if (!file)
        return;

    const reader = new FileReader();

    reader.onload = () => {
        try {
            applySaveData(JSON.parse(reader.result));
            saveGame();
            backupDirty = false;
            localStorage.setItem(BACKUP_DIRTY_KEY, "0");
            updateSaveStatus();
        } catch (error) {
            updateSaveStatus("Import failed");
            console.error(error);
        }
    };

    reader.readAsText(file);
}


function updateAllUI()
{
    if (typeof updateQuestTracker === "function")
        {updateQuestTracker();}

    if (typeof updateKeyTracker === "function")
        {updateKeyTracker();}

    if (typeof updateNotesUI === "function")
        {updateNotesUI();}

    if (typeof renderSlayerMaster === "function")
        {renderSlayerMaster();}

    if (typeof refreshResourceTileHighlights === "function")
        {refreshResourceTileHighlights();}

    if (typeof refreshTileListStatuses === "function")
        {refreshTileListStatuses();}
}


function updateSaveStatus(message = getSaveSummaryText())
{
    const status = document.getElementById("saveStatus");

    if (status)
        {status.textContent = message;}
}


function setupSaveControls()
{
    const exportBtn = document.getElementById("exportSave");
    const importBtn = document.getElementById("importSave");
    const resetBtn = document.getElementById("resetSave");
    const importInput = document.getElementById("importSaveFile");

    if (!exportBtn || !importBtn || !resetBtn || !importInput)
        return;

    updateSaveStatus();

    exportBtn.addEventListener("click", exportSave);

    importBtn.addEventListener("click", () => {
        importInput.value = "";
        importInput.click();
    });

    resetBtn.addEventListener("click", resetGame);

    importInput.addEventListener("change", () => {
        importSave(importInput.files[0]);
    });
}


window.addEventListener("beforeunload", (event) => {
    saveGame();

    if (!backupDirty)
        return;

    event.preventDefault();
    event.returnValue = "";
});
window.addEventListener("load", setupSaveControls);
loadGame();
