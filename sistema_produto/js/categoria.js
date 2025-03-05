// Função para adicionar ou editar uma categoria
function salvarCategoria() {
    const id = document.getElementById("categoria-id").value; // Para edição
    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    if (!nome || !descricao) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Verificar se a categoria já existe antes de salvar
    fetch("http://localhost:3000/categorias")
        .then(response => response.json())
        .then(categorias => {
            const categoriaExistente = categorias.find(categoria => categoria.nome.toLowerCase() === nome.toLowerCase());

            if (categoriaExistente && !id) {
                alert("Categoria já existe!");
                return;
            }

            const categoria = { nome, descricao };
            const metodo = id ? "PUT" : "POST";
            const url = id ? `http://localhost:3000/categorias/${id}` : "http://localhost:3000/categorias";

            fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoria),
            })
            .then(response => {
                if (!response.ok) throw new Error("Erro ao salvar categoria.");
                return response.json();
            })
            .then(() => {
                alert(id ? "Categoria atualizada!" : "Categoria adicionada!");
                limparFormulario();
                atualizarListaCategorias();
            })
            .catch(error => {
                console.error("Erro ao salvar categoria:", error);
                alert("Ocorreu um erro ao salvar a categoria.");
            });
        })
        .catch(error => {
            console.error("Erro ao verificar categorias:", error);
            alert("Erro ao acessar o banco de dados.");
        });
}

// Função para atualizar a lista de categorias na tela
function atualizarListaCategorias() {
    fetch("http://localhost:3000/categorias")
        .then(response => response.json())
        .then(categorias => {
            const listaCategorias = document.getElementById("categorias-lista");
            listaCategorias.innerHTML = "";

            categorias.forEach((categoria) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${categoria.nome}</td>
                    <td>${categoria.descricao}</td>
                    <td>
                        <button onclick="editarCategoria('${categoria.id}', '${categoria.nome}', '${categoria.descricao}')">Editar</button>
                        <button onclick="deletarCategoria('${categoria.id}')">Deletar</button>
                    </td>
                `;
                listaCategorias.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Erro ao buscar categorias:", error);
            alert("Ocorreu um erro ao carregar as categorias.");
        });
}

// Função para editar uma categoria
function editarCategoria(id, nome, descricao) {
    document.getElementById("categoria-id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("descricao").value = descricao;
}

// Função para deletar uma categoria
function deletarCategoria(id) {
    if (confirm("Tem certeza que deseja deletar esta categoria?")) {
        fetch(`http://localhost:3000/categorias/${id}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao deletar categoria");
            alert("Categoria deletada!");
            atualizarListaCategorias();
        })
        .catch(error => {
            console.error("Erro ao deletar categoria:", error);
            alert("Ocorreu um erro ao tentar deletar.");
        });
    }
}

// Função para limpar o formulário após salvar
function limparFormulario() {
    document.getElementById("categoria-id").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("descricao").value = "";
}

// Inicializa a lista de categorias ao carregar a página
window.onload = atualizarListaCategorias;
