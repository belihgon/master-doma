// БУРГЕР МЕНЮ
const burgerBtn = document.getElementById('burgerBtn');
const mobileNav = document.getElementById('mobileNav');

if (burgerBtn) {
  burgerBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
  });
}

// МАСКА ТЕЛЕФОНА
function phoneMask(input) {
  if (!input) return;
  
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length === 0) {
      e.target.value = '';
    } else if (value.length <= 1) {
      e.target.value = '+7 (' + value;
    } else if (value.length <= 4) {
      e.target.value = '+7 (' + value.slice(1);
    } else if (value.length <= 7) {
      e.target.value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4);
    } else if (value.length <= 9) {
      e.target.value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7);
    } else {
      e.target.value = '+7 (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 9) + '-' + value.slice(9, 11);
    }
  });
}

// Применяем маску ко всем полям телефона
document.querySelectorAll('input[type="tel"]').forEach(phoneMask);

// МОДАЛЬНОЕ ОКНО
const modal = document.getElementById('leadModal');
const modalClose = document.getElementById('modalClose');
const modalForm = document.getElementById('modalForm');

function openModal(service = '') {
  if (!modal) return;
  const serviceField = document.getElementById('modal_service');
  if (serviceField && service) {
    serviceField.value = service;
  }
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  if (modalForm) modalForm.reset();
  const errorDiv = document.getElementById('modal_error');
  if (errorDiv) errorDiv.classList.remove('show');
}

if (modalClose) modalClose.addEventListener('click', closeModal);

// Закрытие по клику вне модалки
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// Кнопки открытия модалки
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const service = btn.getAttribute('data-service') || '';
    openModal(service);
  });
});

// ОСНОВНАЯ ФОРМА НА СТРАНИЦЕ
const leadForm = document.getElementById('leadForm');

function saveLeadToLocalStorage(data) {
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  leads.push({
    ...data,
    date: new Date().toISOString()
  });
  localStorage.setItem('leads', JSON.stringify(leads));
  localStorage.setItem('lastLead', JSON.stringify(data));
}

function validateForm(name, phone, consent) {
  if (!name || name.trim() === '') {
    return 'Введите имя';
  }
  if (!phone || phone.trim() === '' || phone.length < 10) {
    return 'Введите корректный номер телефона';
  }
  if (!consent) {
    return 'Подтвердите согласие на обработку данных';
  }
  return null;
}

function handleFormSubmit(form, isModal = false) {
  const name = form.querySelector('[name="name"]').value;
  const phone = form.querySelector('[name="phone"]').value;
  const service = form.querySelector('[name="service"]')?.value || '';
  const message = form.querySelector('[name="message"]')?.value || '';
  const consent = form.querySelector('#lead_consent')?.checked || form.querySelector('#modal_consent')?.checked;
  
  const errorDiv = form.querySelector('.error');
  const error = validateForm(name, phone, consent);
  
  if (error) {
    if (errorDiv) {
      errorDiv.textContent = error;
      errorDiv.classList.add('show');
    }
    return false;
  }
  
  if (errorDiv) errorDiv.classList.remove('show');
  
  const leadData = {
    name: name.trim(),
    phone: phone.trim(),
    service: service || 'Не указана',
    message: message.trim() || '—'
  };
  
  saveLeadToLocalStorage(leadData);
  
  // Редирект на страницу спасибо
  window.location.href = 'spasibo.html';
  return true;
}

if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(leadForm, false);
  });
}

if (modalForm) {
  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(modalForm, true);
  });
}

// ГАЛЕРЕЯ И ЛАЙТБОКС
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(imgSrc) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = imgSrc;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const imgSrc = item.getAttribute('data-img');
    if (imgSrc) openLightbox(imgSrc);
  });
});

// ПЛАВНАЯ АНИМАЦИЯ ПРИ СКРОЛЛЕ
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .gallery-item, .price-row, .about-grid, .form-card, .contacts-info').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ЗАКРЫТИЕ МОБИЛЬНОГО МЕНЮ ПРИ КЛИКЕ НА ССЫЛКУ
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('active');
  });
});

console.log('Сайт загружен!');