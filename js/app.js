document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо, чи вже є кнопка для бонусу. Якщо ні – створимо в кінці main або body.
    let bonusBtn = document.querySelector('.bonus-btn');
    if (!bonusBtn) {
        bonusBtn = document.createElement('button');
        bonusBtn.textContent = '⭐ Натисни мене! ⭐';
        bonusBtn.className = 'bonus-btn';
        bonusBtn.style.display = 'block';
        bonusBtn.style.margin = '20px auto';
        bonusBtn.style.padding = '10px 20px';
        bonusBtn.style.background = '#ff9800';
        bonusBtn.style.border = 'none';
        bonusBtn.style.borderRadius = '30px';
        bonusBtn.style.cursor = 'pointer';
        bonusBtn.style.fontSize = '1rem';
        
        // Знаходимо контейнер, куди додати (наприклад, main або footer)
        const main = document.querySelector('main');
        if (main) main.appendChild(bonusBtn);
        else document.body.appendChild(bonusBtn);
    }

    // Додаємо обробник події (click)
    bonusBtn.addEventListener('click', () => {
        const oldText = bonusBtn.textContent;
        bonusBtn.textContent = '❤️ ТИ НАТИСНУВ(ЛА) МЕНЕ!! ❤️';
        setTimeout(() => {
            bonusBtn.textContent = oldText;
        }, 1000);
    });
});