@echo off
echo Creating database for Smart Greenhouse Monitoring System...

java -cp "target/classes;%USERPROFILE%\.m2\repository\mysql\mysql-connector-java\8.0.33\mysql-connector-java-8.0.33.jar" com.greenhouse.util.DatabaseCreator

echo.
echo Database creation completed.
pause