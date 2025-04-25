
// Ładowanie Firebase SDK v9 compat
const script1 = document.createElement("script");
script1.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
document.head.appendChild(script1);

const script2 = document.createElement("script");
script2.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js";
script2.onload = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyB_KUw9LfyQesBQ8u-XsR63zqKFfXdqmQI",
    authDomain: "polkoloniewachowscy.firebaseapp.com",
    projectId: "polkoloniewachowscy",
    storageBucket: "polkoloniewachowscy.appspot.com",
    messagingSenderId: "387020196373",
    appId: "1:387020196373:web:a006f42a66bb835eb29c1c"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const selectedDates = new Set();
  const maxSpots = 15;

  const formatDate = (date) => date.toISOString().split('T')[0];

  const getWeekdaysInJuly = () => {
    const dates = [];
    const start = new Date("2025-07-01");
    const end = new Date("2025-07-31");
    let current = new Date(start);
    while (current <= end) {
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  function createDateButtons(zapisy) {
    const counts = {};
    zapisy.forEach(z => {
      counts[z.date] = (counts[z.date] || 0) + 1;
    });

    const container = document.getElementById("dates");
    if (!container) return;

    let html = "";
    getWeekdaysInJuly().forEach(date => {
      const formatted = formatDate(date);
      const count = counts[formatted] || 0;
      const disabled = count >= maxSpots;
      html += `<button data-date="${formatted}" ${disabled ? "disabled" : ""}>${formatted} (${maxSpots - count} miejsc)</button>`;
    });
    container.innerHTML = html;

    document.querySelectorAll("#dates button").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("selected");
        const date = btn.dataset.date;
        if (selectedDates.has(date)) {
          selectedDates.delete(date);
        } else {
          selectedDates.add(date);
        }
      });
    });
  }

  function loadZapisy() {
    db.collection("zapisy")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        const zapisy = snapshot.docs.map(doc => doc.data());
        createDateButtons(zapisy);
        const list = document.getElementById("zapisyList");
        if (list) {
          list.innerHTML = zapisy.map(z =>
            `<li><strong>${z.name}</strong> - ${z.date} <br/><small>${z.phone}</small></li>`
          ).join("");
        }
      });
  }

  window.submitForm = () => {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const notes = document.getElementById("notes").value;

    if (!name || !phone || selectedDates.size === 0) {
      alert("Uzupełnij wszystkie pola i wybierz datę!");
      return;
    }

    const batch = db.batch();
    const timestamp = new Date();

    selectedDates.forEach(date => {
      const ref = db.collection("zapisy").doc();
      batch.set(ref, {
        name, phone, notes, date,
        timestamp: firebase.firestore.Timestamp.fromDate(timestamp)
      });
    });

    batch.commit().then(() => {
      alert("Zapisano!");
      document.getElementById("name").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("notes").value = "";
      selectedDates.clear();
    });
  };

  loadZapisy();
};

document.head.appendChild(script2);
