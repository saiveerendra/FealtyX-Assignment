const BASE_URL = "https://fealtyx-backend.onrender.com";

const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const email = document.getElementById("email").value.trim();

  const payload = { name, age, email };

  try {
    const res = await fetch(`${BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to add student");
     alert("Student added successfully!");
    form.reset();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

document.getElementById("Get All students").addEventListener("click", async (e) => {
    try {
    const res = await fetch(`${BASE_URL}/students`);
    const students = await res.json();

    // studentList.innerHTML = "";

    students.forEach((student) => {
      const div = document.createElement("div");
      div.className = "student";
      div.innerHTML = `
        Id:${student.id}<br/>
        <strong>${student.name}</strong><br/>
        Age: ${student.age}<br/>
        Email: ${student.email}<br/>
      `;
      studentList.appendChild(div);
    });
  } catch (err) {
    studentList.innerHTML = "Failed to load students.";
  }
});

function warning() {
        alert("Id not found");
}
document.getElementById("Student").addEventListener("click",async(e)=>{
     const Id = document.getElementById("id").value.trim();
      console.log(Id)
     const res =  await fetch(`${BASE_URL}/students/${Id}`);
     const student=await res.json();
     console.log(student);
    
     if(student.name){
    const div = document.createElement("div");
      div.className = "student";
      div.innerHTML = `
        <strong>${student.name}</strong><br/>
        Age: ${student.age}<br/>
        Email: ${student.email}<br/>
      `;
      get_student_by_id.appendChild(div);}
      else{
        warning();
      }
    
});
async function getSummary(id, btn) {
  btn.disabled = true;
  const box = document.getElementById(`summary-${id}`);
  box.textContent = "Loading summary...";

  try {
    const res = await fetch(`${BASE_URL}/students/${id}/summary`);
    const data = await res.text();
    box.textContent = data;
  } catch (err) {
    box.textContent = "Error fetching summary.";
  } finally {
    btn.disabled = false;
  }
}

document.getElementById("showUpdateBtn").addEventListener("click", async (e) => {
      const Id = document.getElementById("Id").value.trim();
      console.log(Id);
      if(!Id) return alert("Please enter id");
      try{
     const res =  await fetch(`${BASE_URL}/students/${Id}`);

     const student=await res.json();
      document.getElementById("updateName").value = student.name;
      document.getElementById("updateAge").value = student.age;
      document.getElementById("updateEmail").value = student.email;
      const form = document.getElementById("updateForm");
     document.getElementById("updateForm").style.display = "block";}
      catch(e)
      {
        alert("Error while updating",e);
      }
     
    });

    // Handle update button click
    document.getElementById("updateBtn").addEventListener("click", async (e) => {
         const Id = document.getElementById("Id").value.trim();
         const name=document.getElementById("updateName").value.trim();
      const age=document.getElementById("updateAge").value.trim(); 
      const email=document.getElementById("updateEmail").value.trim(); 
        const payload = { name, age, email };

  try {
    const res = await fetch(`${BASE_URL}/students/${Id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to add student");
    form.reset();
  } catch (err) {
    alert("Error: " + err.message);
  }
    });
document.getElementById("DeleteBtn").addEventListener("click",async(e)=>{
    const Id=document.getElementById("delete_id").value.trim();
    if(!Id)
    { 
      return alert("enter valid id");
    }
     try {
    const res = await fetch(`${BASE_URL}/students/${Id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to add student");
    alert("✅ Summary fetched successfully!")
    form.reset();
  } catch (err) {
    alert("Error: " + err.message);
  }
})
document.getElementById("Summary").addEventListener("click", async (e) => {
  const Id = document.getElementById("summary_id").value.trim();

  if (!Id) {
    return alert("Please enter a valid ID");
  }
  const summary = document.getElementById("summary");
  

  // Show loading
  const loading = document.createElement("div");
  loading.id = "loading-summary";
  loading.innerHTML = `<strong>Loading...</strong>`;
  summary.appendChild(loading);

  try {
    const res = await fetch(`${BASE_URL}/students/${Id}/summary`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("Failed to fetch summary");

    const data = await res.text(); // assuming the summary is plain text

    // Remove loading
    const existing = document.getElementById("loading-summary");
    if (existing) summary.removeChild(existing);

    // Show summary
    const div = document.createElement("div");
    div.className = "student";
    div.innerHTML = `
      <strong>Summary:</strong><br/> ${data}
    `;
    summary.appendChild(div);
  } catch (err) {
    const existing = document.getElementById("loading-summary");
    if (existing) summary.removeChild(existing);

    alert("Error: " + err.message);
  }
});
