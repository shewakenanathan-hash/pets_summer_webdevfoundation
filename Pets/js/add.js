document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://quiz-nydl-special.vercel.app/api/pets';

  const form = document.getElementById('petForm');
  const status = document.getElementById('formStatus');
  const preview = document.getElementById('imagePreview');

  if (!form) return;

  const fields = [
    'petName',
    'animalType',
    'breed',
    'petDescription',
    'petAge',
    'petGender',
    'petImage'
  ];

  const showFieldError = (id, message) => {
    const field = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);

    if (error) {
      error.textContent = message;
    }

    if (field) {
      field.setAttribute(
        'aria-invalid',
        message ? 'true' : 'false'
      );
    }
  };

  const validUrl = (value) => {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  };

  // Preview image while typing
  const imageInput = document.getElementById('petImage');

  if (imageInput) {
    imageInput.addEventListener('input', (event) => {
      const animalType =
        document.getElementById('animalType')?.value || 'Dog';

      preview.src =
        event.target.value.trim() ||
        imageForType(animalType);
    });
  }

  // Submit form
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    fields.forEach((id) => {
      showFieldError(id, '');
    });

    const values = Object.fromEntries(
      fields.map((id) => {
        const element = document.getElementById(id);
        return [
          id,
          element ? element.value.trim() : ''
        ];
      })
    );

    let valid = true;

    // Name
    if (!values.petName) {
      showFieldError(
        'petName',
        'Name is required.'
      );
      valid = false;
    } else if (
      !/^[A-Za-zÀ-ÿ]+(?:[ '\u0027-][A-Za-zÀ-ÿ]+)*$/.test(
        values.petName
      )
    ) {
      showFieldError(
        'petName',
        'Name can only contain letters, spaces, apostrophes, and hyphens.'
      );
      valid = false;
    }

    // Animal type
    if (!values.animalType) {
      showFieldError(
        'animalType',
        'Choose an animal type.'
      );
      valid = false;
    }

    // Breed
    if (!values.breed) {
      showFieldError(
        'breed',
        'Breed is required.'
      );
      valid = false;
    }

    // Description
    if (!values.petDescription) {
      showFieldError(
        'petDescription',
        'Add a short description.'
      );
      valid = false;
    }

    // Age
    if (
      values.petAge === '' ||
      Number.isNaN(Number(values.petAge)) ||
      Number(values.petAge) < 0
    ) {
      showFieldError(
        'petAge',
        'Age must be a non-negative number.'
      );
      valid = false;
    }

    // Gender
    if (!values.petGender) {
      showFieldError(
        'petGender',
        'Choose a gender.'
      );
      valid = false;
    }

    // Image
    if (!validUrl(values.petImage)) {
      showFieldError(
        'petImage',
        'Enter a valid image URL.'
      );
      valid = false;
    }

    if (!valid) return;

    // Show loading state
    showState(
      status,
      'Adding pet...',
      'info'
    );

    // Data sent to API
    const pet = {
      name: values.petName,
      animalType: values.animalType,
      breed: values.breed,
      description: values.petDescription,
      age: Number(values.petAge),
      gender: values.petGender,
      image: values.petImage,
      status: 'Available'
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },

        body: JSON.stringify(pet)
      });

      if (!response.ok) {
        let errorMessage =
          `API request failed (${response.status})`;

        try {
          const errorData = await response.json();

          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // API did not return JSON
        }

        throw new Error(errorMessage);
      }

      const savedPet = await response.json();

      // Reset form
      form.reset();

      if (preview) {
        preview.src = imageForType('Dog');
      }

      showState(
        status,
        `${values.petName} was added successfully.`,
        'success'
      );

      console.log('Pet saved to API:', savedPet);

    } catch (error) {
      console.error('Error adding pet:', error);

      showState(
        status,
        `Could not add pet: ${error.message}`,
        'error'
      );
    }
  });
});
