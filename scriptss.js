const intro = document.getElementById("intro");
const hero = document.getElementById("hero");
const journal = document.getElementById("journal");
const startBtn = document.getElementById("startBtn");

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
