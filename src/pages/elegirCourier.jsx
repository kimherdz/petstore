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
          setDestino(data.postal); // Use the fetched postal code as the 'destino'
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
    if (!courier || !destino) {
      console.error('Debe seleccionar un courier y un destino válido.');
      return;
    }

    // Dynamically construct the endpoint using the selected courier and destination.
    const encodedCourier = encodeURIComponent(courier);
    const url = `http://192.168.1.100/crud-actividades/backend/Insertarpedido.php?orden=530&destinatario=${encodeURIComponent(destino)}&destino=${encodeURIComponent(destino)}&direccion=porahi&tienda=${encodedCourier}&formato=${formato}`;
    
    console.log("Enviando solicitud a URL:", url);

    // Here you can use FetchAPIs or handle the fetch directly.
    FetchAPIs(url, 'status');
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

        <Button variant="primary" type="submit">
          Consultar Costo de Envío
        </Button>
      </Form>

      <br />
      <Button
        className="butt0n" 
        variant="success" 
        onClick={handleProceedToPayment} 
        style={{ display: 'block', margin: '0 auto' }}
      >
        Proceder al Pago
      </Button>
    </>
  );
}

async function FetchAPIs(endpoint, fieldName) {
  try {
    const req = await fetch(endpoint);
    const contentType = req.headers.get('content-type');

    let res;
    let fieldValue;

    if (contentType.includes('application/json')) {
      res = await req.json();
      fieldValue = res[fieldName];
    } else if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
      const text = await req.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'application/xml');
      const fieldElement = xmlDoc.querySelector(fieldName);
      fieldValue = fieldElement ? fieldElement.textContent : null;
    } else {
      throw new Error('Unsupported content type');
    }

    console.log(fieldValue);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
