import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function Courier() {
  const location = useLocation();
  const { total, email } = location.state || { total: 0, email: '' }; // Recibe el email del usuario loggeado
  const [destino, setDestino] = useState(''); // Almacenará el código postal
  const [formato, setFormato] = useState('json');
  const [postal, setPostal] = useState('');
  const [courier, setCourier] = useState(''); // Almacenará el courier seleccionado
  const navigate = useNavigate();

  // Opciones de courier (ejemplos)
  const courierOptions = [
    { value: 'C1', label: 'Courier 1' },
    { value: 'C2', label: 'Courier 2' },
    { value: 'C3', label: 'Courier 3' },
  ];

  useEffect(() => {
    const fetchPostal = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getPostal?email=${email}`);
        const data = await response.json();
        if (data.postal) {
          setPostal(data.postal);
          setDestino(data.postal); // Setear el destino automáticamente al código postal
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
    const url = `http://courrier/consulta?destino=${destino}&formato=${formato}&courier=${courier}`;
    console.log("Enviando solicitud a URL:", url);
  };

  const handleProceedToPayment = () => {
    navigate('/payment', { state: { total: total } });
  };

  return (
    <>
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

        <Button variant="primary" type="submit">
          Consultar Costo de Envío
        </Button>
      </Form>

      <br />
      <Button variant="success" onClick={handleProceedToPayment}>
        Proceder al Pago
      </Button>
    </>
  );
}
