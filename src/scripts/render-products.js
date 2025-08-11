//Obtem o snack bar
const snackBar = document.querySelector('.snack-bar');
//Valores da lista select
const categorySelect = document.querySelector('#category-select');
//Desativa o snack bar
const modal = document.querySelector('.modal');
//Fecha o modal
const closeModalButton = document.querySelector('#close-modal-button');
//Abre o modal
const openModalButton = document.querySelector('#open-modal-button');
//Pesquisa produto
const searchProductButton = document.querySelector('#search-button');

//Requisição api
async function request(category) {
    try {
        const result = await fetch('https://fakestoreapi.in/api/products?limit=150');
        const products = await result.json();
        render(products.products, category);
    } catch (e) {
        snackBarMessage('An error occurred while accessing the data.');
    }
}

//Mensagem da Snack Bar
function snackBarMessage(message) {
    snackBar.hidden = false;
    snackBar.innerHTML = `<p>${message}</p>`;
    setTimeout(() => {
        snackBar.hidden = true;
    }, 4000);
}

//Adiciona um produto no carrinho
function cart(product) {

    snackBarMessage('Product add to cart!');

    const { title, price, image } = product;

    const modalContainer = document.querySelector('.modal-container');
    const cartCard = document.createElement('div');

    cartCard.className = 'cart-card';

    //Cria elementos HTML
    const htmlTitle = document.createElement('h1');
    const htmlPrice = document.createElement('p');
    const htmlImage = document.createElement('img');
    const trashButton = document.createElement('button');
    const trashDiv = document.createElement('div');
    const total = document.querySelector('#price');

    //Adiciona os valores aos elementos
    trashButton.innerHTML = "<img src='/src/icons/trash-icon.svg'/>";
    trashButton.classList = 'trash-button';
    htmlTitle.innerHTML = title;
    htmlPrice.innerHTML = `$${price}`;
    htmlImage.src = image;
    trashDiv.appendChild(trashButton);
    trashDiv.classList = 'trash-container';
    //Desativa a opção de arrastar imagem
    htmlImage.draggable = false;
    //Imagem não disponivel caso ocorra um erro
    htmlImage.onerror = () => {
        htmlImage.src = '/src/icons/image-not-found.svg';
    }

    try {
        let value;
        //Armazena o valor dos produtos em cache
        if (localStorage.getItem('value') !== null) {
            value = parseInt(localStorage.getItem('value')) + price;
            localStorage.setItem('value', value);
        } else {
            value = localStorage.setItem('value', price);
        }

    } catch (e) {
        snackBarMessage('An error occurred while calculating the products.');
    }

    total.innerHTML = '$' + localStorage.getItem('value');
    //Remove produto do carrinho
    trashButton.addEventListener('click', () => {
        cartCard.remove();
        localStorage.setItem('value', parseInt(localStorage.getItem('value')) - price);
        total.innerHTML = '$' + localStorage.getItem('value');
        if (localStorage.getItem('value') <= 0) {
            //Fecha o modal se o mesmo não tiver produtos
            closeModal();
        }
    });
    cartCard.append(trashDiv, htmlImage, htmlTitle, htmlPrice);
    modalContainer.appendChild(cartCard);
}

//Busca produtos
function searchProduct() {
    const searchInput = document.querySelector('#search-input');
    if (!searchInput.value) {
        snackBarMessage('The research field cannot be null.');
    } else {
        request(searchInput.value);
        searchInput.value = null;
    }
}

//Fecha o modal
function closeModal() {
    modal.hidden = true;
    openModalButton.hidden = false;
    document.body.style.overflowY = 'visible';
}

//Abre o modal
function openModal() {
    if (localStorage.getItem('value') === null || localStorage.getItem('value') <= 0) {
        snackBarMessage('The cart is empty!');
    } else {
        modal.hidden = false;
        openModalButton.hidden = true;
        //Desativa a barra de rolagem do body.
        document.body.style.overflowY = 'hidden';
    }
}

//Renderiza os produtos na tela
function render(products, value) {
    //Obtem o card container
    const container = document.querySelector('.card-container');
    container.innerHTML = '';
    //Verifica se existe produtos na categoria que seja igual ao value
    const listNull = products.filter((product) => product.category === value);
    //Obtem a lista com o resultado
    let result;
    //Retorna todos os produtos
    if (value === 'all') {
        result = products;
        //Retorna todos os produtos da categoria com o valor do select
    } else if (listNull.length !== 0) {
        result = products.filter((product) => product.category === value);
        //Retorna produtos caso exista produtos igual ao valor pesquisado
    } else {
        result = products.filter((product) => product.title.toLowerCase().includes(value.toLowerCase()));
        if (result.length === 0) {
            snackBarMessage('Sorry, product not found.');
            request('all');
        }
    }

    //Cria um card para cada produto  
    result.map((product) => {
        const { title, price, description, image } = product;
        const card = document.createElement('div');
        card.classList = 'card';

        //Cria os elementos HTML
        const htmlTitle = document.createElement('h1');
        const htmlDescription = document.createElement('h3');
        const htmlPrice = document.createElement('p');
        const htmlImage = document.createElement('img');
        const button = document.createElement('button');
        const hiddenDescription = document.createElement('div');


        //Adiciona os valores aos elementos
        htmlTitle.innerHTML = title;
        htmlDescription.innerHTML = description;
        htmlDescription.hidden = true;
        htmlPrice.innerHTML = `$${price}`;
        htmlImage.src = image;
        htmlImage.alt = title;
        //Desativa a opção de arrastar imagem
        htmlImage.draggable = false;
        //Imagem não disponivel caso ocorra um erro
        htmlImage.onerror = () => {
            htmlImage.src = '/src/icons/image-not-found.svg';
        };
        button.innerHTML = '<b>Add to cart</b>';
        hiddenDescription.innerHTML = "<img src='/src/icons/caret-up.svg'/>";
        hiddenDescription.classList = 'description-button';
        hiddenDescription.addEventListener('click', () => {
            const hidden = htmlDescription.hidden;
            if (hidden) {
                htmlDescription.hidden = false;
                hiddenDescription.style.transform = 'rotate(180deg)';
            } else if (!hidden) {
                htmlDescription.hidden = true;
                hiddenDescription.style.transform = 'rotate(360deg)';
            }
        });
        button.addEventListener('click', () => cart(product));

        card.append(htmlTitle, htmlImage, htmlPrice, hiddenDescription, htmlDescription, button);
        container.appendChild(card);
    }
    );
}

closeModalButton.addEventListener('click', closeModal);
openModalButton.addEventListener('click', openModal);
searchProductButton.addEventListener('click', searchProduct);
//Troca os itens de acordo com a categoria
categorySelect.addEventListener('change', () => request(categorySelect.value));