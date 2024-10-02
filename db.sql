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

CREATE TABLE Ventas(
	idventa SERIAL NOT NULL PRIMARY KEY,
	fecha DATE NOT NULL,
    courier VARCHAR(30),
	total_venta DECIMAL(10, 2),
	idcliente INT NOT NULL,
	FOREIGN KEY(idcliente) REFERENCES Clientes(idcliente)
);

CREATE TABLE DetalleVentas(
    iddetalle SERIAL PRIMARY KEY,
    idventa INTEGER NOT NULL,
    idproducto INTEGER NOT NULL,
    cantidad_comprada INTEGER NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY(idventa) REFERENCES Ventas(idventa),
    FOREIGN KEY(idproducto) REFERENCES Producto(idproducto)
);
