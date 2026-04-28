import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './CustomerLayout';
import RequireAuth from './RequireAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';

function App() {
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
    </Routes>
  );
}

export default App;
