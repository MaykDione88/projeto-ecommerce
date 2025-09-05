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
        passo 5 - atualizar o valor

Objetivo 3 - Atualizar os valores do carrinho
        passo 1 - pegar o input de quantidade do carrinho
        passo 2 - adicionar evento de escuta no input
        passo 3 - atualizar o valor total do produto
        passo 4 - atualizar o valor total do carrinho
*/

// Objetivo 1 - quando clicar no botao de adicionar ao carrinho temos que atualizar o
// contador, adicionar o produto no localStorage e atualizar o html do carrinho

//     parte 1 - vamos adicionar +1 no icone do carrinho
//         passo 1 - pegar os botões de adicionar ao carrinho do html

const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');

// passo 2 - adicionar uma evento de escuta nesses botões pra quando clicar disparar uma ação

botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        //passo 3 - pega as informações do produto clicado e adicionar no localStorage
        const elementoProduto = evento.target.closest(".produto");
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector(".nome").textContent;
        const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
        const produtoPreco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(",", "."));

        //buscar a lista de produtos do localStorage
        const carrinho = obterProdutosDoCarrinho();
        //testar se o produto já existe no carrinho
        const existeProduto = carrinho.find(produto => produto.id === produtoId);
        //se existir só atualiza a quantidade
        if (existeProduto) {
            existeProduto.quantidade += 1;
        }
        else {
            //se não existir adiciona o produto com quantidade 1
            const produto = {
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1
            };
            carrinho.push(produto);
        }

        salvarProdutosNoCarrinho(carrinho);
    atualizarContadorCarrinho();

    });

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
    const carrinho = obterProdutosDoCarrinho();
    let total = 0;

    carrinho.forEach(produto => {
        total += produto.quantidade;
    });

    console.log(total);

    document.getElementById('contador-carrinho').textContent = total;

}
