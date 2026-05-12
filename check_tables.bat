@echo off
mysql -u root -h 127.0.0.1 -P 3306 student_advisor -e "SHOW TABLES;"
echo Exit code: %ERRORLEVEL%
