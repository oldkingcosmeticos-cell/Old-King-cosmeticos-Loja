import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserController {
  
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          photo: true,
          role: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return res.json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
  }

  static async toggleAdmin(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // Não permite remover o admin principal (Caio)
      if (user.email === 'caioh0455@gmail.com') {
        return res.status(403).json({ error: 'Não é possível remover este administrador.' });
      }

      const newRole = user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
      
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role: newRole }
      });

      return res.json({ success: true, user: updatedUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar permissões do usuário.' });
    }
  }
}
