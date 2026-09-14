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
