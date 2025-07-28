@echo off
echo ========================================
echo Pushing Backend Files to GitHub
echo ========================================

echo.
echo 1. Initializing Git repository...
git init

echo.
echo 2. Adding all files...
git add .

echo.
echo 3. Making initial commit...
git commit -m "Initial commit: Janu E-commerce Backend"

echo.
echo 4. Adding remote origin...
git remote add origin https://github.com/SagarikaVandana/janu-ecommerce-backend.git

echo.
echo 5. Pushing to main branch...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Push completed successfully!
echo ========================================
pause 