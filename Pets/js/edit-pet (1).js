const API_URL="https://quiz-nydl-special.vercel.app/api/pets";

document.addEventListener("DOMContentLoaded",loadPet);

async function loadPet(){
  const id=new URLSearchParams(location.search).get("id");
  const form=document.getElementById("editForm"),message=document.getElementById("editMessage");
  if(!id){message.className="message error";message.textContent="No pet ID was provided.";return;}
  try{
    // Load from the API collection so this works even if GET /api/pets/:id is not implemented.
    const response=await fetch(API_URL,{method:"GET",headers:{"Accept":"application/json"}});
    if(!response.ok)throw new Error(`API GET failed: ${response.status}`);
    const pets=await response.json();
    const pet=(Array.isArray(pets)?pets:[]).find(p=>String(p._id)===String(id));
    if(!pet)throw new Error("Pet not found");
    form.elements.petName.value=pet.name||"";
    form.elements.animalType.value=pet.species||"Dog";
    form.elements.breed.value=pet.breed||"";
    form.elements.petDescription.value=pet.description||"";
    form.elements.petAge.value=pet.age??"";
    form.elements.petGender.value=pet.gender||"Male";
    form.elements.petImage.value=pet.imageUrl||"";
    form.elements.status.value=pet.status||"Available";
  }catch(error){
    message.className="message error";message.textContent="Could not load this pet from the API.";console.error(error);return;
  }

  form.addEventListener("submit",async event=>{
    event.preventDefault();
    const f=new FormData(form);
    const updated={
      name:String(f.get("petName")||"").trim(),
      species:String(f.get("animalType")||"").trim(),
      breed:String(f.get("breed")||"").trim(),
      age:Number(f.get("petAge")),
      gender:String(f.get("petGender")||"").trim(),
      description:String(f.get("petDescription")||"").trim(),
      imageUrl:String(f.get("petImage")||"").trim(),
      status:String(f.get("status")||"Available").trim()
    };
    message.className="message";message.textContent="Updating API...";
    try{
      const response=await fetch(`${API_URL}/${encodeURIComponent(id)}`,{
        method:"PATCH",headers:{"Content-Type":"application/json","Accept":"application/json"},
        body:JSON.stringify(updated)
      });
      const text=await response.text();
      if(!response.ok)throw new Error(`API PATCH failed: ${response.status} ${text}`);
      message.className="message success";message.textContent="Pet updated successfully in the API.";
    }catch(error){
      message.className="message error";message.textContent="Could not update the pet in the API.";console.error(error);
    }
  });

  document.getElementById("deletePet")?.addEventListener("click",async()=>{
    if(!confirm("Delete this pet permanently?"))return;
    try{
      const response=await fetch(`${API_URL}/${encodeURIComponent(id)}`,{method:"DELETE",headers:{"Accept":"application/json"}});
      const text=await response.text();
      if(!response.ok)throw new Error(`API DELETE failed: ${response.status} ${text}`);
      location.href="browse-pets.html";
    }catch(error){
      message.className="message error";message.textContent="Could not delete the pet from the API.";console.error(error);
    }
  });
}
