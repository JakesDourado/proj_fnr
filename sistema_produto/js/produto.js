// produto.js

// Função para adicionar um novo produto
function adicionarProduto() {
    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const categoria = document.getElementById("categoria").value;

    if (nome && preco && categoria) {
        const novoProduto = { nome, preco, categoria };

        // Enviar dados para o json-server
        fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoProduto),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Produto adicionado:", data);
            atualizarListaProdutos(); // Atualiza a lista na tela
            alert("Produto adicionado com sucesso!");
        })
        .catch(error => {
            console.error('Erro ao adicionar produto:', error);
            alert("Ocorreu um erro ao adicionar o produto.");
        });
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função para atualizar a lista de produtos na tela
function atualizarListaProdutos() {
    fetch('http://localhost:3000/produtos')
        .then(response => response.json())
        .then(produtos => {
            const listaProdutos = document.getElementById("produtos-lista");
            listaProdutos.innerHTML = "";

            produtos.forEach((produto, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>${produto.preco}</td>
                    <td>${produto.categoria}</td>
                    <td>
                        <button onclick="deletarProduto(${produto.id})">Deletar</button>
                    </td>
                `;
                listaProdutos.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
            alert("Ocorreu um erro ao carregar os produtos.");
        });
}

// Função para deletar um produto
function deletarProduto(id) {
    fetch(`http://localhost:3000/produtos/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        console.log("Produto deletado");
        atualizarListaProdutos();
    })
    .catch(error => {
        console.error('Erro ao deletar produto:', error);
        alert("Ocorreu um erro ao deletar o produto.");
    });
}

// Inicializa a lista de produtos ao carregar a página
window.onload = atualizarListaProdutos;
