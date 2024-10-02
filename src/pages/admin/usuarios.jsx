import { useEffect, useState } from "react";
import { Table, Spinner, Button, Form } from "react-bootstrap";
import axios from "axios";
import './admin.css'; // Asegúrate de tener tu CSS adecuado

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null); // Indica qué usuario se está editando
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo: ''
  });
  const [sortOrder, setSortOrder] = useState('id'); // Estado para el orden
  const [sortDirection, setSortDirection] = useState('asc'); // Estado para la dirección

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clientes");
        setUsuarios(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Ordenar usuarios
  const sortUsers = (a, b) => {
    const valueA = sortOrder === 'id' ? a.idcliente : (sortOrder === 'nombre' ? a.nombre : a.tipo);
    const valueB = sortOrder === 'id' ? b.idcliente : (sortOrder === 'nombre' ? b.nombre : b.tipo);

    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  };

  // Ordenar usuarios cuando cambia el estado
  const sortedUsers = usuarios.sort(sortUsers);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error al cargar los usuarios: {error}</div>;
  }

  const handleEditClick = (index) => {
    setEditIndex(index);
    setFormData({
      nombre: usuarios[index].nombre,
      email: usuarios[index].email,
      telefono: usuarios[index].telefono,
      direccion: usuarios[index].direccion,
      tipo: usuarios[index].tipo
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
      const response = await axios.put(`http://localhost:5000/api/clientes/${id}`, formData);
      const updatedUsuarios = [...usuarios];
      updatedUsuarios[editIndex] = response.data; // Actualiza el usuario editado
      setUsuarios(updatedUsuarios);
      setEditIndex(null); // Salir del modo edición
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
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
      <h2>Usuarios</h2>

      <Form.Group className="form-group-inline">
        <Form.Label className="label-inventario">Ordenar por:</Form.Label>
        <Form.Select onChange={handleSortChange} value={sortOrder}>
          <option value="id">ID</option>
          <option value="nombre">Nombre</option>
          <option value="tipo">Tipo</option>
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
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Tipo</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((usuario, index) => (
            <tr key={usuario.idcliente}>
              <td>{usuario.idcliente}</td>
              <td>
                {editIndex === index ? (
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                ) : (
                  usuario.nombre
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <Form.Control
                    type="email" // Campo de tipo email
                    name="email"
                    value={formData.email} // Ahora editable
                    onChange={handleInputChange}
                  />
                ) : (
                  usuario.email
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                ) : (
                  usuario.telefono
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                ) : (
                  usuario.direccion
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <Form.Control
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                  />
                ) : (
                  usuario.tipo
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <Button variant="success" onClick={() => handleSave(usuario.idcliente)}>Guardar</Button>
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
