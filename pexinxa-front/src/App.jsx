import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Product from './pages/products/Products';
import LoginForm from './pages/login/Login';
import RegisterForm from './pages/register/Register';
import CookieCard from './components/Cookie/CookieCard';
import About from './pages/about/About';
import { CartProvider } from './context/CartContext';
import { CalendarProvider } from './context/CalendarContext'; 

function App() {
  return (
    <CartProvider>
      <CalendarProvider> 
        <Router>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Product />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <CookieCard />
          </div>
        </Router>
      </CalendarProvider>
    </CartProvider>
  );
}

export default App;
