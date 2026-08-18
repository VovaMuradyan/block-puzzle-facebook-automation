const runPublisher = require('../src/publisher');

function getMsUntilNextInterval(intervalMinutes = 15) {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  const nextMinuteMark = Math.ceil((minutes + 0.001) / intervalMinutes) * intervalMinutes;
  const diffMinutes = nextMinuteMark - minutes;
  const targetMs = (diffMinutes * 60 - seconds) * 1000 - ms;

  return targetMs > 0 ? targetMs : intervalMinutes * 60 * 1000;
}

async function startDaemon() {
  console.log('===========================================================');
  console.log('🚀 24/7 High-Frequency Daemon Facebook Publisher Started (15-Min Intervals)');
  console.log('===========================================================');

  // Trigger first immediate run
  try {
    console.log('\n[Daemon] Executing initial immediate publication run...');
    await runPublisher();
  } catch (err) {
    console.error('[Daemon] Initial run error:', err.message);
  }

  // Schedule loop sharp at :00, :15, :30, :45 minute marks
  const scheduleNext = () => {
    const delayMs = getMsUntilNextInterval(15);
    const nextTime = new Date(Date.now() + delayMs).toLocaleTimeString();
    console.log(`\n[Daemon] Next scheduled publication run at ${nextTime} (in ${Math.round(delayMs / 1000 / 60)} minutes)...`);

    setTimeout(async () => {
      try {
        console.log(`\n[Daemon] Triggering scheduled 15-min run at ${new Date().toISOString()}...`);
        await runPublisher();
      } catch (err) {
        console.error('[Daemon] Scheduled run error:', err.message);
      } finally {
        scheduleNext();
      }
    }, delayMs);
  };

  scheduleNext();
}

startDaemon();
