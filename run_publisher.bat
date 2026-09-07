@echo off
REM Reliable 30-min Facebook Publisher Launcher for Windows Task Scheduler
REM Runs the publisher every time the Task Scheduler fires.

set "BASE=C:\Users\Vov\.gemini\antigravity\scratch\block-puzzle-facebook-automation"
set "NODE_LOG=%BASE%\data\publisher_cron.log"

cd /d "%BASE%"

echo [%date% %time%] Publisher cron fired >> "%NODE_LOG%"
node src/publisher.js >> "%NODE_LOG%" 2>&1
echo [%date% %time%] Publisher cron finished (exit %errorlevel%) >> "%NODE_LOG%"