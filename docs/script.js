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

produtos.forEach((produto, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
        <label>
            <input type="checkbox" id="check-${index}"> ${produto.nome} (${produto.preco})
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

    await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comanda)
    });

    alert('Comanda salva!');
    carregarComandas();  // ✅ Atualiza a lista após salvar
});

async function carregarComandas() {
    const lista = document.getElementById('lista-comandas');
    lista.innerHTML = '';

    const resposta = await fetch(api);
    const comandas = await resposta.json();

    comandas.forEach(comanda => {
        const item = document.createElement('li');
        
        // Formata os pedidos
        const pedidosTexto = comanda.pedidos.map(p => 
            `${p.quantidade}x ${p.produto} (R$ ${p.precoUnitario})`
        ).join(', ');

        item.innerHTML = `
            <strong>Cliente:</strong> ${comanda.cliente}<br>
            <strong>Pedidos:</strong> ${pedidosTexto}<br>
            <strong>Total:</strong> R$ ${comanda.valorTotal}<br>
            <strong>Data:</strong> ${comanda.data}
        `;

        lista.appendChild(item);
    });
}




// ✅ Carrega a lista quando a página for aberta
document.addEventListener('DOMContentLoaded', () => {
    carregarComandas();
});


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
