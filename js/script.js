document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('#navbar a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('#navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.9)';
        } else {
            navbar.style.backgroundColor = 'transparent';
        }
    });

    // Form submission
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-Token': getCsrfToken(),
                    }
                });
                if (response.ok) {
                    alert('Gracias por tu mensaje. Te contactaremos pronto!');
                    this.reset();
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
            }
        });
    }

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Dynamic copyright year
    const currentYear = new Date().getFullYear();
    document.querySelector('footer p').textContent = `© ${currentYear} Mi Portafolio. Todos los derechos reservados.`;

    // Lazy loading for project images
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }

    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Función para obtener el token CSRF (debe implementarse en el backend)
function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

// Optimización de rendimiento para eventos de redimensionamiento
const debouncedResize = debounce(() => {
    // Código para manejar el redimensionamiento
    console.log('Window resized');
}, 250);

window.addEventListener('resize', debouncedResize);

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animaciones con GSAP (si está incluido)
if (typeof gsap !== 'undefined') {
    gsap.from('#home h2', { opacity: 0, y: 50, duration: 1, delay: 0.5 });
    gsap.from('.project-card', { 
        opacity: 0, 
        y: 50, 
        duration: 0.8, 
        stagger: 0.2, 
        scrollTrigger: {
            trigger: '#projects',
            start: 'top center'
        }
    });
}

// Añadir clase para animación fade-in
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
});

document.querySelector('#contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[name="name"]').value.trim();
    const email = this.querySelector('input[name="email"]').value.trim();
    const message = this.querySelector('textarea[name="message"]').value.trim();

    if (!name || !email || !message) {
        alert('Todos los campos son obligatorios');
        return;
    }

    if (!validateEmail(email)) {
        alert('Por favor, introduce un correo electrónico válido');
        return;
    }

    // Rest of the form submission logic
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

document.addEventListener('DOMContentLoaded', () => {
    // ... (mantén tu código existente aquí)

    // Inicializar ScrollMagic
    const controller = new ScrollMagic.Controller();

    // Animación para la sección de inicio
    const homeTimeline = gsap.timeline();
    homeTimeline.from('.home__title', {opacity: 0, y: 50, duration: 1})
                .from('.home__text', {opacity: 0, y: 30, duration: 1}, '-=0.5');

    new ScrollMagic.Scene({
        triggerElement: '#home',
        triggerHook: 0.8,
        reverse: false
    })
    .setTween(homeTimeline)
    .addTo(controller);

    // Animación para las tarjetas de proyectos
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        const cardAnim = gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 0.8,
            paused: true
        });

        new ScrollMagic.Scene({
            triggerElement: card,
            triggerHook: 0.9,
            reverse: false
        })
        .setTween(cardAnim)
        .addTo(controller);
    });

    // Animación para la sección "Sobre Mí"
    const aboutTimeline = gsap.timeline();
    aboutTimeline.from('.about__profile-pic', {opacity: 0, scale: 0.5, duration: 1})
                 .from('.about__text p', {opacity: 0, y: 30, stagger: 0.2, duration: 0.8}, '-=0.5');

    new ScrollMagic.Scene({
        triggerElement: '#about',
        triggerHook: 0.7,
        reverse: false
    })
    .setTween(aboutTimeline)
    .addTo(controller);

    // Animación para el formulario de contacto
    const contactTimeline = gsap.timeline();
    contactTimeline.from('.contact__form', {opacity: 0, scale: 0.9, duration: 1})
                   .from('.contact__input, .contact__textarea', {opacity: 0, y: 20, stagger: 0.2, duration: 0.5}, '-=0.5');

    new ScrollMagic.Scene({
        triggerElement: '#contact',
        triggerHook: 0.8,
        reverse: false
    })
    .setTween(contactTimeline)
    .addTo(controller);

    // Animación del navbar al hacer scroll
    new ScrollMagic.Scene({
        triggerElement: 'body',
        triggerHook: 0,
        offset: 100
    })
    .setClassToggle('.navbar', 'scrolled')
    .addTo(controller);
});
