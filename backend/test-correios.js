const { calcularPrecoPrazo } = require('correios-brasil');

let args = {
  sCepOrigem: '01001000', // Praça da Sé
  sCepDestino: '22041001', // Copacabana
  nVlPeso: '1',
  nCdFormato: '1', // 1 para caixa / pacote
  nVlComprimento: '20',
  nVlAltura: '20',
  nVlLargura: '20',
  nCdServico: ['04014', '04510'], // PAC e SEDEX
  nVlDiametro: '0',
};

calcularPrecoPrazo(args).then((response) => {
  console.log(response);
}).catch((error) => {
  console.error(error);
});
