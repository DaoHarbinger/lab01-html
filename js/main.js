document.addEventListener('DOMContentLoaded', init);

function init() {
    initActiveNav();
    initMenuToggle();
    initThemeToggle();
    initBackToTop();
    initFooterYear();
    initAccordion();
    initFilters();
    initModal();
    initContactForm();
}

// 1. Підсвічування активної сторінки
function initActiveNav() {
    const current = window.location.pathname;
    const links = document.querySelectorAll('.nav-list a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (current.endsWith(href) || (current === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// 2. Бургер-меню
function initMenuToggle() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    if (window.innerWidth <= 768) {
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// 3. Тема + localStorage
function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const saved = localStorage.getItem('siteTheme');
    if (saved === 'dark') {
        document.body.classList.add('theme-dark');
        btn.textContent = '☀️';
    }
    btn.addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        const isDark = document.body.classList.contains('theme-dark');
        localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
        btn.textContent = isDark ? '☀️' : '🌙';
    });
}

// 4. Кнопка "Вгору"
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) btn.classList.add('show');
        else btn.classList.remove('show');
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// 5. Автоматичний рік у футері
function initFooterYear() {
    const footer = document.querySelector('.site-footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.innerHTML = footer.innerHTML.replace(/\d{4}/, year);
    }
}

// 6. Акордеон
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            content.classList.toggle('open');
        });
    });
}

// 7. Фільтрація карток
function initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#skillsGrid .card');
    if (!btns.length || !cards.length) return;
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cards.forEach(card => {
                const cat = card.dataset.category;
                card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
            });
        });
    });
}

// 8. Модальне вікно (lightbox)
function initModal() {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const close = document.querySelector('.modal-close');
    if (!modal || !modalImg) return;
    const triggers = document.querySelectorAll('.modal-trigger');
    triggers.forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modal.classList.add('open');
        });
    });
    const closeModal = () => {
        modal.classList.remove('open');
        modalImg.src = '';
    };
    close?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
}

// 9-10. Валідація, лічильник, чернетка, submit
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const charSpan = document.getElementById('charCount');
    const statusDiv = document.getElementById('formStatus');
    const DRAFT_KEY = 'contactDraft';

    function saveDraft() {
        const draft = {
            name: nameInput?.value || '',
            email: emailInput?.value || '',
            phone: document.getElementById('phone')?.value || '',
            topic: document.getElementById('topic')?.value || '',
            message: messageInput?.value || '',
            contactWay: document.querySelector('input[name="contactWay"]:checked')?.value || '',
            agree: document.querySelector('input[name="agree"]')?.checked || false
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
    function loadDraft() {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (!saved) return;
        try {
            const d = JSON.parse(saved);
            if (nameInput) nameInput.value = d.name;
            if (emailInput) emailInput.value = d.email;
            const phone = document.getElementById('phone');
            if (phone) phone.value = d.phone;
            const topic = document.getElementById('topic');
            if (topic && d.topic) topic.value = d.topic;
            if (messageInput) messageInput.value = d.message;
            const radio = document.querySelector(`input[name="contactWay"][value="${d.contactWay}"]`);
            if (radio) radio.checked = true;
            const agree = document.querySelector('input[name="agree"]');
            if (agree) agree.checked = d.agree;
        } catch(e) {}
    }
    function updateCharCount() {
        if (charSpan && messageInput) charSpan.textContent = messageInput.value.length;
    }
    function validate() {
        let valid = true;
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        if (!nameInput?.value.trim() || nameInput.value.trim().length < 2) {
            document.getElementById('nameError').textContent = 'Ім\'я має бути не менше 2 символів';
            valid = false;
        }
        const email = emailInput?.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email)) {
            document.getElementById('emailError').textContent = 'Введіть коректний email';
            valid = false;
        }
        if (!messageInput?.value.trim() || messageInput.value.trim().length < 10) {
            document.getElementById('messageError').textContent = 'Повідомлення має бути не менше 10 символів';
            valid = false;
        }
        return valid;
    }
    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        if (statusDiv) {
            statusDiv.innerHTML = `<div class="form-status success">✅ Дякуємо, ${data.name}! Ваше повідомлення надіслано (демо-режим).</div>`;
            setTimeout(() => statusDiv.innerHTML = '', 5000);
        }
        localStorage.removeItem(DRAFT_KEY);
        // form.reset(); // за бажанням
    }
    // слухачі
    if (nameInput) nameInput.addEventListener('input', saveDraft);
    if (emailInput) emailInput.addEventListener('input', saveDraft);
    if (messageInput) messageInput.addEventListener('input', () => { updateCharCount(); saveDraft(); });
    const phone = document.getElementById('phone');
    if (phone) phone.addEventListener('input', saveDraft);
    const topic = document.getElementById('topic');
    if (topic) topic.addEventListener('change', saveDraft);
    document.querySelectorAll('input[name="contactWay"]').forEach(r => r.addEventListener('change', saveDraft));
    const agree = document.querySelector('input[name="agree"]');
    if (agree) agree.addEventListener('change', saveDraft);
    form.addEventListener('submit', handleSubmit);
    loadDraft();
    updateCharCount();
}