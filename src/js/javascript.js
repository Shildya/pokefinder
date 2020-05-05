const baseURL = 'https://pokeapi.co/api/v2/';
const limit = 151;
var allPokemons = [];

for (i = 1; i < limit + 1; i++) {
     
    var pokemon = document.createElement('div');
    pokemon.setAttribute('class', 'pokemon');
    pokemon.setAttribute('id', i);

    var pokemonId = document.createElement('p');
    pokemonId.setAttribute('class', 'pokemon-id');
    pokemonId.textContent = i;
    pokemon.appendChild(pokemonId);

    var pokemonSprite = document.createElement('img');
    pokemon.appendChild(pokemonSprite);

    var pokemonName = document.createElement('a');
    pokemonName.setAttribute('class', 'pokemon-name');
    pokemon.appendChild(pokemonName);

    var pokemonTypes = document.createElement('p');
    pokemonTypes.setAttribute('class', 'pokemon-types');
    pokemon.appendChild(pokemonTypes);

    document.querySelector('main').appendChild(pokemon);

};

for (i = 1; i < limit + 1; i++) {

    const url = ''.concat(baseURL, 'pokemon/', i);
    fetch(url)
    .then(result => result.json())
    .then((data) => {

        var pokemonSprite = document.getElementById(`${data.id}`).getElementsByTagName('img')[0];
        pokemonSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;

        var pokemonName = document.getElementById(`${data.id}`).getElementsByClassName('pokemon-name')[0];
        pokemonName.textContent = data.name;

        data.types.forEach(types => {

            var pokemonType = document.createElement('p');
            pokemonType.setAttribute('class', `pokemon-type ${types.type.name}`);
            pokemonType.textContent = types.type.name;

            var pokemonTypes = document.getElementById(`${data.id}`).getElementsByClassName('pokemon-types')[0];
            pokemonTypes.appendChild(pokemonType);
        });

        allPokemons.push(`${data.name}`);
    });
};

var moon = document.querySelector('.moon');
var sun = document.querySelector('.sun');
const body = document.querySelector('body');
const logoDark = document.querySelector('.logo-dark');
const logoLight = document.querySelector('.logo-light');
const header = document.querySelector('header');
const searchBar = document.querySelector('.search-bar')

function darkMode() {

    var pokemons = document.querySelectorAll('.pokemon');
    pokemons.forEach(pokemon => {
        pokemon.classList.toggle('dark-mode')
    });

    var pokemonIds = document.querySelectorAll('.pokemon-id');
    pokemonIds.forEach(pokemonId => {
        pokemonId.classList.toggle('dark-mode');
    });

    var pokemonNames = document.querySelectorAll('.pokemon-name');
    pokemonNames.forEach(pokemonName => {
        pokemonName.classList.toggle('dark-mode');
    });

    header.classList.toggle('dark-mode');
    body.classList.toggle('dark-mode');

    logoLight.classList.toggle('hidden');
    logoDark.classList.toggle('hidden');

    moon.classList.toggle('hidden');
    sun.classList.toggle('hidden');

    searchBar.classList.toggle('dark-mode');
};

moon.addEventListener('click', darkMode);
sun.addEventListener('click', darkMode);


searchBar.addEventListener('input', () => {
    document.querySelectorAll('.pokemon').forEach(pokemon => {
        var pokemonName = pokemon.querySelector('.pokemon-name').textContent
        if (!pokemonName.startsWith(searchBar.value.toLowerCase())) {
            pokemon.style.display = 'none';
        }
        else {
            pokemon.style.display = 'grid';
        }
    });
});