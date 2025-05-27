const api = 'https://menuonproject.onrender.com/api/comandas';

const produtos = [
    { nome: 'Pastel 1', preco: 5.0 },
    { nome: 'Pastel 2', preco: 6.0 },
    { nome: 'Pastel completo', preco: 8.0 },
    { nome: 'Tapioca', preco: 4.0 },
    { nome: 'Coxinhas', preco: 3.5 },
    { nome: 'Sopa', preco: 7.0 },
    { nome: 'Açaí 1', preco: 10.0 },
    { nome: 'Açaí 2', preco: 12.0 },
    { nome: 'H2O', preco: 2.0 }
];

const container = document.getElementById('produtos');
let idEditando = null;  // ✅ Para saber se está editando

produtos.forEach((produto, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
        <label>
            <input type="checkbox" id="check-${index}"> ${produto.nome} (R$ ${produto.preco})
        </label>
        <button type="button" onclick="alterarQuantidade(${index}, -1)">-</button>
        <span id="quant-${index}">0</span>
        <button type="button" onclick="alterarQuantidade(${index}, 1)">+</button>
    `;
    container.appendChild(div);
});

function alterarQuantidade(index, delta) {
    const span = document.getElementById('quant-' + index);
    let qtd = parseInt(span.textContent) + delta;
    if (qtd < 0) qtd = 0;
    span.textContent = qtd;
}

document.getElementById('comanda-form').addEventListener('submit', async e => {
    e.preventDefault();
    const cliente = document.getElementById('cliente').value;
    const pedidos = [];
    let valorTotal = 0;

    produtos.forEach((produto, index) => {
        if (document.getElementById('check-' + index).checked) {
            const quantidade = parseInt(document.getElementById('quant-' + index).textContent);
            if (quantidade > 0) {
                pedidos.push({ produto: produto.nome, quantidade, precoUnitario: produto.preco });
                valorTotal += quantidade * produto.preco;
            }
        }
    });

    const comanda = { cliente, pedidos, valorTotal, data: new Date().toISOString().split('T')[0] };

    if (idEditando) {
        // ✅ PUT para editar
        await fetch(`${api}/${idEditando}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comanda)
        });
        idEditando = null;
    } else {
        // ✅ POST para criar
        await fetch(api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comanda)
        });
    }

    alert('Comanda salva!');
    carregarComandas();
    e.target.reset();
});

async function carregarComandas(endpoint, containerId) {
    const lista = document.getElementById(containerId);
    lista.innerHTML = '';

    const resposta = await fetch(api + endpoint);
    const comandas = await resposta.json();

    comandas.forEach(c => {
        const item = document.createElement('li');

        let pedidosTexto = '';
        if (Array.isArray(c.pedidos) && c.pedidos.length > 0) {
            pedidosTexto = c.pedidos.map(p =>
                `${p.quantidade}x ${p.produto} (R$ ${p.precoUnitario})`
            ).join(', ');
        } else {
            pedidosTexto = 'Nenhum pedido';
        }

        item.innerHTML = `
            <strong>Cliente:</strong> ${c.cliente}<br>
            <strong>Total:</strong> ${c.valorTotal}<br>
            <strong>Data:</strong> ${c.data}<br>
            <strong>Status:</strong> ${c.status}<br>
            <strong>Pedidos:</strong> ${c.pedidos.map(i => `${i.produto} x${i.quantidade}`).join(', ')}<br>
            <button onclick='editarComanda(${JSON.stringify(c)})'>Editar</button>
            <button onclick="marcarComoEmAberto(${c.id})">Em Aberto</button>
            <button onclick="marcarComoPago(${c.id})">Pago</button>
        `;
        lista.appendChild(item);
    });
}

async function marcarComoEmAberto(id) {
    await fetch(`${api}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'em_aberto' })
    });
    location.reload();
}

async function marcarComoPago(id) {
    await fetch(`${api}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paga' })
    });
    location.reload();
}


function editarComanda(comanda) {
    document.getElementById('cliente').value = comanda.cliente;

    // Limpa as seleções e quantidades
    produtos.forEach((produto, index) => {
        document.getElementById('check-' + index).checked = false;
        document.getElementById('quant-' + index).textContent = '0';
    });

    // Marca os pedidos existentes
    if (Array.isArray(comanda.pedidos)) {
        comanda.pedidos.forEach(p => {
            const index = produtos.findIndex(prod => prod.nome === p.produto);
            if (index >= 0) {
                document.getElementById('check-' + index).checked = true;
                document.getElementById('quant-' + index).textContent = p.quantidade;
            }
        });
    }

    idEditando = comanda.id;
}

carregarComandas();





// const api = 'https://menuonproject.onrender.com/api/comandas';

// const produtos = [
//     { nome: 'Pastel 1', preco: 5.0 },
//     { nome: 'Pastel 2', preco: 6.0 },
//     { nome: 'Pastel completo', preco: 8.0 },
//     { nome: 'Tapioca', preco: 4.0 },
//     { nome: 'Coxinhas', preco: 3.5 },
//     { nome: 'Sopa', preco: 7.0 },
//     { nome: 'Açaí 1', preco: 10.0 },
//     { nome: 'Açaí 2', preco: 12.0 },
//     { nome: 'H2O', preco: 2.0 }
// ];

// const container = document.getElementById('produtos');

// produtos.forEach((produto, index) => {
//     const div = document.createElement('div');
//     div.innerHTML = `
//         <label>
//             <input type="checkbox" id="check-${index}"> ${produto.nome} (${produto.preco})
//         </label>
//         <button type="button" onclick="alterarQuantidade(${index}, -1)">-</button>
//         <span id="quant-${index}">0</span>
//         <button type="button" onclick="alterarQuantidade(${index}, 1)">+</button>
//     `;
//     container.appendChild(div);
// });

// function alterarQuantidade(index, delta) {
//     const span = document.getElementById('quant-' + index);
//     let qtd = parseInt(span.textContent) + delta;
//     if (qtd < 0) qtd = 0;
//     span.textContent = qtd;
// }

// document.getElementById('comanda-form').addEventListener('submit', async e => {
//     e.preventDefault();
//     const cliente = document.getElementById('cliente').value;
//     const pedidos = [];
//     let valorTotal = 0;

//     produtos.forEach((produto, index) => {
//         if (document.getElementById('check-' + index).checked) {
//             const quantidade = parseInt(document.getElementById('quant-' + index).textContent);
//             if (quantidade > 0) {
//                 pedidos.push({ produto: produto.nome, quantidade, precoUnitario: produto.preco });
//                 valorTotal += quantidade * produto.preco;
//             }
//         }
//     });

//     const comanda = { cliente, pedidos, valorTotal, data: new Date().toISOString().split('T')[0] };

//     await fetch(api, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(comanda)
//     });

//     alert('Comanda salva!');
//     carregarComandas();  // ✅ Atualiza a lista após salvar
// });

// async function carregarComandas() {
//     const lista = document.getElementById('lista-comandas');
//     lista.innerHTML = '';

//     const resposta = await fetch(api);
//     const comandas = await resposta.json();

//     comandas.forEach(comanda => {
//         const item = document.createElement('li');

//         let pedidosTexto = '';
//         if (Array.isArray(comanda.pedidos) && comanda.pedidos.length > 0) {
//             pedidosTexto = comanda.pedidos.map(p => 
//                 `${p.quantidade}x ${p.produto} (R$ ${p.precoUnitario})`
//             ).join(', ');
//         } else {
//             pedidosTexto = 'Nenhum pedido';
//         }

//         item.innerHTML = `
//             <strong>Cliente:</strong> ${comanda.cliente}<br>
//             <strong>Pedidos:</strong> ${pedidosTexto}<br>
//             <strong>Total:</strong> R$ ${comanda.valorTotal}<br>
//             <strong>Data:</strong> ${comanda.data}
//         `;

//         lista.appendChild(item);
//     });
// }





// // ✅ Carrega a lista quando a página for aberta
// document.addEventListener('DOMContentLoaded', () => {
//     carregarComandas();
// });


// async function carregarComandas() {
//     const lista = document.getElementById('lista-comandas');
//     lista.innerHTML = '';

//     const resposta = await fetch(api);
//     const comandas = await resposta.json();

//     comandas.forEach(comanda => {
//         const item = document.createElement('li');
//         item.textContent = `Cliente: ${comanda.cliente}, Total: ${comanda.valorTotal}, Data: ${comanda.data}`;
//         lista.appendChild(item);
//     });
// }


// const api = 'https://menuonproject.onrender.com/api/comandas';

// const produtos = [
//     { nome: 'Pastel 1', preco: 5.0 },
//     { nome: 'Pastel 2', preco: 6.0 },
//     { nome: 'Pastel completo', preco: 8.0 },
//     { nome: 'Tapioca', preco: 4.0 },
//     { nome: 'Coxinhas', preco: 3.5 },
//     { nome: 'Sopa', preco: 7.0 },
//     { nome: 'Açaí 1', preco: 10.0 },
//     { nome: 'Açaí 2', preco: 12.0 },
//     { nome: 'H2O', preco: 2.0 }
// ];

// const container = document.getElementById('produtos');

// produtos.forEach((produto, index) => {
//     const div = document.createElement('div');
//     div.innerHTML = `
//         <label>
//             <input type="checkbox" id="check-${index}"> ${produto.nome} (${produto.preco})
//         </label>
//         <button type="button" onclick="alterarQuantidade(${index}, -1)">-</button>
//         <span id="quant-${index}">0</span>
//         <button type="button" onclick="alterarQuantidade(${index}, 1)">+</button>
//     `;
//     container.appendChild(div);
// });

// function alterarQuantidade(index, delta) {
//     const span = document.getElementById('quant-' + index);
//     let qtd = parseInt(span.textContent) + delta;
//     if (qtd < 0) qtd = 0;
//     span.textContent = qtd;
// }

// document.getElementById('comanda-form').addEventListener('submit', async e => {
//     e.preventDefault();
//     const cliente = document.getElementById('cliente').value;
//     const pedidos = [];
//     let valorTotal = 0;

//     produtos.forEach((produto, index) => {
//         if (document.getElementById('check-' + index).checked) {
//             const quantidade = parseInt(document.getElementById('quant-' + index).textContent);
//             if (quantidade > 0) {
//                 pedidos.push({ produto: produto.nome, quantidade, precoUnitario: produto.preco });
//                 valorTotal += quantidade * produto.preco;
//             }
//         }
//     });

//     const comanda = { cliente, pedidos, valorTotal, data: new Date().toISOString().split('T')[0] };

//     await fetch(api, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(comanda)
//     });

//     alert('Comanda salva!');
// });
