import React, { useState } from 'react';

const ProcessPayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  //(Algoritmo de Luhn)
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
    const parts = expiryDate.split('/');
    if (parts.length !== 2) {
      return false;
    }

    const month = parseInt(parts[0], 10);
    const year = parseInt('20' + parts[1], 10);
    const today = new Date();
    const currentMonth = today.getMonth() + 1;

    return (
      month >= 1 &&
      month <= 12 &&
      (year > today.getFullYear() || (year === today.getFullYear() && month >= currentMonth))
    );
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateCardNumber(cardNumber)) {
      setMessage('Número de tarjeta de crédito inválido.');
      return;
    }

    if (!validateExpiryDate(expiryDate)) {
      setMessage('Fecha de vencimiento inválida o tarjeta vencida.');
      return;
    }

    if (!validateCVV(securityCode)) {
      setMessage('Código de seguridad inválido.');
      return;
    }

    // URL de la API para la autorización del pago
    const url = `http://emisor/autorizacion?tarjeta=${cardNumber}&nombre=${cardName}&fecha_venc=${expiryDate}&num_seguridad=${securityCode}&monto=${amount}&tienda=Petstore&formato=json`;

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
        <label htmlFor="cardNumber">Número de Tarjeta:</label>
        <input
          type="text"
          id="cardNumber"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
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

        <label htmlFor="expiryDate">Fecha de Vencimiento (MM/YY):</label>
        <input
          type="text"
          id="expiryDate"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          maxLength="5"
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

        <label htmlFor="amount">Monto a Pagar:</label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        /><br />

        <button type="submit">Pagar</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ProcessPayment;
