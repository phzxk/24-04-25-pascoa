
// server.js
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'senac@02',
    database: 'cheirinho_de_bolo'
});

app.post('/api/mysql', async (req, res) => {
    const { nome, email, senha, tipo, id } = req.body;
    try {
        switch (tipo) {
            case 'cadastro':
                var [rows, fields] = await pool.query(
                    "insert into `cheirinho_de_bolo`.`tbl_login` (`nome`, `email`, `senha`) values (?, ?, ?);",
                    [nome, email, senha]
                );
                if (rows.affectedRows > 0) {
                    res.json({ message: 'Usuário cadastrado com sucesso!' });
                } else {
                    throw ('Não foi possível cadastrar o usuário!');
                }
                break;
            case 'login':
                var [rows, fields] = await pool.query(
                    "select * from `cheirinho_de_bolo`.`tbl_login` where `nome` = ? and `email` = ? and `senha` = ?;",
                    [nome, email, senha]
                );
                if (rows.length == 1) {
                    res.json({ message: 'Usuário logado com sucesso' });
                } else {
                    throw ("Não foi possível logar o usuário!");
                }
                break;
            case 'leitura':
                var addNome = "";
                var addEmail = "";
                var addAnd = "";

                if (nome.trim().length > 0) {
                    addNome = " `nome` like '%" + nome + "%' ";
                }

                if (email.trim().length > 0) {
                    addEmail = " `email` like '%" + email + "%' ";
                }

                if (nome.trim().length > 0 && email.trim().length > 0) {
                    addAnd = " and ";
                }

                var strSql = "select * from `cheirinho_de_bolo`.`tbl_login` where" + 
                    addNome + addAnd + addEmail + ";";
                var [rows, fields] = await pool.query(strSql);
                if (rows.length > 0) {
                    res.json({ 
                        message: 'Nome ou login encontrado com sucesso!',
                        id: rows[0].id,
                        nome: rows[0].nome,
                        email: rows[0].login,
                        linhas: rows.length
                    });
                } else {
                    throw ("Não foi possível encontrar o nome ou login!");
                }
                break;
            case 'atualizacao':
                var strSql = "select * from `cheirinho_de_bolo`.`tbl_login`;";
                var [rows, fields] = await pool.query(strSql);
                if (rows.length > 0) {
                    res.json({ 
                        message: 'Nome, login e senhas encontrados com sucesso!',
                        rows: rows
                    });
                } else {
                    throw ("Não há registro algum na tabela tbl_login!");
                }
                break;
            case 'atualizar':
                var addId = "";
                var addNome = "";
                var addEmail = "";
                var addSenha = "";
                var addAnd = "";

                if (id.trim().length > 0) {
                    addId = id;
                }

                if (nome.trim().length > 0) {
                    addNome = " `nome` = '" + nome + "' ";
                }

                if (email.trim().length > 0) {
                    addEmail = " `email` = '" + email + "' ";
                }

                if (addNome.length > 0) {
                    addEmail = " , " + addEmail;
                }

                if (senha.trim().length > 0) {
                    addSenha = " `senha` = '" + senha + "' ";
                }

                if (addEmail.length > 0) {
                    addSenha = " , " + addSenha;
                }

                var strSql = "update `cheirinho_de_bolo`.`tbl_login` set " + 
                    addNome + addEmail + addSenha + 
                    " where `id` = " + addId + ";";
                var [rows, fields] = await pool.query(strSql);
                if (rows.affectedRows > 0) {
                    res.json({ 
                        message: 'Registro atualizado com sucesso!'
                    });
                } else {
                    throw ("Não foi possível atualizar o id: " + addId + " na tabela cadastro!");
                }
                break;
            default:
                throw ("Não foi possível identificar o tipo!");
        }
    } catch (err) {
        // console.error(err); // aqui não vai aparecer o erro no console, pois este arquivo não é processado pelo frontend, mas sim pelo backend (node server.js)
        res.status(500).json({ message: `Erro: ${err}` });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
