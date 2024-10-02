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

  const navigate = useNavigate();

  useEffect(() => {
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

    fetchProductos();
  }, []);

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

  const handleProceedToLogin = () => {
    localStorage.setItem('total', total);
    navigate('/login'); 
  };

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
          <Button variant="primary" onClick={handleProceedToLogin}>
            Proceder al Courier
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Catalogo;
