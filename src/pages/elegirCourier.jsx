import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function Courier() {
  const location = useLocation();
  const { total, email } = location.state || { total: 0, email: '' };
  const [destinatario, setDestinatario] = useState(''); // Campo para el destinatario
  const [destino, setDestino] = useState('');
  const [direccion, setDireccion] = useState(''); // Campo para la dirección
  const [tienda, setTienda] = useState(''); // Campo para la tienda
  const [formato, setFormato] = useState('json'); // Si es necesario, se puede usar
  const [postal, setPostal] = useState('');
  const [courier, setCourier] = useState('');
  const navigate = useNavigate();

  const courierOptions = [
    { value: '192.168.0.103/', label: 'UG Express' },
    { value: '192.168.0.115/', label: 'Entregas Mcqueen' },
    { value: '192.168.0.103/', label: 'ALC Express' },
    { value: '192.168.0.117/', label: 'SpeedyBox' },
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
    const url = `http://${encodeURIComponent(courier)}/envio?orden=___&destinatario=${encodeURIComponent(destinatario)}&destino=${encodeURIComponent(destino)}&direccion=${encodeURIComponent(direccion)}&tienda=Petstore`;
    console.log("Enviando solicitud a URL:", url);
    // Aquí podrías hacer una solicitud fetch para enviar la URL si es necesario
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

        <Form.Group controlId="destinatarioInput">
          <Form.Label>Destinatario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre del destinatario"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="destinoInput">
          <Form.Label>Destino</Form.Label>
          <Form.Control
            type="text"
            placeholder="Código postal del destino"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="direccionInput">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            placeholder="Dirección del envío"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
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
