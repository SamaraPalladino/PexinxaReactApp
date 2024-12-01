import { useState } from "react";
import { Heart, X, ListPlus, SlidersHorizontal } from "lucide-react";
import { Navbar } from "../../components/Navbar/NavBar";
import { Footer } from "../../components/Footer/Footer";
import BannerCarousel from "../../components/Carousel/BannerCarousel";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const acucar = "/products/acucar.png";
const oleo = "/products/oleo.png";
const camil = "/products/camil.png";
const kiarroz = "/products/kiarroz.png";
const amarelao = "/markets/amarelao.png";
const assala = "/markets/assala.png";
const barraca = "/markets/barraca.png";
const sonia = "/markets/sonia.png";

const products = [
  {
    id: 1,
    name: "Óleo De Girassol Soya Garrafa 900ml",
    price: 9.5,
    market: {
      name: "Sonia Supermercado",
      logo: sonia,
    },
    image: oleo,
  },
  {
    id: 2,
    name: "Arroz Branco Camil Pacote 5kg",
    price: 27.99,
    market: {
      name: "Barraca Supermercado",
      logo: barraca,
    },
    image: camil,
  },
  {
    id: 3,
    name: "Arroz Branco Kiarroz Pacote 5kg",
    price: 35.0,
    market: {
      name: "Amarelão Supermercado",
      logo: amarelao,
    },
    image: kiarroz,
  },
  {
    id: 4,
    name: "Açúcar Refinado Especial União 1kg",
    price: 5.9,
    market: {
      name: "Assalá Atacadista",
      logo: assala,
    },
    image: acucar,
  },
];

export const Product = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { currentUser } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    addItem(product);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <BannerCarousel />
        <div className="flex justify-between items-center mb-4 mt-3 font-montserrat">
          <h2 className="text-3xl font-bold text-gray-700">Produtos</h2>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center bg-orange-500 text-white px-16 py-2 rounded"
          >
            <SlidersHorizontal className="mr-2" /> Filtro
          </button>
        </div>
        <hr className="flex mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-300 p-4 rounded-lg shadow flex flex-col items-center"
            >
              <div className="w-full h-48 flex items-center justify-center mb-4 font-montserrat">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-auto h-full object-contain"
                />
              </div>
              <p className="font-medium text-center text-gray-800">
                {product.name}
              </p>
              <div className="flex items-center mt-3 mb-4">
                <img
                  src={product.market.logo}
                  alt={product.market.name}
                  className="w-6 h-6 mr-2"
                />
                <span className="text-sm font-semibold text-gray-600">
                  {product.market.name}
                </span>
              </div>
              <div className="flex justify-between items-center w-full mb-4">
                <span className="text-3xl pl-20 font-extrabold text-orange-500">
                  R$ {product.price.toFixed(2)}
                </span>
                <Heart className="text-red-500 mr-20 cursor-pointer" />
              </div>
              <button
                className="mt-2 w-full bg-orange-500 text-white py-2 rounded-full font-bold flex items-center justify-center hover:bg-orange-600 transition-all hover:-translate-y-1"
                onClick={() => handleAddToCart(product)}
              >
                <ListPlus className="mr-2" /> Adicionar
              </button>
            </div>
          ))}
        </div>
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-80 p-5 h-full overflow-y-auto shadow-lg rounded-l-xl">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-800">Filtros</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold text-sm">
                Filtrar
              </button>
            </div>
          </div>
        )}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-80 p-6 rounded-lg shadow-lg relative">
              <button
                className="absolute top-3 right-3 text-orange-500 hover:text-gray-700"
                onClick={() => setShowLoginModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold text-gray-800 font-montserrat">Você parece não estar logado!</h2>
              <p className="mt-4 text-sm text-gray-600 font-montserrat font-medium">
                Entre em sua conta ou cadastre-se para começar a economizar!
              </p>
              <div className="mt-6 flex justify-between">
                <button
                  className="bg-orange-500 text-white px-12 py-2 rounded hover:bg-orange-600 font-montserrat font-semibold"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="bg-sky-500 text-white px-8 py-2 rounded hover:bg-sky-600 font-montserrat font-semibold"
                  onClick={() => navigate("/register")}
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Product;
