import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function Users() {
    const [orderNumber, setOrderNumber] = useState('');
    const [courier, setCourier] = useState('');
    const [orderStatus, setOrderStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const courierOptions = [
        { value: '192.168.0.105', label: 'UG Express' },
        { value: '192.168.0.108', label: 'Entregas Mcqueen' },
        { value: '192.168.0.102', label: 'ALC Express' },
        { value: '192.168.0.110:8000', label: 'SpeedyBox' },
    ];

    const handleInputChange = (event) => {
        setOrderNumber(event.target.value); 
    };

    const handleCourierChange = (event) => {
        setCourier(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Número de pedido ingresado:", orderNumber);
        await fetchOrderStatus();
    };

    const fetchOrderStatus = async () => {
        if (!courier) {
            alert('Por favor, seleccione un courier.');
            return;
        }

        const tienda = 'Petstore';
        const formato = 'json';
        const url = `http://${courier}/status?orden=${orderNumber}&tienda=${tienda}&formato=${formato}`;
        console.log(url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al obtener el estado del pedido');
            }
            const data = await response.json();
            setOrderStatus(data);
            setShowModal(true);
        } catch (error) {
            console.error('Error al consultar el estado del pedido:', error);
            alert('No se pudo obtener el estado del pedido.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setOrderStatus(null);
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
                
                <Form.Group controlId="courierSelect">
                    <Form.Label>Elegir Courier</Form.Label>
                    <Form.Control
                        as="select"
                        value={courier}
                        onChange={handleCourierChange}
                        required
                    >
                        <option value="">Seleccione un courier</option>
                        {courierOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <button type="submit" className="btn btn-primary mt-3">Consultar</button>
            </form>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Estado del Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {orderStatus ? (
                        <pre>{JSON.stringify(orderStatus, null, 2)}</pre>
                    ) : (
                        <p>No se encontró información sobre el pedido.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
