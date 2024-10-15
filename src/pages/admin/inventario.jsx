import { useEffect, useState } from "react";
import { Table, Spinner, Button, Form } from "react-bootstrap";
import axios from "axios";
import './admin.css';
import { Link } from "react-router-dom";

export default function Inventory() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null); 
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    stock: ''
  });
  const [newProductData, setNewProductData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    stock: ''
  });
  const [sortOrder, setSortOrder] = useState('id'); 
  const [sortDirection, setSortDirection] = useState('asc');

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

  // Función para manejar la entrada en el formulario de nuevos productos
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProductData({
      ...newProductData,
      [name]: value,
    });
  };

  // Función para enviar el nuevo producto al backend
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/productos', newProductData);
      setProductos([...productos, response.data]); // Añadir el nuevo producto a la lista
      setNewProductData({ nombre: '', precio: '', descripcion: '', stock: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error al cargar los productos: {error}</div>;
  }

  return (
    <>
      <h2>Inventario</h2>

      <div className="adminbut2">
        <Link to="/admin">
          <Button className="menu-button mb-3">Regresar</Button>
        </Link>
      </div>

      {/* Formulario para agregar un nuevo producto */}
      <Form onSubmit={handleAddProduct}>
        <h4>Añadir nuevo producto</h4>
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={newProductData.nombre}
            onChange={handleNewProductChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            name="precio"
            value={newProductData.precio}
            onChange={handleNewProductChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            name="descripcion"
            value={newProductData.descripcion}
            onChange={handleNewProductChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Cantidad (Stock)</Form.Label>
          <Form.Control
            type="number"
            name="stock"
            value={newProductData.stock}
            onChange={handleNewProductChange}
            required
          />
        </Form.Group>
        <Button variant="success" type="submit" className="mt-2">
          Añadir Producto
        </Button>
      </Form>

      {/* Tabla de productos */}
      <div className="container d-flex justify-content-center mt-3">
        <Table striped bordered hover>
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={producto.idproducto}>
                <td className="text-center">{producto.idproducto}</td>
                <td>{producto.nombre}</td>
                <td className="text-center">{producto.precio}</td>
                <td>{producto.descripcion}</td>
                <td className="text-center">{producto.stock > 0 ? producto.stock : "Sin stock"}</td>
                <td className="text-center">
                  {/* Botones de editar y eliminar */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
