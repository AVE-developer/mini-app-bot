let coinCount = 0;
const TAP_VALUE = 1; // Har bir bosish 1 koin beradi

// Elementlarni olish
const coinCountDisplay = document.getElementById('coin-count');
const tapButton = document.getElementById('tap-button');
const userIdDisplay = document.getElementById('user-id');

// 1. Telegram Mini App ni ishga tushirish
window.Telegram.WebApp.ready();

// Telegram orqali yuborilgan ma'lumotlarni olish
const initData = window.Telegram.WebApp.initDataUnsafe;

// Foydalanuvchi ma'lumotini ko'rsatish
if (initData.user) {
    // Agar bot orqali kirgan bo'lsa, foydalanuvchi ID sini ko'rsatamiz
    userIdDisplay.textContent = initData.user.id;
} else {
    userIdDisplay.textContent = "Bot orqali kirilmagan";
}

// 2. O'yin mantiqi (Koin yig'ish)
tapButton.addEventListener('click', () => {
    coinCount += TAP_VALUE;
    coinCountDisplay.textContent = coinCount;

    // Har 10 ta tapdan so'ng Telegram'dagi asosiy tugmani ko'rsatish
    if (coinCount > 0 && coinCount % 10 === 0) {
        showTelegramMainButton();
    }
});

// 3. Telegram MainButton (Ilovaning pastidagi asosiy tugma) funksiyasi
function showTelegramMainButton() {
    const MainButton = window.Telegram.WebApp.MainButton;
    
    // Tugma nomini o'rnatamiz
    MainButton.setText(`🎉 ${coinCount} AVECOINni Serverga Saqlash`);
    
    // Tugmani ko'rsatamiz
    MainButton.show();
    
    // Tugma bosilganda nima qilish kerakligini belgilaymiz
    MainButton.onClick(function() {
        alert(`${coinCount} AVECOIN serverga saqlandi!`);
        
        // Bu joyda asosan koinni serverga saqlash API chaqirig'i bo'ladi (Backend)
        
        // So'ngra tugmani yashirish
        MainButton.hide(); 
    });
}