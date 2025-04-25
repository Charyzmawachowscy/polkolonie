
const firebaseConfig = {
  apiKey: "AIzaSyB_KUw9LfyQesBQ8u-XsR63zqKFfXdqmQI",
  authDomain: "polkoloniewachowscy.firebaseapp.com",
  projectId: "polkoloniewachowscy",
  storageBucket: "polkoloniewachowscy.firebasestorage.app",
  messagingSenderId: "387020196373",
  appId: "1:387020196373:web:a006f42a66bb835eb29c1c"
};

const script1 = document.createElement("script");
script1.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
script1.onload = () => {
  const script2 = document.createElement("script");
  script2.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  script2.onload = () => {
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

    const createDateButtons = (zapisy) => {
      const counts = {};
      zapisy.forEach(z => {
        counts[z.date] = (counts[z.date] || 0) + 1;
      });

      const container = document.getElementById('dates');
      if (!container) return;
      container.innerHTML = '';
      getWeekdaysInJuly().forEach(date => {
        const dateStr = formatDate(date);
        const btn = document.createElement('button');
        const spotsLeft = maxSpots - (counts[dateStr] || 0);
        btn.innerText = date.toLocaleDateString('pl-PL') + ` (${spotsLeft})`;
        btn.disabled = spotsLeft <= 0;
        if (selectedDates.has(dateStr)) btn.classList.add('selected');
        btn.onclick = () => {
          if (selectedDates.has(dateStr)) {
            selectedDates.delete(dateStr);
            btn.classList.remove('selected');
          } else {
            selectedDates.add(dateStr);
            btn.classList.add('selected');
          }
        };
        container.appendChild(btn);
      });
    };

    const renderList = (zapisy) => {
      const list = document.getElementById('zapisyList');
      if (!list) return;
      list.innerHTML = '';
      zapisy.forEach(z => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${z.name}</strong> – ${z.date} (8:00–16:00)<br/>Telefon: ${z.phone}${z.notes ? `<br/>Uwagi: ${z.notes}` : ''}`;
        list.appendChild(li);
      });
    };

    db.collection("zapisy").orderBy("date").onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => doc.data());
      createDateButtons(data);
      renderList(data);
    });

    window.submitForm = async () => {
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const notes = document.getElementById('notes').value.trim();
      if (!name || !phone || selectedDates.size === 0) {
        alert("Wypełnij wszystkie wymagane pola i wybierz co najmniej jeden dzień.");
        return;
      }
      for (let date of selectedDates) {
        await db.collection("zapisy").add({
          name, phone, notes, date,
          timestamp: new Date()
        });
      }
      document.getElementById('name').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('notes').value = '';
      selectedDates.clear();
      alert("Dziecko zostało zapisane!");
    };
  };
  document.body.appendChild(script2);
};
document.body.appendChild(script1);
