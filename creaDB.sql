-- Script para creacion de base de datos de usuarios

DROP TABLE usuarios;


CREATE TABLE usuarios(
	id varchar(50) not null,
	nombre varchar(50) not null,
	password varchar(40) not null,
	CONSTRAINT pk_usuario PRIMARY KEY(id)
	);

-- Algunos usuarios de prueba

INSERT INTO usuarios VALUES('mesut10','Mesut Ozil', MD5('soy el 10'));
INSERT INTO usuarios VALUES('sr4','Sergio Ramos', MD5('soy el 4'));
INSERT INTO usuarios VALUES('xabiA','Xabi Alonso', MD5('soy el 14'));
INSERT INTO usuarios VALUES('DiMaria','Angel Di Maria', MD5('soy el 22'));