cd /d "%~dp0"
call npx htmlhint --config .htmlhintrc --nocolor ./**/*.html > html-validation-errors.txt