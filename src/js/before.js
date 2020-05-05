baseURL = 'https://pokeapi.co/api/v2/';

for (i = 1; i < 722; i++) {

    url = ''.concat(baseURL, 'pokemon/', i);
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        
        var pokemon = document.createElement('div');
        pokemon.setAttribute('class', 'pokemon');

        var pokemonId = document.createElement('p');
        pokemonId.setAttribute('class', 'pokemon-id');
        pokemonId.textContent = data.id;
        pokemon.appendChild(pokemonId);

        var pokemonSprite = document.createElement('img');
        pokemonSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
        pokemon.appendChild(pokemonSprite);

        var pokemonName = document.createElement('a');
        pokemonName.setAttribute('class', 'pokemon-name');
        pokemonName.textContent = data.name;
        pokemon.appendChild(pokemonName);

        var pokemonTypes = document.createElement('p');
        pokemonTypes.setAttribute('class', 'pokemon-types');
        pokemon.appendChild(pokemonTypes);

        data.types.forEach(types => {
            var pokemonType = document.createElement('p');
            pokemonType.setAttribute('class', `pokemon-type ${types.type.name}`);
            pokemonType.textContent = types.type.name;
            pokemonTypes.appendChild(pokemonType);
        });

        document.body.appendChild(pokemon);
    });

};