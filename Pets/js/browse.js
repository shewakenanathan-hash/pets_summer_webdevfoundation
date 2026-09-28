document.addEventListener('DOMContentLoaded', async () => {
  const API_URL = 'https://quiz-nydl-special.vercel.app/api/pets';

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

  // ================================
  // GET PETS FROM API
  // ================================
  async function requestPets() {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load pets: ${response.status}`);
    }

    const data = await response.json();

    // Support APIs that return:
    // [ ...pets ]
    // OR { pets: [ ...pets ] }
    // OR { data: [ ...pets ] }
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.pets)) {
      return data.pets;
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  }

  // ================================
  // UPDATE PET STATUS
  // ================================
  async function updatePetStatus(id, status) {
    const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

      body: JSON.stringify({
        status: status
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to update pet: ${response.status}`);
    }

    return await response.json();
  }

  // ================================
  // RENDER PETS
  // ================================
  const render = () => {
    const term = search
      ? search.value.trim().toLowerCase()
      : '';

    const selectedAnimal = animal
      ? animal.value
      : '';

    const selectedBreed = breed
      ? breed.value
      : '';

    let matches = pets.filter((pet) => {
      const searchableValues = [
        pet.name,
        pet.animalType,
        pet.breed,
        pet.gender,
        pet.description
      ];

      const matchesSearch = searchableValues.some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(term)
      );

      const matchesAnimal =
        !selectedAnimal ||
        pet.animalType === selectedAnimal;

      const matchesBreed =
        !selectedBreed ||
        pet.breed === selectedBreed;

      return (
        matchesSearch &&
        matchesAnimal &&
        matchesBreed
      );
    });

    // ================================
    // SORT
    // ================================
    if (sort && sort.value === 'age') {
      matches.sort(
        (a, b) =>
          Number(a.age || 0) -
          Number(b.age || 0)
      );
    } else {
      matches.sort((a, b) =>
        String(a.name || '').localeCompare(
          String(b.name || '')
        )
      );
    }

    // ================================
    // CREATE PET CARDS
    // ================================
    grid.innerHTML = matches
      .map((pet) => {
        const status = String(
          pet.status || 'Available'
        );

        const statusClass = status
          .toLowerCase()
          .replace(/\s+/g, '-');

        const image =
          pet.image ||
          imageForType(pet.animalType);

        const isAvailable =
          status.toLowerCase() === 'available';

        return `
          <article class="pet-card">

            <div class="pet-card-image">

              <img
                src="${escapeHtml(image)}"
                alt="${escapeHtml(pet.name)}"
                loading="lazy"
                onerror="this.src='${escapeHtml(
                  imageForType(pet.animalType)
                )}'"
              >

              <span
                class="image-status status-${statusClass}"
              >
                ${escapeHtml(status)}
              </span>

            </div>

            <div class="pet-card-content">

              <h3>
                ${escapeHtml(pet.name)}
              </h3>

              <p>
                <strong>
                  ${escapeHtml(pet.animalType)}
                </strong>
                ·
                ${escapeHtml(pet.breed)}
              </p>

              <p class="pet-description">
                ${escapeHtml(pet.description)}
              </p>

              <div class="pet-meta">

                <span>
                  Age: ${escapeHtml(pet.age)}
                </span>

                <span>
                  Gender: ${escapeHtml(pet.gender)}
                </span>

              </div>

              <div class="pet-actions">

                <a
                  class="btn btn-outline"
                  href="edit pets.html?id=${encodeURIComponent(
                    pet.id
                  )}"
                >
                  Edit
                </a>

                <button
                  class="btn btn-primary adopt-button"
                  data-id="${escapeHtml(pet.id)}"
                  ${!isAvailable ? 'disabled' : ''}
                >
                  ${
                    isAvailable
                      ? 'Adopt'
                      : escapeHtml(status)
                  }
                </button>

              </div>

            </div>

          </article>
        `;
      })
      .join('');

    if (matches.length) {
      hideState(empty);
    } else {
      showState(
        empty,
        'No pets match your search.',
        'empty'
      );
    }
  };

  // ================================
  // HTML ESCAPE
  // ================================
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ================================
  // LOAD PETS
  // ================================
  try {
    showState(
      loading,
      'Loading pets...',
      'loading'
    );

    pets = await requestPets();

    // ================================
    // ANIMAL TYPES
    // ================================
    const types = [
      ...new Set(
        pets
          .map((pet) => pet.animalType)
          .filter(Boolean)
      )
    ].sort();

    // ================================
    // BREEDS
    // ================================
    const breeds = [
      ...new Set(
        pets
          .map((pet) => pet.breed)
          .filter(Boolean)
      )
    ].sort();

    if (animal) {
      animal.innerHTML =
        '<option value="">All types</option>' +
        types
          .map(
            (value) =>
              `<option value="${escapeHtml(value)}">${escapeHtml(
                value
              )}</option>`
          )
          .join('');
    }

    if (breed) {
      breed.innerHTML =
        '<option value="">All breeds</option>' +
        breeds
          .map(
            (value) =>
              `<option value="${escapeHtml(value)}">${escapeHtml(
                value
              )}</option>`
          )
          .join('');
    }

    hideState(loading);

    render();

  } catch (err) {
    console.error('API error:', err);

    hideState(loading);

    showState(
      error,
      "Couldn't reach the server. Please try again.",
      'error'
    );
  }

  // ================================
  // SEARCH / FILTER EVENTS
  // ================================
  if (search) {
    search.addEventListener(
      'input',
      render
    );
  }

  if (animal) {
    animal.addEventListener(
      'change',
      render
    );
  }

  if (breed) {
    breed.addEventListener(
      'change',
      render
    );
  }

  if (sort) {
    sort.addEventListener(
      'change',
      render
    );
  }

  // ================================
  // ADOPT BUTTON
  // ================================
  grid.addEventListener(
    'click',
    async (event) => {
      const button =
        event.target.closest('.adopt-button');

      if (!button) return;

      const petId = button.dataset.id;

      const pet = pets.find(
        (item) =>
          String(item.id) === String(petId)
      );

      if (!pet) return;

      if (
        String(pet.status).toLowerCase() !==
        'available'
      ) {
        return;
      }

      const originalText =
        button.textContent;

      button.disabled = true;
      button.textContent = 'Updating...';

      try {
        // UPDATE API
        await updatePetStatus(
          petId,
          'Pending'
        );

        // Update local display after API succeeds
        pet.status = 'Pending';

        render();

      } catch (err) {
        console.error(
          'Adoption update failed:',
          err
        );

        button.disabled = false;
        button.textContent =
          originalText;

        showState(
          error,
          'Could not update the adoption status. Please try again.',
          'error'
        );
      }
    }
  );
});
