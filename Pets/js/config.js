const API_BASE_URL = '';
const PETS_STORAGE_KEY = 'pawhaven.pets.v3';

const DEFAULT_PETS = [
  { id: 'pet-001', name: 'Milo', animalType: 'Cat', breed: 'Tabby Mix', age: 4, gender: 'Male', description: 'A gentle lap cat who loves sunny windows and quiet company.', image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=900&q=80', status: 'Available', createdAt: '2026-01-12' },
  { id: 'pet-002', name: 'Sunny', animalType: 'Bird', breed: 'Parakeet', age: 1, gender: 'Female', description: 'A bright, curious parakeet who enjoys songs and friendly voices.', image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=900&q=80', status: 'Available', createdAt: '2026-02-08' },
  { id: 'pet-003', name: 'Pip', animalType: 'Hamster', breed: 'Syrian Hamster', age: 1, gender: 'Male', description: 'A tiny explorer with a big personality and a love of tunnels.', image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80', status: 'Pending', createdAt: '2026-02-19' },
  { id: 'pet-004', name: 'Buddy', animalType: 'Dog', breed: 'Labrador Mix', age: 2, gender: 'Male', description: 'An affectionate, playful pup who is always ready for an adventure.', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80', status: 'Available', createdAt: '2026-03-01' },
  { id: 'pet-005', name: 'Bunny', animalType: 'Rabbit', breed: 'Mini Lop', age: 1, gender: 'Female', description: 'A soft and sweet rabbit who enjoys gentle attention and fresh greens.', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=80', status: 'Available', createdAt: '2026-03-07' }
];

function readPets() {
  try {
    const saved = localStorage.getItem(PETS_STORAGE_KEY);
    if (!saved) {
      writePets(DEFAULT_PETS);
      return [...DEFAULT_PETS];
    }
    const pets = JSON.parse(saved);
    if (!Array.isArray(pets)) return [...DEFAULT_PETS];

    const savedIds = new Set(pets.map((pet) => pet.id));
    const missingDefaults = DEFAULT_PETS.filter((pet) => !savedIds.has(pet.id));
    const normalizedPets = pets.map((pet) => {
      const defaultPet = DEFAULT_PETS.find((item) => item.id === pet.id);
      return {
        ...pet,
        description: pet.description || defaultPet?.description || `${pet.name} is a ${pet.breed || pet.animalType} with a distinct personality.`
      };
    });
    const restoredPets = [...normalizedPets, ...missingDefaults];
    if (missingDefaults.length || restoredPets.some((pet, index) => pet.description !== pets[index]?.description)) {
      writePets(restoredPets);
    }
    return restoredPets;
  } catch {
    return [...DEFAULT_PETS];
  }
}

function writePets(pets) {
  localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(pets));
}

async function requestPets(path = '', options = {}) {
  if (!API_BASE_URL) return readPets();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) throw new Error('Request failed');
  return response.status === 204 ? null : response.json();
}

function imageForType(type) {
  const images = {
    Dog: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
    Cat: 'https://images.unsplash.com/photo-1511044568932-338cda765e62?auto=format&fit=crop&w=900&q=80',
    Bird: 'https://images.unsplash.com/photo-1534189642739-7a16bc56a494?auto=format&fit=crop&w=900&q=80',
    Hamster: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80',
    Rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=80'
  };
  return images[type] || images.Dog;
}

function showState(element, message, kind = 'info') {
  if (!element) return;
  element.textContent = message;
  element.className = `state-message ${kind}`;
  element.classList.remove('hidden');
}

function hideState(element) {
  if (element) element.classList.add('hidden');
}
