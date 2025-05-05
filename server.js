// server.js
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 80;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const pool = mysql.createPool({
    host: 'mysql-3d1f4d97-phsilvamartins590-643b.j.aivencloud.com',
    port: '25127',
    user: 'avnadmin',
    password: 'AVNS_7gXTgilDt5Pm0Czpcjq',
    database: 'defaultdb'
});


app.post('/api/mysql', async (req, res) => {
    const { nome, login, senha, tipo, id } = req.body;
    try {
        switch (tipo) {
            case 'cadastro':
                var [rows, fields] = await pool.query(
                    "insert into `freedb_myql_pedro`.`tbl_login` (`nome`, `login`, `senha`) values (?, ?, ?);",
                    [nome, login, senha]
                );
                if (rows.affectedRows > 0) {
                    res.json({ message: 'Usuário cadastrado com sucesso!' });
                } else {
                    throw ('Não foi possível cadastrar o usuário!');
                }
                break;
                case 'login':
                    try {
                        var [rows, fields] = await pool.query(
                            "select * from `freedb_myql_pedro`.`tbl_login` where `nome` = ? and `login` = ? and `senha` = ?;",
                            [nome, login, senha]
                        );
                        if (rows.length >= 1) {
                            res.json({ message: 'Usuário logado com sucesso!'});
                            resultado = 1;
                        } else {
                            throw ("Não foi possível logar o usuário");
                        }
                    }
                    catch (err) {
                        res.status(500).json({
                            message: `Erro de login: ${err}`,
                            error: `Erro de login: ${err}`
                        })
                    }
                break;
                case 'leitura':
                var addNome = "";
                var addLogin = "";
                var addAnd = "";

                if (nome.trim().length > 0) {
                    addNome = " `nome` like '%" + nome + "%' ";
                }

                if (login.trim().length > 0) {
                    addLogin = " `login` like '%" + login + "%' ";
                }

                if (nome.trim().length > 0 && login.trim().length > 0) {
                    addAnd = " and ";
                }

                var strSql = "select * from `freedb_myql_pedro`.`tbl_login` where" + 
                    addNome + addAnd + addLogin + ";";
                var [rows, fields] = await pool.query(strSql);
                if (rows.length > 0) {
                    res.json({ 
                        message: 'Nome ou login encontrado com sucesso!',
                        id: rows[0].id,
                        nome: rows[0].nome,
                        login: rows[0].login,
                        linhas: rows.length
                    });
                } else {
                    throw ("Não foi possível encontrar o nome ou login!");
                }
                break;
                case 'atualizacao':
                    var strSql = "select * from `freedb_myql_pedro`.`tbl_login`;";
                    var [rows, fields] = await pool.query(strSql);
                    if (rows.length > 0) {
                        res.json({ 
                            message: 'Nome, login e senhas encontrados com sucesso!',
                            rows: rows
                        });
                    } else {
                        throw ("Não há registro algum na tabela tbl_cadastro!");
                    }
                    break;
                case 'atualizar':
                    var addId = "";
                    var addNome = "";
                    var addLogin = "";
                    var addSenha = "";
                    var addAnd = "";
    
                    if (id.trim().length > 0) {
                        addId = id;
                    }
    
                    if (nome.trim().length > 0) {
                        addNome = " `nome` = '" + nome + "' ";
                    }
    
                    if (login.trim().length > 0) {
                        addLogin = " `login` = '" + login + "' ";
                    }
    
                    if (addNome.length > 0) {
                        addLogin = " , " + addLogin;
                    }
    
                    if (senha.trim().length > 0) {
                        addSenha = " `senha` = '" + senha + "' ";
                    }
    
                    if (addLogin.length > 0) {
                        addSenha = " , " + addSenha;
                    }
    
                    var strSql = "update `freedb_myql_pedro`.`tbl_login` set " + 
                        addNome + addLogin + addSenha + 
                        " where `id` = " + addId + ";";
                    var [rows, fields] = await pool.query(strSql);
                    if (rows.affectedRows > 0) {
                        res.json({ 
                            message: 'Registro atualizado com sucesso!'
                        });
                    } else {
                        throw ("Não foi possível atualizar o id: " + addId + " na tabela tbl_clientes!");
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