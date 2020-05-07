const baseURL = 'https://pokeapi.co/api/v2/';

if (localStorage.getItem('pokemonId') !== null) {
    var pokemonId = localStorage.getItem('pokemonId');
    getInfos();
    getPokedex();
}
else {
    window.location.href = "index.html";
}

function getInfos() {
    document.querySelector('p').textContent = '#' + pokemonId;
    var url = ''.concat(baseURL, 'pokemon/', pokemonId);
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        document.title = (((data.name).charAt(0).toUpperCase() + (data.name).slice(1)) + " | PokéFinder");

        var pokemonSprite = document.querySelector('.current-pokemon-artwork');
        pokemonSprite.src = `https://pokeres.bastionbot.org/images/pokemon/${data.id}.png`;

        var currentPokemonName = document.querySelector('.current-pokemon-name');
        currentPokemonName.textContent = data.name;

        data.types.forEach(types => {

            var pokemonType = document.createElement('p');
            pokemonType.setAttribute('class', `pokemon-type ${types.type.name} current-pokemon-type`);
            pokemonType.textContent = types.type.name;

            var currentPokemonTypes = document.querySelector('.current-pokemon-types');
            currentPokemonTypes.appendChild(pokemonType);
        });
    });
};

function getPokedex() {
    var currentPokemonPokedex = document.querySelector('.current-pokemon-pokedex');
    url = ''.concat(baseURL, 'pokemon-species/', pokemonId);
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        var pokemonDescriptionFragment = document.createDocumentFragment();
        data.flavor_text_entries.forEach(pokedex => {
            if (pokedex.language.name == 'en' && pokedex.version.name == 'x') {pokedexX = pokedex.flavor_text;}
            else if (pokedex.language.name == 'en' && pokedex.version.name == 'y') {pokedexY = pokedex.flavor_text;}
            else if (pokedex.language.name == 'en' && pokedex.version.name == 'alpha-sapphire') {pokedexAS = pokedex.flavor_text;}
            else if (pokedex.language.name == 'en' && pokedex.version.name == 'omega-ruby') {pokedexOR = pokedex.flavor_text;};
        });
        if (pokedexAS == pokedexOR) {
            var pokedexVersion = document.createElement('p');
            pokedexVersion.setAttribute('class', 'version');
            pokedexVersion.textContent = 'Pokémon Alpha Sapphire & Omega Ruby';
            pokemonDescriptionFragment.appendChild(pokedexVersion);

            var pokedexDescription = document.createElement('p');
            pokedexDescription.setAttribute('class', 'description');
            pokedexDescription.textContent = pokedexAS;
            pokemonDescriptionFragment.appendChild(pokedexDescription);
        }
        else {
            var pokedexVersion = document.createElement('p');
            pokedexVersion.setAttribute('class', 'version');
            pokedexVersion.textContent = 'Pokémon Alpha Sapphire';
            pokemonDescriptionFragment.appendChild(pokedexVersion);

            var pokedexDescription = document.createElement('p');
            pokedexDescription.setAttribute('class', 'description');
            pokedexDescription.textContent = pokedexAS;
            pokemonDescriptionFragment.appendChild(pokedexDescription);

            var pokedexVersion = document.createElement('p');
            pokedexVersion.setAttribute('class', 'version');
            pokedexVersion.textContent = 'Pokémon Omega Ruby';
            pokemonDescriptionFragment.appendChild(pokedexVersion);

            var pokedexDescription = document.createElement('p');
            pokedexDescription.setAttribute('class', 'description');
            pokedexDescription.textContent = pokedexOR;
            pokemonDescriptionFragment.appendChild(pokedexDescription);
        };
        currentPokemonPokedex.appendChild(pokemonDescriptionFragment);
    });
};

function getEvolutions() {

};