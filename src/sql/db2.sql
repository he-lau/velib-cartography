CREATE TABLE station (
    stationcode INT PRIMARY KEY,
    name VARCHAR(255),
    nom_arrondissement_communes VARCHAR(255),    
    lon FLOAT,
    lat FLOAT
);

/*
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stationcode INT,
    log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    numbikesavailable INT,
    numdocksavailable INT,
    capacity INT,    
    duedate TIMESTAMP NULL,
    ebike TINYINT(1), 
    is_installed TINYINT(1),
    is_renting TINYINT(1),
    is_returning TINYINT(1),
    mechanical INT,
    FOREIGN KEY (stationcode) REFERENCES station(stationcode)
);
*/

CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stationcode INT,
    log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    numbikesavailable INT,
    numdocksavailable INT,
    capacity INT,    
    duedate TIMESTAMP NULL,
    ebike TINYINT(1), 
    is_installed ENUM('OUI', 'NON'),
    is_renting ENUM('OUI', 'NON'),
    is_returning ENUM('OUI', 'NON'),
    mechanical INT,
    FOREIGN KEY (stationcode) REFERENCES station(stationcode)
);
