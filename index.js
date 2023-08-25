const getCard = async () => {
  //   displayLoading();
  const searchInput =
    document.querySelector('.search-input').value + '*' || '*';
  const types = document.querySelector('#type').value || '*';
  const supertypes = document.querySelector('#supertype').value || '*';
  const subtypes = document.querySelector('#subtype').value || '*';
  const pack = document.querySelector('#pack').value || '*';
  const rarity = document.querySelector('#rarity').value || '*';
  let query = '';

  switch (types !== '*') {
    case true:
      query =
        `q=name:${searchInput} types:${types} supertype:${supertypes} subtypes:"${subtypes}" set.name:"${pack}" rarity:"${rarity}"&` ||
        '&';
      break;
    case false:
      if (supertypes === 'Pokémon' || supertypes === '*') {
        query =
          `q=name:${searchInput} supertype:${supertypes} subtypes:"${subtypes}" set.name:"${pack}" rarity:"${rarity}"&` ||
          '&';
      } else {
        query =
          `q=name:${searchInput} supertype:${supertypes} subtypes:"${subtypes}" set.name:"${pack}" rarity:"${rarity}"&` ||
          '&';
      }
      break;
    default:
      null;
  }

  const resultBox = document.querySelector('.result-box');

  try {
    const api = await fetch(
      `https://api.pokemontcg.io/v2/cards?${query}page=1&pageSize=20`
    );
    const response = await api.json();
    const datas = response.data;
    const count = response.count;
    let cards = '';
    if (count === 0) {
      cards = '<div class="not-found">Card not found</div>';
      resultBox.innerHTML = cards;
    } else {
      datas.map((m) => (cards += showCard(m)));
      resultBox.innerHTML = cards;
    }
  } catch (err) {
    resultBox.innerHTML = 'Card not Found';
  }
};

const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');
searchButton.addEventListener('click', () => getCard());
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    getCard();
  }
});

const loader = document.querySelector('#loading');

// const displayLoading = () => {
//   loader.classList.add('display');
//   setTimeout(() => {
//     loader.classList.remove('display');
//   }, 6000);
// };

const hideLoading = () => {
  loader.classList.remove('display');
};

const showCard = (m) => {
  return `<div class="card" id="${m.id}">
            <img src="${m.images.large}" alt="${m.name + m.id}" title="${
    m.name + ' ' + m.id
  }"/>
        </div>`;
};

const getType = async () => {
  const api = await fetch('https://api.pokemontcg.io/v2/types');
  const response = await api.json();
  const data = response.data;
  let option = `<option value="" selected>Select Type</option>`;
  data.forEach((m) => (option += showFilterOption(m)));
  typeSelector.innerHTML = option;
};
getType();

const getSuperType = () => {
  fetch('https://api.pokemontcg.io/v2/supertypes')
    .then((response) => response.json())
    .then((datas) => {
      const data = datas.data;
      let option = `<option value="" selected>Select Card Type</option>`;
      data.forEach((m) => (option += showFilterOption(m)));
      superTypeSelector.innerHTML = option;
    });
};
getSuperType();

const getSubType = () => {
  fetch('https://api.pokemontcg.io/v2/subtypes')
    .then((response) => response.json())
    .then((datas) => {
      const data = datas.data;
      let option = `<option value="" selected>Select Subtype</option>`;
      data.forEach((m) => (option += showFilterOption(m)));
      subTypeSelector.innerHTML = option;
    });
};
getSubType();

const getPack = () => {
  fetch('https://api.pokemontcg.io/v2/sets')
    .then((response) => response.json())
    .then((datas) => {
      const data = datas.data;
      const pack = data.map((s) => s.name);
      let option = `<option value="" selected>Select Pack</option>`;
      pack.forEach((m) => (option += showFilterOption(m)));
      packSelector.innerHTML = option;
    });
};
getPack();

const getRarity = () => {
  fetch('https://api.pokemontcg.io/v2/rarities')
    .then((response) => response.json())
    .then((datas) => {
      const data = datas.data;
      let option = `<option value="" defaultSelected>Select Rarity</option>`;
      data.forEach((m) => (option += showFilterOption(m)));
      const typeSelect = document.querySelector('#rarity');
      typeSelect.innerHTML = option;
    });
};
getRarity();

const showFilterOption = (m) => {
  return `<option value="${m}">${m}</option>`;
};

// Filter Selector
const typeSelector = document.querySelector('#type');
const superTypeSelector = document.querySelector('#supertype');
const subTypeSelector = document.querySelector('#subtype');
const packSelector = document.querySelector('#pack');

const clearFilter = () => {
  getType();
  getSuperType();
  getSubType();
  getPack();
  getRarity();
};

const clearFilterBtn = document.querySelector('.clear-filter');
clearFilterBtn.addEventListener('click', () => {
  clearFilter();
});
