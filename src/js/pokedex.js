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
    var url = ''.concat(baseURL, 'pokemon/', pokemonId);
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        document.title = prettyName(((data.name).charAt(0).toUpperCase() + (data.name).slice(1)) + " | PokéFinder");

        var pokemonArtwork = document.querySelector('.current-pokemon-artwork');
        // pokemonArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${data.id}.png`;
        if (data.id == 487) {
            pokemonArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${data.id}-altered.png`;
        }
        else if (data.id == 412) {
            pokemonArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${data.id}-plant-cloak.png`;
        }
        else {
            pokemonArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${data.id}.png`;
        }

        document.querySelector('.current-pokemon-entries').textContent = '#' + data.id + ' ' + prettyName(data.name);

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
    url = ''.concat(baseURL, 'pokemon-species/', pokemonId);
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        data.flavor_text_entries.forEach(pokedex => {
            if (pokedex.language.name == 'en' && pokedex.version.name == 'alpha-sapphire') {pokedexAS = pokedex.flavor_text.replace(/\n/g, ' ');}
            else if (pokedex.language.name == 'en' && pokedex.version.name == 'omega-ruby') {pokedexOR = pokedex.flavor_text.replace(/\n/g, ' ');};
        });
        if (samePokedexDescription()) {
            writePokedexDescription('Pokémon Alpha Sapphire & Omega Ruby', pokedexAS);
        }
        else {
            writePokedexDescription('Pokémon Alpha Sapphire', pokedexAS);
            writePokedexDescription('Pokémon Omega Ruby', pokedexOR)

        };
    });
};

function samePokedexDescription() { 
    return pokedexAS == pokedexOR;
}

function writePokedexDescription(version, pokedex) {
    var currentPokemonPokedex = document.querySelector('.current-pokemon-pokedex');
    var pokemonDescriptionFragment = document.createDocumentFragment();

    var pokedexVersion = document.createElement('p');
    pokedexVersion.setAttribute('class', 'version');
    pokedexVersion.textContent = version;
    pokemonDescriptionFragment.appendChild(pokedexVersion);

    var pokedexDescription = document.createElement('p');
    pokedexDescription.setAttribute('class', 'description');
    pokedexDescription.textContent = pokedex;
    pokemonDescriptionFragment.appendChild(pokedexDescription);
    currentPokemonPokedex.appendChild(pokemonDescriptionFragment);
};


function getEvolutions() {
    
    url = ''.concat(baseURL, 'pokemon-species/', pokemonId);
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        url = data.evolution_chain.url;
        fetch(url)
        .then(result => result.json())
        .then((data) => {
            var evolutionTree = document.querySelector('.evolution-tree');
            if (Object.keys(data.chain.evolves_to).length === 0) {
                evolutionTree.textContent = 'This Pokémon has and is the result of no evolution.';
            }
            else {
                var firstEvolution = document.createElement('div');
                firstEvolution.setAttribute('class', 'first-evolution')

                var basePokemon = document.createElement('p');
                basePokemon.textContent = 'Base Pokémon';
                firstEvolution.appendChild(basePokemon);

                var evolutionArtwork = document.createElement('img');
                evolutionArtwork.setAttribute('class', 'evolution-artwork');

                var artworkId = data.chain.species.url.replace(new RegExp('https://pokeapi.co/api/v2/pokemon-species/'), '',).replace('/', '');
                if (artworkId == 412) {
                    evolutionArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${artworkId}-plant-cloak.png`;
                }
                else {
                    evolutionArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${artworkId}.png`;
                }
                firstEvolution.appendChild(evolutionArtwork);

                var evolutionName = document.createElement('a');
                evolutionName.setAttribute('class', 'evolution-name');
                evolutionName.href = 'infos.html';
                evolutionName.textContent = prettyName(data.chain.species.name);
                evolutionName.addEventListener('click', () => {
                    localStorage.setItem('pokemonId', data.chain.species.name);
                });

                firstEvolution.appendChild(evolutionName);
                evolutionTree.appendChild(firstEvolution);

                if (data.chain.species.name == 'eevee') {
                    evolutionTree.classList.add('eevee');
                }

                data.chain.evolves_to.forEach(evolveResult => {

                    var secondEvolution = document.createElement('div');
                    secondEvolution.setAttribute('class', 'second-evolution')

                    if (evolveResult.evolution_details[0].trigger.name == 'trade') {
                        writeTradeCondition(evolveResult, secondEvolution);
                        console.log('test')
                    }
                    else if (evolveResult.evolution_details[0].trigger.name == 'use-item') {
                        writeUseItem(evolveResult, secondEvolution);
                        console.log('test')
                    }
                    else if (evolveResult.evolution_details[0].trigger.name == 'level-up') {
                        console.log('test')
                        if (evolveResult.evolution_details[0].min_level !== null) {
                            console.log('test')
                            if (evolveResult.evolution_details[0].time_of_day !== null && evolveResult.evolution_details[0].time_of_day !== '') {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                evolveMethod.textContent = 'Level ' + evolveResult.evolution_details[0].min_level + ' (' + evolveResult.evolution_details[0].time_of_day + ')';
                                secondEvolution.appendChild(evolveMethod);
                                console.log('test')
                            }
                            else if (evolveResult.evolution_details[0].gender !== null && evolveResult.evolution_details[0].gender !== '') {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                if (evolveResult.evolution_details[0].gender == 1) {
                                    evolveMethod.textContent = 'Level ' + evolveResult.evolution_details[0].min_level + ' (♀)';
                                }
                                else {
                                    evolveMethod.textContent = 'Level ' + evolveResult.evolution_details[0].min_level + ' (♂)';
                                }
                                secondEvolution.appendChild(evolveMethod);
                            }
                            else {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                evolveMethod.textContent = 'Level ' + evolveResult.evolution_details[0].min_level;
                                secondEvolution.appendChild(evolveMethod);
                                console.log('test')
                            }
                            
                        }
                        else if (evolveResult.evolution_details[0].min_happiness !== null && evolveResult.evolution_details[0].min_happiness !== '') {
                            if (evolveResult.evolution_details[0].time_of_day !== null && evolveResult.evolution_details[0].time_of_day !== '') {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                evolveMethod.textContent = 'Level up with Friendship (' + evolveResult.evolution_details[0].time_of_day + ')';
                                secondEvolution.appendChild(evolveMethod);
                                console.log('test')
                            }
                            else {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                evolveMethod.textContent = 'Level up with Friendship';
                                secondEvolution.appendChild(evolveMethod);
                                console.log('test')
                            }
                        }
                        else if (evolveResult.evolution_details[0].known_move_type !== null || evolveResult.evolution_details[0].known_move !== null) {
                            writeKnownMoveCondition(evolveResult, secondEvolution);
                            console.log('test')
                        }
                        else if (evolveResult.evolution_details[0].location !== null && evolveResult.evolution_details[0].location !== '') {
                            if (evolveResult.evolution_details[0].location.name == 'sinnoh-route-217') {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                evolveMethod.textContent = 'Level up near Ice Rock';
                                secondEvolution.appendChild(evolveMethod);
                                console.log('test')
                            }
                            else if (evolveResult.evolution_details[0].location.name == 'eterna-forest') {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                evolveMethod.textContent = 'Level up near Moss Rock';
                                secondEvolution.appendChild(evolveMethod);
                                console.log('test')
                            }
                            else {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                evolveMethod.textContent = 'Level up in a special area';
                                secondEvolution.appendChild(evolveMethod);
                                console.log('test')
                            }
                        }
                        else if (evolveResult.evolution_details[0].held_item !== null) {
                            var evolveMethod = document.createElement('div');
                            evolveMethod.setAttribute('class', 'evolve-method');

                            var evolveMethodText = document.createElement('p');
                            evolveMethodText.setAttribute('class', 'evolve-method-text');
                            evolveMethodText.textContent = 'Level up holding ';
                            evolveMethod.appendChild(evolveMethodText);
                            console.log('test')

                            var evolveItemSprite = document.createElement('img');
                            evolveItemSprite.setAttribute('class', 'evolve-item-sprite');
                            evolveItemSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolveResult.evolution_details[0].held_item.name}.png`;
                            evolveMethod.appendChild(evolveItemSprite);
                            console.log('test')

                            var evolveItemName = document.createElement('p');
                            evolveItemName.setAttribute('class', 'evolve-item-name')
                            evolveItemName.textContent = evolveResult.evolution_details[0].held_item.name.replace('-', ' ');
                            evolveMethod.appendChild(evolveItemName);

                            if (evolveResult.evolution_details[0].time_of_day !== null) {
                                var evolveTime = document.createElement('p');
                                evolveTime.setAttribute('class', 'evolve-time')
                                evolveTime.textContent = ` (${evolveResult.evolution_details[0].time_of_day})`;
                                evolveMethod.appendChild(evolveTime);
                                console.log('test')
                            }

                            secondEvolution.appendChild(evolveMethod);
                        }
                    }
                    var evolutionArtwork = document.createElement('img');
                    evolutionArtwork.setAttribute('class', 'evolution-artwork');
                    var artworkId = evolveResult.species.url.replace(new RegExp('https://pokeapi.co/api/v2/pokemon-species/'), '',).replace('/', '');
                    if (artworkId == 413) {
                        evolutionArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${artworkId}-plant-cloak.png`;
                    }
                    else {
                        evolutionArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${artworkId}.png`;
                    }
                    secondEvolution.appendChild(evolutionArtwork);
                    var evolutionName = document.createElement('a');
                    evolutionName.setAttribute('class', 'evolution-name');
                    evolutionName.href = 'infos.html';
                    evolutionName.textContent = prettyName(evolveResult.species.name);
                    evolutionName.addEventListener('click', () => {
                        localStorage.setItem('pokemonId', evolveResult.species.name);
                    });
                    secondEvolution.appendChild(evolutionName);
                    evolutionTree.appendChild(secondEvolution);
                    
                    if (Object.keys(evolveResult.evolves_to).length !== 0) {
                        
                        evolveResult.evolves_to.forEach(evolveResult2 => {

                            var thirdEvolution = document.createElement('div');
                            thirdEvolution.setAttribute('class', 'third-evolution');

                            if (evolveResult2.evolution_details[0].min_level !== null) {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                evolveMethod.textContent = 'Level ' + evolveResult2.evolution_details[0].min_level;
                                thirdEvolution.appendChild(evolveMethod);
                            }
                            else if (evolveResult2.evolution_details[0].trigger.name == 'trade') {
                                writeTradeCondition(evolveResult2, thirdEvolution);
                            }
                            else if (evolveResult2.evolution_details[0].trigger.name == 'use-item') {
                                writeUseItem(evolveResult2, thirdEvolution);
                            }
                            else if (evolveResult2.evolution_details[0].min_happiness !== null) {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                evolveMethod.textContent = 'Level up with Friendship';
                                thirdEvolution.appendChild(evolveMethod);
                            }
                            else if (evolveResult2.evolution_details[0].location !== null && evolveResult2.evolution_details[0].location !== '') {
                                var evolveMethod = document.createElement('p');
                                evolveMethod.setAttribute('class', 'evolve-method');
                                evolveMethod.textContent = 'Level up in a special area';
                                thirdEvolution.appendChild(evolveMethod);
                            }
                            else if (evolveResult2.evolution_details[0].known_move_type !== null) {
                                writeKnownMoveCondition(evolveResult2, thirdEvolution);
                            }

                            var evolutionArtwork = document.createElement('img');
                            evolutionArtwork.setAttribute('class', 'evolution-artwork');
                            var artworkId = evolveResult2.species.url.replace(new RegExp('https://pokeapi.co/api/v2/pokemon-species/'), '',).replace('/', '');
                            evolutionArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${artworkId}.png`;
                            thirdEvolution.appendChild(evolutionArtwork);
                            var evolutionName = document.createElement('a');
                            evolutionName.setAttribute('class', 'evolution-name');
                            evolutionName.href = 'infos.html'
                            evolutionName.textContent = prettyName(evolveResult2.species.name);
                            evolutionName.addEventListener('click', () => {
                                localStorage.setItem('pokemonId', evolveResult2.species.name);
                            })
                            thirdEvolution.appendChild(evolutionName);
                            evolutionTree.appendChild(thirdEvolution);
                        });
                    };
                        
                });
            };
        });
    });
};

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

function writeUseItem(evolveResult, parent) {

	var evolveMethod = document.createElement('div');
    evolveMethod.setAttribute('class', 'evolve-method');

    var evolveMethodText = document.createElement('p');
    evolveMethodText.setAttribute('class', 'evolve-method-text');
    evolveMethodText.textContent = 'Using a ';
    evolveMethod.appendChild(evolveMethodText);

    var evolveItemSprite = document.createElement('img');
    evolveItemSprite.setAttribute('class', 'evolve-item-sprite');
    evolveItemSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolveResult.evolution_details[0].item.name}.png`;
    evolveMethod.appendChild(evolveItemSprite);

    var evolveItemName = document.createElement('p');
    evolveItemName.setAttribute('class', 'evolve-item-name');


    if (evolveResult.evolution_details[0].gender == 1) {
    	evolveItemName.textContent = evolveResult.evolution_details[0].item.name.replace('-', ' ') + ' (♀)';
	}
	else if (evolveResult.evolution_details[0].gender == 2) {
    	evolveItemName.textContent = evolveResult.evolution_details[0].item.name.replace('-', ' ') + ' (♂)';
	}
	else {
		evolveItemName.textContent = evolveResult.evolution_details[0].item.name.replace('-', ' ');
	}

    evolveMethod.appendChild(evolveItemName);
    parent.appendChild(evolveMethod);
};

function writeTradeCondition(evolveResult, parent) {
	if (evolveResult.evolution_details[0].held_item !== null) {
		var evolveMethod = document.createElement('div');
		evolveMethod.setAttribute('class', 'evolve-method');

        var evolveMethodText = document.createElement('p');
		evolveMethodText.setAttribute('class', 'evolve-method-text');
		evolveMethodText.textContent = 'Trade holding ';
		evolveMethod.appendChild(evolveMethodText);

		var evolveItemSprite = document.createElement('img');
		evolveItemSprite.setAttribute('class', 'evolve-item-sprite');
		evolveItemSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolveResult.evolution_details[0].held_item.name}.png`;
		evolveMethod.appendChild(evolveItemSprite);

		var evolveItemName = document.createElement('p');
		evolveItemName.setAttribute('class', 'evolve-item-name')
		evolveItemName.textContent = evolveResult.evolution_details[0].held_item.name.replace('-', ' ');
		evolveMethod.appendChild(evolveItemName);
		parent.appendChild(evolveMethod);
	}
	else if (evolveResult.evolution_details[0].trade_species !== null && evolveResult.evolution_details[0].trade_species !== '') {
		var evolveMethod = document.createElement('div');
        evolveMethod.setAttribute('class', 'evolve-method');
        
        var evolveMethodText = document.createElement('p');
        evolveMethodText.setAttribute('class', 'evolve-method-text');
		evolveMethodText.textContent = 'Trade with\xa0';
		evolveMethod.appendChild(evolveMethodText);

		var tradeName = document.createElement('a');
        tradeName.setAttribute('class', 'evolution-name');
        tradeName.href = 'infos.html';
        tradeName.textContent = evolveResult.evolution_details[0].trade_species.name;
        tradeName.addEventListener('click', () => {
            localStorage.setItem('pokemonId', evolveResult.evolution_details[0].trade_species.name);
        });
        evolveMethod.appendChild(tradeName);
        parent.appendChild(evolveMethod);

	}
	else {
		var evolveMethod = document.createElement('p');
		evolveMethod.setAttribute('class', 'evolve-method');
		evolveMethod.textContent = 'Trade';
		parent.appendChild(evolveMethod);
	}
}

function writeKnownMoveCondition(evolveResult, parent) {
	if (evolveResult.evolution_details[0].min_affection !== null && evolveResult.evolution_details[0].min_affection !== '') {
		var evolveMethod = document.createElement('div');
        evolveMethod.setAttribute('class', 'evolve-method');

        var evolveMethodText = document.createElement('p');
        evolveMethodText.setAttribute('class', 'evolve-method-text');
        evolveMethodText.textContent = 'Level up with level ' + evolveResult.evolution_details[0].min_affection + ' affection and a ' + evolveResult.evolution_details[0].known_move_type.name + '-type move';
        evolveMethod.appendChild(evolveMethodText);

        parent.appendChild(evolveMethod);  
	}
	else {
		var evolveMethod = document.createElement('div');
        evolveMethod.setAttribute('class', 'evolve-method');

        var evolveMethodText = document.createElement('p');
        evolveMethodText.setAttribute('class', 'evolve-method-text');
        evolveMethodText.textContent = 'Level up knowing\xa0';
        evolveMethod.appendChild(evolveMethodText);

        var moveName = document.createElement('p');
        moveName.setAttribute('class', 'move-name');
        moveName.textContent = evolveResult.evolution_details[0].known_move.name.replace('-', ' ');
        evolveMethod.appendChild(moveName);

        parent.appendChild(evolveMethod);  
	}
}