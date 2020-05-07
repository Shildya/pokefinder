const baseURL = 'https://pokeapi.co/api/v2/';

if (localStorage.getItem('pokemonId') !== null) {
    var pokemonId = localStorage.getItem('pokemonId');
    getInfos();
    getPokedex();
    getEvolutions();
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
            if (pokedex.language.name == 'en' && pokedex.version.name == 'alpha-sapphire') {pokedexAS = pokedex.flavor_text.replace(/\n/g, ' ');}
            else if (pokedex.language.name == 'en' && pokedex.version.name == 'omega-ruby') {pokedexOR = pokedex.flavor_text.replace(/\n/g, ' ');};
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
            console.log(pokedexAS);
            console.log(pokedexOR);
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
    var evolutionTree = document.querySelector('.evolution-tree');
    var firstEvolution = document.querySelector('.first-evolution');
    var secondEvolution = document.querySelector('.second-evolution');
    var thirdEvolution = document.querySelector('.third-evolution');
    
    url = ''.concat(baseURL, 'pokemon-species/', pokemonId);
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        url = data.evolution_chain.url;
        fetch(url)
        .then(result => result.json())
        .then((data) => {
            if (Object.keys(data.chain.evolves_to).length === 0) {
                evolutionTree.textContent = 'This Pokémon has and is the result of no evolution.';
            }
            else {
                data.chain.evolves_to.forEach(evolveResult => {
                    var firstEvolutionFragment = document.createDocumentFragment();
                    var secondEvolutionFragment = document.createDocumentFragment();
                    var thirdEvolutionFragment = document.createDocumentFragment();

                    var basePokemon = document.createElement('p');
                    basePokemon.textContent = 'Base Pokémon';
                    firstEvolutionFragment.appendChild(basePokemon);

                    var evolutionArtwork = document.createElement('img');
                    evolutionArtwork.setAttribute('class', 'evolution-artwork');

                    var artworkId = data.chain.species.url.replace(new RegExp('https://pokeapi.co/api/v2/pokemon-species/'), '',).replace('/', '');
                    evolutionArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${artworkId}.png`;
                    firstEvolutionFragment.appendChild(evolutionArtwork);

                    var evolutionName = document.createElement('p');
                    evolutionName.setAttribute('class', 'evolution-name');
                    evolutionName.textContent = data.chain.species.name;
                    firstEvolutionFragment.appendChild(evolutionName);

                    if (evolveResult.evolution_details[0].trigger.name == 'trade') {
                        if (evolveResult.evolution_details[0].held_item == null) {
                            evolutionTree.textContent += 'Trade ▼';
                        }
                        else {
                            evolutionTree.textContent += 'Trade holding ' + evolveResult.evolution_details[0].held_item.name.replace('-', ' ') + ' ▼';
                        };
                    }
                    else if (evolveResult.evolution_details[0].trigger.name == 'use-item') {
                        evolutionTree.textContent += evolveResult.evolution_details[0].item.name.replace('-', ' ') + ' ▼';
                    }
                    else if (evolveResult.evolution_details[0].trigger.name == 'level-up') {
                        if (evolveResult.evolution_details[0].min_level !== null) {

                            var evolveMethod = document.createElement('p');
                            evolveMethod.setAttribute('class', 'evolve-method');
                            evolveMethod.textContent = 'Level ' + evolveResult.evolution_details[0].min_level;
                            secondEvolutionFragment.appendChild(evolveMethod);
                            firstEvolution.appendChild(firstEvolutionFragment);
                        }
                        if (evolveResult.evolution_details[0].min_happiness !== null) {
                            if (evolveResult.evolution_details[0].time_of_day !== null && evolveResult.evolution_details[0].time_of_day !== '') {
                                evolutionTree.textContent += 'Level up with Friendship (' + evolveResult.evolution_details[0].time_of_day + ') ▼';
                            }
                            else {
                                evolutionTree.textContent += 'Level up with Friendship ▼';
                            }
                        }
                        else if (evolveResult.evolution_details[0].min_affection !== null) {
                            if (evolveResult.evolution_details[0].known_move_type.name !== null) {
                                evolutionTree.textContent += 'Level up with level ' + evolveResult.evolution_details[0].min_affection + ' affection and a ' + evolveResult.evolution_details[0].known_move_type.name + '-type move ▼';
                            }
                            else {
                                evolutionTree.textContent += 'Level up with level ' + evolveResult.evolution_details[0].min_affection + ' affection ▼';
                            }
                        }
                        else if (evolveResult.evolution_details[0].location !== null && evolveResult.evolution_details[0].location !== '') {
                            if (evolveResult.evolution_details[0].location.name == 'sinnoh-route-217') {
                                evolutionTree.textContent += 'Level up near Ice Rock ▼';
                            }
                            else if (evolveResult.evolution_details[0].location.name == 'eterna-forest') {
                                evolutionTree.textContent += 'Level up near Moss Rock ▼';
                            }
                        }
                    }
                    var evolutionArtwork = document.createElement('img');
                    evolutionArtwork.setAttribute('class', 'evolution-artwork');
                    var artworkId = data.chain.evolves_to[0].species.url.replace(new RegExp('https://pokeapi.co/api/v2/pokemon-species/'), '',).replace('/', '');
                    evolutionArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${artworkId}.png`;
                    secondEvolutionFragment.appendChild(evolutionArtwork);
                    var evolutionName = document.createElement('p');
                    evolutionName.setAttribute('class', 'evolution-name');
                    evolutionName.textContent = data.chain.evolves_to[0].species.name;
                    secondEvolutionFragment.appendChild(evolutionName);
                    secondEvolution.appendChild(secondEvolutionFragment);
                    
                    if (Object.keys(evolveResult.evolves_to).length !== 0) {
                        
                        if (evolveResult.evolves_to[0].evolution_details[0].min_level !== null) {
                            var evolveMethod = document.createElement('p');
                            evolveMethod.setAttribute('class', 'evolve-method');
                            evolveMethod.textContent = 'Level ' + evolveResult.evolves_to[0].evolution_details[0].min_level;
                            thirdEvolutionFragment.appendChild(evolveMethod);
                            thirdEvolution.appendChild(thirdEvolutionFragment);
                        }
                        else if (evolveResult.evolves_to[0].evolution_details[0].trigger.name == 'trade') {
                            if (evolveResult.evolves_to[0].evolution_details[0].held_item == null) {
                                evolutionTree.textContent += 'Trade ▼';
                            }
                            else {
                                evolutionTree.textContent += 'Trade holding ' + evolveResult.evolution_details[0].held_item.name.replace('-', ' ') + ' ▼';
                            };
                        }
                        else if (evolveResult.evolves_to[0].evolution_details[0].trigger.name == 'use-item') {
                            evolutionTree.textContent += evolveResult.evolves_to[0].evolution_details[0].item.name.replace('-', ' ') + '▼';
                        }

                        var evolutionArtwork = document.createElement('img');
                        evolutionArtwork.setAttribute('class', 'evolution-artwork');
                        var artworkId = data.chain.evolves_to[0].evolves_to[0].species.url.replace(new RegExp('https://pokeapi.co/api/v2/pokemon-species/'), '',).replace('/', '');
                        evolutionArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${artworkId}.png`;
                        thirdEvolutionFragment.appendChild(evolutionArtwork);
                        var evolutionName = document.createElement('p');
                        evolutionName.setAttribute('class', 'evolution-name');
                        evolutionName.textContent = data.chain.evolves_to[0].evolves_to[0].species.name;
                        thirdEvolutionFragment.appendChild(evolutionName);
                        thirdEvolution.appendChild(thirdEvolutionFragment);
                        // evolutionTree.textContent += evolveResult.evolves_to[0].species.name;
                    };
                });
            };
        });
    });
};