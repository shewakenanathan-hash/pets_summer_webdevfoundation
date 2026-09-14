const STORAGE_KEY = 'pawhaven.pets.v1';

const defaultPets = [
  {
    id: 'pet-001',
    name: 'Milo',
    animalType: 'Cat',
    breed: 'Tabby Mix',
    age: 4,
    gender: 'Male',
    image: 'data:image/jpeg;base64,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',
    status: 'Available'
  },
  {
    id: 'pet-002',
    name: 'Sunny',
    animalType: 'Bird',
    breed: 'Parakeet',
    age: 1,
    gender: 'Female',
    image: 'data:image/jpeg;base64,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',
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
