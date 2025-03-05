// Função que será chamada quando o usuário clicar no botão "Entrar"
function login() {
    const email = document.getElementById("email").value;  // Obtém o valor do campo de e-mail
    const password = document.getElementById("password").value;  // Obtém o valor do campo de senha

    // Simulando um banco de dados de usuários com um array
    const usuarios = [
        { email: "adm@adm.com.br", senha: "adm123", tipo: "admin" },
        { email: "funcionario@funcionario.com.br", senha: "funcionario123", tipo: "funcionario" },
        { email: "cliente@cliente.com", senha: "cliente123", tipo: "cliente" }
    ];

    // Verificando se existe um usuário com o e-mail e senha informados
    const usuarioEncontrado = usuarios.find(user => user.email === email && user.senha === password);

    // Se o usuário for encontrado, redireciona para a página de dashboard
    if (usuarioEncontrado) {
        alert(`Bem-vindo, ${usuarioEncontrado.tipo}!`);
        window.location.href = "dashboard.html";  // Redireciona para o painel principal
    } else {
        // Caso contrário, exibe uma mensagem de erro
        alert("E-mail ou senha inválidos.");
    }
}
