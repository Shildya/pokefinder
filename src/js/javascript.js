const baseURL = 'https://pokeapi.co/api/v2/';
const limit = 151;

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
    pokemonName.href = 'infos.html';
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
        var name = document.createTextNode(`${data.name}`);
        pokemonName.appendChild(name);
        pokemonName.href = "infos.html";

        data.types.forEach(types => {

            var pokemonType = document.createElement('p');
            pokemonType.setAttribute('class', `pokemon-type ${types.type.name}`);
            pokemonType.textContent = types.type.name;

            var pokemonTypes = document.getElementById(`${data.id}`).getElementsByClassName('pokemon-types')[0];
            pokemonTypes.appendChild(pokemonType);
        });
    });
};