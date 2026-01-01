// Select DOM elements
const input = document.getElementById('pushup-input');
const addBtn = document.getElementById('add-btn');
const historyList = document.getElementById('history-list');
const monthTotalEl = document.getElementById('month-total');
const yearTotalEl = document.getElementById('year-total');

// Load data from LocalStorage on startup
let logs = JSON.parse(localStorage.getItem('pushupLogs')) || [];

// Initialize app
updateUI();

// Event Listener: Add Log
addBtn.addEventListener('click', () => {
    const count = parseInt(input.value);
    
    if (!count || count <= 0) {
        alert("Please enter a valid number");
        return;
    }

    const newLog = {
        id: Date.now(),
        count: count,
        date: new Date().toISOString()
    };

    logs.unshift(newLog); // Add to beginning of array
    saveData();
    updateUI();
    input.value = ''; // Clear input
});

// Event Listener: Delete Log (Event Delegation)
historyList.addEventListener('click', (e) => {
    if(e.target.classList.contains('delete-btn')) {
        const id = Number(e.target.dataset.id);
        if(confirm('Delete this entry?')) {
            logs = logs.filter(log => log.id !== id);
            saveData();
            updateUI();
        }
    }
});

// Save to LocalStorage
function saveData() {
    localStorage.setItem('pushupLogs', JSON.stringify(logs));
}

// Update UI
function updateUI() {
    renderStats();
    renderHistory();
}

// Calculate and Display Stats
function renderStats() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let monthSum = 0;
    let yearSum = 0;

    logs.forEach(log => {
        const logDate = new Date(log.date);
        
        // Check Year
        if (logDate.getFullYear() === currentYear) {
            yearSum += log.count;
            
            // Check Month (only if year matches)
            if (logDate.getMonth() === currentMonth) {
                monthSum += log.count;
            }
        }
    });

    monthTotalEl.textContent = monthSum.toLocaleString();
    yearTotalEl.textContent = yearSum.toLocaleString();
}

// Render History List
function renderHistory() {
    historyList.innerHTML = '';
    
    // Show only top 50 recent logs to keep it fast
    logs.slice(0, 50).forEach(log => {
        const dateObj = new Date(log.date);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <span class="count">${log.count} reps</span>
                <br>
                <span class="date">${dateStr}</span>
            </div>
            <button class="delete-btn" data-id="${log.id}">✕</button>
        `;
        historyList.appendChild(li);
    });
}