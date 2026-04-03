import express from 'express';
import { prisma } from '../src/utils/prisma.js'; // Caminho para o prisma que puxa as funções
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

const router = express.Router();

const JWT_SECRET =  process.env.JWT_SECRET

// CADASTRO
router.post('/cadastro', async (req, res) => {

try {
    const user = req.body;
    const hashedPassword = await bcrypt.hash(user.password, 10); // Documentação bcrypt: https://www.npmjs.com/package/bcrypt#hashing-a-password
    // Remover const userDB, responde o usuário com a senha criptografada, não recomendado
    const userDB =  await prisma.user.create({
        data: {
            email: user.email,
            name: user.name,
            password: hashedPassword,
        },
    });
    // Remover userDB que é o usuário criado no banco, não é recomendado responder com esses dados
    res.status(201).json(userDB, { message: 'Usuário cadastrado com sucesso', user });

} catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
}});

// LOGIN

router.post('/login', async (req, res) => {
  try {
    // Recebe parametros de email e senha do corpo da requisição(req.body)
    const { email, password } = req.body;

    // Verifica se email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha obrigatórios' });
    }

    // Busca usuário no banco de dados
    const user = await prisma.user.findUnique({ where: { email } });
    // Verifica se o usuário existe, se não existir retorna erro 404 (Not Found) com mensagem de usuário não encontrado
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Compara a senha com a senha criptografada armazenada no banco de dados
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Senha incorreta' });

    // Gerar Token JWT (JSON Web Token) para autenticação futura, não implementado aqui, mas recomendado para produção
    // Futuramente fazer o token alterar ao usuario mudar senha etc como no Discord

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json(token);

  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

router.put('/atualizar-usuario/:id', async (req, res) => {
    try{
        await prisma.user.update({
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
        await prisma.user.update({
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
        await prisma.user.delete({
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