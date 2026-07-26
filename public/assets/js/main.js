/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== ADD BLUR TO HEADER ===============*/
const blurHeader = () =>{
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the blur-header class to the header tag
    this.scrollY >= 50 ? header.classList.add('bg-header') 
                       : header.classList.remove('bg-header')
}
window.addEventListener('scroll', blurHeader)

/*=============== SWIPER HOME ===============*/
var homeSwiper = new Swiper(".home__swiper", {
    loop: true,
    spaceBetween: -24,
    grabCursor: true,
    slidesPerView: 'auto',
    centeredSlides: 'auto',

    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    breakpoints: {
        1220: {
            spaceBetween: -32,
        }
    }
});

/*=============== SWIPER TESTIMONIAL ===============*/
var testimonialSwiper = new Swiper(".testimonial__swiper", {
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 0,

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    breakpoints: {
        1150: {
            slidesPerView: 1,
            spaceBetween: 0,
        }
    }
});

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
    const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
    this.scrollY >= 350 ? scrollUp?.classList.add('show-scroll')
                        : scrollUp?.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () =>{
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            sectionsClass?.classList.add('active-link')
        }else{
            sectionsClass?.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-fill'

// Previously selected theme (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-fill' : 'ri-sun-fill'

// We validate if the user previously chose a theme
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-fill' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 300,
})

sr.reveal(`.home__data, .home__swiper, .footer__container, .scrollup, .home__data_cursos`)
sr.reveal(`.home__bird-1`, {delay: 500, origin: 'top'})
sr.reveal(`.home__bird-2`, {delay: 700, origin: 'top'})
sr.reveal(`.destination__card`, {interval: 100})
sr.reveal(`.testimonial__swiper, .testimonial__img`, {origin: 'right'})
sr.reveal(`.services__card`, {interval: 100, origin: 'bottom'})
sr.reveal(`.curso-card`, {interval: 200, origin: 'bottom'})


/*=============== FUNCIÓN MOSTRAR DETALLE DE CURSOS ===============*/
 // Función para mostrar detalles del curso
    function mostrarDetalle(cursoId) {
      // Ocultar todos los detalles primero
      document.querySelectorAll('.detalle-curso').forEach(detalle => {
        detalle.style.display = 'none';
      });
      
      // Mostrar el detalle seleccionado
      document.getElementById(`detalle-${cursoId}`).style.display = 'block';
      
      // Desplazarse suavemente al detalle
      document.getElementById(`detalle-${cursoId}`).scrollIntoView({
        behavior: 'smooth'
      });
    }
    
    // Filtrado de cursos por categoría
    document.querySelectorAll('.filtro-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        // Quitar clase active de todos los botones
        document.querySelectorAll('.filtro-btn').forEach(b => {
          b.classList.remove('active');
        });
        
        // Agregar clase active al botón clickeado
        this.classList.add('active');
        
        const categoria = this.dataset.categoria;
        const cursos = document.querySelectorAll('.curso-card');
        
        cursos.forEach(curso => {
          if (categoria === 'todos' || curso.dataset.categoria === categoria) {
            curso.style.display = 'block';
          } else {
            curso.style.display = 'none';
          }
        });
      });
    });

// Asegurar que la función esté disponible globalmente
window.mostrarDetalle = mostrarDetalle;