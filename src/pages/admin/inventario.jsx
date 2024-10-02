import { useEffect, useState } from "react";
import { Table, Spinner, Button, Form } from "react-bootstrap";
import axios from "axios";

export default function Inventory() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null); // Indica qué producto se está editando
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    stock: ''
  });

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

  const handleEditClick = (index) => {
    setEditIndex(index);
    setFormData({
      nombre: productos[index].nombre,
      precio: productos[index].precio,
      descripcion: productos[index].descripcion,
      stock: productos[index].stock
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/productos/${id}`, formData);
      const updatedProductos = [...productos];
      updatedProductos[editIndex] = response.data; // Actualiza el producto editado
      setProductos(updatedProductos);
      setEditIndex(null); // Salir del modo edición
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={producto.idproducto}>
              <td>{producto.idproducto}</td>
              <td>
                {editIndex === index ? (
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                ) : (
                  producto.nombre
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <Form.Control
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                  />
                ) : (
                  typeof producto.precio === "number" ? producto.precio.toFixed(2) : producto.precio
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <Form.Control
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                  />
                ) : (
                  producto.descripcion
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                ) : (
                  producto.stock > 0 ? producto.stock : "Sin stock"
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <Button variant="success" onClick={() => handleSave(producto.idproducto)}>Guardar</Button>
                ) : (
                  <Button variant="primary" onClick={() => handleEditClick(index)}>Editar</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
