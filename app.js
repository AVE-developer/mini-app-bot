lucide.createIcons();

// --- Elementlarni olish ---
const pageSections = document.querySelectorAll('.page-section');
const navButtons = document.querySelectorAll('.nav-btn');
const navBar = document.getElementById('nav-bar');
const balanceDisplay = document.querySelector('#home-section h2');
const botStatusText = document.getElementById('bot-status-text');
const activateBotBtn = document.getElementById('activate-bot-btn');

// --- Konfiguratsiya ---
const MINING_RATE_PER_SECOND = 1; // Har soniyada 1 AVE
const BOT_DURATION_HOURS = 8;     // Bot ishlaydigan vaqt (8 soat)
const BOT_DURATION_MS = BOT_DURATION_HOURS * 60 * 60 * 1000; // 8 soat millisekundda

// --- Ma'lumotlarni saqlash (Local Storage) ---
let state = {
    balance: parseInt(localStorage.getItem('balance')) || 0,
    botActiveUntil: parseInt(localStorage.getItem('botActiveUntil')) || 0,
};

// --- UI Yangilash Yordamchi Funksiyasi ---
function updateBalanceDisplay() {
    const formattedBalance = Math.floor(state.balance).toLocaleString();
    balanceDisplay.innerHTML = `${formattedBalance} <span class="text-2xl text-gray-500">AVE</span>`;
    localStorage.setItem('balance', state.balance.toString());
}

function updateBotStatusUI(isActive, timeLeft) {
    if (isActive) {
        // Bot aktiv holatda
        botStatusText.textContent = `ACTIVE 🟢 (${timeLeft})`;
        botStatusText.className = 'px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full shadow-lg';
        activateBotBtn.classList.add('hidden'); // Aktivlashtirish tugmasini yashirish
    } else {
        // Bot tugagan holatda
        botStatusText.textContent = `PASSIVE 🔴`;
        botStatusText.className = 'px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg';
        activateBotBtn.classList.remove('hidden'); // Aktivlashtirish tugmasini ko'rsatish
    }
}

// --- Mining Mantiqining Asosiy Funksiyasi ---
function startAutoMining() {
    const now = Date.now();
    
    // 1. Agar oldingi bot faoliyati tugagan bo'lsa, offlayn qazishni hisoblaymiz.
    if (state.botActiveUntil > now) {
        const lastCheckTime = parseInt(localStorage.getItem('lastCheckTime')) || now;
        
        // Botning aktiv bo'lishi tugagunga qadar offlayn qancha vaqt o'tganini hisoblash
        const activeDuration = Math.min(now, state.botActiveUntil) - lastCheckTime;
        
        // Shu vaqt ichida qancha AVE ishlab topilganini hisoblash
        const earnedCoins = Math.floor(activeDuration / 1000) * MINING_RATE_PER_SECOND;
        
        state.balance += earnedCoins;
        
        // Foydalanuvchiga qancha pul ishlaganini ko'rsatish mumkin (ixtiyoriy)
        if (earnedCoins > 0) {
             console.log(`Ofllayn rejimda ${earnedCoins} AVE ishlab topildi!`);
        }
    }
    
    localStorage.setItem('lastCheckTime', now.toString());
    updateBalanceDisplay(); // Balansni yangilash
    
    // 2. Har soniyada yangilanishni boshlash
    setInterval(() => {
        const currentTime = Date.now();
        const isActive = currentTime < state.botActiveUntil;

        if (isActive) {
            // Balansni 1 ga oshirish
            state.balance += MINING_RATE_PER_SECOND;
            updateBalanceDisplay();
            
            // Vaqtni hisoblash va UI ni yangilash
            const remainingMS = state.botActiveUntil - currentTime;
            const h = Math.floor(remainingMS / (60 * 60 * 1000));
            const m = Math.floor((remainingMS % (60 * 60 * 1000)) / (60 * 1000));
            const s = Math.floor((remainingMS % (60 * 1000)) / 1000);
            
            const timeLeft = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            updateBotStatusUI(true, timeLeft);
        } else {
            // Bot tugagan, PASSIVE holat
            updateBotStatusUI(false, null);
        }
        
        localStorage.setItem('lastCheckTime', currentTime.toString());
        
    }, 1000); // Har 1 sekundda
}

// --- Botni Aktivlashtirish Funksiyasi ---
activateBotBtn.addEventListener('click', () => {
    const now = Date.now();
    
    // Botni hozirdan boshlab 8 soatga aktivlashtirish
    state.botActiveUntil = now + BOT_DURATION_MS;
    
    // Local Storage'da yangilash
    localStorage.setItem('botActiveUntil', state.botActiveUntil.toString());
    
    // Tugma holatini to'g'irlash (vaqtni darhol ko'rsatish uchun)
    updateBotStatusUI(true, 'Bot launched...');
    
    // Foydalanuvchiga xabar berish (ixtiyoriy)
    alert(`The bot has been activated for 8 hours! Balance accumulation has begun.`);
    
    // Navigatsiyani qayta yuklash (yangi holatni ko'rsatish uchun)
    navigateTo('home');
});


// --- Page Navigation (Avvalgi kabi qoladi) ---
function navigateTo(targetPage) {
    pageSections.forEach(section => section.classList.add('hidden'));
    const targetSection = document.getElementById(`${targetPage}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    navBar.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-page') === targetPage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Navigation buttons
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.getAttribute('data-page');
        navigateTo(page);
    });
});

// --- Ilovani Yuklash ---
document.addEventListener('DOMContentLoaded', () => {
    // Balansni yuklash
    updateBalanceDisplay();
    
    // Barcha sectionlarni yashirish
    pageSections.forEach(section => section.classList.add('hidden'));
    
    // Asosiy sahifani yuklash
    navigateTo('home');
    
    // Mining logikasini boshlash
    startAutoMining(); 
});



