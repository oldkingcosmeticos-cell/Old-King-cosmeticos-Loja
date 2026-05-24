import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ImageService } from '../services/ImageService';

const prisma = new PrismaClient();

export class BannerController {
  static async getAll(req: Request, res: Response) {
    try {
      const banners = await prisma.banner.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.json(banners);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar banners' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { cat, img } = req.body;
      const processedImg = await ImageService.processImage(img) || img;
      const newBanner = await prisma.banner.create({
        data: { cat, img: processedImg }
      });
      return res.status(201).json(newBanner);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao criar banner' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { cat, img } = req.body;
      const processedImg = await ImageService.processImage(img) || img;
      const updated = await prisma.banner.update({
        where: { id: Number(id) },
        data: { cat, img: processedImg }
      });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar banner' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.banner.delete({ where: { id: Number(id) } });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao excluir banner' });
    }
  }
}
