const baseURL = 'https://pokeapi.co/api/v2/';
const evolutionTree = document.querySelector('.evolution-tree');
specialArtworks = ['ids'];
specialEvolutions = ['names'];

if (localStorage.getItem('pokemonId') !== null) {
	var pokemonId = localStorage.getItem('pokemonId');
	getInfos();	
}
else {
	window.location.href = 'index.html';
}

function getInfos() {
	var url = ''.concat(baseURL, 'pokemon-species/', pokemonId);
	fetch(url)
	.then(result => result.json())
	.then(data => {
		getPokemonEntries(data.id, data.name);
		setPageTitle(data.name);
		getArtwork(data.id);
		getTypes(data.varieties[0].pokemon.url);
		getPokedex(data.flavor_text_entries);
		getEvolutionTree(data.evolution_chain.url);
	});
}

function getPokemonEntries(id, name) {
	document.querySelector('.current-pokemon-entries').textContent = '#' + id + ' ' + prettyName(name);
}

function setPageTitle(name) {
	name = prettyName(name.charAt(0).toUpperCase() + name.slice(1));
	title = name + ' | PokéFinder';
	document.title = title;
}

function getArtwork(id) {
	var pokemonArtwork = document.querySelector('.current-pokemon-artwork');
	if (specialArtworks.includes(id)) {
		pokemonArtwork.src = getSpecialArtwork(id);
	}
	else {
		pokemonArtwork.src = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
	}
}

function getSpecialArtwork(id) {
	return;
}

function getTypes(pokemonURL) {
	fetch(pokemonURL)
	.then(result => result.json())
	.then(data => {
		currentPokemonTypes = document.querySelector('.current-pokemon-types');

		data.types.forEach(types => {
			createElement({
				type: 'p',
				class: `pokemon-type ${types.type.name} current-pokemon-type`,
				text: types.type.name,
				parent: currentPokemonTypes,
			});
		});
	});
}

function getPokedex(pokedices) {
	pokedices.forEach(pokedex => {
		if (pokedex.language.name == 'en' && pokedex.version.name == 'alpha-sapphire') {
			pokedexAS = pokedex.flavor_text.replace(/\n/g, ' ');
		}
		else if (pokedex.language.name == 'en' && pokedex.version.name == 'omega-ruby') {
			pokedexOR = pokedex.flavor_text.replace(/\n/g, ' ');
		};
	});

	if (pokedexAS == pokedexOR) {
		writePokedex('Pokémon Alpha Sapphire & Omega Ruby', pokedexAS);	
	}
	else {
		writePokedex('Pokémon Alpha Sapphire', pokedexAS);
        writePokedex('Pokémon Omega Ruby', pokedexOR);
	};
}

function writePokedex(version, pokedex) {
	var pokemonPokedex = document.querySelector('.current-pokemon-pokedex');
	var pokedexFragment = document.createDocumentFragment();

	createElement({
		type: 'p',
		class: 'version',
		text: version,
		parent: pokedexFragment,
	});

	createElement({
		type: 'p',
		class: 'description',
		text: pokedex,
		parent: pokedexFragment,
	});

	pokemonPokedex.appendChild(pokedexFragment);
}

function getEvolutionTree(evolutionsURL) {
	fetch(evolutionsURL)
	.then(result => result.json())
	.then(data => {
		if (Object.keys(data.chain.evolves_to).length === 0) {
			evolutionTree.textContent = 'This Pokémon has and is the result of no evolution.';
		}
		else {
			getEvolutions({
				path: data.chain,
				class: 'first-evolution',
				text: 'Base Pokémon',
			});

			getSpecialEvolutions(prettyName(data.chain.species.name));

			data.chain.evolves_to.forEach(evolveResult => {
				getEvolutions({
					path: evolveResult,
					class: 'second-evolution',
					method: getEvolutionMethod(evolveResult),
				});
			});

			if (Object.keys(data.chain.evolves_to[0].evolves_to).length !== 0) {
				data.chain.evolves_to[0].evolves_to.forEach(evolveResult2 => {
					getEvolutions({
						path: evolveResult2,
						class: 'second-evolution',
						method: getEvolutionMethod(evolveResult2),
					});
				});
			}
		};
	});
}

function getEvolutions(options) {
	const evolution =   createElement({
                            type: 'div',
                            class: options.class,
                            parent: evolutionTree,
                        });

	const evolveMethod = 	createElement({
								type: 'div',
								text: options.text,
								parent: evolution,
							});

	if (options.method) {
		evolveMethod.setAttribute('class', 'evolve-method');
		evolveMethod.appendChild(options.method);
	}

	var artworkId = options.path.species.url.replace(new RegExp('https://pokeapi.co/api/v2/pokemon-species/'), '',).replace('/', '');

	if (specialArtworks.includes(artworkId)) {
		createElement({
			type: 'img',
			class: 'evolution-artwork',
			src: getSpecialArtwork(),
			parent: evolution,
		});
	}
	else {
		createElement({
			type: 'img',
			class: 'evolution-artwork',
			src: `https://pokeres.bastionbot.org/images/pokemon/${artworkId}.png`,
			parent: evolution,
		});
	}

	const evolutionName = createElement({
							type: 'a',
							class: 'evolution-name',
							href: 'infos.html',
                            text: prettyName(options.path.species.name),
                            parent: evolution,
						});

	evolutionName.addEventListener('click', () => {
		localStorage.setItem('pokemonId', options.path.species.name);
	});
}

function getSpecialEvolutions(name) {
	if (specialEvolutions.includes(name)) {
		evolutionTree.classList.add(`${name}`);
	}
}

function getEvolutionMethod(path) {

	evolutionMethodFragment = document.createDocumentFragment();

	if (path.evolution_details[0].trigger.name == 'level-up') {
		getLevelUpConditions(path);
    }
    else if (path.evolution_details[0].trigger.name == 'use-item') {
    	getUseItemConditions(path);
    }
    else if (path.evolution_details[0].trigger.name == 'trade') {
    	getTradeConditions(path);
    }
    else if (path.evolution_details[0].trigger.name == 'shed') {
    	getShadeConditions();
    }
    return evolutionMethodFragment;
}

function getLevelUpConditions(path) {
	// Minimal Level
	if (path.evolution_details[0].min_level !== null) {
		// Physical Stats
		if (path.evolution_details[0].relative_physical_stats !== null) {
			// Attack > Defense
			if (path.evolution_details[0].relative_physical_stats == 1) {
				createElement({
					type: 'p',
					class: 'evolve-method-text',
					text: 'Level ' + path.evolution_details[0].min_level + ' (Attack > Defense)',
					parent: evolutionMethodFragment,
				});
			}
			// Attack < Defense
			else if (path.evolution_details[0].relative_physical_stats == -1) {
				createElement({
					type: 'p',
					class: 'evolve-method-text',
					text: 'Level ' + path.evolution_details[0].min_level + ' (Attack < Defense)',
					parent: evolutionMethodFragment,
				});
			}
			// Attack = Defense
			else {
				createElement({
					type: 'p',
					class: 'evolve-method-text',
					text: 'Level ' + path.evolution_details[0].min_level + ' (Attack = Defense)',
					parent: evolutionMethodFragment,
				});
			}
		}
		// Time of Day
		else if (path.evolution_details[0].time_of_day !== null && path.evolution_details[0].time_of_day !== '') {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level ' + path.evolution_details[0].min_level + ' (' + path.evolutions_details[0].time_of_day + ')',
				parent: evolutionMethodFragment,
			});
		}
		// Gender Female
		else if (path.evolution_details[0].gender == 1) {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level ' + path.evolution_details[0].min_level + ' (♀)',
				parent: evolutionMethodFragment,
			});
		}
		// Gender Male
		else if (path.evolution_details[0].gender == 2) {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level ' + path.evolution_details[0].min_level + ' (♂)',
				parent: evolutionMethodFragment,
			});
		}
		// Hold Upside-Down
		else if (path.evolution_details[0].turn_upside_down == true) {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level ' + path.evolution_details[0].min_level + ' (holding game system upside-down)',
				parent: evolutionMethodFragment,
			});
		}
		// Raining
		else if (path.evolution_details[0].needs_overworld_rain == true) {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level ' + path.evolution_details[0].min_level + ' (raining)',
				parent: evolutionMethodFragment,
			});
		}
		// Pokémon-Type in Party
		else if (path.evolution_details[0].party_type !== null) {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level ' + path.evolution_details[0].min_level + ' with a ' + path.evolution_details[0].party_type.name + '-type in the party',
				parent: evolutionMethodFragment,
			});
		}
		// Minimal Level Only
		else {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level ' + path.evolution_details[0].min_level,
				parent: evolutionMethodFragment,
			});
		}		
	}
	// Special Area
	else if (path.evolution_details[0].location !== null && path.evolution_details[0].location !== '') {
		// Near Ice Rock
		if (path.evolution_details[0].location.name == 'sinnoh-route-217') {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level up near Ice Rock',
				parent: evolutionMethodFragment,
			});
		}
		// Near Moss Rock
		else if (path.evolution_details[0].location.name == 'eterna-forest') {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level up near Moss Rock',
				parent: evolutionMethodFragment,
			});
		}
		// Special Area
		else {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level up in a special area',
				parent: evolutionMethodFragment,
			});
		}
	}
	// Friendship
	else if (path.evolution_details[0].min_happiness !== null && path.evolution_details[0].min_happiness !== '') {
		// Time of Day
		if (path.evolution_details[0].time_of_day !== null && path.evolution_details[0].time_of_day !== '') {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level up with Friendship (' + path.evolution_details[0].time_of_day + ')',
				parent: evolutionMethodFragment,
			});
		}
		// Friendship Only
		else {
			createElement({
				type: 'p',
				class: 'evolve-method-text',
				text: 'Level up with Friendship',
				parent: evolutionMethodFragment,
			});
		}
	}
	// Holding Item
	else if (path.evolution_details[0].held_item !== null) {
		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: 'Level up holding ',
			parent: evolutionMethodFragment,
		});

		createElement({
			type: 'img',
			class: 'evolve-item-sprite',
			src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${path.evolution_details[0].held_item.name}.png`,
			parent: evolutionMethodFragment,
		});

		createElement({
			type: 'p',
			class: 'evolve-item-name',
			text: path.evolution_details[0].held_item.name.replace('-', ' '),
			parent: evolutionMethodFragment,
		});

		createElement({
			type: 'p',
			class: 'evolve-time',
			text: ` (${path.evolution_details[0].time_of_day})`,
			parent: evolutionMethodFragment,
		});
	}
	// Having Attack
	else if (path.evolution_details[0].known_move !== null) {
		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: 'Level up knowing\xa0',
			parent: evolutionMethodFragment,
		});

		createElement({
			type: 'p',
			class: 'move-name',
			text: path.evolution_details[0].known_move.name.replace('-', ' '),
			parent: evolutionMethodFragment,
		});
	}
	// Having Attack-Type + Affection
	else if (path.evolution_details[0].known_move_type !== null) {
		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: 'Level up with level ' + path.evolution_details[0].min_affection + ' affection and a ' + path.evolution_details[0].known_move_type.name + '-type move',
			parent: evolutionMethodFragment,
		});
	}
	// Beauty
	else if (path.evolves_to[0].evolution_details[0].min_beauty !== null) {
		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: 'Level up (Beauty > ' + (path.evolution_details[0].min_beauty - 1) + ')',
			parent: evolutionMethodFragment,
		});		
	}
	// Pokémon in Party
	else if (path.evolves_to[0].evolution_details[0].party_species !== null) {
		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: 'Level up with\xa0',
			parent: evolutionMethodFragment,
		});

		var pokemonName = 	createElement({
								type: 'a',
								class: 'evolution-name',
								text: path.evolution_details[0].party_species.name,
								href: 'infos.html',
								parent: evolutionMethodFragment,
							});

		pokemonName.addEventListener('click', () => {
			localStorage.setItem('pokemonId', path.evolution_details[0].party_species.name);
		});

		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: '\xa0in party',
			parent: evolutionMethodFragment,
		});
	}
	return evolutionMethodFragment;
}

function getUseItemConditions(path) {
	// Text Method
	createElement({
		type: 'p',
		class: 'evolve-method-text',
		text: 'Using a',
		parent: evolutionMethodFragment,
	});
	// Item Sprite
	createElement({
		type: 'img',
		class: 'evolve-item-sprite',
		src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${path.evolution_details[0].item.name}.png`,
		parent: evolutionMethodFragment,
	});
	// Item Name
	createElement({
		type: 'p',
		class: 'evolve-item-name',
		text: path.evolution_details[0].item.name.replace('-', ' '),
		parent: evolutionMethodFragment,
	})
	// Gender Female
	if (path.evolution_details[0].gender == 1) {
		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: ' (♀)',
			parent: evolutionMethodFragment,
		})
	}
	// Gender Male
	else if (path.evolution_details[0].gender == 1) {
		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: ' (♂)',
			parent: evolutionMethodFragment,
		})
	}
	return evolutionMethodFragment;
}

function getTradeConditions(path) {
	// With Pokémon
	if (path.evolution_details[0].trade_species !== null && path.evolution_details[0].trade_species !== '') {
		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: 'Trade with\xa0',
			parent: evolutionMethodFragment,
		});

		var tradeName = createElement({
			type: 'a',
			class: 'evolution-name',
			href: 'infos.html',
			text: path.evolution_details[0].trade_species.name,
			parent: evolutionMethodFragment,
		});

		tradeName.addEventListener('click', () => {
			localStorage.setItem('pokemonId', path.evolution_details[0].trade_species.name);
		});
	}
	// With Item
	else if (path.evolution_details[0].held_item !== null) {
		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: 'Trade holding ',
			parent: evolutionMethodFragment,
		});

		createElement({
			type: 'img',
			class: 'evolve-item-sprite',
			src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${path.evolution_details[0].held_item.name}.png`,
			parent: evolutionMethodFragment,
		});

		createElement({
			type: 'p',
			class: 'evolve-item-name',
			text: path.evolution_details[0].held_item.name.replace('-', ' '),
			parent: evolutionMethodFragment,
		});
	}
	// Trade Only
	else {
		createElement({
			type: 'p',
			class: 'evolve-method-text',
			text: 'Trade',
			parent: evolutionMethodFragment,
		});			
	}
}

function getShadeConditions() {
	createElement({
		type: 'p',
		class: 'evolve-method-text',
		text: 'Space in party and a ',
		parent: evolutionMethodFragment,
	});

	createElement({
		type: 'img',
		class: 'evolve-item-sprite',
		src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png`,
		parent: evolutionMethodFragment,
	});

	createElement({
		type: 'p',
		class: 'evolve-item-name',
		text: 'Poké Ball',
		parent: evolutionMethodFragment,
	});

	createElement({
		type: 'p',
		class: 'evolve-method-text',
		text: '\xa0in bag',
		parent: evolutionMethodFragment,
	});
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