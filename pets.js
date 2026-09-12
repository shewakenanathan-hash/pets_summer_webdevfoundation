const STORAGE_KEY = 'pawhaven.pets.v1';

const defaultPets = [
  {
    id: 'pet-001',
    name: 'Milo',
    animalType: 'Cat',
    breed: 'Tabby Mix',
    age: 4,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1511044568932-338cda765e62?auto=format&fit=crop&w=900&q=80',
    status: 'Available'
  },
  {
    id: 'pet-002',
    name: 'Sunny',
    animalType: 'Bird',
    breed: 'Parakeet',
    age: 1,
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1534189642739-7a16bc56a494?auto=format&fit=crop&w=900&q=80',
    status: 'Available'
  },
  {
    id: 'pet-003',
    name: 'Pip',
    animalType: 'Hamster',
    breed: 'Syrian Hamster',
    age: 1,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80',
    status: 'Pending'
  }
];

function getPets() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPets));
    return [...defaultPets];
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPets));
      return [...defaultPets];
    }
    return parsed;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPets));
    return [...defaultPets];
  }
}

function setPets(pets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
}

function readTitleCase(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function initBrowsePage() {
  const pets = getPets();
  const grid = document.getElementById('petsGrid');
  const empty = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const animalFilter = document.getElementById('animalFilter');
  const breedFilter = document.getElementById('breedFilter');
  const sortSelect = document.getElementById('sortSelect');

  function animalOptions() {
    const options = ['All types'];
    pets.forEach((pet) => {
      if (!options.includes(pet.animalType)) {
        options.push(pet.animalType);
      }
    });
    return options;
  }

  function loadFilters() {
    const petTypes = animalOptions();
    animalFilter.innerHTML = petTypes
      .map((type) => `<option value="${type}">${type === 'All types' ? 'All types' : type}</option>`)
      .join('');

    const breeds = ['All breeds'];
    pets.forEach((pet) => {
      if (!breeds.includes(pet.breed)) {
        breeds.push(pet.breed);
      }
    });
    breedFilter.innerHTML = breeds
      .map((breed) => `<option value="${breed}">${breed === 'All breeds' ? 'All breeds' : breed}</option>`)
      .join('');
  }

  function renderPets() {
    const search = (searchInput.value || '').toLowerCase();
    const animal = animalFilter.value || 'All types';
    const breed = breedFilter.value || 'All breeds';
    const sort = sortSelect.value || 'name';

    let filtered = pets.filter((pet) => {
      const matchesSearch = [pet.name, pet.animalType, pet.breed, pet.gender].some((field) =>
        (field || '').toLowerCase().includes(search)
      );
      const matchesAnimal = animal === 'All types' || pet.animalType === animal;
      const matchesBreed = breed === 'All breeds' || pet.breed === breed;
      return matchesSearch && matchesAnimal && matchesBreed;
    });

    if (sort === 'age') {
      filtered = filtered.sort((a, b) => a.age - b.age);
    } else {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (empty) {
        empty.classList.remove('hidden');
        empty.innerHTML = '<p>No pets match your search.</p>';
      }
      return;
    }

    if (empty) {
      empty.classList.add('hidden');
    }

    grid.innerHTML = filtered.map(createPetCard).join('');
  }

  loadFilters();
  renderPets();

  if (searchInput) {
    searchInput.addEventListener('input', renderPets);
  }

  if (animalFilter) {
    animalFilter.addEventListener('change', renderPets);
  }

  if (breedFilter) {
    breedFilter.addEventListener('change', renderPets);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', renderPets);
  }

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('.adopt-button');
    if (!button) return;

    const petId = button.getAttribute('data-id');
    const currentPets = getPets();
    const selected = currentPets.find((pet) => pet.id === petId);
    if (!selected) return;

    selected.status = 'Pending';
    setPets(currentPets);
    renderPets();
  });
}

function createPetCard(pet) {
  return `<article class="pet-card">
    <img src="${pet.image}" alt="${pet.name}" onerror="this.src='https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80'">
    <div class="pet-card-content">
      <span class="status-${pet.status.toLowerCase()}">${pet.status}</span>
      <h3>${pet.name}</h3>
      <p><strong>${pet.animalType}</strong> • ${pet.breed}</p>
      <div class="pet-meta">
        <span>Age: ${pet.age}</span>
        <span>Gender: ${pet.gender}</span>
      </div>
      <div class="pet-actions">
        <a class="btn btn-outline" href="edit pets.html?id=${pet.id}">Edit</a>
        <button class="btn btn-primary adopt-button" data-id="${pet.id}">Adopt</button>
      </div>
    </div>
  </article>`;
}

function initAddPage() {
  const form = document.getElementById('petForm');
  const error = document.getElementById('formError');
  const success = document.getElementById('successMessage');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {
      name: readTitleCase(document.getElementById('petName').value),
      animalType: readTitleCase(document.getElementById('animalType').value),
      breed: readTitleCase(document.getElementById('breed').value),
      age: Number(document.getElementById('petAge').value),
      gender: document.getElementById('petGender').value
    };

    if (!data.name || !data.animalType || !data.breed || !data.age || !data.gender) {
      showError(error, 'Please complete all five fields before adding a pet.');
      return;
    }

    if (Number.isNaN(data.age) || data.age < 0) {
      showError(error, 'Age must be a valid number.');
      return;
    }

    const pets = getPets();
    const newPet = {
      id: `pet-${Date.now()}`,
      name: data.name,
      animalType: data.animalType,
      breed: data.breed,
      age: data.age,
      gender: data.gender,
      image: defaultImageForType(data.animalType),
      status: 'Available'
    };

    pets.push(newPet);
    setPets(pets);

    form.reset();
    hideError(error);
    showSuccess(success, `${data.name} was added to PawHaven.`);
  });
}

function initEditPage() {
  const list = document.getElementById('editPetsList');
  const pets = getPets();

  if (!list) return;

  list.innerHTML = pets.map((pet) => `
    <article class="edit-card" data-pet-id="${pet.id}">
      <div class="edit-card-image">
        <img src="${pet.image}" alt="">
      </div>
      <div class="edit-card-fields">
        <div class="edit-grid">
          <label>Name<input type="text" class="edit-name" value="${pet.name}" required></label>
          <label>Animal Type<select class="edit-animal" required>
            <option ${pet.animalType === 'Cat' ? 'selected' : ''}>Cat</option>
            <option ${pet.animalType === 'Bird' ? 'selected' : ''}>Bird</option>
            <option ${pet.animalType === 'Hamster' ? 'selected' : ''}>Hamster</option>
          </select></label>
          <label>Breed<input type="text" class="edit-breed" value="${pet.breed}" required></label>
          <label>Age<input type="number" min="0" class="edit-age" value="${pet.age}" required></label>
          <label>Gender<select class="edit-gender" required>
            <option ${pet.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option ${pet.gender === 'Male' ? 'selected' : ''}>Male</option>
          </select></label>
        </div>
        <div class="edit-actions">
          <button class="btn btn-primary save-pet" data-id="${pet.id}">Save</button>
          <button class="btn btn-outline delete-pet" data-id="${pet.id}">Delete</button>
        </div>
      </div>
    </article>
  `).join('');

  list.addEventListener('click', (event) => {
    const target = event.target;
    const card = target.closest('[data-pet-id]');
    if (!card) return;

    const petId = card.getAttribute('data-pet-id');
    const pets = getPets();
    const pet = pets.find((item) => item.id === petId);
    if (!pet) return;

    if (target.classList.contains('delete-pet')) {
      const updated = pets.filter((item) => item.id !== petId);
      setPets(updated);
      card.remove();
      return;
    }

    if (target.classList.contains('save-pet')) {
      const cardEl = target.closest('[data-pet-id]');
      const name = cardEl.querySelector('.edit-name').value.trim();
      const animalType = cardEl.querySelector('.edit-animal').value.trim();
      const breed = cardEl.querySelector('.edit-breed').value.trim();
      const age = Number(cardEl.querySelector('.edit-age').value);
      const gender = cardEl.querySelector('.edit-gender').value;

      if (!name || !animalType || !breed || !gender || Number.isNaN(age) || age < 0) {
        showError(document.getElementById('editError'), 'All fields must be filled with valid values.');
        return;
      }

      pet.name = name;
      pet.animalType = animalType;
      pet.breed = breed;
      pet.age = age;
      pet.gender = gender;
      pet.image = pet.image || defaultImageForType(animalType);

      setPets(pets);
      showSuccess(document.getElementById('editSuccess'), `${name} was saved.`);
    }
  });
}

function defaultImageForType(animalType) {
  const type = (animalType || '').toLowerCase();
  if (type === 'dog') return 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80';
  if (type === 'cat') return 'https://images.unsplash.com/photo-1511044568932-338cda765e62?auto=format&fit=crop&w=900&q=80';
  if (type === 'bird') return 'https://images.unsplash.com/photo-1534189642739-7a16bc56a494?auto=format&fit=crop&w=900&q=80';
  if (type === 'hamster') return 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80';
  return 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80';
}

function showError(error, message) {
  if (!error) return;
  error.textContent = message;
  error.classList.remove('hidden');
}

function hideError(error) {
  if (!error) return;
  error.textContent = '';
  error.classList.add('hidden');
}

function showSuccess(success, message) {
  if (!success) return;
  success.textContent = message;
  success.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'browse') {
    initBrowsePage();
  }

  if (page === 'add') {
    initAddPage();
  }

  if (page === 'edit') {
    initEditPage();
  }
});
