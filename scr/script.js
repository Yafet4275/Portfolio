$(document).ready(function(){
  let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function loadList() {
      showLoadingModal()
      return fetch(apiUrl)
        .then(function (response) {
          hideLoadingModal()
          return response.json();
        })
        .then(function (json) {
          json.results.forEach(function (item) {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
        .catch(function (e) {
          hideLoadingModal()
          console.error(e);
        });
    }

    function add(pokemon) {
      if (typeof pokemon === 'object' && 'name' in pokemon) {
        pokemonList.push(pokemon);
      } else {
        console.log('pokemon is not correct');
      }
    }
    
    function getAll() {
      return pokemonList;
    }

    function addListItem(pokemon) {
      let pokemonListElement = $('.list-group');
      let button = $('<button></button>').attr('type', 'button').addClass('btn btn-primary myButton').text(pokemon.name);

      pokemonListElement.append(button);

      $('.list-group').on('click', '.myButton', function() {
        let pokemonName = $(this).text();
        let pokemon = pokemonRepository.getAll().find(function(item) {
          return item.name === pokemonName;
        });
        if (pokemon) {
          pokemonRepository.showDetails(pokemon);
        }
      });
    }

    function loadDetails(item) {
      let url = item.detailsUrl;
      showLoadingModal()
      return fetch(url)
        .then(function (response) {
          hideLoadingModal()
          return response.json();
        })
        .then(function (details) {
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          item.types = details.types;
        })
        .catch(function (e) {
          hideLoadingModal()
          console.error(e);
        });
    }

    function showDetails(item) {
      pokemonRepository.loadDetails(item).then(function () {
        showModal(item);
      });
    }

    function showModal(item) {
      let modalTitle = $('.modal-title');
      let modalBody = $('.modal-body');
    
      modalTitle.text(item.name);
      modalBody.empty(); 
    
      let heightElement = $('<p></p>').text('Height: ' + item.height);
      let imageElement = $('<img>').attr('src', item.imageUrl).attr('alt', item.name + ' image');
    
      modalBody.append(heightElement);
      modalBody.append(imageElement);
    
      $('#exampleModal').modal('show');

      $('.modal-header .close, .modal-footer .btn-secondary').on('click', function() {
        $('#exampleModal').modal('hide');
      });
    }

    function showLoadingModal() {
      $('#loadingModal').modal('show');
    }

    function hideLoadingModal() {
      $('#loadingModal').modal('hide');
    }
    
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
});