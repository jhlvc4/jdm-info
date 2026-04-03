import express from 'express';
import { prisma } from '../src/utils/prisma.js';

const router = express.Router();

router.get('/listar-usuarios', async (req, res) => {

    try {
        
        const users = await prisma.user.findMany({ omit: {password: true} });
        res.status(200).json({ message: 'Lista de usuários', users});

    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar usuários' });
    }
});

export default router;