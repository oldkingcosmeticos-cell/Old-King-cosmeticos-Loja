import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReviewController {
  static async getAll(req: Request, res: Response) {
    try {
      const reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.json(reviews);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar avaliações' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { type, productId, text, rating, name, photo } = req.body;
      const newReview = await prisma.review.create({
        data: { type, productId, text, rating, name, photo }
      });
      return res.status(201).json(newReview);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao criar avaliação' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.review.delete({ where: { id: Number(id) } });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao excluir avaliação' });
    }
  }
}
