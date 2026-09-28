const API_URL="https://quiz-nydl-special.vercel.app/api/pets";
let pets=[];

document.addEventListener("DOMContentLoaded",loadPets);

async function loadPets(){
  const grid=document.getElementById("petsGrid"),state=document.getElementById("browseState");
  try{
    const response=await fetch(API_URL,{method:"GET",headers:{"Accept":"application/json"}});
    if(!response.ok)throw new Error(`API GET failed: ${response.status}`);
    const data=await response.json();
    pets=Array.isArray(data)?data:[];
    fillFilters();
    state.hidden=true;
    renderPets();
  }catch(error){
    state.hidden=false; state.className="message error";
    state.textContent="Could not load pets from the API.";
    console.error("PawHaven API:",error);
  }
}

function fillFilters(){
  const animal=document.getElementById("animalFilter"),breed=document.getElementById("breedFilter");
  [...new Set(pets.map(p=>p.species).filter(Boolean))].sort().forEach(v=>animal.insertAdjacentHTML("beforeend",`<option value="${safe(v)}">${safe(v)}</option>`));
  [...new Set(pets.map(p=>p.breed).filter(Boolean))].sort().forEach(v=>breed.insertAdjacentHTML("beforeend",`<option value="${safe(v)}">${safe(v)}</option>`));
}

function renderPets(){
  const grid=document.getElementById("petsGrid"),q=document.getElementById("searchInput").value.toLowerCase();
  const animal=document.getElementById("animalFilter").value,breed=document.getElementById("breedFilter").value,sort=document.getElementById("sortSelect").value;
  let list=pets.filter(p=>[p.name,p.species,p.breed,p.gender,p.description].some(v=>String(v??"").toLowerCase().includes(q))&&(!animal||p.species===animal)&&(!breed||p.breed===breed));
  if(sort==="age")list.sort((a,b)=>Number(a.age)-Number(b.age));else list.sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  grid.innerHTML=list.length?list.map(p=>`<article class="pet-card">
    <img src="${safe(p.imageUrl)}" alt="${safe(p.name)}">
    <div class="pet-card-content">
      <span class="status-${String(p.status||"Available").toLowerCase()}">${safe(p.status||"Available")}</span>
      <h3>${safe(p.name)}</h3><p><strong>${safe(p.species)}</strong> · ${safe(p.breed)}</p>
      <p class="pet-description">${safe(p.description)}</p>
      <div class="pet-meta"><span>Age: ${safe(p.age)}</span><span>Gender: ${safe(p.gender)}</span></div>
      <div class="pet-actions">
        <a class="btn btn-outline" href="edit-pet.html?id=${encodeURIComponent(p._id)}">Edit</a>
        <button class="btn btn-primary adopt" data-id="${safe(p._id)}" ${p.status!=="Available"?"disabled":""}>${p.status==="Available"?"Adopt":safe(p.status)}</button>
      </div>
    </div></article>`).join(""):'<div class="empty">No pets match your search.</div>';
}

["searchInput"].forEach(id=>document.getElementById(id)?.addEventListener("input",renderPets));
["animalFilter","breedFilter","sortSelect"].forEach(id=>document.getElementById(id)?.addEventListener("change",renderPets));

document.getElementById("petsGrid")?.addEventListener("click",async event=>{
  const button=event.target.closest(".adopt"); if(!button)return;
  button.disabled=true;
  try{
    const response=await fetch(`${API_URL}/${encodeURIComponent(button.dataset.id)}`,{
      method:"PATCH",headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify({status:"Pending"})
    });
    if(!response.ok)throw new Error(`API PATCH failed: ${response.status}`);
    const pet=pets.find(p=>p._id===button.dataset.id); if(pet)pet.status="Pending";
    renderPets();
  }catch(error){button.disabled=false;alert("The API could not update the adoption status.");console.error(error);}
});

function safe(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
