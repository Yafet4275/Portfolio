let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=10';
  let modalContainer = document.querySelector('#modal-container')
  let dialogPromiseReject;

  function loadList() {
    showLoadingMessage()
    return fetch(apiUrl).then(function (response) {
      hideLoadingMessage();
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
        // console.log(pokemon);
      });
    }).catch(function (e) {
      hideLoadingMessage();
      console.error(e);
    })
  }

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }
  function getAll() {
    return pokemonList;
  }
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");
    let listpokemon = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("button-class");
    listpokemon.appendChild(button);
    pokemonList.appendChild(listpokemon);
    button.addEventListener("click", function(event) {
      showDetails(pokemon);
    });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    showLoadingMessage()
    return fetch(url).then(function (response) {
      hideLoadingMessage();
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function (e) {
      hideLoadingMessage();
      console.error(e);
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      showModal(item);
    });
  }

  function showModal(item) {
    // Clear all existing modal content
    let modalContent = document.querySelector('#modal-container');
    modalContent.innerHTML = '';
    let modal = document.createElement('div');
    modal.classList.add('modal');

    // Add to the new modal content
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';

    //Create the pokemon details elements
    let nameElement = document.createElement("h2");
    nameElement.textContent = "Name: " + item.name;

    let heightElement = document.createElement("p");
    heightElement.textContent = "Height: " + item.height;

    let imageElement = document.createElement("img");
    imageElement.src = item.imageUrl;
    imageElement.alt = item.name + "image";

    // Add event listener to close the modal when the close button is clicked
    closeButtonElement.addEventListener("click", function(){
      closeModal();
    });

    //Append the elements to the modal content
    modal.appendChild(closeButtonElement);
    modal.appendChild(nameElement);
    modal.appendChild(heightElement);
    modal.appendChild(imageElement);

    // Append the modal to the modal container
    modalContent.appendChild(modal);
    modalContainer.classList.add('is-visible');
  }

  function closeModal() {
    //Get the modal element
    let modal = document.getElementById("modal");
    
    //Hide the modal
    modalContainer.classList.remove('is-visible');
  }

  function showLoadingMessage() {
    let loading = document.createElement('div');
    loading.innerText = 'Loading..........';
    loading.style.position = 'fixed';
    loading.style.top = 0;
    loading.style.left = 0;
    loading.style.width = '100%';
    loading.style.backgroundColor = 'white';
    loading.style.color = 'black';
    loading.style.padding = '10px';
    document.querySelector('.pokemon-list').appendChild(loading);
  }
  
  function hideLoadingMessage() {
      let loading = document.querySelector('.pokemon-list div');
      if (loading) {
          loading.remove();
      }
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      closeModal();  
    }
  });

  modalContainer.addEventListener('click', (e) => {
    let target = e.target;
    if (target === modalContainer) {
      closeModal();
    }
  });

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };
})();


pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});




