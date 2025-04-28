document.getElementById('frmCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('txtNome').value;
    const email = document.getElementById('txtEmail').value;
    const senha = document.getElementById('txtSenha').value;
    const tipo = 'cadastro';

    const response = await fetch('/api/mysql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, tipo })
    });

    const result = await response.json();
    console.log(result.message);
});