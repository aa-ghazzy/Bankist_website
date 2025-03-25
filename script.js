'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ///////////////////////////////////////////
// ///////////////////////////////////////////
// ///////////////////////////////////////////
// ///////////////////////////////////////////

const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');
const btnTabs = document.querySelectorAll('.operations__tab');
const btnTabContainer = document.querySelector('.operations__tab-container');
const header = document.querySelector('.header');
const allSecs = document.querySelectorAll('.section');
// const lazyImgs = document.querySelectorAll('.lazy-img');
const lazyImgs = document.querySelectorAll('img[data-src]');

// HANDLERS & CALLBACK FUNCS
const scrollDownHandler = function (e) {
  e.preventDefault();
  const id = e.target.getAttribute('href');
  document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
};

const mouseOverOutHandler = function (e) {
  // if (e.target.classList.contains('nav__link')) {
  if (e.target.matches('.nav__link')) {
    const siblingLinks = e.target
      .closest('.nav')
      .querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');

    siblingLinks.forEach(ele => {
      if (ele !== e.target) ele.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

const btnTabContainerHandler = function (e) {
  if (e.target.classList.contains('operations__tab--active')) return;

  const allBtn = btnTabContainer.querySelectorAll('.operations__tab');
  const allContents = btnTabContainer
    .closest('.operations')
    .querySelectorAll('.operations__content');

  const parentElement = btnTabContainer.closest('.operations');

  const tabsAnimation = function (element) {
    allBtn.forEach(btn => btn.classList.remove('operations__tab--active'));
    element.classList.add('operations__tab--active');

    allContents.forEach(content => {
      content.classList.remove('operations__content--active');
    });
    parentElement
      .querySelector(`.operations__content--${element.dataset.tab}`)
      .classList.add('operations__content--active');
  };

  // if (e.target.tagName === 'SPAN')
  if (e.target.matches('span'))
    tabsAnimation(e.target.closest('.operations__tab'));

  if (e.target.matches('.operations__tab')) tabsAnimation(e.target);
};

const navObserverCallback = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  });
};

const secsObserverCallback = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const imgObserverCallback = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () =>
      entry.target.classList.remove('lazy-img')
    );

    observer.unobserve(entry.target);
  });
};

// EVENT LISNTENRS & OBSERVERS
navLinks.forEach(function (navLink) {
  navLink.addEventListener('click', scrollDownHandler);
});

nav.addEventListener('mouseover', mouseOverOutHandler.bind(0.5));
nav.addEventListener('mouseout', mouseOverOutHandler.bind(1));

btnTabContainer.addEventListener('click', btnTabContainerHandler);

let navObserver = new IntersectionObserver(navObserverCallback, {
  root: null,
  threshold: 0.115,
});

navObserver.observe(header);

let secsObserver = new IntersectionObserver(secsObserverCallback, {
  root: null,
  threshold: 0.15,
});

allSecs.forEach(sec => {
  sec.classList.add('section--hidden'); //HIDDEN HIDDEN HIDDEN
  secsObserver.observe(sec);
});

let imgObserver = new IntersectionObserver(imgObserverCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //LOAD BEFORE SHOWING
});

lazyImgs.forEach(img => imgObserver.observe(img));

let currSlide = 0;

// SLIDER //
const slider = function () {
  // VARS
  const slides = document.querySelectorAll('.slide');
  const sliderBtnRight = document.querySelector('.slider__btn--right');
  const sliderBtnLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');

  // FUNCS
  const createDots = function () {
    let htmlEle = '';

    slides.forEach((_, i) => {
      const dot = `<button class="dots__dot" data-slide="${i}"></button>`;
      htmlEle += dot;
    });

    dotsContainer.insertAdjacentHTML('afterbegin', htmlEle);
  };

  const dotActive = function (slide) {
    dotsContainer
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));

    dotsContainer
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const slideTo = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const nextSlide = function () {
    if (currSlide === slides.length - 1) currSlide = 0;
    else currSlide++;

    slideTo(currSlide);
    dotActive(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) currSlide = slides.length - 1;
    else currSlide--;

    slideTo(currSlide);
    dotActive(currSlide);
  };

  // arrows
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
      dotActive(currSlide);
    }
    if (e.key === 'ArrowLeft') {
      prevSlide();
      dotActive(currSlide);
    }
  });

  dotsContainer.addEventListener('click', function (e) {
    if (!e.target.matches('.dots__dot')) return;
    currSlide = Number(e.target.dataset.slide); ///////////////////IMPORTANT
    dotActive(currSlide);
    slideTo(currSlide);
  });

  const init = function () {
    createDots();
    dotActive(0);
    slideTo(0);
  };

  init();

  // EVENT LISTENERS
  sliderBtnRight.addEventListener('click', nextSlide);
  sliderBtnLeft.addEventListener('click', prevSlide);
};

slider()
