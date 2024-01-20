use parqueadero;

create table  if not exists users(
	id VARCHAR(15) NOT NULL PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    surname VARCHAR(40) NOT NULL
);

INSERT INTO users VALUES ("1004808761","Juan","Prieto"), ("123456789","Miguel","Martínez");
SELECT * FROM users;

create table if not exists transacciones(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    createdAt DATETIME NOT NULL,
    saldo INT NOT NULL DEFAULT(0),
    id_user VARCHAR(15) NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id)
);
UPDATE users SET id = "1234567890" WHERE id = "123456789";
INSERT transacciones VALUES (NULL, current_time(), 2500, "1004808761");

SELECT * FROM transacciones;