import axios from 'axios';
import { useEffect, useState } from 'react';
import { Spinner, Table } from 'react-bootstrap';
export default function Users(){
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>{
        const fetchUsuarios = async () =>{
            try {
                const response = await axios.get('http://localhost:5000/api/clientes');
                setUsuarios(response.data);
            } catch (error) {
                setError(error.message);
            } finally{
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, []);

    if(loading){
        return <Spinner animation="border" />
    }else if (error){
        return <div>Error al cargar los productos: {error}</div>;
    }
    return(
        <>
        <h2>Usuarios</h2>
        <Table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Tipo</th>
                    <th>Fecha de registro</th>
                </tr>
            </thead>
            <tbody>
                {usuarios.map((usuario) =>(
                    <tr key={usuario.idcliente}>
                        <td>{usuario.idcliente}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.telefono}</td>
                        <td>{usuario.direccion}</td>
                        <td>{usuario.tipo}</td>
                        <td>{usuario.fecha_registros}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    );
}