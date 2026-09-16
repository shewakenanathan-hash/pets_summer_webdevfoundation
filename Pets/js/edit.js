document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('editPetsList');
  const loading = document.getElementById('editLoading');
  const error = document.getElementById('editError');
  const status = document.getElementById('editStatus');
  if (!list) return;
  let pets;
  try { showState(loading, 'Loading pet profile...', 'loading'); pets = await requestPets(); hideState(loading); } catch { hideState(loading); showState(error, "Couldn't reach the server. Please try again.", 'error'); return; }
  const selectedId = new URLSearchParams(window.location.search).get('id');
  pets = pets.filter((pet) => pet.id === selectedId);
  if (!pets.length) {
    showState(error, 'Choose a pet from Browse pets before opening the edit page.', 'empty');
    return;
  }
  const render = () => { list.innerHTML = pets.map((pet) => `<article class="edit-card" data-pet-id="${pet.id}"><div class="edit-card-image"><img src="${pet.image}" alt="${pet.name}"><span class="image-status status-${pet.status.toLowerCase()}">${pet.status}</span></div><div class="edit-card-fields"><div class="edit-grid"><label>Name<input class="edit-name" value="${pet.name}"><small class="field-error"></small></label><label>Animal type<select class="edit-animal"><option ${pet.animalType === 'Dog' ? 'selected' : ''}>Dog</option><option ${pet.animalType === 'Cat' ? 'selected' : ''}>Cat</option><option ${pet.animalType === 'Bird' ? 'selected' : ''}>Bird</option><option ${pet.animalType === 'Hamster' ? 'selected' : ''}>Hamster</option><option ${pet.animalType === 'Rabbit' ? 'selected' : ''}>Rabbit</option></select></label><label>Breed<input class="edit-breed" value="${pet.breed}"><small class="field-error"></small></label><label>Age<input type="number" min="0" class="edit-age" value="${pet.age}"><small class="field-error"></small></label><label>Gender<select class="edit-gender"><option ${pet.gender === 'Female' ? 'selected' : ''}>Female</option><option ${pet.gender === 'Male' ? 'selected' : ''}>Male</option></select></label><label>Status<select class="edit-status"><option ${pet.status === 'Available' ? 'selected' : ''}>Available</option><option ${pet.status === 'Pending' ? 'selected' : ''}>Pending</option><option ${pet.status === 'Adopted' ? 'selected' : ''}>Adopted</option></select></label><label class="edit-description-field">Description<textarea class="edit-description" rows="4">${pet.description || ''}</textarea><small class="field-error"></small></label><label>Image URL<input type="url" class="edit-image" value="${pet.image}"><small class="field-error"></small></label></div><div class="edit-actions"><button class="btn btn-primary save-pet">Save changes</button><button class="btn btn-outline delete-pet">Delete</button></div><div class="confirm-panel hidden"><p>Delete ${pet.name}? This cannot be undone.</p><button class="btn btn-danger confirm-delete">Delete permanently</button><button class="btn btn-quiet cancel-delete">Keep pet</button></div></div></article>`).join(''); };
  render();
  list.addEventListener('click', (event) => {
    const card = event.target.closest('[data-pet-id]'); if (!card) return;
    const pet = pets.find((item) => item.id === card.dataset.petId); if (!pet) return;
    if (event.target.closest('.delete-pet')) { card.querySelector('.confirm-panel').classList.remove('hidden'); event.target.disabled = true; return; }
    if (event.target.closest('.cancel-delete')) { card.querySelector('.confirm-panel').classList.add('hidden'); card.querySelector('.delete-pet').disabled = false; return; }
    if (event.target.closest('.confirm-delete')) { pets = pets.filter((item) => item.id !== pet.id); writePets(pets); render(); showState(status, `${pet.name} was deleted.`, 'success'); return; }
    if (event.target.closest('.save-pet')) {
      const values = { name: card.querySelector('.edit-name').value.trim(), animalType: card.querySelector('.edit-animal').value, breed: card.querySelector('.edit-breed').value.trim(), description: card.querySelector('.edit-description').value.trim(), age: Number(card.querySelector('.edit-age').value), gender: card.querySelector('.edit-gender').value, status: card.querySelector('.edit-status').value, image: card.querySelector('.edit-image').value.trim() };
      const errors = card.querySelectorAll('.field-error'); errors.forEach((item) => { item.textContent = ''; });
      const messages = [!values.name ? 'Name is required.' : !/^[A-Za-zÀ-ÿ]+(?:[ '\u0027-][A-Za-zÀ-ÿ]+)*$/.test(values.name) ? 'Name can only contain letters, spaces, apostrophes, and hyphens.' : '', !values.breed ? 'Breed is required.' : '', !values.description ? 'Description is required.' : '', Number.isNaN(values.age) || values.age < 0 ? 'Age must be non-negative.' : '', (() => { try { return !['http:', 'https:'].includes(new URL(values.image).protocol); } catch { return true; } })() ? 'Enter a valid image URL.' : ''];
      messages.forEach((message, index) => { if (message) errors[index].textContent = message; }); if (messages.some(Boolean)) return;
      Object.assign(pet, values); writePets(pets); render(); showState(status, `${pet.name} was saved.`, 'success');
    }
  });
});
