
document.addEventListener("DOMContentLoaded", async () => {
  const API="https://quiz-nydl-special.vercel.app/api/pets", grid=document.getElementById("petsGrid");
  const search=document.getElementById("searchInput"), animal=document.getElementById("animalFilter"), breed=document.getElementById("breedFilter"), sort=document.getElementById("sortSelect"), state=document.getElementById("browseState");
  let pets=[];
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  try{const r=await fetch(API);if(!r.ok)throw 0;const d=await r.json();pets=Array.isArray(d)?d:(d.pets||d.data||[]);
    [...new Set(pets.map(p=>p.animalType).filter(Boolean))].sort().forEach(x=>animal.insertAdjacentHTML("beforeend",`<option value="${esc(x)}">${esc(x)}</option>`));
    [...new Set(pets.map(p=>p.breed).filter(Boolean))].sort().forEach(x=>breed.insertAdjacentHTML("beforeend",`<option value="${esc(x)}">${esc(x)}</option>`));
    state.hidden=true; render();
  }catch(e){state.hidden=false;state.className="message error";state.textContent="Could not reach the pet server."}
  function render(){
    let m=pets.filter(p=>{const q=search.value.toLowerCase();return [p.name,p.animalType,p.breed,p.gender,p.description].some(v=>String(v??"").toLowerCase().includes(q))&&(!animal.value||p.animalType===animal.value)&&(!breed.value||p.breed===breed.value)});
    m.sort((a,b)=>sort.value==="age"?Number(a.age)-Number(b.age):String(a.name).localeCompare(String(b.name)));
    grid.innerHTML=m.length?m.map(p=>`<article class="pet-card"><img src="${esc(p.image)}" alt="${esc(p.name)}"><div class="pet-card-content"><span class="status-${String(p.status||"Available").toLowerCase()}">${esc(p.status||"Available")}</span><h3>${esc(p.name)}</h3><p><strong>${esc(p.animalType)}</strong> · ${esc(p.breed)}</p><p class="pet-description">${esc(p.description)}</p><div class="pet-meta"><span>Age: ${esc(p.age)}</span><span>Gender: ${esc(p.gender)}</span></div><div class="pet-actions"><a class="btn btn-outline" href="edit-pet.html?id=${encodeURIComponent(p.id)}">Edit</a><button class="btn btn-primary adopt" data-id="${esc(p.id)}" ${p.status!=="Available"?"disabled":""}>${p.status==="Available"?"Adopt":esc(p.status)}</button></div></div></article>`).join(""):'<div class="empty">No pets match your search.</div>';
  }
  [search,animal,breed,sort].forEach(x=>x.addEventListener(x===search?"input":"change",render));
  grid.addEventListener("click",async e=>{const b=e.target.closest(".adopt");if(!b)return;try{const r=await fetch(`${API}/${encodeURIComponent(b.dataset.id)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"Pending"})});if(!r.ok)throw 0;const p=pets.find(x=>String(x.id)===String(b.dataset.id));if(p)p.status="Pending";render()}catch{alert("Could not update adoption status.")}});
});
