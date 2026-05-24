import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SettingsController {
  static async get(req: Request, res: Response) {
    try {
      let settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
      
      // Cria a configuração padrão se não existir (Fallback)
      if (!settings) {
        settings = await prisma.storeSettings.create({
          data: {
            id: 1,
            phone: '(11) 99469-1444',
            whatsapp: '(11) 99469-1444',
            email: 'contato@oldkingcosmeticos.com.br',
            hours: 'seg a sex das 9h às 18h',
            description: 'A Old King Cosméticos fabrica produtos masculinos premium.',
            instagram: 'https://instagram.com/oldking',
            facebook: 'https://facebook.com/oldking'
          }
        });
      }
      return res.json(settings);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { phone, whatsapp, email, hours, description, instagram, facebook, melhorEnvioToken, originCep } = req.body;
      
      const updated = await prisma.storeSettings.upsert({
        where: { id: 1 },
        update: { phone, whatsapp, email, hours, description, instagram, facebook, melhorEnvioToken, originCep },
        create: { id: 1, phone, whatsapp, email, hours, description, instagram, facebook, melhorEnvioToken, originCep }
      });
      
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar configurações' });
    }
  }
}
