import { useEffect, useState } from "react";
import { Table, Spinner, Button, Form } from "react-bootstrap";
import axios from "axios";
import './admin.css';

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo: ''
  });
  const [sortOrder, setSortOrder] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

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
      updatedUsuarios[editIndex] = response.data;
      setUsuarios(updatedUsuarios);
      setEditIndex(null);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await axios.delete(`http://localhost:5000/api/clientes/${id}`);
        setUsuarios(usuarios.filter(usuario => usuario.idcliente !== id));
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
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
      <div className="adminbut2">
        <Button variant="secondary" onClick={() => navigate('/admin')}>
          Volver
        </Button>
      </div>

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

    <div className="container d-flex justify-content-center mt-3">
      <Table striped bordered hover>
        <thead>
        <tr className="text-center">
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((usuario, index) => (
            <tr key={usuario.idcliente}>
               <td className="text-center">{usuario.idcliente}</td>
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
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleInputChange}
                  />
                ) : (
                  usuario.email
                )}
              </td>
              <td className="text-center">
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
              <td className="text-center">
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
              <td className="text-center">
                {editIndex === index ? (
                  <> 
                  <Button variant="success" onClick={() => handleSave(usuario.idcliente)}>Guardar</Button>
                  <Button variant="danger" onClick={() => handleDelete(usuario.idcliente)}>Eliminar</Button>
                  </> 
                ) : (
                  <Button variant="primary" onClick={() => handleEditClick(index)}>Editar</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
    </>
  );
}
