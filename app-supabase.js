let books=[],currentBook=null;

// --- FINAL ORIGINAL BOOKS 1 TO 10 - NO SUPABASE DEPENDENCY ---
const originalBooks = [
  { id: "class-1", title: "Class 1 - All Books (Original)", author: "PCTB Punjab", category: "School Books" },
  { id: "class-2", title: "Class 2 - All Books (Original)", author: "PCTB Punjab", category: "School Books" },
  { id: "class-3", title: "Class 3 - All Books (Original)", author: "PCTB Punjab", category: "School Books" },
  { id: "class-4", title: "Class 4 - All Books (Original)", author: "PCTB Punjab", category: "School Books" },
  { id: "class-5", title: "Class 5 - All Books (Original)", author: "PCTB Punjab", category: "School Books" },
  { id: "class-6", title: "Class 6 - All Books (Original)", author: "PCTB Punjab", category: "School Books" },
  { id: "class-7", title: "Class 7 - All Books (Original)", author: "PCTB Punjab", category: "School Books" },
  { id: "class-8", title: "Class 8 - All Books (Original)", author: "PCTB Punjab", category: "School Books" },
  { id: "class-9", title: "Class 9 - All Books (Original)", author: "PCTB Punjab", category: "School Books" },
  { id: "class-10", title: "Class 10 - All Books (Original)", author: "PCTB Punjab", category: "School Books" }
];
books = [...originalBooks];

function enterLibrary(){
  const w=document.getElementById("welcome");
  const l=document.getElementById("library");
  if(w) w.classList.add("hidden");
  if(l) l.classList.remove("hidden");
  renderBooks();
}

function renderBooks(){
  const container = document.getElementById("books");
  if(!container) return;
  const q=(document.getElementById("search")?.value||"").trim().toLowerCase();
  const c=(document.getElementById("category")?.value||"All");
  
  let list = books;
  if(q) list = list.filter(b=>`${b.title} ${b.author} ${b.category}`.toLowerCase().includes(q));
  if(c!=="All") list = list.filter(b=>b.category===c);

  container.innerHTML = list.map(b=>`
    <article class="card" style="padding:16px;border:1px solid #eee;border-radius:12px;background:#fff">
      <div class="icon" style="font-size:32px">📘</div>
      <h3 style="margin:10px 0 4px 0">${b.title}</h3>
      <p style="color:#666;margin:0">${b.author}</p>
      <small style="color:#0a7c3e;font-weight:bold">${b.category}</small>
      <div style="margin-top:12px;display:flex;gap:8px">
        <a href="https://pctb.punjab.gov.pk/E-Books" target="_blank" style="padding:8px 14px;background:#0a7c3e;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">Download Original</a>
        <a href="https://pctb.punjab.gov.pk/E-Books" target="_blank" style="padding:8px 14px;background:#f0f0f0;color:#333;border-radius:8px;text-decoration:none">Read</a>
      </div>
    </article>
  `).join("");
}

function quickCat(cat){
  const catEl=document.getElementById("category");
  if(catEl) catEl.value=cat;
  const sEl=document.getElementById("search");
  if(sEl) sEl.value="";
  renderBooks();
  document.getElementById("books")?.scrollIntoView({behavior:"smooth"});
}

// Dummy functions to avoid errors
function openAdmin(){}
function closeAdmin(){}
function esc(s){return String(s||"").replace(/[<>&\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}

// Auto load on page open
document.addEventListener("DOMContentLoaded", ()=>{
  if(document.getElementById("books")) renderBooks();
});
