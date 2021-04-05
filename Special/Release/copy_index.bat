@echo off
for /D %%a in ("C:\Projects\Sources\kik1975.github.io\Special\Gamers\*.*") do xcopy /y /d "C:\Projects\Sources\kik1975.github.io\Special\Release\index.html" "%%a"