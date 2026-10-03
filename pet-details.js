const id = new URLSearchParams(location.search).get("id");

const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const details = document.getElementById("details");
const viewMode = document.getElementById("viewMode");
const editForm = document.getElementById("editForm");
const confirmPanel = document.getElementById("confirmPanel");

let currentPet = null;

document.getElementById("menuButton").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("show");
});

function showError(text) {
  loading.classList.add("hidden");
  errorBox.textContent = text;
  errorBox.classList.remove("hidden");
}

function statusClass(status) {
  return status.toLowerCase().replace(" ", "-");
}

function displayPet(pet) {
  document.getElementById("petImage").src = pet.imageUrl;
  document.getElementById("petImage").alt = pet.name;
  document.getElementById("petName").textContent = pet.name;
  document.getElementById("petBreed").textContent = pet.breed || pet.species;
  document.getElementById("petSpecies").textContent = pet.species;
  document.getElementById("petAge").textContent = `${pet.age} year${pet.age == 1 ? "" : "s"}`;
  document.getElementById("petGender").textContent = pet.gender || "Unknown";
  document.getElementById("petSize").textContent = pet.size || "Medium";
  document.getElementById("petDescription").textContent = pet.description;

  const badge = document.getElementById("petStatus");
  badge.textContent = pet.status || "Available";
  badge.className = `status-badge ${statusClass(pet.status || "Available")}`;

  document.getElementById("adoptButton").disabled = pet.status === "Adopted";
  document.getElementById("adoptButton").textContent =
    pet.status === "Adopted" ? "Already adopted" : "Mark as adopted";
}

async function loadPet() {
  if (!id) {
    showError("No pet ID was provided in the URL.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/pets/${encodeURIComponent(id)}`);
    if (!response.ok) throw new Error("Pet not found.");
    currentPet = await response.json();
    displayPet(currentPet);
    loading.classList.add("hidden");
    details.classList.remove("hidden");
  } catch (error) {
    showError(error.message || "Couldn't reach the server.");
  }
}

function fillEditForm() {
  document.getElementById("editName").value = currentPet.name || "";
  document.getElementById("editSpecies").value = currentPet.species || "Other";
  document.getElementById("editBreed").value = currentPet.breed || "";
  document.getElementById("editAge").value = currentPet.age;
  document.getElementById("editGender").value = currentPet.gender || "Unknown";
  document.getElementById("editSize").value = currentPet.size || "Medium";
  document.getElementById("editImageUrl").value = currentPet.imageUrl || "";
  document.getElementById("editDescription").value = currentPet.description || "";
  document.getElementById("editStatus").value = currentPet.status || "Available";
  updateEditPreview();
}

function updateEditPreview() {
  const input = document.getElementById("editImageUrl");
  const preview = document.getElementById("editImagePreview");
  try {
    const url = new URL(input.value.trim());
    if (url.protocol === "http:" || url.protocol === "https:") {
      preview.src = url.href;
      preview.classList.remove("hidden");
    } else preview.classList.add("hidden");
  } catch {
    preview.classList.add("hidden");
  }
}

document.getElementById("editButton").addEventListener("click", () => {
  fillEditForm();
  viewMode.classList.add("hidden");
  editForm.classList.remove("hidden");
});

document.getElementById("cancelEditButton").addEventListener("click", () => {
  editForm.classList.add("hidden");
  viewMode.classList.remove("hidden");
});

document.getElementById("editImageUrl").addEventListener("input", updateEditPreview);

function editUrlIsValid(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateEdit() {
  document.querySelectorAll("#editForm .field-error").forEach(item => item.textContent = "");
  let valid = true;

  const name = document.getElementById("editName").value.trim();
  const species = document.getElementById("editSpecies").value;
  const age = document.getElementById("editAge").value;
  const image = document.getElementById("editImageUrl").value.trim();
  const description = document.getElementById("editDescription").value.trim();

  if (!name) {
    document.getElementById("editNameError").textContent = "Name is required.";
    valid = false;
  }
  if (!species) {
    document.getElementById("editSpeciesError").textContent = "Species is required.";
    valid = false;
  }
  if (age === "" || Number(age) < 0 || !Number.isFinite(Number(age))) {
    document.getElementById("editAgeError").textContent = "Age must be 0 or greater.";
    valid = false;
  }
  if (!editUrlIsValid(image)) {
    document.getElementById("editImageUrlError").textContent = "Enter a valid image URL.";
    valid = false;
  }
  if (!description) {
    document.getElementById("editDescriptionError").textContent = "Description is required.";
    valid = false;
  }

  return valid;
}

editForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!validateEdit()) return;

  const saveButton = document.getElementById("saveButton");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  const updated = {
    name: document.getElementById("editName").value.trim(),
    species: document.getElementById("editSpecies").value,
    breed: document.getElementById("editBreed").value.trim(),
    age: Number(document.getElementById("editAge").value),
    gender: document.getElementById("editGender").value,
    size: document.getElementById("editSize").value,
    imageUrl: document.getElementById("editImageUrl").value.trim(),
    description: document.getElementById("editDescription").value.trim(),
    status: document.getElementById("editStatus").value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/pets/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });

    if (!response.ok) throw new Error("Could not save changes.");
    currentPet = await response.json();
    displayPet(currentPet);
    editForm.classList.add("hidden");
    viewMode.classList.remove("hidden");
  } catch (error) {
    alert(error.message || "Couldn't reach the server.");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Save changes";
  }
});

document.getElementById("adoptButton").addEventListener("click", async () => {
  const button = document.getElementById("adoptButton");
  button.disabled = true;
  button.textContent = "Updating...";

  try {
    const response = await fetch(`${API_BASE_URL}/pets/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Adopted" })
    });

    if (!response.ok) throw new Error("Could not update adoption status.");
    currentPet = await response.json();
    displayPet(currentPet);
  } catch (error) {
    alert(error.message || "Couldn't reach the server.");
    button.disabled = false;
  }
});

document.getElementById("deleteButton").addEventListener("click", () => {
  confirmPanel.classList.remove("hidden");
});

document.getElementById("cancelDelete").addEventListener("click", () => {
  confirmPanel.classList.add("hidden");
});

document.getElementById("confirmDelete").addEventListener("click", async () => {
  const button = document.getElementById("confirmDelete");
  button.disabled = true;
  button.textContent = "Deleting...";

  try {
    const response = await fetch(`${API_BASE_URL}/pets/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    if (!response.ok && response.status !== 204) {
      throw new Error("Could not delete the pet.");
    }

    window.location.href = "index.html";
  } catch (error) {
    alert(error.message || "Couldn't reach the server.");
    button.disabled = false;
    button.textContent = "Yes, delete";
  }
});

loadPet();
