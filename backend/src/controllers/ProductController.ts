import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ImageService } from '../services/ImageService';

const prisma = new PrismaClient();

export class ProductController {
  
  static async getAll(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      // Converte as strings JSON de volta para arrays/objetos para o frontend
      const formatted = products.map(p => ({
        ...p,
        tags: JSON.parse(p.tags || '[]'),
        wholesalePrices: JSON.parse(p.wholesalePrices || '[]')
      }));
      
      return res.json(formatted);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, price, originalPrice, sku, image, image2, image3, image4, listCategory, tags, wholesalePrices } = req.body;
      
      const processedImage = await ImageService.processImage(image) || image;
      const processedImage2 = await ImageService.processImage(image2) || image2;
      const processedImage3 = await ImageService.processImage(image3) || image3;
      const processedImage4 = await ImageService.processImage(image4) || image4;

      const newProduct = await prisma.product.create({
        data: {
          name,
          price,
          originalPrice,
          sku,
          image: processedImage,
          image2: processedImage2,
          image3: processedImage3,
          image4: processedImage4,
          listCategory,
          tags: JSON.stringify(tags || []),
          wholesalePrices: JSON.stringify(wholesalePrices || [])
        }
      });
      
      return res.status(201).json({
        ...newProduct,
        tags: JSON.parse(newProduct.tags),
        wholesalePrices: JSON.parse(newProduct.wholesalePrices || '[]')
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price, originalPrice, sku, image, image2, image3, image4, listCategory, tags, wholesalePrices } = req.body;
      
      const processedImage = await ImageService.processImage(image) || image;
      const processedImage2 = await ImageService.processImage(image2) || image2;
      const processedImage3 = await ImageService.processImage(image3) || image3;
      const processedImage4 = await ImageService.processImage(image4) || image4;

      const updated = await prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          originalPrice,
          sku,
          image: processedImage,
          image2: processedImage2,
          image3: processedImage3,
          image4: processedImage4,
          listCategory,
          tags: JSON.stringify(tags || []),
          wholesalePrices: JSON.stringify(wholesalePrices || [])
        }
      });
      
      return res.json({
        ...updated,
        tags: JSON.parse(updated.tags),
        wholesalePrices: JSON.parse(updated.wholesalePrices || '[]')
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.product.delete({ where: { id } });
      return res.json({ success: true, message: 'Produto removido com sucesso' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  }
}
