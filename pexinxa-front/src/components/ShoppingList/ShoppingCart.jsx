import { useCart } from "../../context/CartContext";
import useCalendarIntegrations from "../../hooks/useCalendarIntegration";
import PropTypes from "prop-types";
import jsPDF from "jspdf";
import "jspdf-autotable";

const EmptyCartImage = "/Sacolinha.png";

export const ShoppingCart = ({ isOpen, onClose }) => {
  const { items, addItem, removeItem, subtotal } = useCart();
  const { addEvent, login, isAuthenticated } = useCalendarIntegrations();
  const comparison = 20.0;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Sua Lista de Compras", 10, 10);

    const tableData = items.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      `R$ ${item.price.toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [["#", "Nome", "Quantidade", "Preço"]],
      body: tableData,
    });

    doc.text(`Subtotal: R$ ${subtotal.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);
    doc.text(`Comparação: +R$ ${comparison.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 20);
    doc.text(`Total: R$ ${(subtotal + comparison).toFixed(2)}`, 10, doc.lastAutoTable.finalY + 30);

    return doc.output("blob"); 
  };

  const exportToPDF = () => {
    const blob = generatePDF();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lista_de_compras.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareOnWhatsApp = () => {
    const blob = generatePDF();

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64PDF = fileReader.result.split(",")[1]; 
      const pdfLink = `data:application/pdf;base64,${base64PDF}`;

      if (navigator.share) {
        navigator
          .share({
            title: "Lista de Compras",
            text: "Confira minha lista de compras do Amarelão Supermercados!",
            files: [new File([blob], "lista_de_compras.pdf", { type: "application/pdf" })],
          })
          .catch((err) => console.error("Erro ao compartilhar:", err));
      } else {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            "Confira minha lista de compras do Amarelão Supermercados! Clique no link para baixar o PDF: " +
              pdfLink
          )}`
        );
      }
    };
    fileReader.readAsDataURL(blob);
  };

  const addToCalendar = async () => {
    if (!isAuthenticated) {
      await login();
    }

    const eventDetails = {
      summary: "Lista de Compras do Amarelão",
      description: `Subtotal: R$ ${subtotal.toFixed(2)}, Comparação: R$ ${comparison.toFixed(
        2
      )}, Total: R$ ${(subtotal + comparison).toFixed(2)}`,
      start: {
        dateTime: new Date().toISOString(), // Define o início para o momento atual
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // Define o fim para 1h depois
        timeZone: "America/Sao_Paulo",
      },
    };

    try {
      const response = await addEvent(eventDetails);
      console.log("Evento adicionado ao calendário:", response);
      alert("Evento adicionado ao calendário com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar ao calendário:", error);
      alert("Erro ao adicionar ao calendário.");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:max-w-sm bg-white shadow-lg transition-transform z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-orange-500 hover:text-orange-600 text-xl font-bold"
        >
          ✕
        </button>

        <div className="p-6 pt-16 flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4">
              <img
                src={EmptyCartImage}
                alt="Sacola vazia"
                className="w-42 h-auto"
              />
              <p className="text-gray-600 text-xl font-medium">
                Sua Lista está vazia
              </p>
              <p className="text-gray-500 text-sm">Adicione itens</p>
            </div>
          ) : (
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-sm text-gray-500 font-semibold mb-2">
                  Sua lista em
                </h2>
                <p className="font-bold mb-6 text-gray-800 text-xl">
                  Amarelão Supermercados
                </p>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b py-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-500 text-sm">
                        R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 bg-gray-100 rounded-full text-gray-600 text-center font-bold"
                      >
                        -
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() => addItem(item)}
                        className="w-8 h-8 bg-gray-100 rounded-full text-gray-600 text-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 text-sm">Subtotal:</span>
                  <span className="font-medium text-sm">
                    R$ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600 text-sm">Comparação:</span>
                  <span className="text-orange-500 font-medium text-sm">
                    + R$ {comparison.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-gray-800">
                    R$ {(subtotal + comparison).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={exportToPDF}
                  className="w-full bg-blue-500 text-white py-3 mt-4 rounded-lg hover:bg-blue-600 transition text-sm font-bold"
                >
                  Exportar para PDF
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="w-full bg-green-500 text-white py-3 mt-4 rounded-lg hover:bg-green-600 transition text-sm font-bold"
                >
                  Compartilhar no WhatsApp
                </button>
                <button
                  onClick={addToCalendar}
                  className="w-full bg-orange-500 text-white py-3 mt-4 rounded-lg hover:bg-orange-600 transition text-sm font-bold"
                >
                  Adicionar ao Calendário
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

ShoppingCart.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShoppingCart;
