document.addEventListener('DOMContentLoaded', async () => {
  const API_URL =
    'https://quiz-nydl-special.vercel.app/api/pets';

  const recent =
    document.getElementById('recentPets');

  const state =
    document.getElementById('homeState');

  if (!recent) return;

  // =========================
  // GET PETS FROM API
  // =========================
  async function requestPets() {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(
        `Failed to load pets (${response.status})`
      );
    }

    const data = await response.json();

    // Support:
    // [pets]
    // { pets: [...] }
    // { data: [...] }
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

  // =========================
  // ESCAPE HTML
  // =========================
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  try {
    // Show loading
    showState(
      state,
      'Loading recent pets...',
      'loading'
    );

    // Get pets from API
    const pets = await requestPets();

    // Sort newest first
    const recentPets = pets
      .slice()
      .sort((a, b) => {
        return (
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
      })
      .slice(0, 3);

    // Hide loading
    hideState(state);

    // No pets
    if (recentPets.length === 0) {
      recent.innerHTML = `
        <div class="empty-message">
          No pets have been added yet.
        </div>
      `;

      return;
    }

    // =========================
    // DISPLAY RECENT PETS
    // =========================
    recent.innerHTML = recentPets
      .map((pet) => {
        const status =
          pet.status || 'Available';

        const statusClass = String(status)
          .toLowerCase()
          .replace(/\s+/g, '-');

        return `
          <article class="pet-card compact-card">

            <img
              src="${escapeHtml(pet.image)}"
              alt="${escapeHtml(pet.name)}"
              loading="lazy"
            >

            <div class="pet-card-content">

              <span class="status-${statusClass}">
                ${escapeHtml(status)}
              </span>

              <h3>
                ${escapeHtml(pet.name)}
              </h3>

              <p>
                ${escapeHtml(pet.animalType)}
                ·
                ${escapeHtml(pet.breed)}
              </p>

              <p class="pet-description">
                ${escapeHtml(pet.description)}
              </p>

            </div>

          </article>
        `;
      })
      .join('');

  } catch (error) {
    console.error(
      'Could not load recent pets:',
      error
    );

    showState(
      state,
      "Couldn't reach the server. Please try again.",
      'error'
    );
  }
});
