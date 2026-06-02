import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { EmailService } from '../services/EmailService';
import { ImageService } from '../services/ImageService';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'oldking-super-secret-key-2024';

// Em memória temporária para guardar os códigos de verificação antes de criar o usuário no banco
const verificationCodes: Record<string, string> = {};

export class AuthController {
  
  static async sendVerificationCode(req: Request, res: Response) {
    let { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'E-mail e código são obrigatórios.' });
    }
    
    email = email.toLowerCase();

    // Verifica se e-mail já existe no banco real
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    // Salva o código na memória temporária para validar depois
    verificationCodes[email] = code;

    try {
      await EmailService.sendVerificationCodeEmail(email, code);
      return res.json({ success: true, message: 'Código enviado com sucesso.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao enviar e-mail.' });
    }
  }

  static async register(req: Request, res: Response) {
    let { name, email, password, phone, photo, code } = req.body;

    if (!name || !email || !password || !code) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }
    
    email = email.toLowerCase();

    // Valida o código
    if (verificationCodes[email] !== code) {
      return res.status(400).json({ error: 'Código de verificação incorreto ou expirado.' });
    }

    // Verifica novamente se já não criaram conta
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    try {
      // Criptografa a senha com bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Define como admin se for o e-mail do dono
      const role = email.toLowerCase() === 'caioh0455@gmail.com' ? 'ADMIN' : 'CUSTOMER';
      
      const processedPhoto = await ImageService.processImage(photo) || photo;

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          photo: processedPhoto,
          role
        }
      });

      // Limpa o código da memória
      delete verificationCodes[email];

      // Gera o Token JWT para já entrar logado
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, photo: newUser.photo }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar usuário no banco de dados.' });
    }
  }

  static async login(req: Request, res: Response) {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }
    
    email = email.toLowerCase();

    try {
      // Busca usuário no SQLite
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      // Compara a senha digitada com o Hash do banco
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      // Gera o Token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, photo: user.photo }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro no servidor durante o login.' });
    }
  }

  static async googleLogin(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token do Google não fornecido.' });
    }

    try {
      const { OAuth2Client } = require('google-auth-library');
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        return res.status(400).json({ error: 'Token do Google inválido.' });
      }

      const email = payload.email.toLowerCase();
      const name = payload.name || 'Usuário do Google';
      const photo = payload.picture || '';

      // Verifica se o usuário já existe
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Se não existir, cria uma conta automaticamente com uma senha forte aleatória
        const crypto = require('crypto');
        const randomPassword = crypto.randomBytes(20).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        const role = email === 'caioh0455@gmail.com' ? 'ADMIN' : 'CUSTOMER';

        user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            photo,
            role,
          }
        });
      }

      // Gera o Token JWT da nossa aplicação
      const jwtToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token: jwtToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, photo: user.photo }
      });
    } catch (err) {
      console.error('Erro no login com Google:', err);
      return res.status(500).json({ error: 'Falha na autenticação com o Google.' });
    }
  }

}
