const axios = require('axios');

async function test() {
  const app_key = "6729961936698";
  const app_secret = "869239991dce1a98ad9305e9fd15fa7d";

  const searchPayload = {
    call: 'ConsultarProduto',
    app_key,
    app_secret,
    param: [{
      codigo: "PRD00008"
    }]
  };
  try {
    const res = await axios.post('https://app.omie.com.br/api/v1/geral/produtos/', searchPayload);
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
