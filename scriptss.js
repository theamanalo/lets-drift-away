const intro = document.getElementById("intro");
const hero = document.getElementById("hero");
const journal = document.getElementById("journal");
const startBtn = document.getElementById("startBtn");
const historyList = document.getElementById("historyList");

const orb = document.getElementById("orb");
const instruction = document.getElementById("instruction");
const timer = document.getElementById("timer");

const ambient = document.getElementById("ambient");
ambient.loop = true; 

const journalInput = document.getElementById("journalInput");
const saveBtn = document.getElementById("saveBtn");
const pauseTimerBtn = document.getElementById("pausetimer");
const savedMsg = document.getElementById("savedMsg");

let seconds = 0;
let phaseIndex = 0;
const phases = ["Inhale", "Hold", "Exhale"];

let timerInterval;

startBtn.addEventListener("click", () => {
  intro.classList.add("hidden");
  hero.classList.remove("hidden");
  journal.classList.remove("hidden");

  ambient.play().catch(err => {
    console.log("Autoplay blocked by browser, user interaction required");
  });

  startBreathing();
  startTimer(); 
});

function startBreathing() {
  setInterval(() => {
    instruction.style.opacity = 0;

    setTimeout(() => {
      instruction.textContent = phases[phaseIndex];
      instruction.style.opacity = 1;

      if (phaseIndex === 0) {
        orb.style.transform = "scale(1.4)";
      }
      if (phaseIndex === 2) {
        orb.style.transform = "scale(1)";
      }

      phaseIndex = (phaseIndex + 1) % phases.length;
    }, 1000);

  }, 4000);
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timer.textContent = `${mins}:${secs}`;
  }, 1000);
}

pauseTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval); 
});

saveBtn.addEventListener("click", () => {
  localStorage.setItem("driftJournal", journalInput.value);
  savedMsg.style.opacity = 1;
  setTimeout(() => savedMsg.style.opacity = 0, 2000);
});

window.onload = () => {
  const saved = localStorage.getItem("driftJournal");
  if (saved) journalInput.value = saved;
};

function saveSessionEntry() {
  const text = journalInput.value.trim();
  if (!text) return;

  const now = new Date();

  const entry = {
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: timer.textContent,
    reflection: text
  };

  let history = JSON.parse(localStorage.getItem("driftHistory")) || [];
  history.unshift(entry);
  localStorage.setItem("driftHistory", JSON.stringify(history));

  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("driftHistory")) || [];
  if (!historyList) return;

  historyList.innerHTML = "";

  history.forEach(entry => {
    const div = document.createElement("div");
    div.classList.add("entry");

    div.innerHTML = `
      <strong>${entry.date} • ${entry.time}</strong>
      Duration: ${entry.duration}<br>
      ${entry.reflection}
    `;

    historyList.appendChild(div);
  });
}

saveBtn.addEventListener("click", saveSessionEntry);

renderHistory();
