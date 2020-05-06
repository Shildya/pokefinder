var moon = document.querySelector('.moon');
var sun = document.querySelector('.sun');

const header = document.querySelector('header');
const body = document.querySelector('body');
const footer = document.querySelector('footer');

const logoDark = document.querySelector('.logo-dark');
const logoLight = document.querySelector('.logo-light');

const searchBar = document.querySelector('.search-bar');
const noResult = document.querySelector('.no-result');

const favicon = document.querySelector('link[rel="icon"]');

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
    footer.classList.toggle('dark-mode')

    logoLight.classList.toggle('hidden');
    logoDark.classList.toggle('hidden');

    moon.classList.toggle('hidden');
    sun.classList.toggle('hidden');

    searchBar.classList.toggle('dark-mode');
    noResult.classList.toggle('dark-mode');
};

moon.addEventListener('click', darkMode);
sun.addEventListener('click', darkMode);

searchBar.addEventListener('input', () => {
    document.querySelectorAll('.pokemon').forEach(pokemon => {
        var pokemonName = pokemon.querySelector('.pokemon-name').textContent;
        if (!pokemonName.startsWith(searchBar.value.toLowerCase())) {
            pokemon.classList.add('hidden');
        }
        else {
            pokemon.classList.remove('hidden');
        }
    });
    if (document.querySelectorAll('.pokemon.hidden').length === limit) {
        document.querySelector('.no-result').classList.remove('hidden');
    }
    else {
        document.querySelector('.no-result').classList.add('hidden');
    }
});