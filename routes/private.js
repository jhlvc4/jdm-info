import express from 'express';
import { prisma } from '../src/utils/prisma.ts';

const router = express.Router();

router.get('/listar-usuarios', async (req, res) => {

    try {
        
        const users = await prisma.users.findMany({ omit: {password: true} });
        res.status(200).json({ message: 'Lista de usuários', users});

    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar usuários' });
    }
});

router.put('/atualizar-usuario/:id', async (req, res) => {
    try{
        await prisma.users.update({
            where: { 
                id: req.params.id
            },
            data: {
                name: req.body.name,
                email: req.body.email,
            }
        });
        const jsonSucess = JSON.stringify({ message: 'Usuário atualizado com sucesso' });
        res.status(200).json({ ...req.body, ...JSON.parse(jsonSucess) });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
});

router.put('/atualizar-senha/:id', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await prisma.users.update({
            where: { 
                id: req.params.id
            },
            data: {
                password: hashedPassword
            }
        });
        res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar senha' });
    }
});

router.delete('/deletar-usuario/:id', async (req, res) => {
    try{
        await prisma.users.delete({
            where: { 
                id: req.params.id
            }
        });
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
});

export default router;