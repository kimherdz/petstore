import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import petsandtrails from './petsandtrails.png';
import './catcss.css';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orderNumber, setOrderNumber] = useState(''); // Estado para el número de pedido
  const [showOrderModal, setShowOrderModal] = useState(false); // Estado para el modal del número de pedido

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/login');
    } else {
      setIsLoggedIn(true);
      fetchProductos();
    }
  }, [navigate]);

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/productos");
      const data = await response.json();
      const productosEnStock = data.filter(producto => producto.stock > 0);
      setProductos(productosEnStock);
    } catch (error) {
      console.error('Error en búsqueda de productos', error);
    }
  };

  const addToCart = (id, price, name) => {
    const priceNumber = parseFloat(price.replace(/[^\d.-]/g, ''));
    setCart([...cart, { id, name, price: priceNumber, quantity: 1, totalPrice: priceNumber }]);
    setTotal(prevTotal => prevTotal + priceNumber);
  };

  const renderCartItems = () => {
    return cart.map((item) => (
      <li key={item.id}>
        {item.name} - Q{item.price.toFixed(2)}
      </li>
    ));
  };

  const filteredProducts = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleOrderModalClose = () => {
    setShowOrderModal(false);
    navigate('/courier'); // Navegar a la página del courier cuando el modal se cierra
  }; // Función para cerrar el modal del número de pedido

  const handleProceedToCourier = async () => {
    localStorage.setItem('total', total);
    const email = localStorage.getItem('email');

    // Generar un número de pedido
    const generatedOrderNumber = await createOrder(email, total);
    
    if (generatedOrderNumber) {
      setOrderNumber(generatedOrderNumber); // Guarda el número de pedido en el estado
      setShowOrderModal(true); // Mostrar el modal con el número de pedido
    } else {
      console.error('No se pudo generar el número de pedido');
    }
  };

  const createOrder = async (email, total) => {
    try {
      const response = await fetch('http://localhost:5000/api/pedidos', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, total }),
      });

      if (response.ok) {
          const result = await response.json();
          console.log('Número de pedido generado:', result.orderNumber);
          return result.orderNumber;
      } else {
          console.error('Error al crear el pedido:', response.statusText);
          return null;
      }
    } catch (error) {
      console.error('Error en la solicitud de creación de pedido:', error);
      return null;
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <div className="image-container">
        <img src={petsandtrails} alt="Imagen de Productos" className="catalog-image" />
      </div>
      
      <h2>Productos</h2>

      <div className="filtro">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='but'>
        <Button variant="primary" onClick={handleShow}>
          Ver Carrito
        </Button>
      </div>

      <div id="product-list">
        {filteredProducts.map((producto) => (
          <div className="product" key={producto.id}>
            <h3>{producto.nombre}</h3>
            <p>Precio: Q{parseFloat(producto.precio.replace(/[^\d.-]/g, '')).toFixed(2)}</p>
            <button onClick={() => addToCart(producto.id, producto.precio, producto.nombre)}>
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>

      <Modal 
        show={showModal} 
        onHide={handleClose} 
        size="lg" 
        centered
        dialogClassName='custom-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Carrito de Compras</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul id="cart-items">{renderCartItems()}</ul>
          <p>Total: Q{total.toFixed(2)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleProceedToCourier}>
            Proceder al Courier
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para mostrar el número de pedido generado */}
      <Modal 
        show={showOrderModal} 
        onHide={handleOrderModalClose} 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Número de Pedido Generado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Su número de pedido es: <strong>{orderNumber}</strong></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOrderModalClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Catalogo;
