// Função para adicionar um novo cliente
function adicionarCliente() {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;


    if (nome && telefone && email) {
        fetch('http://localhost:3000/clientes')
            .then(response => response.json())
            .then(clientes => {
                let novoId = "1"; // ID inicial como string

                if (clientes.length > 0) {
                    // Obtém o maior ID numérico e soma 1
                    const ids = clientes.map(cliente => parseInt(cliente.id)); // Converte IDs para número
                    novoId = (Math.max(...ids) + 1).toString(); // Converte de volta para string
                }

                const novoCliente = { id: novoId, nome, telefone, email };

                return fetch('http://localhost:3000/clientes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoCliente),
                });
            })
            .then(response => response.json())
            .then(data => {
                console.log("Cliente adicionado:", data);
                atualizarListaClientes(); // Atualiza a lista na tela após adicionar
                alert("Cliente adicionado com sucesso!");
            })
            .catch(error => {
                console.error('Erro ao adicionar cliente:', error);
                alert("Ocorreu um erro ao adicionar o cliente.");
            });
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}



// Função para atualizar a lista de clientes na tela
function atualizarListaClientes() {
    fetch('http://localhost:3000/clientes')
        .then(response => response.json())
        .then(clientes => {
            const listaClientes = document.getElementById("clientes-lista");
            listaClientes.innerHTML = "";

            clientes.forEach(cliente => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${cliente.nome}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.email}</td>
                    <td>
                        <button onclick="editarCliente(${cliente.id})">Editar</button>
                        <button onclick="deletarCliente(${cliente.id})">Deletar</button>
                    </td>
                `;
                listaClientes.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar clientes:', error);
            alert("Ocorreu um erro ao carregar a lista de clientes.");
        });
}

// Função para deletar um cliente
function deletarCliente(id) {
    if (!id) {
        alert("ID inválido!");
        return;
    }

    fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao deletar cliente");
        }
        alert("Cliente deletado com sucesso!");
        atualizarListaClientes(); // Atualiza a lista após a exclusão
    })
    .catch(error => {
        console.error('Erro ao deletar cliente:', error);
        alert("Ocorreu um erro ao deletar o cliente.");
    });
}


// Função para editar um cliente
function editarCliente(id) {
    console.log("Editando cliente com ID:", id); // Log para depuração
    if (!id) {
        alert("ID inválido");
        return;
    }

    fetch(`http://localhost:3000/clientes/${id}`)
        .then(response => response.json())
        .then(cliente => {
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("telefone").value = cliente.telefone;
            document.getElementById("email").value = cliente.email;

            const adicionarButton = document.getElementById("adicionarButton");
            adicionarButton.innerText = "Atualizar";
            adicionarButton.onclick = function() {
                atualizarCliente(id);
            };
        })
        .catch(error => {
            console.error('Erro ao editar cliente:', error);
            alert("Ocorreu um erro ao carregar os dados para edição.");
        });
}

// Função para atualizar um cliente
function atualizarCliente(id) {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    if (nome && telefone && email) {
        const clienteAtualizado = { nome, telefone, email };

        fetch(`http://localhost:3000/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteAtualizado),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Cliente atualizado:", data);
            alert("Cliente atualizado com sucesso!");
            atualizarListaClientes();
            resetarFormulario();
        })
        .catch(error => {
            console.error('Erro ao atualizar cliente:', error);
            alert("Ocorreu um erro ao atualizar o cliente.");
        });
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função para resetar o formulário após salvar as alterações
function resetarFormulario() {
    document.getElementById("nome").value = '';
    document.getElementById("telefone").value = '';
    document.getElementById("email").value = '';
    const adicionarBtn = document.querySelector("button[onclick='adicionarCliente()']");
    adicionarBtn.innerText = "Adicionar";
    adicionarBtn.setAttribute('onclick', 'adicionarCliente()');
}

window.onload = atualizarListaClientes;
