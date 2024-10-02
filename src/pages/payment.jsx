import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../catalogo/catcss.css';
import { Form, Button } from 'react-bootstrap';

const Payment = () => {
  const location = useLocation();
  const total = parseFloat(localStorage.getItem('total')) || 0;
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [message, setMessage] = useState('');
  const [emisor, setEmisor] = useState('');

  const cardOptions = [
    { value: 'Visa', label: 'Visa' },
    { value: 'American Express', label: 'American Express' },
    { value: 'Master Card', label: 'Master Card' },
    { value: 'Credomatic', label: 'Credomatic' },
  ];

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardNumber(value);
  };

  const validateCardNumber = (cardNumber) => {
    return cardNumber.length === 16;
  };

  const validateExpiryDate = (expiryDate) => {
    const today = new Date();
    const year = parseInt(expiryDate.substring(0, 4), 10);
    const month = parseInt(expiryDate.substring(4, 6), 10);

    return (
      year > today.getFullYear() ||
      (year === today.getFullYear() && month >= today.getMonth() + 1)
    );
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  // Envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateCardNumber(cardNumber)) {
      alert('Número de tarjeta de crédito inválido. Debe tener 16 dígitos.');
      return;
    }

    if (!validateExpiryDate(expiryDate)) {
      alert('Fecha de vencimiento inválida o tarjeta vencida.');
      return;
    }

    if (!validateCVV(securityCode)) {
      alert('Código de seguridad inválido.');
      return;
    }

    // URL de la API para la autorización del pago
    const url = `http://${encodeURIComponent(emisor)}/autorizacion?tarjeta=${cardNumber}&nombre=${cardName}&fecha_venc=${expiryDate}&num_seguridad=${securityCode}&monto=${total}&tienda=Petstore&formato=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.autorizacion.status === 'APROBADO') {
        setMessage(`Pago aprobado. Número de autorización: ${data.autorizacion.numero}`);
      } else {
        setMessage('Pago denegado.');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setMessage('Ocurrió un error al procesar el pago.');
    }
  };

  return (
    <div>
      <h2>Pago</h2>
      <form onSubmit={handleSubmit}>

      <Form.Group controlId="cardSelect">
            <Form.Label>Elegir Emisor</Form.Label>
            <Form.Control
              as="select"
              value={emisor}
              onChange={(e) => setEmisor(e.target.value)}
            >
              <option value="">Seleccione un emisor</option>
              {cardOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

        <label htmlFor="cardNumber">Número de Tarjeta:</label>
        <input
          type="text"
          id="cardNumber"
          inputMode='numeric'
          value={cardNumber}
          onChange={handleCardNumberChange}
          maxLength="16"
          required
        /><br />

        <label htmlFor="cardName">Nombre del Titular:</label>
        <input
          type="text"
          id="cardName"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
        /><br />

        <label htmlFor="expiryDate">Fecha de Vencimiento (YYYYMM):</label>
        <input
          type="text"
          id="expiryDate"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          maxLength="6"
          required
        /><br />

        <label htmlFor="securityCode">Código de Seguridad (CVV):</label>
        <input
          type="text"
          id="securityCode"
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
          maxLength="3"
          required
        /><br />
        
        <p className="monto-total">Monto total a Pagar: Q{total.toFixed(2)}</p>

        <button type="submit">Pagar</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Payment;
