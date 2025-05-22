
const api = 'https://menuon.onrender.com/api/comandas';

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
});
