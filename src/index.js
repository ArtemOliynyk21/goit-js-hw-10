import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(countrySearch, DEBOUNCE_DELAY));

function countrySearch(evt) {
  const name = refs.input.value.trim();
  if (!name) {
    return;
  }

  fetchCountries(name)
    .then(renderCountries)
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
  
}

function renderCountries(countries) {
  clearSearch();
  if (countries.length > 10) {
    clearSearch();
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countries.length >= 2 && countries.length <= 10) {
    renderCountriesList(countries);
    return;
  }
  if (countries.length === 1) {
    renderCountryInfo(countries);
  }
}

function renderCountriesList(countries) {
  const markupList = countries
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
  <img class="country-item__flag" src="${flags.svg}" alt="Flag of ${name.official}"> 
  <h1 class="country-item__name">${name.official}</h1>
</li>`;
    })
    .join('');
  refs.countryList.innerHTML = markupList;
  refs.countryInfo.innerHTML = '';
}

function renderCountryInfo(countries) {
  const markupInfo = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="country-image">
        <img class="country-flag__img" src="${flags.svg}" alt="Flag of ${
        name.official
      }">${name.official}
      </div>
<ul class="country-card__list">
  <li class="country-card__item">
    <p><b>Capital:</b> ${capital}</p>
  </li>
  <li class="country-card__item">
    <p><b>Population:</b> ${population}</p>
  </li>
  <li class="country-card__item">
    <p><b>Languages:</b> ${Object.values(languages)}</p>
  </li>
</ul>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markupInfo;
  refs.countryList.innerHTML = '';
}

function clearSearch() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
