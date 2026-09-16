document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('petsGrid');
  const empty = document.getElementById('emptyState');
  const loading = document.getElementById('loadingState');
  const error = document.getElementById('browseError');
  const search = document.getElementById('searchInput');
  const animal = document.getElementById('animalFilter');
  const breed = document.getElementById('breedFilter');
  const sort = document.getElementById('sortSelect');
  if (!grid) return;

  let pets = [];
  const render = () => {
    const term = search.value.trim().toLowerCase();
    const selectedAnimal = animal.value;
    const selectedBreed = breed.value;
    let matches = pets.filter((pet) => [pet.name, pet.animalType, pet.breed, pet.gender, pet.description].some((value) => String(value).toLowerCase().includes(term)) && (!selectedAnimal || pet.animalType === selectedAnimal) && (!selectedBreed || pet.breed === selectedBreed));
    matches.sort((a, b) => sort.value === 'age' ? a.age - b.age : a.name.localeCompare(b.name));
    grid.innerHTML = matches.map((pet) => `<article class="pet-card"><div class="pet-card-image"><img src="${pet.image}" alt="${pet.name}" loading="lazy"><span class="image-status status-${pet.status.toLowerCase()}">${pet.status}</span></div><div class="pet-card-content"><h3>${pet.name}</h3><p><strong>${pet.animalType}</strong> · ${pet.breed}</p><p class="pet-description">${pet.description}</p><div class="pet-meta"><span>Age: ${pet.age}</span><span>Gender: ${pet.gender}</span></div><div class="pet-actions"><a class="btn btn-outline" href="edit pets.html?id=${encodeURIComponent(pet.id)}">Edit</a><button class="btn btn-primary adopt-button" data-id="${pet.id}" ${pet.status !== 'Available' ? 'disabled' : ''}>${pet.status === 'Available' ? 'Adopt' : pet.status}</button></div></div></article>`).join('');
    if (matches.length) hideState(empty); else showState(empty, 'No pets match your search.', 'empty');
  };

  try {
    showState(loading, 'Loading pets...', 'loading');
    pets = await requestPets();
    const types = [...new Set(pets.map((pet) => pet.animalType))].sort();
    const breeds = [...new Set(pets.map((pet) => pet.breed))].sort();
    animal.innerHTML = '<option value="">All types</option>' + types.map((value) => `<option>${value}</option>`).join('');
    breed.innerHTML = '<option value="">All breeds</option>' + breeds.map((value) => `<option>${value}</option>`).join('');
    hideState(loading); render();
  } catch {
    hideState(loading); showState(error, "Couldn't reach the server. Please try again.", 'error');
  }

  [search, animal, breed, sort].forEach((control) => control.addEventListener(control === search ? 'input' : 'change', render));
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('.adopt-button');
    if (!button) return;
    const pet = pets.find((item) => item.id === button.dataset.id);
    if (!pet) return;
    pet.status = 'Pending'; writePets(pets); render();
  });
});
