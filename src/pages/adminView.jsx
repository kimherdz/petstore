
import { Button, Form, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AdminView(){

    
    return(
        <>
        <div className="container">
            <h2>Bienvenido</h2>
            <br />
            <NavInventory />
        </div>

        </>

    );
}

function NavInventory(){
    const navigate = useNavigate();
    const handleRedirectInventory = () =>{
        navigate('/inventario');
    }
    const handleRedirectUsers =()=>{
        navigate('/usuarios')
    }
    return(
        <>
        <Button onClick={handleRedirectInventory}>Ver inventario</Button>
        <Button onClick={handleRedirectUsers}>Ver usuarios</Button>
        </>
        
    );
}