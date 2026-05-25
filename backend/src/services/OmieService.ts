import axios from 'axios';

export class OmieService {
  
  static async registerOrder(order: any, customer: any, items: any[]) {
    console.log("------------------------------------------");
    console.log(`[OMIE] Iniciando registro do Pedido ${order.id} na Omie`);
    
    const app_key = process.env.OMIE_APP_KEY;
    const app_secret = process.env.OMIE_APP_SECRET;

    if (!app_key || !app_secret || app_key === '1234567890') {
      console.warn("[OMIE] ⚠️ Chaves da Omie não configuradas corretamente no .env! Simulação ignorada.");
      return false;
    }

    try {
      // 1. Cadastrar ou Atualizar Cliente na Omie (UpsertCliente)
      const cleanCpf = customer?.cpf?.replace(/\D/g, '') || '';
      if (!cleanCpf) throw new Error("CPF não fornecido no checkout, impossível integrar com a Omie.");

      console.log(`[OMIE] 1. Sincronizando cliente CPF: ${cleanCpf}`);
      let codigo_cliente_omie = 0;

      try {
        // Primeiro tenta buscar o cliente para ver se ele já existe na Omie
        const searchPayload = {
          call: 'ListarClientes',
          app_key,
          app_secret,
          param: [{
            pagina: 1,
            registros_por_pagina: 10,
            clientesFiltro: {
              cnpj_cpf: cleanCpf
            }
          }]
        };
        const searchRes = await axios.post('https://app.omie.com.br/api/v1/geral/clientes/', searchPayload);
        if (searchRes.data.clientes_cadastro && searchRes.data.clientes_cadastro.length > 0) {
          codigo_cliente_omie = searchRes.data.clientes_cadastro[0].codigo_cliente_omie;
          console.log(`[OMIE] Cliente já existia na base. ID: ${codigo_cliente_omie}`);
        }
      } catch (e) {
        // Ignora erro de busca
      }

      if (codigo_cliente_omie === 0) {
        // Se não achou, cria um novo
        const clientPayload = {
          call: 'UpsertCliente',
          app_key,
          app_secret,
          param: [{
            codigo_cliente_integracao: cleanCpf,
            email: customer.email,
            razao_social: customer.name,
            nome_fantasia: customer.name,
            cnpj_cpf: cleanCpf,
            telefone1_numero: customer.phone,
            endereco: customer.street,
            endereco_numero: customer.number,
            bairro: customer.neighborhood,
            complemento: customer.complement || '',
            estado: customer.state,
            cidade: customer.city,
            cep: customer.cep
          }]
        };

        const clientResponse = await axios.post('https://app.omie.com.br/api/v1/geral/clientes/', clientPayload);
        codigo_cliente_omie = clientResponse.data.codigo_cliente_omie;
        console.log(`[OMIE] Cliente cadastrado com sucesso! ID Omie: ${codigo_cliente_omie}`);
      }
      
      console.log(`[OMIE] Cliente sincronizado com sucesso! ID Omie: ${codigo_cliente_omie}`);

      // 2. Montar os itens do pedido
      const det = items.map((item, index) => ({
        ide: {
          codigo_item_integracao: `${order.id.substring(0, 8)}-${index}`
        },
        product: item.product,
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        price: item.price
      }));

      // Busca os códigos internos dos produtos na Omie
      const orderItems = [];
      for (let index = 0; index < det.length; index++) {
        const item = det[index];
        let codigo_produto = 0;
        let codigo_produto_integracao = String(item.product?.sku || item.id || item.product?.id);

        if (item.product?.sku) {
          try {
            const prodSearchPayload = {
              call: 'ConsultarProduto',
              app_key,
              app_secret,
              param: [{ codigo: item.product.sku }]
            };
            const prodRes = await axios.post('https://app.omie.com.br/api/v1/geral/produtos/', prodSearchPayload);
            if (prodRes.data && prodRes.data.codigo_produto) {
              codigo_produto = prodRes.data.codigo_produto;
              codigo_produto_integracao = ""; // Se achou o código interno, não envia o de integração
            }
          } catch (e) {
            console.log(`[OMIE] Produto não achado pelo código ${item.product.sku}, usando integracao padrão.`);
          }
        }

        const calcValor = typeof (item.product?.price || item.unit_price) === 'string' ? Number((item.product?.price || item.unit_price).replace('R$ ', '').replace(/\./g, '').replace(',', '.')) : Number((item.product?.price || item.unit_price) || 0);
        console.log(`[OMIE DEBUG] item.product.price: ${item.product?.price}, item.unit_price: ${item.unit_price}, valor calculado: ${calcValor}`);

        orderItems.push({
          ide: {
            codigo_item_integracao: `${order.id.substring(0, 8)}-${index}`
          },
          produto: {
            codigo_produto,
            codigo_produto_integracao,
            descricao: item.title || item.product?.name,
            quantidade: item.quantity,
            valor_unitario: calcValor
          }
        });
      }

      // 3. Registrar o Pedido de Venda
      console.log(`[OMIE] 2. Criando pedido de venda...`);
      const orderPayload = {
        call: 'IncluirPedido',
        app_key,
        app_secret,
        param: [{
          cabecalho: {
            codigo_cliente: codigo_cliente_omie,
            codigo_pedido_integracao: order.id,
            data_previsao: new Date().toLocaleDateString('pt-BR'),
            etapa: "10", // Voltando para a etapa 10 (gaveta segura)
            quantidade_itens: det.length
          },
          det: orderItems,
          frete: {
            modalidade: "9", // Sem frete ou frete por conta do emitente
            valor_frete: order.shippingFee || 0
          },
          informacoes_adicionais: {
            codigo_categoria: "1.01.01", // Receita de Vendas de Produtos
            codigo_conta_corrente: 10404148227 // Omie.CASH
          }
        }]
      };

      const orderResponse = await axios.post('https://app.omie.com.br/api/v1/produtos/pedido/', orderPayload);
      console.log(`[OMIE] Sucesso! Pedido de Venda Criado. Número: ${orderResponse.data.numero_pedido}`);
      console.log("------------------------------------------");
      return true;

    } catch (error: any) {
      console.error("[OMIE ERROR] Falha ao integrar com a Omie:");
      console.error(error.response?.data?.faultstring || error.message);
      console.log("------------------------------------------");
      throw new Error(error.response?.data?.faultstring || error.message);
    }
  }

  static async issueInvoice(order: any) {
    console.log(`[OMIE] Solicitando emissão de NF-e para o pedido ${order.id}...`);
    // Na API da Omie, você pode mudar a etapa do pedido para faturar ou chamar a API de NFE.
    return true;
  }

}
