import React, { useState } from 'react';

export default function Users() {
    const [orderNumber, setOrderNumber] = useState('');

    const handleInputChange = (event) => {
        setOrderNumber(event.target.value); 
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Número de pedido ingresado:", orderNumber);
    };

    return (
        <>
            <h2>Estado de envío del pedido</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="orderNumber" className="form-label">Ingrese su número de pedido</label>
                    <input
                        type="text"
                        id="orderNumber"
                        className="form-control"
                        value={orderNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Consultar</button>
            </form>
        </>
    );
}
