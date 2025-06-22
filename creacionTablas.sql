CREATE TABLE DEPARTAMENTO (
    id_departamento INT PRIMARY KEY NOT NULL,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE MUNICIPIO (
    id_municipio INT PRIMARY KEY NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    id_departamento INT NOT NULL,
    FOREIGN KEY (id_departamento) REFERENCES DEPARTAMENTO(id_departamento)
);

CREATE TABLE ESTABLECIMIENTO (
    id_establecimiento INT PRIMARY KEY NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    id_municipio INT NOT NULL,
    FOREIGN KEY (id_municipio) REFERENCES MUNICIPIO(id_municipio)
);

CREATE TABLE CIRCUITO (
    id_circuito INT PRIMARY KEY NOT NULL,
    es_accesible BOOLEAN NOT NULL,
    es_interno BOOLEAN NOT NULL,
    zona VARCHAR(50) NOT NULL,
    barrio VARCHAR(100) NOT NULL,
    id_establecimiento INT NOT NULL,
    FOREIGN KEY (id_establecimiento) REFERENCES ESTABLECIMIENTO(id_establecimiento)
);

CREATE TABLE VOTANTE (
    ci BIGINT PRIMARY KEY NOT NULL,
    cc VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    id_circuito INT NOT NULL,
    FOREIGN KEY (id_circuito) REFERENCES CIRCUITO(id_circuito)
);

CREATE TABLE MIEMBRO_DE_MESA (
    ci BIGINT PRIMARY KEY NOT NULL,
    cc VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    organismo VARCHAR(100) NOT NULL,
    id_circuito INT NOT NULL,
    FOREIGN KEY (id_circuito) REFERENCES CIRCUITO(id_circuito)
);

CREATE TABLE AGENTE_POLICIAL (
    ci BIGINT PRIMARY KEY NOT NULL,
    cc VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    comisaria VARCHAR(100) NOT NULL,
    id_circuito INT NOT NULL,
    FOREIGN KEY (id_circuito) REFERENCES CIRCUITO(id_circuito)
);

CREATE TABLE CANDIDATO (
    ci BIGINT PRIMARY KEY NOT NULL,
    cc VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL
);

CREATE TABLE PARTIDO (
    nombre VARCHAR(100) PRIMARY KEY NOT NULL,
    direccion_sede VARCHAR(200) NOT NULL,
    presidente VARCHAR(100) NOT NULL,
    vicepresidente VARCHAR(100) NOT NULL
);

CREATE TABLE LISTA (
    id_lista INT PRIMARY KEY NOT NULL,
    numero_lista INT NOT NULL,
    organo VARCHAR(100) NOT NULL,
    orden INT NOT NULL,
    id_departamento INT NOT NULL,
    nombre_partido VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_departamento) REFERENCES DEPARTAMENTO(id_departamento),
    FOREIGN KEY (nombre_partido) REFERENCES PARTIDO(nombre)
);

CREATE TABLE PAPELETA (
    id_papeleta INT PRIMARY KEY NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    id_lista INT NOT NULL,
    FOREIGN KEY (id_lista) REFERENCES LISTA(id_lista)
);

CREATE TABLE VOTO (
    id_voto INT PRIMARY KEY NOT NULL,
    es_observado BOOLEAN NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    ci_votante BIGINT NOT NULL,
    id_papeleta INT NOT NULL,
    FOREIGN KEY (ci_votante) REFERENCES VOTANTE(ci),
    FOREIGN KEY (id_papeleta) REFERENCES PAPELETA(id_papeleta)
);

CREATE TABLE ES_PRESIDENTE (
    ci_votante BIGINT NOT NULL,
    nombre_partido VARCHAR(100) NOT NULL,
    PRIMARY KEY (ci_votante, nombre_partido),
    FOREIGN KEY (ci_votante) REFERENCES VOTANTE(ci),
    FOREIGN KEY (nombre_partido) REFERENCES PARTIDO(nombre)
);

CREATE TABLE ES_VICEPRESIDENTE (
    ci_votante BIGINT NOT NULL,
    nombre_partido VARCHAR(100) NOT NULL,
    PRIMARY KEY (ci_votante, nombre_partido),
    FOREIGN KEY (ci_votante) REFERENCES VOTANTE(ci),
    FOREIGN KEY (nombre_partido) REFERENCES PARTIDO(nombre)
);

CREATE TABLE VOTO_USA_PAPELETA (
    id_voto INT NOT NULL,
    id_papeleta INT NOT NULL,
    PRIMARY KEY (id_voto, id_papeleta),
    FOREIGN KEY (id_voto) REFERENCES VOTO(id_voto),
    FOREIGN KEY (id_papeleta) REFERENCES PAPELETA(id_papeleta)
);
