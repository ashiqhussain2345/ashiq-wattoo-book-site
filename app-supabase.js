const sb=supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
let books=[],currentBook=null;

// --- ORIGINAL PCTB BOOKS 1-12 - All Classes Official Links ---
const originalBooks = [];

// Function to add books for a class
function addClassBooks(classNum, subjects){
  subjects.forEach(sub=>{
    originalBooks.push({
      id: `orig-${classNum}-${sub.toLowerCase().replace(/ /g,'-')}`,
      title: `${sub} - Class ${classNum} (Original)`,
      author: "PCTB Punjab",
      category: "School Books",
      className: `Class ${classNum}`,
      pdf_path: "https://pctb.punjab.gov.pk/E-Books",
      isExternal: true,
      cover_path: ""
    });
  });
}

const primarySubjects = ["Urdu", "English", "Mathematics", "Islamiat", "General Knowledge"];
const middleSubjects = ["Urdu", "English", "Mathematics", "Islamiat", "Science", "Computer", "Geography", "History"];
const matricSubjects = ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science", "English", "Urdu", "Islamiat", "Pak Studies"];
const interSubjects = ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science", "English", "Urdu", "Islamiat", "Pak Studies"];

// Class 1-5
for(let i=1;i<=5;i++) addClassBooks(i, primarySubjects);
// Class 6-8
for(let i=6;i<=8;i++) addClassBooks(i, middleSubjects);
// Class 9-10
for(let i=9;i<=10;i++) addClassBooks(i, matricSubjects);
// Class 11-12
for(let i=11;i<=12;i++) addClassBooks(i, interSubjects);

async function enterLibrary(){document.getElementById("welcome").classList.add("hidden");document.getElementById("library").classList.remove("hidden");await loadBooks();}
async function loadBooks(){
  const r=await sb.from("books").select("*").order("created_at",{ascending:false});
  if(r.error){
    console.error(r.error);
    books = [...originalBooks];
  } else {
    books = [...originalBooks, ...(r.data||[])];
  }
  renderBooks();
  if(document.getElementById("adminBooks")) renderAdmin();
}
function renderBooks(){
  const q=(document.getElementById("search")?.value||"").trim().toLowerCase();
  const c=(document.getElementById("category")?.value||"All");
  const classFilter=document.getElementById("classFilter")?.value||"All";
  let list=books.filter(b=>(c==="All"||b.category===c)&&(`${b.title} ${b.author||""} ${b.category} ${b.className||""}`).toLowerCase().includes(q));
  if(classFilter!=="All"){
    list=list.filter(b=>b.className===classFilter);
  }
  document.getElementById("books").innerHTML=list.length?list.map(b=>{
    const cover=b.cover_path && !b.isExternal?sb.storage.from("book-covers").getPublicUrl(b.cover_path).data.publicUrl:"";
    const pdfUrl = b.isExternal ? b.pdf_path : sb.storage.from("book-pdfs").getPublicUrl(b.pdf_path).data.publicUrl;
    return `<article class="card">${cover?`<img class="book-cover" src="${cover}" alt="${esc(b.title)}">`:`<div class="icon">📘</div>`}<h3>${esc(b.title)}</h3><p>${esc(b.author||"")}</p><small>${esc(b.category||"")} | ${esc(b.className||"")}</small><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button onclick="readBook('${b.id}')">Read</button><a href="${pdfUrl}" target="_blank" style="padding:6px 12px;background:#0a7c3e;color:#fff;border-radius:6px;text-decoration:none;">Download Original</a></div></article>`;
  }).join(""):`<div class="card"><h3>No books in this category</h3><p>Try selecting Class 1-12 or search</p></div>`;
}
function quickCat(cat){document.getElementById("category").value=cat;document.getElementById("search").value="";renderBooks();document.getElementById("books")?.scrollIntoView({behavior:"smooth"})}
function openAdmin(){document.getElementById("admin").classList.remove("hidden")}
function closeAdmin(){document.getElementById("admin").classList.add("hidden")}
async function login(){const email=document.getElementById("adminEmail")?.value.trim()||prompt("Admin email:");const pass=document.getElementById("adminPass")?.value||prompt("Admin password:");const {error}=await sb.auth.signInWithPassword({email,password:pass});if(error)alert(error.message);else alert("Logged in");closeAdmin();loadBooks()}
async function addBook(e){e.preventDefault();const pdf=document.getElementById("bookPdf")?.files[0],cover=document.getElementById("bookCover")?.files[0];const title=document.getElementById("bookTitle")?.value;const author=document.getElementById("bookAuthor")?.value;const category=document.getElementById("bookCategory")?.value||"Other Books";if(!pdf||!title)return alert("Title and PDF required");const pdfName=`${Date.now()}_${pdf.name}`;let coverName="";const {error:pdfErr}=await sb.storage.from("book-pdfs").upload(pdfName,pdf);if(pdfErr)return alert(pdfErr.message);if(cover){coverName=`${Date.now()}_${cover.name}`;await sb.storage.from("book-covers").upload(coverName,cover);}const {error}=await sb.from("books").insert({title,author,category,pdf_path:pdfName,cover_path:coverName});if(error)alert(error.message);else {e.target.reset();loadBooks();alert("Book Added")}} 
async function renderAdmin(){const box=document.getElementById("adminBooks");if(!box)return;box.innerHTML=books.filter(b=>!b.isExternal).map(b=>`<div>${esc(b.title)} - <button onclick="deleteBook('${b.id}')">Delete</button></div>`).join("")}
async function deleteBook(id){const b=books.find(x=>x.id==id);if(b?.isExternal)return alert("Original book cannot be deleted");if(!b||!confirm("Delete this book?"))return;await sb.storage.from("book-pdfs").remove([b.pdf_path]);if(b.cover_path)await sb.storage.from("book-covers").remove([b.cover_path]);await sb.from("books").delete().eq("id",id);loadBooks()}
function readBook(id){currentBook=books.find(b=>b.id==id);if(!currentBook)return;if(currentBook.isExternal){window.open(currentBook.pdf_path,"_blank");return;}document.getElementById("readerTitle").textContent=currentBook.title;document.getElementById("pdfFrame").src=sb.storage.from("book-pdfs").getPublicUrl(currentBook.pdf_path).data.publicUrl;document.getElementById("reader").classList.remove("hidden")}
function closeReader(){document.getElementById("reader").classList.add("hidden");document.getElementById("pdfFrame").src=""}
async function shareBook(){if(!currentBook)return;const u=currentBook.isExternal?currentBook.pdf_path:sb.storage.from("book-pdfs").getPublicUrl(currentBook.pdf_path).data.publicUrl;if(navigator.share){try{await navigator.share({title:currentBook.title,url:u})}catch{}}else{await navigator.clipboard.writeText(u);alert("Link copied")}} 
function esc(s){return String(s||"").replace(/[<>&"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
