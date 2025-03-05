document.addEventListener("DOMContentLoaded", function () {
    carregarCategorias(); // Carregar as categorias no select
    atualizarListaProdutos();
});

// Função para carregar categorias no select
function carregarCategorias() {
    fetch("http://localhost:3000/categorias")
        .then(response => response.json())
        .then(categorias => {
            const categoriaSelect = document.getElementById("categoria");
            categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>'; // Resetar opções

            categorias.forEach(categoria => {
                const option = document.createElement("option");
                option.value = categoria.id;
                option.textContent = categoria.nome;
                categoriaSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar categorias:", error);
            alert("Erro ao carregar as categorias.");
        });
}

// Função para adicionar um novo produto
function adicionarProduto() {
    const categoriaId = document.getElementById("categoria").value;
    const nome = document.getElementById("nome").value.trim();
    const valor = document.getElementById("valor").value.trim();
    const quantidade = document.getElementById("quantidade").value.trim();

    if (!categoriaId || !nome || !valor || !quantidade) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const novoProduto = { categoriaId, nome, valor, quantidade };

    fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto),
    })
    .then(response => response.json())
    .then(() => {
        atualizarListaProdutos();
        alert("Produto adicionado com sucesso!");
        document.getElementById("produto-form").reset();
    })
    .catch(error => {
        console.error('Erro ao adicionar produto:', error);
        alert("Erro ao adicionar o produto.");
    });
}

// Função para atualizar a lista de produtos na tela
function atualizarListaProdutos() {
    fetch('http://localhost:3000/produtos')
        .then(response => response.json())
        .then(produtos => {
            const listaProdutos = document.getElementById("produtos-lista");
            listaProdutos.innerHTML = "";

            produtos.forEach(produto => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>R$ ${parseFloat(produto.valor).toFixed(2)}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.categoriaId}</td>
                    <td>
                        <button onclick="editarProduto(${produto.id})">Editar</button>
                        <button onclick="deletarProduto(${produto.id})">Deletar</button>
                    </td>
                `;
                listaProdutos.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
            alert("Erro ao carregar os produtos.");
        });
}

// Função para editar um produto
function editarProduto(id) {
    const novoNome = prompt("Novo nome do produto:");
    const novoValor = prompt("Novo valor:");
    const novaQuantidade = prompt("Nova quantidade:");

    if (!novoNome || !novoValor || !novaQuantidade) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    fetch(`http://localhost:3000/produtos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoNome, valor: novoValor, quantidade: novaQuantidade }),
    })
    .then(response => response.json())
    .then(() => {
        atualizarListaProdutos();
        alert("Produto atualizado com sucesso!");
    })
    .catch(error => {
        console.error('Erro ao editar produto:', error);
        alert("Erro ao editar o produto.");
    });
}

// Função para deletar um produto
function deletarProduto(id) {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
        fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' })
        .then(() => {
            atualizarListaProdutos();
            alert("Produto deletado com sucesso!");
        })
        .catch(error => {
            console.error('Erro ao deletar produto:', error);
            alert("Erro ao deletar o produto.");
        });
    }
}
