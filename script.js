
let fileChanges = 0;
let cursorMoves = 0;
let sessionStart = Date.now();

function updateDuration() {
  const duration = Math.floor((Date.now() - sessionStart) / 1000);
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  document.getElementById("duration").textContent = 
    `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function addActivity(text) {
  const list = document.getElementById("activity-list");
  const item = document.createElement("li");
  item.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
  list.insertBefore(item, list.firstChild);
  if (list.children.length > 50) {
    list.removeChild(list.lastChild);
  }
}

async function main() {
  await replit.init();

  document.getElementById("loading").style.display = "none";
  document.getElementById("session-info").style.display = "block";

  setInterval(updateDuration, 1000);

  replit.editor.onDidChangeTextDocument(() => {
    fileChanges++;
    document.getElementById("file-changes").textContent = fileChanges;
    addActivity("File content changed");
  });

  replit.editor.onDidChangeCursorPosition(() => {
    cursorMoves++;
    document.getElementById("cursor-moves").textContent = cursorMoves;
    addActivity("Cursor moved");
  });

  replit.session.onActiveFileChange((event) => {
    addActivity(`Switched to file: ${event.file}`);
  });
}

window.addEventListener("load", main);
