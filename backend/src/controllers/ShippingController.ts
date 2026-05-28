import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export class ShippingController {
  static async calculate(req: Request, res: Response) {
    try {
      const { destinationCep, cep, itemsCount = 1 } = req.body;
      const targetCep = destinationCep || cep;
      
      if (!targetCep) {
        return res.status(400).json({ error: 'CEP de destino é obrigatório' });
      }

      // Buscar configurações da loja
      const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
      
      if (!settings || !settings.melhorEnvioToken || !settings.originCep) {
        return res.status(400).json({ error: 'Frete indisponível no momento (Falta Token/CEP de origem)' });
      }

      // Remover caracteres especiais do CEP
      const cleanOriginCep = settings.originCep.replace(/\D/g, '');
      const cleanDestinationCep = targetCep.replace(/\D/g, '');

      // Calcular dimensões (simplificado para cosméticos: 1 item = 300g, 15x15x10cm)
      // Cada item a mais aumenta o peso em 300g e a altura em 2cm (simulação básica)
      const weight = Math.max(0.3 * itemsCount, 0.3); // Kg
      const height = Math.max(10 + (itemsCount * 2), 10); // cm
      const width = 15;
      const length = 15;

      const payload = {
        from: { postal_code: cleanOriginCep },
        to: { postal_code: cleanDestinationCep },
        package: {
          weight,
          width,
          height,
          length
        }
      };

      // 1. Buscar endereço no ViaCEP para preencher o formulário de Checkout SEMPRE
      const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cleanDestinationCep}/json/`).catch(() => null);
      let address = {};
      if (viaCepResponse && viaCepResponse.data && !viaCepResponse.data.erro) {
        address = {
          street: viaCepResponse.data.logradouro,
          neighborhood: viaCepResponse.data.bairro,
          city: viaCepResponse.data.localidade,
          state: viaCepResponse.data.uf
        };
      }

      // 2. Buscar opções de Frete no Melhor Envio
      let validOptions: any[] = [];
      let shippingError = null;

      try {
        const response = await axios.post(
          'https://melhorenvio.com.br/api/v2/me/shipment/calculate',
          payload,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${settings.melhorEnvioToken}`,
              'User-Agent': 'old-king-store (contato@oldking.com.br)'
            }
          }
        );
        
        validOptions = response.data
          .filter((opt: any) => !opt.error)
          .filter((opt: any) => {
            const lowerName = String(opt.name || '').toLowerCase();
            return lowerName.includes('pac') || lowerName.includes('sedex');
          })
          .map((opt: any) => ({
          name: opt.name,
          price: parseFloat(opt.price),
          delivery_time: opt.delivery_time,
          company: opt.company?.name || ''
        }));
      } catch (err: any) {
        console.error('Erro ao calcular frete:', err.response?.data || err.message);
        shippingError = 'Não foi possível calcular o frete com a transportadora.';
      }
      
      return res.json({
        address,
        options: validOptions,
        error: shippingError
      });

    } catch (err: any) {
      console.error('Erro geral no ShippingController:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
