const API_URL="https://quiz-nydl-special.vercel.app/api/pets";

document.addEventListener("DOMContentLoaded",loadRecentPets);

async function loadRecentPets(){
  const grid=document.getElementById("recentPets");
  const state=document.getElementById("homeState");
  if(!grid)return;
  try{
    const response=await fetch(API_URL,{method:"GET",headers:{"Accept":"application/json"}});
    if(!response.ok)throw new Error(`API GET failed: ${response.status}`);
    const pets=await response.json();
    const list=(Array.isArray(pets)?pets:[]).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,3);
    state.hidden=true;
    grid.innerHTML=list.length?list.map(petCard).join(""):'<div class="empty">No pets found.</div>';
  }catch(error){
    state.hidden=false;
    state.className="message error";
    state.textContent="API connection failed. Please check the API server.";
    console.error("PawHaven API:",error);
  }
}

function petCard(p){
  return `<article class="pet-card">
    <img src="${safe(p.imageUrl)}" alt="${safe(p.name)}" loading="lazy">
    <div class="pet-card-content">
      <span class="status-${String(p.status||"Available").toLowerCase()}">${safe(p.status||"Available")}</span>
      <h3>${safe(p.name)}</h3>
      <p>${safe(p.species)} · ${safe(p.breed)}</p>
      <p class="pet-description">${safe(p.description)}</p>
    </div>
  </article>`;
}
function safe(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
