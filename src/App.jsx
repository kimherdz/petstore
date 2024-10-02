import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './navbar/navbar';
import Login from './pages/login';
import AdminView from './pages/adminView';
import Catalog from './catalogo/catalogo';
import Courier from './pages/elegirCourier';
import Inventory from './pages/inventario';
import Payment from './payment/payment';
import CrearCuenta from './pages/crearCuenta';
import CreateProduct from './pages/crearProducto';
import Users from './pages/usuarios';
import Status from './pages/status';


export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route index element={<Catalog />} />
        <Route path='Admin' element={<AdminView />} />
        <Route path='courier' element={<Courier />} />
        <Route path='inventario' element={<Inventory />} />
        <Route path='payment' element={<Payment />} />;
        <Route path='Login' element={<Login />} />;
        <Route path='crearCuenta' element={<CrearCuenta />} />;
        <Route path='usuarios' element={<Users />} />;
        <Route path='crearproducto' element={<CreateProduct />} />;
        <Route path='status' element={<Status />} />;
      </Routes>
       
    </BrowserRouter>
  );
}
