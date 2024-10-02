import React, { useState } from 'react';
import './style.css'; // Asegúrate de importar tu archivo CSS aquí
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    console.log('Datos a enviar:', data);
  };

  return (
    <div className="container">
    <h2>Inicio de sesión</h2>
      <form onSubmit={handleSubmit}>
        
        <label htmlFor="correo">Correo Electrónico:</label>
        <input
          type="text"
          id="correo"
          name="correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="Contraseña"
          name="contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        
        <button type="submit" className="button">Ingresar</button>
        <br />
        
        <a href="/crearCuenta" className="createAccount">¿No tiene una cuenta?</a> 
      </form>      
    </div>
  );
};

export default Login;
