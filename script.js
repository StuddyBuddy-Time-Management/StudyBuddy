let timer;
let remainingTime = 0;
let isPaused = false;

// ------------------- TIMER FUNCTIONS ------------------

function startTimer() {
  const input = document.getElementById("timerInput");
  const minutes = parseInt(input.value);
  if (isNaN(minutes) || minutes <= 0) {
    alert("Please enter a valid number of minutes.");
    return;
  }

  clearInterval(timer);
  remainingTime = minutes * 60;
  isPaused = false;
  updateDisplay();

  timer = setInterval(() => {
    if (!isPaused && remainingTime > 0) {
      remainingTime--;
      updateDisplay();
    }

    if (remainingTime === 0) {
      clearInterval(timer);
      document.getElementById("countdownDisplay").textContent = "Time's up!";
      document.getElementById("alarmSound").play();
    }
  }, 1000);
}

function pauseTimer() {
  isPaused = true;
}

function resumeTimer() {
  if (remainingTime > 0) {
    isPaused = false;
  }
}

function resetTimer() {
  const input = document.getElementById("timerInput");
  const minutes = parseInt(input.value);
  if (isNaN(minutes) || minutes <= 0) return;
  clearInterval(timer);
  remainingTime = minutes * 60;
  isPaused = false;
  updateDisplay();

  timer = setInterval(() => {
    if (!isPaused && remainingTime > 0) {
      remainingTime--;
      updateDisplay();
    }

    if (remainingTime === 0) {
      clearInterval(timer);
      document.getElementById("countdownDisplay").textContent = "Time's up!";
      document.getElementById("alarmSound").play();
    }
  }, 1000);
}

function cancelTimer() {
  clearInterval(timer);
  remainingTime = 0;
  isPaused = false;
  updateDisplay("Cancelled");
}

function stopAlarm() {
  const alarm = document.getElementById("alarmSound");
  alarm.pause();
  alarm.currentTime = 0;
}

function updateDisplay(textOverride) {
  const display = document.getElementById("countdownDisplay");
  if (textOverride) {
    display.textContent = textOverride;
  } else {
    const mins = Math.floor(remainingTime / 60);
    const secs = remainingTime % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

// ------------------- TASK MANAGER FUNCTIONS ------------------

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const task = taskInput.value.trim();
  if (task !== "") {
    addTask(task);
    taskInput.value = "";
  }
});

function addTask(text) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;

  const buttons = document.createElement("div");
  buttons.classList.add("task-buttons");

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "✓";
  doneBtn.onclick = () => {
    li.classList.toggle("done");
    saveTasks();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  buttons.appendChild(doneBtn);
  buttons.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(buttons);

  taskList.appendChild(li);
  saveTasks();
}

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      done: li.classList.contains("done")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
  saved.forEach(task => {
    addTask(task.text);
    const last = taskList.lastChild;
    if (task.done) last.classList.add("done");
  });
}

loadTasks();
