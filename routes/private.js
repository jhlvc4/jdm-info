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

/* router.put('/atualizar-usuario/:id', async (req, res) => {
    try{
        await prisma.user.update({
            where: { 
                id: req.params.id
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
        });
        const jsonSucess = JSON.stringify({ message: 'Usuário atualizado com sucesso' });
        res.status(200).json({ ...req.body, ...JSON.parse(jsonSucess) });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
}); */

export default router;