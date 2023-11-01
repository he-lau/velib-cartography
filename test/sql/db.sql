CREATE TABLE velib_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stationcode INT,
    log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lon FLOAT,
    lat FLOAT,
    capacity INT,
    duedate TIMESTAMP NULL,
    ebike TINYINT(1),
    is_installed TINYINT(1),
    is_renting TINYINT(1),
    is_returning TINYINT(1),
    mechanical INT,
    name VARCHAR(255),
    nom_arrondissement_communes VARCHAR(255),
    numbikesavailable INT,
    numdocksavailable INT
);
