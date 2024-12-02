import { useState, useEffect } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Heart, X, ListPlus, SlidersHorizontal, ArrowUp } from "lucide-react";
import { Navbar } from "../../components/Navbar/NavBar";
import { Footer } from "../../components/Footer/Footer";
import BannerCarousel from "../../components/Carousel/BannerCarousel";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import products from "../../hooks/useProductData";
import MarketMap from "../../components/MarketMap/MarketMap";
import { useNavigate } from "react-router-dom";

export const Product = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    categories: [],
    markets: [],
    priceRange: [2, 100],
  });
  const [economyMode, setEconomyMode] = useState(false);
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

  const handleScroll = () => {
    setShowScrollToTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      if (type === "categories" || type === "markets") {
        updatedFilters[type] = updatedFilters[type].includes(value)
          ? updatedFilters[type].filter((item) => item !== value)
          : [...updatedFilters[type], value];
      } else if (type === "priceRange") {
        updatedFilters.priceRange = value;
      }
      return updatedFilters;
    });
  };

  const applyFilters = () => {
    const { markets, priceRange } = filters;

    let filtered = products;

    if (markets.length > 0) {
      filtered = filtered.filter((product) =>
        markets.includes(product.market.name)
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (economyMode) {
      filtered = filtered.filter((product) => product.price < 10);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, economyMode]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <BannerCarousel />
        <div className="flex justify-between items-center mb-4 mt-3 font-montserrat">
          <h2 className="text-3xl font-bold text-gray-700">Produtos</h2>
          <div className="flex gap-4 items-center">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={economyMode}
                    onChange={() => setEconomyMode(!economyMode)}
                  />
                }
                className="text-green-600 font-montserrat font-semibold"
                label="✅ Economia Máxima "
              />
            </FormGroup>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center bg-orange-500 text-white px-16 py-2 rounded"
            >
              <SlidersHorizontal className="mr-2" /> Filtro
            </button>
          </div>
        </div>
        <hr className="flex mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
                {economyMode &&
                  (product.price === 9.5 || product.price === 5.9) && (
                    <span className="text-xs text-green-500 font-bold">
                      ✅ Economia Máxima!
                    </span>
                  )}
                <button
                  className="mt-2 w-full bg-orange-500 text-white py-2 rounded-full font-bold flex items-center justify-center hover:bg-orange-600 transition-all hover:-translate-y-1"
                  onClick={() => handleAddToCart(product)}
                >
                  <ListPlus className="mr-2" /> Adicionar
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-700 font-bold">
              Nenhum produto encontrado para os filtros aplicados.
            </p>
          )}
        </div>
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-96 p-5 h-full overflow-y-auto shadow-lg rounded-l-xl border border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Filtros</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Faixa de preço
                </h3>
                <input
                  type="range"
                  min="2"
                  max="100"
                  step="1"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      2,
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full cursor-pointer accent-orange-500"
                />
                <div className="text-sm text-gray-600 mt-2">
                  R$ {filters.priceRange[0]} - R$ {filters.priceRange[1]}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Mercados</h3>
                <div>
                  {[
                    "Barraca Supermercado",
                    "Amarelão Supermercado",
                    "Sonia Supermercado",
                    "Assalá Atacadista",
                  ].map((market) => (
                    <div key={market} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={market}
                        checked={filters.markets.includes(market)}
                        onChange={() => handleFilterChange("markets", market)}
                        className="mr-2 cursor-pointer accent-orange-500"
                      />
                      <label
                        htmlFor={market}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {market}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-orange-500 text-white py-2 px-4 rounded-full w-full font-bold hover:bg-orange-600 transition-all"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <section className="w-full bg-sky-50 py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 font-montserrat">
              Não sabe qual mercado ir?
            </h2>
            <p className="text-xl text-gray-600 mt-2 font-montserrat">
              Veja o mais próximo de você!
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="h-[500px] w-full">
              <MarketMap />
            </div>
          </div>
        </div>
      </section>
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <button
              onClick={() => setShowLoginModal(false)}
              className=" flex text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="w-6 h-6 text-orange-500" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Faça Login ou Cadastre-se!
            </h2>
            <p className="text-gray-600 mb-6">
              Você precisa estar logado para adicionar produtos a sua lista!
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => navigate("/login")}
                className="bg-orange-500 text-white py-2 px-14 rounded-full font-bold hover:bg-orange-600 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-gray-300 text-gray-700 py-2 px-12 rounded-full font-bold hover:bg-gray-400 transition-all"
              >
                Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-all"
        >
          <ArrowUp />
        </button>
      )}
    </div>
  );
};
export default Product;
