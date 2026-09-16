document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('petForm');
  const status = document.getElementById('formStatus');
  const preview = document.getElementById('imagePreview');
  if (!form) return;
  const fields = ['petName', 'animalType', 'breed', 'petDescription', 'petAge', 'petGender', 'petImage'];
  const showFieldError = (id, message) => {
    const field = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);
    if (error) error.textContent = message;
    if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
  };
  const validUrl = (value) => { try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } };
  document.getElementById('petImage').addEventListener('input', (event) => { preview.src = event.target.value || imageForType(document.getElementById('animalType').value); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    fields.forEach((id) => showFieldError(id, ''));
    const values = Object.fromEntries(fields.map((id) => [id, document.getElementById(id).value.trim()]));
    let valid = true;
    if (!values.petName) { showFieldError('petName', 'Name is required.'); valid = false; }
    else if (!/^[A-Za-zÀ-ÿ]+(?:[ '\u0027-][A-Za-zÀ-ÿ]+)*$/.test(values.petName)) { showFieldError('petName', 'Name can only contain letters, spaces, apostrophes, and hyphens.'); valid = false; }
    if (!values.animalType) { showFieldError('animalType', 'Choose an animal type.'); valid = false; }
    if (!values.breed) { showFieldError('breed', 'Breed is required.'); valid = false; }
    if (!values.petDescription) { showFieldError('petDescription', 'Add a short description.'); valid = false; }
    if (values.petAge === '' || Number.isNaN(Number(values.petAge)) || Number(values.petAge) < 0) { showFieldError('petAge', 'Age must be a non-negative number.'); valid = false; }
    if (!values.petGender) { showFieldError('petGender', 'Choose a gender.'); valid = false; }
    if (!validUrl(values.petImage)) { showFieldError('petImage', 'Enter a valid image URL.'); valid = false; }
    if (!valid) return;
    const pets = readPets();
    pets.push({ id: `pet-${Date.now()}`, name: values.petName, animalType: values.animalType, breed: values.breed, description: values.petDescription, age: Number(values.petAge), gender: values.petGender, image: values.petImage, status: 'Available', createdAt: new Date().toISOString() });
    writePets(pets); form.reset(); preview.src = imageForType('Dog'); showState(status, `${values.petName} was added successfully.`, 'success');
  });
});
