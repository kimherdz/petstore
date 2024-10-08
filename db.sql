CREATE TABLE Producto(
	idproducto SERIAL NOT NULL PRIMARY KEY,
	nombre VARCHAR (100) NOT NULL,
	precio DECIMAL(10,2) NOT NULL,
	descripcion TEXT,
	stock INTEGER NOT NULL
);

CREATE TABLE Clientes(
	idcliente SERIAL NOT NULL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(100) NOT NULL,
	telefono VARCHAR(15),
	direccion TEXT,
	tipo VARCHAR(1),
	postal INTEGER,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Pedidos (
    idpedido SERIAL PRIMARY KEY,
    idcliente INTEGER REFERENCES Clientes(idcliente),
    total DECIMAL(10, 2),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

