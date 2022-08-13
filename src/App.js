import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.min.css';
import Home from './pages/Home/Home';
import Products from './pages/products/Products';
import Cart from './pages/Cart/Cart';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Bills from './pages/bills/Bills';
import Customers from './pages/customers/Customers';

function App() {
  return (
  <>
  <Router>
    <Routes>
     
      <Route path="/" element={
          <Home />
      } />

      <Route path="/products" element={
           <Products />
      } />

      <Route path='/cart' element={
          <Cart />
      
      } />

      <Route path="/bills" element={<Bills/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/customers" element={<Customers />}/>
      
    </Routes>
  </Router>
 </>
  );
}

export default App;

// export function protectedRouter ({children}) {
//   if (localStorage.getItem("auth") ){
//     return children;
//   } else {
//     return <Navigate to="/login" />
//   }
// }
