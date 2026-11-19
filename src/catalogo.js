const contenedor = document.getElementById("contenedor-pokemones");
const formulario = document.getElementById("form-busqueda");
const input = document.getElementById("search");

function crearCarta(pokemon) {
  const tipos = pokemon.types
    .map((tipo) => tipo.type.name)
    .join(" / ");

  return `
    <article class="card">
      <img
        src="${pokemon.sprites.front_default}"
        alt="${pokemon.name}"
      >

      <h3>${pokemon.name}</h3>

      <p>N.º ${pokemon.id}</p>

      <p>Tipo: ${tipos}</p>
    </article>
  `;
}

async function cargarPokemones() {
  try {
    contenedor.innerHTML = "<p>Cargando Pokémon...</p>";

    const respuesta = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=20"
    );

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener la lista");
    }

    const datos = await respuesta.json();

    const pokemones = await Promise.all(
      datos.results.map(async (pokemon) => {
        const respuestaPokemon = await fetch(pokemon.url);

        if (!respuestaPokemon.ok) {
          throw new Error("No se pudo obtener un Pokémon");
        }

        return respuestaPokemon.json();
      })
    );

    contenedor.innerHTML = pokemones
      .map((pokemon) => crearCarta(pokemon))
      .join("");
  } catch (error) {
    console.error(error);

    contenedor.innerHTML = `
      <p>No se pudieron cargar los Pokémon.</p>
    `;
  }
}

async function buscarPokemon(nombre) {
  try {
    contenedor.innerHTML = "<p>Buscando Pokémon...</p>";

    const nombreCorregido = nombre.trim().toLowerCase();

    const respuesta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${nombreCorregido}`
    );

    if (!respuesta.ok) {
      throw new Error("Pokémon no encontrado");
    }

    const pokemon = await respuesta.json();

    contenedor.innerHTML = crearCarta(pokemon);
  } catch (error) {
    console.error(error);

    contenedor.innerHTML = `
      <p>No se encontró el Pokémon.</p>
    `;
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = input.value;

  if (nombre.trim() === "") {
    cargarPokemones();
  } else {
    buscarPokemon(nombre);
  }
});

cargarPokemones();