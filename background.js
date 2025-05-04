
let sessionStartTime;

async function main() {
  await replit.init();
  sessionStartTime = Date.now();

  const replInfo = await replit.data.currentRepl();
  const userInfo = await replit.data.currentUser();

  logEvent('session_start', {
    replId: replInfo.id,
    userId: userInfo.username,
    timestamp: new Date().toISOString()
  });

  // File system events
  replit.fs.onFileCreate((path) => {
    logEvent('file_create', { path });
  });

  replit.fs.onFileChange((path) => {
    logEvent('file_change', { path });
  });

  // Editor events  
  const editor = await replit.editor;

  editor.onDidChangeCursorPosition(() => {
    logEvent('cursor_move', {
      timestamp: new Date().toISOString()
    });
  });

  editor.onDidChangeTextDocument(() => {
    logEvent('text_change', {
      timestamp: new Date().toISOString()
    });
  });
}

async function logEvent(eventType, payload) {
  try {
    await fetch('https://smee.io/vftghyjnimm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventType,
        payload,
        sentAt: new Date().toISOString()
      })
    });
  } catch (err) {
    console.error('Failed to log telemetry:', err);
  }
}

// Initialize the extension
// adding comments for testing

// Cleanup on unload
window.addEventListener('unload', async () => {
  const sessionEndTime = Date.now();
  const durationMs = sessionEndTime - sessionStartTime;

  await logEvent('session_end', {
    durationMs,
    timestamp: new Date().toISOString()
  });
});

//It is not working will it work now lets test now

main();
