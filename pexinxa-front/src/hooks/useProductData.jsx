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

export default products;
