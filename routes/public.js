import express from 'express';
import { prisma } from '../src/utils/prisma.ts'; // Caminho para o prisma que puxa as funções
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

const router = express.Router();

const JWT_SECRET =  process.env.JWT_SECRET

// CADASTRO
router.post('/cadastro', async (req, res) => {
try {
    const user = req.body;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    await prisma.users.create({
        data: {
            email: user.email,
            name: user.name,
            password: hashedPassword,
        },
    });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user });
} catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
}});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha obrigatórios' });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json(token);

  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

export default router;