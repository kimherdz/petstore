import { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import axios from "axios";

export default function Inventory() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/productos");
                setProductos(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error al cargar los productos: {error}</div>;
    }

    return (
        <>
            <h2>Inventario</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.idproducto}>
                            <td>{producto.idproducto}</td>
                            <td>{producto.nombre}</td>
                            <td>{typeof producto.precio === 'number' ? producto.precio.toFixed(2) : producto.precio}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.stock > 0 ? producto.stock : 'Sin stock'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
