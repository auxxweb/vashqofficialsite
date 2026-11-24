
  const carousel = document.getElementById('howItWorksCarousel');
  const indicators = document.getElementById('howItWorksIndicators');

  const slides = carousel.querySelectorAll('.carousel-item');

  slides.forEach((slide, index) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.setAttribute('data-bs-target', '#howItWorksCarousel');
    button.setAttribute('data-bs-slide-to', index);
    button.setAttribute('aria-label', `Step ${index + 1}`);

    if (index === 0) {
      button.classList.add('active');
      button.setAttribute('aria-current', 'true');
    }

    indicators.appendChild(button);
  });
