// reserva.js

// Função para adicionar uma nova reserva
function adicionarReserva() {
    const nomeCliente = document.getElementById("nomeCliente").value;
    const produto = document.getElementById("produto").value;
    const dataReserva = document.getElementById("dataReserva").value;

    if (nomeCliente && produto && dataReserva) {
        const novaReserva = { nomeCliente, produto, dataReserva };

        // Enviar dados para o json-server
        fetch('http://localhost:3000/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaReserva),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Reserva adicionada:", data);
            atualizarListaReservas(); // Atualiza a lista na tela
            alert("Reserva adicionada com sucesso!");
        })
        .catch(error => {
            console.error('Erro ao adicionar reserva:', error);
            alert("Ocorreu um erro ao adicionar a reserva.");
        });
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função para atualizar a lista de reservas na tela
function atualizarListaReservas() {
    fetch('http://localhost:3000/reservas')
        .then(response => response.json())
        .then(reservas => {
            const listaReservas = document.getElementById("reservas-lista");
            listaReservas.innerHTML = "";

            reservas.forEach((reserva, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${reserva.nomeCliente}</td>
                    <td>${reserva.produto}</td>
                    <td>${reserva.dataReserva}</td>
                    <td>
                        <button onclick="deletarReserva(${reserva.id})">Deletar</button>
                    </td>
                `;
                listaReservas.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar reservas:', error);
            alert("Ocorreu um erro ao carregar as reservas.");
        });
}

// Função para deletar uma reserva
function deletarReserva(id) {
    fetch(`http://localhost:3000/reservas/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        console.log("Reserva deletada");
        atualizarListaReservas();
    })
    .catch(error => {
        console.error('Erro ao deletar reserva:', error);
        alert("Ocorreu um erro ao deletar a reserva.");
    });
}

// Inicializa a lista de reservas ao carregar a página
window.onload = atualizarListaReservas;
