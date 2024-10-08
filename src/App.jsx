import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './navbar/navbar';
import Login from './pages/login';
import AdminView from './pages/admin/adminView';
import Catalog from './catalogo/catalogo';
import Courier from './pages/elegirCourier';
import Inventory from './pages/admin/inventario';
import Payment from './pages/payment';
import Users from './pages/admin/usuarios';
import Status from './pages/status';
import CrearCuenta from './pages/crearCuenta';
import './pages/style.css';


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
        <Route path='usuarios' element={<Users />} />;
        <Route path='status' element={<Status />} />;
        <Route path='crearCuenta' element={<CrearCuenta />} />;
      </Routes>
    </BrowserRouter>
  );
}
