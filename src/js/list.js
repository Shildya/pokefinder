const baseURL = 'https://pokeapi.co/api/v2/';
var limit = 721;

const pokemonList = document.createDocumentFragment();

for (i = 1; i < limit + 1; i++) {
     
    pokemon = document.createElement('div');
    pokemon.setAttribute('class', 'pokemon');
    pokemon.setAttribute('id', i);

    var pokemonId = document.createElement('p');
    pokemonId.setAttribute('class', 'pokemon-id');
    pokemonId.textContent = i;
    pokemon.appendChild(pokemonId);

    var pokemonSprite = document.createElement('img');
    pokemon.appendChild(pokemonSprite);

    var pokemonName = document.createElement('a');
    pokemonName.href = 'infos.html';
    pokemonName.setAttribute('class', 'pokemon-name');
    pokemon.appendChild(pokemonName);

    var pokemonTypes = document.createElement('p');
    pokemonTypes.setAttribute('class', 'pokemon-types');
    pokemon.appendChild(pokemonTypes);

    pokemonList.appendChild(pokemon);
};

document.querySelector('main').appendChild(pokemonList);

for (i = 1; i < limit + 1; i++) {

    const url = ''.concat(baseURL, 'pokemon/', i);
    fetch(url)
    .then(result => result.json())
    .then((data) => {

        var pokemonSprite = document.getElementById(`${data.id}`).getElementsByTagName('img')[0];
        pokemonSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;

        var pokemonName = document.getElementById(`${data.id}`).getElementsByClassName('pokemon-name')[0];
        var name = document.createTextNode(`${prettyName(data.name)}`);
        pokemonName.appendChild(name);
        pokemonName.addEventListener('click', () => {
            localStorage.setItem('pokemonId', data.id);
        });

        data.types.forEach(types => {

            var pokemonType = document.createElement('p');
            pokemonType.setAttribute('class', `pokemon-type ${types.type.name}`);
            pokemonType.textContent = types.type.name;

            var pokemonTypes = document.getElementById(`${data.id}`).getElementsByClassName('pokemon-types')[0];
            pokemonTypes.appendChild(pokemonType);
        });
    });
};

function createElement(options) {
    const element = document.createElement(options.type);
    if (element.class) {
        element.setAttribute('class', options.class);
    }
    if (element.text) {
        element.textContent = options.text;
    }
    if (element.href) {
        element.href = options.href;
    }
    options.parent.appendChild(element);   
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