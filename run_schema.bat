@echo off
mysql -u root -h 127.0.0.1 -P 3306 < "C:\Users\Putu Rifki Dirkayuda\student-advisor\backend\schema.sql"
echo Exit code: %ERRORLEVEL%
