const API_URL="https://quiz-nydl-special.vercel.app/api/pets";

document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("petForm"),message=document.getElementById("formMessage"),preview=document.getElementById("imagePreview");
  if(!form)return;
  document.getElementById("petImage")?.addEventListener("input",e=>{preview.src=e.target.value||"https://placehold.co/800x500?text=Pet";});
  form.addEventListener("submit",async event=>{
    event.preventDefault();
    const f=new FormData(form);
    const pet={
      name:String(f.get("petName")||"").trim(),
      species:String(f.get("animalType")||"").trim(),
      breed:String(f.get("breed")||"").trim(),
      age:Number(f.get("petAge")),
      gender:String(f.get("petGender")||"").trim(),
      description:String(f.get("petDescription")||"").trim(),
      imageUrl:String(f.get("petImage")||"").trim(),
      status:"Available"
    };
    if(!pet.name||!pet.species||!pet.breed||!pet.description||!Number.isFinite(pet.age)||pet.age<0||!pet.gender||!pet.imageUrl){
      message.className="message error";message.textContent="Please complete every field correctly.";return;
    }
    message.className="message";message.textContent="Sending pet to API...";
    try{
      const response=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(pet)});
      const text=await response.text();
      if(!response.ok)throw new Error(`API POST failed: ${response.status} ${text}`);
      form.reset();preview.src="https://placehold.co/800x500?text=Pet";
      message.className="message success";message.textContent="Pet added successfully to the API.";
    }catch(error){
      message.className="message error";message.textContent="Could not add the pet to the API.";
      console.error("PawHaven API:",error);
    }
  });
});
