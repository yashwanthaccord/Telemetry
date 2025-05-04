
// Track session duration
let sessionStartTime;

async function main() {
  try {
    // Initialize Replit extension API
    await replit.init();
    sessionStartTime = Date.now();

    // Get current repl and user information
    const replInfo = await replit.data.currentRepl();
    const userInfo = await replit.data.currentUser();

    console.log("Initialized:", { replId: replInfo.id, user: userInfo.username });

    // Log session start event
    await logEvent('session_start', {
      replId: replInfo.id,
      userId: userInfo.username,
      timestamp: new Date().toISOString()
    });

    // Track file changes using session API
    const session = replit.session;

    // Listen for active file changes and log them
    session.onActiveFileChange((event) => {
      console.log("File changed:", event);
      logEvent('active_file_change', {
        filePath: event.filePath,
        languageId: event.languageId,
        timestamp: new Date().toISOString()
      });
    });

    // Track editor interactions
    const editor = replit.editor;

    // Log cursor movement events
    editor.onDidChangeCursorPosition(() => {
      console.log("Cursor moved");
      logEvent('cursor_move', {
        timestamp: new Date().toISOString()
      });
    });

    // Log text change events
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

// Send telemetry event to external endpoint
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

// Log session end event when window closes
window.addEventListener('unload', async () => {
  const sessionEndTime = Date.now();
  const durationMs = sessionEndTime - sessionStartTime;

  await logEvent('session_end', {
    durationMs,
    timestamp: new Date().toISOString()
  });
});

main();
