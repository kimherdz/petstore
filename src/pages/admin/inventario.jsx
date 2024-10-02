import { useEffect, useState } from "react";
import { Table, Spinner, Button, Form } from "react-bootstrap";
import axios from "axios";
import './admin.css';

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
  const [sortOrder, setSortOrder] = useState('id'); // Estado para el orden
  const [sortDirection, setSortDirection] = useState('asc'); // Estado para la dirección

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

  // Ordenar productos
  const sortProducts = (a, b) => {
    const valueA = sortOrder === 'id' ? a.idproducto : (sortOrder === 'cantidad' ? a.stock : a.precio);
    const valueB = sortOrder === 'id' ? b.idproducto : (sortOrder === 'cantidad' ? b.stock : b.precio);

    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  };

  // Ordenar productos cuando cambia el estado
  const sortedProducts = productos.sort(sortProducts);

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

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleDirectionChange = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <>
      <h2>Inventario</h2>

      <Form.Group className="form-group-inline">
        <Form.Label className="label-inventario">Ordenar por:</Form.Label>
        <Form.Select onChange={handleSortChange} value={sortOrder}>
          <option value="id">ID</option>
          <option value="cantidad">Cantidad</option>
          <option value="precio">Precio</option>
        </Form.Select>

        <Button variant="info" onClick={handleDirectionChange}>
          Cambiar dirección: {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
        </Button>
        
      </Form.Group>

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
          {sortedProducts.map((producto, index) => (
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
