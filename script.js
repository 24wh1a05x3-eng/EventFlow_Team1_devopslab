const events = [
  {id:1,title:"CodeSprint Hackathon",category:"Technical",date:"18 OCT 2026",time:"9:00 AM",location:"Innovation Lab",description:"Build a useful idea with your team and turn it into a working prototype.",emoji:"💻",theme:"purple"},
  {id:2,title:"Rhythm & Roots",category:"Cultural",date:"22 OCT 2026",time:"4:00 PM",location:"Open Air Stage",description:"An evening of music, dance, performances, and campus talent.",emoji:"🎤",theme:"peach"},
  {id:3,title:"Design Thinking Lab",category:"Workshop",date:"25 OCT 2026",time:"10:00 AM",location:"Seminar Hall 2",description:"Learn to shape a problem into a simple idea through hands-on activities.",emoji:"💡",theme:"yellow"},
  {id:4,title:"Campus Sports Day",category:"Sports",date:"29 OCT 2026",time:"8:00 AM",location:"College Grounds",description:"Bring your energy for team games, friendly matches, and fun challenges.",emoji:"🏆",theme:"mint"},
  {id:5,title:"AI & Beyond",category:"Technical",date:"02 NOV 2026",time:"11:00 AM",location:"Main Auditorium",description:"Explore real-world AI projects and hear fresh ideas from student builders.",emoji:"🤖",theme:"blue"},
  {id:6,title:"Creative Canvas",category:"Workshop",date:"06 NOV 2026",time:"2:00 PM",location:"Art Studio",description:"Take a break, try something new, and make your own piece of art.",emoji:"🎨",theme:"pink"}
];

try {
  const savedEvents = JSON.parse(localStorage.getItem("eventflowCustomEvents") || "[]");
  if (Array.isArray(savedEvents)) events.push(...savedEvents);
} catch (error) {
  // Continue with the sample events if local storage is unavailable.
}

let selectedCategory = "All";
let selectedEvent = null;
const eventGrid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const modalBackdrop = document.getElementById("modalBackdrop");
const registrationForm = document.getElementById("registrationForm");
const toast = document.getElementById("toast");
let toastTimer;

function renderEvents() {
  const search = searchInput.value.trim().toLowerCase();
  const visibleEvents = events.filter(event => {
    const categoryMatches = selectedCategory === "All" || event.category === selectedCategory;
    const searchMatches = `${event.title} ${event.category} ${event.location} ${event.description}`.toLowerCase().includes(search);
    return categoryMatches && searchMatches;
  });

  eventGrid.innerHTML = visibleEvents.map(event => `
    <article class="event-card">
      <div class="event-art ${event.theme}"><span class="emoji" aria-hidden="true">${event.emoji}</span></div>
      <div class="event-content">
        <div class="event-meta"><span class="category">${event.category}</span><span class="event-date">${event.date}</span></div>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <div class="event-footer"><span class="event-location">⌖ ${event.location} · ${event.time}</span>
        <button class="register-button" data-event-id="${event.id}">Register ↗</button></div>
      </div>
    </article>`).join("");

  document.getElementById("emptyState").hidden = visibleEvents.length > 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function openRegistration(eventId) {
  selectedEvent = events.find(event => event.id === Number(eventId));
  if (!selectedEvent) return;
  document.getElementById("modalTitle").textContent = "Register for event";
  document.getElementById("modalEventName").textContent = `${selectedEvent.title} · ${selectedEvent.date}`;
  modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("studentName").focus();
}

function closeRegistration() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = "";
  selectedEvent = null;
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
    renderEvents();
  });
});

searchInput.addEventListener("input", renderEvents);
eventGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-event-id]");
  if (button) openRegistration(button.dataset.eventId);
});
document.getElementById("closeModal").addEventListener("click", closeRegistration);
modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeRegistration();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modalBackdrop.hidden) closeRegistration();
});

registrationForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!selectedEvent) return;
  const formData = new FormData(registrationForm);
  const registration = {
    eventId: selectedEvent.id,
    eventTitle: selectedEvent.title,
    name: String(formData.get("studentName")).trim(),
    email: String(formData.get("studentEmail")).trim(),
    year: String(formData.get("studentYear")),
    registeredAt: new Date().toISOString()
  };
  if (!registration.name || !registration.email || !registration.year) {
    showToast("Please complete all fields.");
    return;
  }
  try {
    const saved = JSON.parse(localStorage.getItem("eventflowRegistrations") || "[]");
    saved.push(registration);
    localStorage.setItem("eventflowRegistrations", JSON.stringify(saved));
  } catch (error) {
    showToast("Registration could not be saved in this browser. Please try again.");
    return;
  }
  const eventName = selectedEvent.title;
  registrationForm.reset();
  closeRegistration();
  showToast(`You're registered for ${eventName}!`);
});

const addEventForm = document.getElementById("addEventForm");
addEventForm.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(addEventForm);
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "");
  const rawDate = String(formData.get("date") || "");
  const rawTime = String(formData.get("time") || "");
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!title || !category || !rawDate || !rawTime || !location || !description) {
    showToast("Please complete all event details.");
    return;
  }
  const dateObject = new Date(`${rawDate}T00:00:00`);
  const date = dateObject.toLocaleDateString("en-GB", {day:"2-digit", month:"short", year:"numeric"}).toUpperCase();
  const time = new Date(`2000-01-01T${rawTime}`).toLocaleTimeString("en-US", {hour:"numeric", minute:"2-digit"});
  const styleByCategory = {Technical:{emoji:"💻",theme:"purple"},Cultural:{emoji:"🎤",theme:"peach"},Workshop:{emoji:"💡",theme:"yellow"},Sports:{emoji:"🏆",theme:"mint"}};
  const newEvent = {id:Date.now(),title,category,date,time,location,description,...styleByCategory[category]};
  events.push(newEvent);
  try {
    const customEvents = events.filter(item => ![1,2,3,4,5,6].includes(item.id));
    localStorage.setItem("eventflowCustomEvents", JSON.stringify(customEvents));
  } catch (error) {
    showToast("Event added for this session, but could not be saved in this browser.");
  }
  addEventForm.reset();
  selectedCategory = "All";
  document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item.dataset.category === "All"));
  searchInput.value = "";
  renderEvents();
  showToast(`Added “${title}” to the event list!`);
  document.getElementById("events").scrollIntoView({behavior:"smooth"});
});

document.getElementById("year").textContent = new Date().getFullYear();
renderEvents();
