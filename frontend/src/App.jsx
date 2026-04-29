import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './CustomerLayout';
import StaffLayout from './StaffLayout';
import RequireAuth from './RequireAuth';
import RequireRole from './RequireRole';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import StaffOrders from './pages/StaffOrders';
import StaffMenu from './pages/StaffMenu';

function App() {
  const staffRoles = ['staff', 'admin'];

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<Landing />} />
        <Route path="menu" element={<Menu />} />
        <Route path="cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="orders" element={<RequireAuth><MyOrders /></RequireAuth>} />
        <Route path="orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
      </Route>
      <Route path="/staff" element={<RequireRole roles={staffRoles}><StaffLayout /></RequireRole>}>
        <Route index element={<StaffOrders />} />
        <Route path="orders" element={<StaffOrders />} />
        <Route path="menu" element={<StaffMenu />} />
      </Route>
    </Routes>
  );
}

export default App;
