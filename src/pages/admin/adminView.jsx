import { Button, Nav, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './admin.css';

export default function AdminView() {
  return (
    <Container className="mt-4">
      <h2>Bienvenido Administrador</h2>
      <NavInventory />
    </Container>
  );
}

function NavInventory() {
  const navigate = useNavigate();
  
  return (
    <div className="adminbut">
        <Button variant="primary" onClick={() => navigate('/inventario')}>
          Inventario
        </Button>
        <Button variant="secondary" onClick={() => navigate('/usuarios')}>
          Usuarios
        </Button>
      </div>  
  );
}
