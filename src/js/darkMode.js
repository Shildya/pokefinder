var limit = 151;

var moon = document.querySelector('.moon');
var sun = document.querySelector('.sun');

const header = document.querySelector('header');
const body = document.querySelector('body');
const footer = document.querySelector('footer');

const logoDark = document.querySelector('.logo-dark');
const logoLight = document.querySelector('.logo-light');

const searchBar = document.querySelector('.search-bar');
const noResult = document.querySelector('.no-result');

const currentPokemon = document.querySelector('.current-pokemon');
const currentPokemonEvolution = document.querySelector('.current-pokemon-evolutions');
const currentPokemonEntries = document.querySelector('.current-pokemon-entries');

if (localStorage.getItem('mode') === 'night') {
    darkMode();
};

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

    if (searchBar !== null && noResult !== null) {

        searchBar.classList.toggle('dark-mode');
        noResult.classList.toggle('dark-mode');
    };

    if (currentPokemon !== null && currentPokemonEvolution !== null && currentPokemonEntries !== null) {
        currentPokemon.classList.toggle('dark-mode');
        currentPokemonEvolution.classList.toggle('dark-mode');
        currentPokemonEntries.classList.toggle('dark-mode');
    };
};

moon.addEventListener('click', () => {
    darkMode();
    localStorage.setItem('mode', 'night');
});

sun.addEventListener('click', () => {
    darkMode();
    localStorage.setItem('mode', 'day');
});

if (searchBar !== null) {
    
    searchBar.addEventListener('input', () => {
        document.querySelectorAll('.pokemon').forEach(pokemon => {
            var pokemonName = pokemon.querySelector('.pokemon-name').textContent;
            if (!pokemonName.startsWith(searchBar.value.toLowerCase())) {
                pokemon.classList.add('hidden');
            }
            else {
                pokemon.classList.remove('hidden');
            };
        });
        if (document.querySelectorAll('.pokemon.hidden').length === limit) {
            document.querySelector('.no-result').classList.remove('hidden');
        }
        else {
            document.querySelector('.no-result').classList.add('hidden');
        };
    });
};
