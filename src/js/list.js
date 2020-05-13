const baseURL = 'https://pokeapi.co/api/v2/';
var limit = 721;

const url = ''.concat(baseURL, 'pokemon?limit=', limit);
fetch(url)
.then(result => result.json())
.then((data) => {
    createTable(data);
    addLinks();
    observeImages();
});

function createTable(data) {

    const pokemonList = document.createDocumentFragment();

    data.results.forEach(result => {

        pokemonId = getIdFromUrl(result.url);

        var pokemon = createElement({
            type: 'div',
            class: 'pokemon',
            id: pokemonId,
            parent: pokemonList,
        });

        createElement({
            type: 'p',
            class: 'pokemon-id',
            text: pokemonId,
            parent: pokemon,
        });

        createElement({
            type: 'img',
            class: 'pokemon-sprite',
            data_src: true,
            parent: pokemon,
        });

        createElement({
            type: 'a',
            class: 'pokemon-name',
            href: 'infos.html',
            text: prettyName(result.name),
            parent: pokemon,
        });
    
        createElement({
            type: 'p',
            class: 'pokemon-types',
            parent: pokemon,
        });
    });

    document.querySelector('main').appendChild(pokemonList);
}

function getIdFromUrl(url) {
    url = url.replace(new RegExp('https://pokeapi.co/api/v2/pokemon/'), '').replace('/', '');
    return url;
}

function createElement(options) {
    const element = document.createElement(options.type);
    if (options.class) {
        element.setAttribute('class', options.class);
    }
    if (options.text) {
        element.textContent = options.text;
    }
    if (options.href) {
        element.href = options.href;
    }
    if (options.id) {
        element.id = options.id;
    }
    if (options.data_src) {
        spriteURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        element.setAttribute('data-src', spriteURL);
    } 
    if (options.parent) {
        options.parent.appendChild(element);
    }
    if (options.src) {
        element.src = options.src;
    }
    return element;
}

function prettyName(name) {
    return name
        .replace(new RegExp('-altered'), '')
        .replace(new RegExp('-shield'), '')
        .replace(new RegExp('-male'), '')
        .replace(new RegExp('-average'), '')
        .replace(new RegExp('mr-mime'), 'Mr. Mime')
        .replace(new RegExp('mime-jr'), 'Mime Jr')
        .replace(new RegExp('nidoran-f'), 'Nidoran ♀')
        .replace(new RegExp('nidoran-m'), 'Nidoran ♂')
        .replace(new RegExp('-normal'), '')
        .replace(new RegExp('-plant'), '')
        .replace(new RegExp('-land'), '')
        .replace(new RegExp('-red-striped'), '')
        .replace(new RegExp('-standard'), '')
        .replace(new RegExp('-incarnate'), '')
        .replace(new RegExp('-ordinary'), '')
        .replace(new RegExp('-aria'), '');
}

function addLinks() {
    pokemonNames = document.querySelectorAll('.pokemon-name');
    pokemonNames.forEach(pokemonName => {
        pokemonName.addEventListener('click', () => {
            localStorage.setItem('pokemonId', pokemonName.textContent);
        });
    })
}

function showTypes(pokemon) {

    pokemonId = pokemon.parentNode.id;

    const url = ''.concat(baseURL, 'pokemon/', pokemonId);
    fetch(url)
    .then(result => result.json())
    .then((data) => {

        data.types.forEach(types => {

            var pokemonType = document.createElement('p');
            pokemonType.setAttribute('class', `pokemon-type ${types.type.name}`);
            pokemonType.textContent = types.type.name;

            var pokemonTypes = document.getElementById(`${data.id}`).getElementsByClassName('pokemon-types')[0];
            pokemonTypes.appendChild(pokemonType);
        });
    });
}

function loadImage(img) {
    const src = img.getAttribute('data-src');
    if (src) {
        img.src = src;
    }
    else {
        return;
    }
}

function observeImages() {

    const images = document.querySelectorAll('[data-src]');

    images.forEach(image => {
        imgObserver.observe(image);
    });
}

const imgOptions = {
    threshold: 0,
    rootMargin: '0px 0px 1200px 0px'
};

const imgObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadImage(entry.target);
            showTypes(entry.target);
            imgObserver.unobserve(entry.target);
        }
        else {
            return;
        }
    });
}, imgOptions);