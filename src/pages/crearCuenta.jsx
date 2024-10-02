import React, { useState } from 'react';
import './style.css';
import axios from 'axios';

const CrearCuenta = () => {
  // Estados para manejar los campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [postal, setPostal] = useState('');
  const [tipo, setTipo] = useState('usuario'); // Valor por defecto a 'usuario'
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postalRegex = /^\d{5}$/; // Expresión regular para 5 dígitos
    if (!postalRegex.test(postal)) {
      setError('El código postal debe contener exactamente 5 dígitos.');
      return;
    }
    
    const data = {
      nombre,
      email,
      contraseña,
      telefono,
      direccion,
      tipo,
      postal,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/clientes', data);
      console.log('Cliente registrado:', response.data);
      alert('Cuenta creada exitosamente');
      setError('');
    } catch (error) {
      console.error('Error al registrar la cuenta:', error);
      alert('Error al crear la cuenta');
    }
  };

  return (
    <div className="container">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>

      <label htmlFor="Name">Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <br />

        <label htmlFor="Email">Correo Electrónico:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <label htmlFor="Password">Contraseña:</label>
        <input
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <br />

        <label htmlFor="Phone">Número de teléfono:</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <br />

        <label htmlFor="Adress">Dirección:</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />
        <br />

        <label htmlFor="Postal">Código Postal:</label>
        <input
          type="text"
          value={postal}
          onChange={(e) => setPostal(e.target.value)}
          required
        />
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}

        
        <label>Tipo de cuenta</label>
        <div className='radio-admin'>
        
        <input
          type="radio"
          name="typeRadio"
          value="administrador"
          checked={tipo === 'administrador'}
          onChange={() => setTipo('administrador')}
        /> 
        Administrador
        </div>
        <div className='radio-user'>
        <input
          type="radio"
          name="typeRadio"
          value="usuario"
          checked={tipo === 'usuario'}
          onChange={() => setTipo('usuario')}
        />
        Usuario
        </div>
        <br />
        <button type="submit" className="button">Ingresar</button>
      </form>

      
    </div>
  );
};

export default CrearCuenta;
