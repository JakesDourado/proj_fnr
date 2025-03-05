document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();
    carregarProdutos(); // Carrega todos os produtos inicialmente
    carregarReservas();

    // Adiciona evento para atualizar produtos conforme a categoria selecionada
    document.getElementById("categoria").addEventListener("change", (event) => {
        carregarProdutos(event.target.value);
    });
});

async function carregarCategorias() {
    try {
        const response = await fetch("http://localhost:3000/categorias");
        const categorias = await response.json();
        const categoriaSelect = document.getElementById("categoria");

        if (!categoriaSelect) {
            console.error("Elemento categoria não encontrado");
            return;
        }

        categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';

        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.nome;
            categoriaSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        alert("Erro ao carregar as categorias.");
    }
}

async function carregarProdutos(categoriaId = "") {
    try {
        let url = "http://localhost:3000/produtos";
        if (categoriaId) {
            url += `?categoriaId=${categoriaId}`;
        }

        const response = await fetch(url);
        const produtos = await response.json();

        atualizarListaProdutos(produtos);
        atualizarSelectProdutos(produtos);
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Erro ao carregar os produtos.");
    }
}

async function carregarReservas() {
    try {
        const response = await fetch("http://localhost:3000/reservas");
        const reservas = await response.json();
        atualizarListaReservas(reservas);
    } catch (error) {
        console.error("Erro ao carregar reservas:", error);
        alert("Erro ao carregar as reservas.");
    }
}

function atualizarListaProdutos(produtos) {
    const listaProdutos = document.getElementById("lista-produtos");
    if (!listaProdutos) {
        console.error("Erro: Elemento 'lista-produtos' não encontrado.");
        return;
    }

    listaProdutos.innerHTML = ""; // Limpa a lista antes de atualizar

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${parseFloat(produto.valor).toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.categoriaNome || "Desconhecida"}</td>
            <td>
                <button onclick="editarProduto(${produto.id})">Editar</button>
                <button onclick="deletarProduto(${produto.id})">Deletar</button>
            </td>
        `;
        listaProdutos.appendChild(tr);
    });
}

function atualizarSelectProdutos(produtos) {
    const produtoSelect = document.getElementById("produto");
    if (!produtoSelect) {
        console.error("Elemento 'produto' não encontrado.");
        return;
    }

    produtoSelect.innerHTML = '<option value="">Selecione um produto</option>';

    produtos.forEach(produto => {
        const option = document.createElement("option");
        option.value = produto.id;
        option.textContent = produto.nome;
        produtoSelect.appendChild(option);
    });
}

function atualizarListaReservas(reservas) {
    const listaReservas = document.getElementById("lista-reservas");
    if (!listaReservas) {
        console.error("Elemento lista-reservas não encontrado");
        return;
    }

    listaReservas.innerHTML = "";

    reservas.forEach(reserva => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${reserva.produtoNome}</td>
            <td>${reserva.quantidade}</td>
            <td>${reserva.dataReserva}</td>
        `;
        listaReservas.appendChild(tr);
    });
}

async function adicionarProduto() {
    const nome = document.getElementById("nome").value;
    const valor = document.getElementById("valor").value;
    const quantidade = document.getElementById("quantidade").value;
    const categoriaId = document.getElementById("categoria").value;

    if (!nome || !valor || !quantidade || !categoriaId) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    const produto = { nome, valor, quantidade, categoriaId };

    try {
        await fetch("http://localhost:3000/produtos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });
        carregarProdutos(categoriaId);
        document.getElementById("produto-form").reset();
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        alert("Erro ao adicionar o produto.");
    }
}

async function editarProduto(id) {
    const nome = prompt("Novo nome do produto:");
    const valor = prompt("Novo valor do produto:");
    const quantidade = prompt("Nova quantidade do produto:");
    const categoriaId = prompt("Nova categoria do produto:");

    if (!nome || !valor || !quantidade || !categoriaId) return;

    const produto = { nome, valor, quantidade, categoriaId };

    try {
        await fetch(`http://localhost:3000/produtos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        });
        carregarProdutos(categoriaId);
    } catch (error) {
        console.error("Erro ao editar produto:", error);
        alert("Erro ao editar o produto.");
    }
}

async function deletarProduto(id) {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
        await fetch(`http://localhost:3000/produtos/${id}`, { method: "DELETE" });
        carregarProdutos();
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        alert("Erro ao deletar o produto.");
    }
}
