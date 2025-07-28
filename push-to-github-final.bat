@echo off
echo ========================================
echo Pushing to GitHub Repository
echo ========================================

echo.
echo 1. Checking Git status...
"C:\Program Files\Git\bin\git.exe" status

echo.
echo 2. Adding any new files...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo 3. Committing changes...
"C:\Program Files\Git\bin\git.exe" commit -m "Update: Janu E-commerce Backend"

echo.
echo 4. Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
echo ========================================
echo Push completed!
echo ========================================
echo.
echo Repository URL: https://github.com/SagarikaVandana/janu-ecommerce-backend
echo.
pause 