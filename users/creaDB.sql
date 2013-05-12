-- Script para creacion de base de datos de usuarios

DROP TABLE usuarios;
DROP TABLE cookies;

CREATE TABLE usuarios(
	id varchar(50) not null,
	nombre varchar(50) not null,
	password varchar(40) not null,
	CONSTRAINT pk_usuario PRIMARY KEY(id)
	);


CREATE TABLE usuarios2(
	id varchar(50) not null,
	nombre varchar(50) not null,
	password varchar(40) not null,
	CONSTRAINT pk_usuario PRIMARY KEY(id)
	);


CREATE TABLE cookies(
	id varchar(50) not null,
	cookie varchar(100) not null,
	CONSTRAINT pk_cookie PRIMARY KEY(id)
	);



-- Algunos usuarios de prueba

INSERT INTO usuarios VALUES('mesut10','Mesut Ozil', MD5('soy el 10'));
INSERT INTO usuarios VALUES('sr4','Sergio Ramos', MD5('soy el 4'));
INSERT INTO usuarios VALUES('xabiA','Xabi Alonso', MD5('soy el 14'));
INSERT INTO usuarios VALUES('DiMaria','Angel Di Maria', MD5('soy el 22'));
INSERT INTO usuarios VALUES('alumno','Alumno', MD5('alumno'));
INSERT INTO cookies VALUES('sr4',"");

INSERT INTO cookies VALUES('xabiA',"");
INSERT INTO cookies VALUES('mesut10',"");
INSERT INTO cookies VALUES('DiMaria',"");

INSERT INTO usuarios2 VALUES('mesut10','Mesut Ozil', SHA('soy el 10'));
INSERT INTO usuarios2 VALUES('sr4','Sergio Ramos', SHA('soy el 4'));
INSERT INTO usuarios2 VALUES('xabiA','Xabi Alonso', SHA('soy el 14'));
INSERT INTO usuarios2 VALUES('DiMaria','Angel Di Maria', SHA('soy el 22'));
INSERT INTO usuarios2 VALUES('alumno','Alumno', SHA('alumno'));