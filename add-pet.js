const form = document.getElementById("petForm");
const message = document.getElementById("formMessage");
const submitButton = document.getElementById("submitButton");
const imageUrl = document.getElementById("imageUrl");
const imagePreview = document.getElementById("imagePreview");

document.getElementById("menuButton").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("show");
});

function setError(id, text) {
  document.getElementById(id).textContent = text;
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach(item => item.textContent = "");
  message.className = "form-message hidden";
  message.textContent = "";
}

function validUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateForm() {
  clearErrors();
  let valid = true;

  const name = document.getElementById("name").value.trim();
  const species = document.getElementById("species").value;
  const age = document.getElementById("age").value;
  const description = document.getElementById("description").value.trim();
  const image = imageUrl.value.trim();

  if (!name) {
    setError("nameError", "Name is required.");
    valid = false;
  }
  if (!species) {
    setError("speciesError", "Please choose a species.");
    valid = false;
  }
  if (age === "" || Number(age) < 0 || !Number.isFinite(Number(age))) {
    setError("ageError", "Age must be 0 or greater.");
    valid = false;
  }
  if (!description) {
    setError("descriptionError", "Description is required.");
    valid = false;
  }
  if (!validUrl(image)) {
    setError("imageUrlError", "Enter a valid image URL.");
    valid = false;
  }

  return valid;
}

imageUrl.addEventListener("input", () => {
  const value = imageUrl.value.trim();
  if (validUrl(value)) {
    imagePreview.src = value;
    imagePreview.classList.remove("hidden");
  } else {
    imagePreview.classList.add("hidden");
  }
});

form.addEventListener("submit", async event => {
  event.preventDefault();

  if (!validateForm()) return;

  const pet = {
    name: document.getElementById("name").value.trim(),
    species: document.getElementById("species").value,
    breed: document.getElementById("breed").value.trim(),
    age: Number(document.getElementById("age").value),
    gender: document.getElementById("gender").value,
    size: document.getElementById("size").value,
    description: document.getElementById("description").value.trim(),
    imageUrl: imageUrl.value.trim(),
    status: document.getElementById("status").value
  };

  submitButton.disabled = true;
  submitButton.textContent = "Adding...";

  try {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pet)
    });

    if (!response.ok) {
      let serverMessage = "Could not add the pet.";
      try {
        const data = await response.json();
        serverMessage = data.error || serverMessage;
      } catch {}
      throw new Error(serverMessage);
    }

    const createdPet = await response.json();
    window.location.href = `pet-details.html?id=${encodeURIComponent(createdPet._id)}`;
  } catch (error) {
    message.className = "form-message error-message";
    message.textContent = error.message || "Couldn't reach the server.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Add Pet";
  }
});
