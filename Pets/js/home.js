document.addEventListener('DOMContentLoaded', async () => {
  const recent = document.getElementById('recentPets');
  const state = document.getElementById('homeState');
  if (!recent) return;

  try {
    const pets = await requestPets();
    hideState(state);
    recent.innerHTML = pets.slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 3).map((pet) => `
      <article class="pet-card compact-card">
        <img src="${pet.image}" alt="${pet.name}" loading="lazy">
        <div class="pet-card-content"><span class="status-${pet.status.toLowerCase()}">${pet.status}</span><h3>${pet.name}</h3><p>${pet.animalType} · ${pet.breed}</p><p class="pet-description">${pet.description}</p></div>
      </article>`).join('');
  } catch {
    showState(state, "Couldn't reach the server. Please try again.", 'error');
  }
});
