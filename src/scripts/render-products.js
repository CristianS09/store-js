//Obtem o container da snack bar
const snackBarContainer = document.getElementById('snack-bar-container');
//Modal do carrinho.
const cartModal = document.getElementById('cart-modal');
cartModal.style.visibility = 'hidden';
//Corpo do modal
const modalBody = document.getElementById('modal-body');
//Pesquisa produto
const searchProductButton = document.querySelector('#search-button');
//Obtém o container dos cards dos produtos.
const cardProductsContainer = document.getElementById('card-products-container');
//Botão de alterar o tema.
const buttonTheme = document.getElementById('button-theme');
//Elemento loading.
const loading = document.getElementById('loading');
//Contagem de produtos no carrinho.
const countBadge = document.getElementById('count-badge');
//Total dos itens do carrinho do span.
const totalSpan = document.getElementById('total');
//Total dos itens do carrinho.
let total = 0;


//Oculta botão de abrir o carrinho.
document.getElementById('button-cart-container').style.visibility = 'hidden';

//Produtos no carrinho.
let cartProductsList = [];

//Gera produtos do carrinho.
function rendercartProductsList() {
    //Reseta valores
    modalBody.innerHTML = '';
    //Gera elementos para cada produto adiciona no carrinho.
    cartProductsList.forEach((product) => {
        const { title, image, price } = product;

        //Container dos produtoss.
        const productDiv = document.createElement('div');

        //Define classe de estilo.
        productDiv.className = 'products-cart';


        //Cria elementos.
        const productTitle = document.createElement('p');
        const productImage = document.createElement('img');
        const productPrice = document.createElement('p');

        //Define conteúdo dos elementos
        productTitle.innerText = title;
        productImage.src = image;
        productPrice.innerText = price.toFixed(2) + '$';

        //Insere elementos.
        productDiv.append(productImage, productTitle, productPrice);
        modalBody.appendChild(productDiv);
    });
}

//Fecha modal do carrinho.
function closeModal() {
    cartModal.style.visibility = 'hidden';
    //Ativa barra de rolagem.
    document.body.style.overflowY = 'visible';
}

//Abre modal do carrinho.
function openModal() {
    //Reseta ação de ao clicar no modal.
    cartModal.addEventListener('click', null);
    cartModal.style.visibility = 'visible';
    //Desativa barra de rolagem.
    document.body.style.overflowY = 'hidden';
    rendercartProductsList();
}

//Atualiza o campo de preço;
function setTotal(price) {
    totalSpan.innerText = 'Total: ' + parseFloat(price).toFixed(2) + '$';
}

//Remove produtos
function removeProducts() {
    const result = confirm('Deseja remover os produtos do carrinho?');
    //Se verdadeiro remove produtos.
    if (result) {
        cartProductsList = [];

        //Oculta botão de adicionar produtos no carrinho;
        document.getElementById('button-cart-container').style.visibility = 'hidden';
        snackBarMessage('Produtos Removidos');
        closeModal()
        //Zera total.
        total = 0;
    } else { }
}

//Requisição api
async function request() {
    try {
        //Realiza requisição.
        const result = await fetch('https://fakestoreapi.com/products');
        const products = await result.json();
        //Chama função de renderizar os produtos.
        renderProducts(products);
    } catch (err) {
        console.log(err);
        snackBarMessage('Ocorreu um erro ao obter os dados.', 'error');
    } finally {
        loading.hidden = true;
    }
}

//Carrega tema.
function loadingTheme() {
    //Obtém tema armazenado.
    const storageTheme = localStorage.getItem('theme');
    //Se theme for nulo define tema escuro, se não define tema armazenado.
    if (storageTheme === null) {
        document.body.className = 'dark';
        buttonTheme.innerHTML = '<i class="fa-solid fa-sun"></i>';
        //Armazena tema escuro.
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.className = storageTheme;
        storageTheme === 'dark' ? buttonTheme.innerHTML = '<i class="fa-solid fa-sun"></i>' : buttonTheme.innerHTML = '<i class="fa-solid fa-moon"></i>'
    }
}

//Muda tema.
function changeTheme() {
    //Obtém tema armazenado,
    const storageTheme = localStorage.getItem('theme');
    //Se for tema escuro define como claro, se não define como escuro.
    if (storageTheme === 'dark') {
        localStorage.setItem('theme', 'light');
        buttonTheme.innerHTML = '<i class="fa-solid fa-moon"></i>';
        document.body.className = 'light';
    } else {
        localStorage.setItem('theme', 'dark');
        buttonTheme.innerHTML = '<i class="fa-solid fa-sun"></i>'
        document.body.className = 'dark';
    }
}


//Adicona o produto ao carrinho
function addProductToCart(product) {
    const { title, image, price, id } = product;

    //Mostra botão de adicionar produtos no carrinho;
    document.getElementById('button-cart-container').style.visibility = 'visible';

    //Verifica se o produto já foi adiconado no carrinho.
    if (cartProductsList.find((e) => e.id === product.id)) {
        snackBarMessage('Produto já adicionado ao carrinho.', 'error')
        return;
    }

    //Adiciona produto no carrinho.
    cartProductsList.push({ id: id, title: title, image: image, price: price });
    snackBarMessage('Produto Adicionado ao carrinho.')
    //Adicona contagem de produtos no carrinho.
    countBadge.innerText = cartProductsList.length;
    //Calcula total dos intens ao inserir.
    total += price;
    setTotal(total);
}

//Renderiza produtos.
function renderProducts(products) {
    //Gera card de produtos para cada objeto da api.
    products.forEach((product) => {
        const card = document.createElement('div');
        card.className = 'card';
        //Cria elemento h3 com o título do produto.
        const title = document.createElement('h3');
        title.innerText = product.title;
        //Cria elemento h5 com o preço do produto.
        const price = document.createElement('h5');
        price.innerText = product.price.toFixed(2) + '$';
        //Cria elemento p com a descrição do produto.
        const description = document.createElement('p');
        description.innerText = product.description;
        //Imagem do produto.
        const image = document.createElement('img');
        image.src = product.image;
        //Exibe avaliação do produto.
        const productRating = document.createElement('div');
        //Botão para adiconar o produto no carrinho.
        const addToCartButton = document.createElement('button');
        addToCartButton.className = 'add-to-cart-button';
        addToCartButton.innerHTML = 'Adiconar ao carrinho <i class="fa-solid fa-cart-plus"></i>';
        //Chama função para adiconar produtos no carrinho.
        addToCartButton.addEventListener('click', () => addProductToCart(product));
        //Insere elementos no body.
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        //Armazena avaliações dos produtos.
        const rating = parseInt(product.rating.rate);

        //Gera números de estrelas de acordo com avaliação.
        switch (rating) {
            case 1:
                productRating.innerHTML = '<i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';
                break;
            case 2:
                productRating.innerHTML = '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';
                break;
            case 3:
                productRating.innerHTML = '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';
                break;
            case 4:
                productRating.innerHTML = '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i>';
                break;
            case 5:
                productRating.innerHTML = '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>';
                break;
        }
        //Insere elementos no body.
        cardBody.append(title, image, description, price, productRating, addToCartButton);
        //Insere body no card.
        card.appendChild(cardBody);
        //Insere card no container.
        cardProductsContainer.appendChild(card);
    });
}

//Mensagem da Snack Bar
function snackBarMessage(message, status) {
    const snackBar = document.createElement('div');
    snackBar.className = 'snack-bar';
    if (status === 'error') {
        snackBar.innerHTML = `<p><i class="fa-solid fa-circle-xmark" style="color: rgb(230, 99, 133);"></i>${message}</p>`;
    } else {
        snackBar.innerHTML = `<p><i class="fa-solid fa-circle-check" style="color: rgb(99, 230, 190);"></i>
      ${message}</p>`;
    }

    snackBarContainer.appendChild(snackBar);

    setTimeout(() => {
        snackBar.remove();
    }, 2000);
}

//Finaliza a compra
function finishCart() {
    const result = confirm('Deseja finalizar a compra?');
    //Exibe mensagem,fecha modal e zera lista.
    if (result) {
        snackBarMessage('Compra finaliza!');
        closeModal();
        //Oculta botão de abrir o carrinho.
        document.getElementById('button-cart-container').style.visibility = 'hidden';
        cartProductsList = [];
        //Zera total.
        total = 0;
    } else { }
}

//Busca produto pela barra de navegação
function searchProduct(text) {
    const products = document.querySelectorAll('.card');
    //Busca produtos.
    products.forEach((e) => {
        if (e.textContent.toLocaleLowerCase().includes(text.toLocaleLowerCase())) {
            e.style.display = 'block';
        } else {
            e.style.display = 'none';
        }
    });
}

//Chama funções.
loadingTheme();
request();