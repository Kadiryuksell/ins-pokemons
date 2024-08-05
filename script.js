$(document).ready(() => {
    const pokemons = [];

    const init = () => {
        fetchPokemons();
        setEvents();
    }

    const fetchPokemons = async () => {
        try {
            const response = await $.getJSON('https://pokeapi.co/api/v2/pokemon?limit=151');
            fetchPokemonDetails(response.results);
        } catch (error) {
            console.log('Error:', error);
        }
    }

    const fetchPokemonDetails = (data) => {
        try {
            data.forEach((object) => {
                $.getJSON(object.url)
                    .done(pokemon => {
                        pokemons.push(pokemon);
                    })
                    .fail(error => {
                        console.log('Error:', error);
                    });
            });
        } catch (error) {
            console.log('Error:', error);
        }
    }

    const setEvents = () => {
        $('.pokemon-button').on('click', () => {
            const { searchedValue, sortedValue } = getSearchAndSortValues();
            bringPokemons(searchedValue, sortedValue);
        });

        $('.search-bar').on('input', () => {
            const { searchedValue, sortedValue } = getSearchAndSortValues();
            bringPokemons(searchedValue, sortedValue);
        });

        $('.sort-by').on('change', () => {
            const { searchedValue, sortedValue } = getSearchAndSortValues();
            bringPokemons(searchedValue, sortedValue);
        });
    };

    const getSearchAndSortValues = () => {
        const searchedValue = $('.search-bar').val();
        const sortedValue = $('.sort-by').val();
        return { searchedValue, sortedValue };
    };

    const bringPokemons = (searchedValue, sortedValue) => {
        const filteredPokemons = filterPokemons(searchedValue);
        const sortedPokemons = sortPokemons(filteredPokemons, sortedValue);

        createPokemonCards(sortedPokemons);

        $('.count').text(sortedPokemons.length);
    }

    const filterPokemons = (searchedValue) => {
        return pokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchedValue.toLowerCase()));
    };

    const sortPokemons = (pokemons, sort) => {
        if (sort.toLowerCase().includes('name')) {
            return pokemons.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
        } else {
            return pokemons.sort((a, b) => a.id - b.id);
        }
    }

    const createPokemonCards = (dataPokemons) => {
        const pokemonListElement = $('.pokemon-list');
        pokemonListElement.empty(); 

        dataPokemons.forEach((pokemon) => {
            const { name, id, sprites, types } = pokemon;
            const pokemonCardHtml =
                `<div class="card-container">
                    <img class="pokemon-image" src="${sprites.front_default}"/>
                    <p>${id}</p>
                    <h3>${name}</h3>
                    <ul>
                        ${getPokemonTypes(types)}
                    </ul>
                </div>`;
            pokemonListElement.append(pokemonCardHtml); 
        });
    };

    const getPokemonTypes = (types) => {
        return types.reduce((html, type) => `${html}<li>${type.type.name}</li>`, '');
    };

    init();
});
