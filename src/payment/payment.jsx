import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../catalogo/catcss.css';

const Payment = () => {

  const location = useLocation();
  const total = parseFloat(localStorage.getItem('total')) || 0;
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');

  //validacion (Algoritmo de Luhn)
  const validateCardNumber = (cardNumber) => {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const validateExpiryDate = (expiryDate) => {
    const today = new Date();
    const parts = expiryDate.split('/');

    if (parts.length !== 2) {
      return false;
    }

    const month = parseInt(parts[0], 10);
    const year = parseInt('20' + parts[1], 10);

    return (
      month >= 1 &&
      month <= 12 &&
      (year > today.getFullYear() || (year === today.getFullYear() && month >= today.getMonth() + 1))
    );
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  //envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateCardNumber(cardNumber)) {
      alert('Número de tarjeta de crédito inválido.');
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

    alert('Pago exitoso');
  };

  return (
    <div>
      <h2>Pago</h2>

        <form id="paymentForm" onSubmit={handleSubmit}>
          <label htmlFor="cardNumber">Número de Tarjeta:</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            maxLength="16"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          /><br />

          <label htmlFor="cardName">Nombre del Titular:</label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          /><br />

          <label htmlFor="expiryDate">Fecha de Vencimiento (MM/YY):</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            maxLength="5"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          /><br />

          <label htmlFor="securityCode">Código de Seguridad (CVV):</label>
          <input
            type="text"
            id="securityCode"
            name="securityCode"
            maxLength="3"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
            required
          /><br />
          <p className="monto-total">Monto total a Pagar: Q{total.toFixed(2)}</p>


          <button type="submit">Pagar</button>
        </form>
    </div>
  );
};

export default Payment;
