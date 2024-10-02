import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function Courier() {
  const location = useLocation();
  const { total, email } = location.state || { total: 0, email: '' };
  const [destino, setDestino] = useState('');
  const [formato, setFormato] = useState('json');
  const [postal, setPostal] = useState('');
  const [courier, setCourier] = useState('');
  const navigate = useNavigate();

  const courierOptions = [
    { value: 'UG Express', label: 'UG Express' },
    { value: 'Entregas Mcqueen', label: 'Entregas Mcqueen' },
    { value: 'ALC Express', label: 'ALC Express' },
    { value: 'SpeedyBox', label: 'SpeedyBox' },
  ];

  useEffect(() => {
    const fetchPostal = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getPostal?email=${email}`);
        const data = await response.json();
        if (data.postal) {
          setPostal(data.postal);
          setDestino(data.postal);
        }
      } catch (error) {
        console.error('Error al obtener el código postal', error);
      }
    };

    if (email) {
      fetchPostal();
    }
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `http://${encodeURIComponent(courier)}/consulta?destino=${destino}&formato=${formato}`;
    console.log("Enviando solicitud a URL:", url);
  };

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  return (
    <>
    <h2 className="courier-title">Courier</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="courierSelect">
          <Form.Label>Elegir Courier</Form.Label>
          <Form.Control
            as="select"
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
          >
            <option value="">Seleccione un courier</option>
            {courierOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="postalInput">
          <Form.Label>Código Postal</Form.Label>
          <Form.Control
            type="text"
            placeholder="Código postal del usuario"
            value={postal}
            readOnly
          />
        </Form.Group>

        <Button variant="primary" type="submit" >
          Consultar Costo de Envío
        </Button>
      </Form>

      <br />
      <Button
      className="butt0n" 
      variant="success" 
      onClick={handleProceedToPayment} 
      style={{ display: 'block', margin: '0 auto' }}>
        Proceder al Pago
      </Button>
    </>
  );
}
