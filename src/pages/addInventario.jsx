import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

//ruta: http://localhost:5173/nuevoProducto
export default function AddNewItem(){
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const nuevoProducto = {
        nombre,
        precio: parseFloat(precio),
        descripcion,
        cantidad: parseInt(cantidad, 10),
        };

        console.log(nuevoProducto); 

        
        setNombre('');
        setPrecio('');
        setDescripcion('');
        setCantidad('');
    };

    return (
        <Container>
        <h2>Agregar Nuevo Producto</h2>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nombreProducto">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
                type="text"
                placeholder="Ingresa el nombre del producto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
            </Form.Group>

            <Form.Group controlId="precioProducto">
            <Form.Label>Precio</Form.Label>
            <Form.Control
                type="number"
                placeholder="Ingresa el precio"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
            />
            </Form.Group>

            <Form.Group controlId="descripcionProducto">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
                type="text"
                placeholder="Ingresa una descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
            />
            </Form.Group>

            <Form.Group controlId="cantidadProducto">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
                type="number"
                placeholder="Ingresa la cantidad disponible"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
            />
            </Form.Group>

            <Button variant="primary" type="submit">
            Agregar Producto
            </Button>
        </Form>
        </Container>
    );
        
}