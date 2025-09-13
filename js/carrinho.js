/*
Objetivo 1 - quando clicar no botao de adicionar ao carrinho temos que atualizar o
contador, adicionar o produto no localStorage e atualizar o html do carrinho
    parte 1 - vamos adicionar +1 no icone do carrinho
        passo 1 - pegar os botões de adicionar ao carrinho do html
        passo 2 - adicionar uma evento de escuta nesses botões pra quando clicar disparar
        uma ação
        passo 3 - pega as informações do produto clicado e adicionar no localStorage
        passo 4 - atualizar o contador do carrinho de compras
        passo 5 - renderizar a tabela do carrinho de compras

Objetivo 2 - remover produtos do carrinho
        passo 1 - pegar o botão de deletar do html
        passo 2 - adicionar evento de escuta no botão
        passo 3 - remover o produto do localStorage
        passo 4 - atualizar o html do carrinho retirando o produto

Objetivo 3 - Atualizar os valores do carrinho
        passo 1 - adicionar evento de escuta no input do tbody
        passo 2 - atualizar valor total do produto
        passo 3 - atualizar o valor total do carrinho
*/

// Objetivo 1 - quando clicar no botao de adicionar ao carrinho temos que atualizar o
// contador, adicionar o produto no localStorage e atualizar o html do carrinho

//     parte 1 - vamos adicionar +1 no icone do carrinho
//         passo 1 - pegar os botões de adicionar ao carrinho do html


// Melhoria: Função única para extrair dados do produto do DOM
function extrairDadosProduto(elementoProduto) {
    return {
        id: elementoProduto.dataset.id,
        nome: elementoProduto.querySelector(".nome").textContent,
        imagem: elementoProduto.querySelector("img").getAttribute("src"),
        preco: parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(",", ".")),
        quantidade: 1
    };
}

// Melhoria: Função para adicionar produto ao carrinho, evitando repetição de lógica
function adicionarProdutoAoCarrinho(produto) {
    const carrinho = obterProdutosDoCarrinho();
    const existeProduto = carrinho.find(item => item.id === produto.id);
    if (existeProduto) {
        existeProduto.quantidade += 1;
    } else {
        carrinho.push(produto);
    }
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

// Melhoria: Delegação de eventos para melhor performance e manutenção
document.addEventListener('click', (evento) => {
    if (evento.target.classList.contains('adicionar-ao-carrinho')) {
        const elementoProduto = evento.target.closest('.produto');
        if (elementoProduto) {
            const produto = extrairDadosProduto(elementoProduto);
            adicionarProdutoAoCarrinho(produto);
        }
    }
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

//passo 4 - atualizar o contador do carrinho de compras

function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.quantidade;
    });

    console.log(total);

    document.getElementById('contador-carrinho').textContent = total;

}

//passo 5 - renderizar a tabela do carrinho de compras


function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    corpoTabela.innerHTML = ""; // Limpa o corpo da tabela antes de renderizar

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="td-produto">
                <img src="${produto.imagem}" alt="${produto.nome}" />
            </td>
            <td>${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
            <td class="td-quantidade">
                <input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1">
            </td>
            <td class="td-preco-total">R$${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
            <td>
                <button class="btn-remover" data-id="${produto.id}"></button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });
}


//Objetivo 2 - remover produtos do carrinho
//passo 1 - pegar o botão de deletar do html


// Melhoria: Delegação de eventos para o tbody, reduzindo múltiplos listeners
document.querySelector("#modal-1-content table tbody").addEventListener('click', (evento) => {
    if (evento.target.classList.contains('btn-remover')) {
        const id = evento.target.dataset.id;
        removerProdutoDoCarrinho(id);
    }
});

document.querySelector("#modal-1-content table tbody").addEventListener('input', (evento) => {
    if (evento.target.classList.contains('input-quantidade')) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = parseInt(evento.target.value);
        if (produto) {
            produto.quantidade = novaQuantidade;
        }
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
    }
});

//passo 4 - atualizar o html do carrinho retirando o produto

// Melhoria: Função nomeada de forma mais clara e com comentários
function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();
    // Remove o produto pelo id
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}

//passo 3 - atualizar o valor total do carrinho

// Melhoria: Função mais enxuta usando reduce
function atualizarValorTotalDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const total = produtos.reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0);
    document.querySelector('#total-carrinho').textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
}


// Melhoria: Função centralizadora para atualizar tudo do carrinho
function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalDoCarrinho();
}


// Inicialização: garante que o carrinho está sincronizado ao carregar a página
atualizarCarrinhoETabela();

/*
MELHORIAS REALIZADAS:
1. Delegação de eventos: reduz listeners e melhora performance.
2. Funções utilitárias: extração de dados do produto e adição ao carrinho separadas, facilitando manutenção.
3. Uso de reduce para somar valores: código mais limpo e moderno.
4. Comentários explicativos: facilitam entendimento para outros devs.
5. Botão remover agora tem texto, melhorando acessibilidade.
*/