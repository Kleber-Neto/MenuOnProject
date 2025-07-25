const api = 'http://137.131.178.47:8080/api/comandas';

// const api = 'https://menuonproject-production.up.railway.app/api/comandas';

const produtos = [
    { nome: 'Pastel 1', preco: 7.0 },
    { nome: 'Pastel 2', preco: 8.50 },
    { nome: 'Pastel 3', preco: 10.0 },
    { nome: 'Tapioca',  preco: 6.0 },
    { nome: 'Sopa',     preco: 9.0 },
    { nome: 'Açaí 1',   preco: 5.0 },
    { nome: 'Açaí 2',  preco: 10.0 },
    { nome: 'H2O',      preco: 8.0 },
    { nome: 'Coca 1', preco: 10.0  },
    { nome: 'Coca 2 ', preco: 14.0 },
    {nome: 'Variados', preco: 10.0 },
];

const container = document.getElementById('produtos');
let idEditando = null;

if (container) {
    produtos.forEach((produto, index) => {
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `
            <label>
                <input type="checkbox" id="check-${index}"> ${produto.nome} (R$${produto.preco})
            </label>
            <button type="button" onclick="alterarQuantidade(${index}, -1)">-</button>
            <span id="quant-${index}">0</span>
            <button type="button" onclick="alterarQuantidade(${index}, 1)">+</button>
        `;
        container.appendChild(div);
    });

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

        const comanda = {
            cliente,
            pedidos,
            valorTotal,
            data: new Date().toISOString().split('T')[0],
            status: 'pendente'
        };

        if (idEditando) {
            await fetch(`${api}/${idEditando}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comanda)
            });
            idEditando = null;
        } else {
            await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comanda)
            });
        }

        alert('Comanda salva!');
        carregarComandas(statusAtual);
        e.target.reset();
    });
}

function alterarQuantidade(index, delta) {
    const span = document.getElementById('quant-' + index);
    let qtd = parseInt(span.textContent) + delta;
    if (qtd < 0) qtd = 0;
    span.textContent = qtd;
}

async function carregarComandas(statusDesejado) {
    const lista = document.getElementById('comandas');
    if (!lista) return;

    lista.innerHTML = '';

    const resposta = await fetch(api);
    const comandas = await resposta.json();

    comandas
        .filter(c => c.status === statusDesejado)
        .forEach(c => {
            const item = document.createElement('li');

            let pedidosTexto = 'Nenhum pedido';
            if (Array.isArray(c.pedidos) && c.pedidos.length > 0) {
                pedidosTexto = c.pedidos.map(p => `${p.quantidade}x ${p.produto} (R$ ${p.precoUnitario})`).join(', ');
            }

            item.innerHTML = `
                <strong>Cliente:</strong> ${c.cliente}<br>
                <strong>Pedidos:</strong> ${pedidosTexto}<br>
                <strong>Total:</strong> R$ ${c.valorTotal}<br>
                <strong>Data:</strong> ${c.data}<br>
                <strong>Status:</strong> ${c.status}<br>
                ${botoesComanda(c)}
            `;

            lista.appendChild(item);
        });
}

function botoesComanda(c) {
    let botoes = '';

    if (c.status === 'pendente') {
        botoes += `<button onclick='editarComanda(${JSON.stringify(c).replace(/'/g, "\\'")})'>Editar</button>`;
        botoes += `<button onclick="marcarComoEmAberto(${c.id})">Em Aberto</button>`;
        botoes += `<button onclick="marcarComoPago(${c.id})">Pago</button>`;
    } else if (c.status === 'em_aberto') {
        botoes += `<button onclick="marcarComoPago(${c.id})">Pago</button>`;
    }
    // Se for "paga", nenhum botão.

    return botoes;
}

async function marcarComoEmAberto(id) {
    await fetch(`${api}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'em_aberto' })
    });
    carregarComandas(statusAtual);
}

async function marcarComoPago(id) {
    await fetch(`${api}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paga' })
    });
    carregarComandas(statusAtual);
}

function editarComanda(comanda) {
    document.getElementById('cliente').value = comanda.cliente;

    produtos.forEach((produto, index) => {
        document.getElementById('check-' + index).checked = false;
        document.getElementById('quant-' + index).textContent = '0';
    });

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


// Registro do service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registrado!'))
    .catch(err => console.log('Erro ao registrar Service Worker', err));
}

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
