let sessionStartTime;

async function main() {
  try {
    await replit.init();
    sessionStartTime = Date.now();

    const replInfo = await replit.data.currentRepl();
    const userInfo = await replit.data.currentUser();

    console.log("Initialized:", { replId: replInfo.id, user: userInfo.username });

    await logEvent('session_start', {
      replId: replInfo.id,
      userId: userInfo.username,
      timestamp: new Date().toISOString()
    });

    // Track active file changes
    const session = replit.session;

    session.onActiveFileChange((event) => {
      console.log("File changed:", event);
      logEvent('active_file_change', {
        filePath: event.filePath,
        languageId: event.languageId,
        timestamp: new Date().toISOString()
      });
    });

    // Editor events  
    const editor = replit.editor;

    editor.onDidChangeCursorPosition(() => {
      console.log("Cursor moved");
      logEvent('cursor_move', {
        timestamp: new Date().toISOString()
      });
    });

    editor.onDidChangeTextDocument(() => {
      console.log("Text changed");
      logEvent('text_change', {
        timestamp: new Date().toISOString()
      });
    });

  } catch (err) {
    console.error("Error in main initialization:", err);
  }
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

window.addEventListener('unload', async () => {
  const sessionEndTime = Date.now();
  const durationMs = sessionEndTime - sessionStartTime;

  await logEvent('session_end', {
    durationMs,
    timestamp: new Date().toISOString()
  });
});

main();
// Hoping this to work now