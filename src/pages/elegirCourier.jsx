import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

export default function Courier() {
  const location = useLocation();
  const { total, email } = location.state || { total: 0, email: '' };
  const [destinatario, setDestinatario] = useState('');
  const [destino, setDestino] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tienda] = useState('Petstore');
  const [courier, setCourier] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [costoEnvio, setCostoEnvio] = useState('');
  const [cobertura, setCobertura] = useState(null);
  const [numPedido, setNumPedido] = useState('');
  const navigate = useNavigate();

  const courierOptions = [
    { value: '192.168.0.104/consulta.php?', label: 'UG Express' },
    { value: '192.168.0.108/consulta.php?', label: 'Entregas Mcqueen' },
    { value: '192.168.0.102/consulta.php?', label: 'ALC Express' },
    { value: '192.168.0.110:8000/consulta?', label: 'SpeedyBox' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://${courier}destino=${encodeURIComponent(destino)}&formato=json`;
    console.log(url);
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      const { consultaprecio } = data;

      if (consultaprecio.cobertura === "false") {
        setModalMessage("El courrier no tiene cobertura sobre ese destino. Intente con otro courrier.");
        setCobertura(false);
      } else {
        setModalMessage(`Hay cobertura. El costo del envío es: ${consultaprecio.costo}`);
        setCostoEnvio(consultaprecio.costo);
        localStorage.setItem('costoEnvio', consultaprecio.costo);
        setCobertura(true);
      }
      setModalShow(true);
      
    } catch (error) {
      console.error('Error al consultar el costo de envío:', error);
      setModalMessage("Error en la consulta del costo de envío. Intente nuevamente.");
      setModalShow(true);
    }
  };

  const handleProceedToPayment = () => {
    const url = `http://${courier}/envio?orden=${encodeURIComponent(numPedido)}&destinatario=${encodeURIComponent(destinatario)}&destino=${encodeURIComponent(destino)}&direccion=${encodeURIComponent(direccion)}&tienda=${tienda}`;
    console.log("Enviando solicitud a URL:", url);
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

        <Form.Group controlId="ordenInput">
          <Form.Label>No. Orden</Form.Label>
          <Form.Control
            type="text"
            placeholder="Número de orden"
            value={numPedido}
            onChange={(e) => setNumPedido(e.target.value)}
          />
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

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resultado de la Consulta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage}
          {cobertura === true && <div>Costo del envío: {costoEnvio}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
