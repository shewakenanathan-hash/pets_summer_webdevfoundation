const petGrid = document.getElementById("petGrid");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const empty = document.getElementById("empty");
const petCount = document.getElementById("petCount");
const filterForm = document.getElementById("filterForm");
const searchInput = document.getElementById("searchInput");
const speciesFilter = document.getElementById("speciesFilter");
const statusFilter = document.getElementById("statusFilter");

document.getElementById("menuButton").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("show");
});

function showState(state) {
  loading.classList.add("hidden");
  errorBox.classList.add("hidden");
  empty.classList.add("hidden");
  if (state === "loading") loading.classList.remove("hidden");
  if (state === "error") errorBox.classList.remove("hidden");
  if (state === "empty") empty.classList.remove("hidden");
}

function statusClass(status) {
  return status.toLowerCase().replace(" ", "-");
}

function createPetCard(pet) {
  const card = document.createElement("article");
  card.className = "pet-card";

  const safeImage = pet.imageUrl || "https://picsum.photos/seed/pawhaven/640/480";

  card.innerHTML = `
    <div class="card-image-wrap">
      <img src="${safeImage}" alt="${pet.name}" class="card-image"
           onerror="this.src='https://picsum.photos/seed/pawhaven/640/480'">
      <span class="status-badge ${statusClass(pet.status || "Available")}">${pet.status || "Available"}</span>
    </div>
    <div class="card-body">
      <h3>${pet.name}</h3>
      <p class="breed">${pet.breed || pet.species}</p>
      <p>${pet.age} year${pet.age == 1 ? "" : "s"} · ${pet.gender || "Unknown"}</p>
      <a class="card-link" href="pet-details.html?id=${encodeURIComponent(pet._id)}">View profile →</a>
    </div>
  `;
  return card;
}

async function loadPets() {
  showState("loading");
  petGrid.innerHTML = "";

  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set("search", searchInput.value.trim());
  if (speciesFilter.value) params.set("species", speciesFilter.value);
  if (statusFilter.value) params.set("status", statusFilter.value);

  try {
    const response = await fetch(`${API_BASE_URL}/pets?${params.toString()}`);
    if (!response.ok) throw new Error("Couldn't reach the server.");

    const pets = await response.json();
    const list = Array.isArray(pets) ? pets : pets.pets || [];

    loading.classList.add("hidden");
    petCount.textContent = `${list.length} pet${list.length === 1 ? "" : "s"}`;

    if (list.length === 0) {
      showState("empty");
      return;
    }

    petGrid.innerHTML = "";
    list.forEach(pet => petGrid.appendChild(createPetCard(pet)));
  } catch (error) {
    loading.classList.add("hidden");
    errorBox.textContent = error.message || "Couldn't reach the server. Please try again.";
    showState("error");
  }
}

filterForm.addEventListener("submit", event => {
  event.preventDefault();
  loadPets();
});

loadPets();
