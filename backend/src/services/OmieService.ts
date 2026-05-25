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
      const codigo_cliente_omie = clientResponse.data.codigo_cliente_omie;
      
      console.log(`[OMIE] Cliente sincronizado com sucesso! ID Omie: ${codigo_cliente_omie}`);

      // 2. Montar os itens do pedido
      const det = items.map((item, index) => ({
        ide: {
          codigo_item_integracao: `${order.id.substring(0, 8)}-${index}`
        },
        produto: {
          codigo_produto: item.product?.sku ? Number(item.product.sku) : 0,
          codigo_produto_integracao: item.product?.sku ? "" : String(item.id || item.product?.id),
          descricao: item.title || item.product?.name,
          quantidade: item.quantity,
          valor_unitario: typeof item.unit_price === 'string' ? Number(item.unit_price.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) : Number(item.unit_price || 0)
        }
      }));

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
          det,
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
      return false; // Retornamos falso para não quebrar a venda do cliente, apenas a integração ERP falha
    }
  }

  static async issueInvoice(order: any) {
    console.log(`[OMIE] Solicitando emissão de NF-e para o pedido ${order.id}...`);
    // Na API da Omie, você pode mudar a etapa do pedido para faturar ou chamar a API de NFE.
    return true;
  }

}
