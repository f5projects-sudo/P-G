const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const revealElements = document.querySelectorAll('.reveal');
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

const setActiveLink = () => {
  let current = 'inicio';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', setActiveLink);
setActiveLink();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealElements.forEach(el => observer.observe(el));

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const payload = {
    nombre: data.get('nombre'),
    empresa: data.get('empresa'),
    email: data.get('email'),
    telefono: data.get('telefono'),
    mensaje: data.get('mensaje')
  };

  formMessage.textContent = 'Enviando mensaje...';

  try {
    const response = await fetch('https://n8n.automationf5networking.com/webhook/c7fe6f6b-c6e1-47b1-9dfd-27a848509052', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      formMessage.textContent = `Gracias, ${payload.nombre}. Hemos recibido su mensaje y nuestro equipo dará seguimiento a la brevedad.`;
      form.reset();
    } else {
      formMessage.textContent = 'Ocurrió un error al enviar el mensaje. Intente nuevamente.';
    }
  } catch (error) {
    formMessage.textContent = 'Error de conexión. Intente más tarde.';
  }
});