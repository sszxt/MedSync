@echo off
cd /d %~dp0
echo Adding files to git...
git add .

set /p commitmsg="Enter commit message: "
if "%commitmsg%"=="" set commitmsg=Auto commit

echo Committing with message: %commitmsg%
git commit -m "%commitmsg%"

echo Pushing to GitHub...
git push origin aakif-system

pause
