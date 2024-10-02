import React, { useState } from 'react';
import axios from 'axios';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.post('http://localhost:5000/api/login', {
            email,
            password,
        });
        console.log('Login exitoso:', response.data);
        navigate('/courier', { state: { email: email } });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setError('Correo o contraseña incorrectos.');
        } else {
            setError('Error al intentar iniciar sesión. Inténtelo más tarde.');
        }
    }
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