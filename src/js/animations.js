export function initAnimations() {
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const staggerSelectors = [
    '.hero-copy.reveal',
    '.hero-visual.reveal',
    '.section-heading.reveal',
    '.doc-grid.reveal',
    '.contract-structure.reveal',
    '.compare-grid.reveal',
    '.prep-layout.reveal',
    '.handover-layout.reveal',
    '.tax-wrapper.reveal',
    '.scenario-layout.reveal',
    '.glossary-grid.reveal',
    '.doc-center-grid.reveal',
    '.dashboard-grid.reveal',
    '#checklist-panel',
    '#explorer-layout .explorer-list',
    '.product-preview-list'
  ];
  document.querySelectorAll(staggerSelectors.join(',')).forEach((group) => {
    group.classList.add('motion-stagger');
    [...group.children].forEach((item, index) => {
      item.style.setProperty('--motion-index', String(Math.min(index, 7)));
    });
  });
  const principlesSection = document.getElementById('rental-principles');
  const principles = principlesSection ? [...principlesSection.querySelectorAll('.principle')] : [];
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)');
  const smallScreen = window.matchMedia('(max-width: 760px)');

  const updatePrinciples = () => {
    if (!principlesSection || principles.length === 0) return;
    const compactLayout = smallScreen.matches || prefersReducedMotion;
    if (compactLayout) {
      principles.forEach((step) => {
        step.classList.remove('is-active');
        step.setAttribute('aria-hidden', 'false');
      });
      principlesSection.style.setProperty('--pin-progress', '0');
      return;
    }

    const scrollRange = principlesSection.offsetHeight - window.innerHeight;
    const progress = scrollRange > 0
      ? Math.min(1, Math.max(0, -principlesSection.getBoundingClientRect().top / scrollRange))
      : 0;
    const activeIndex = Math.min(principles.length - 1, Math.floor(progress * principles.length));
    principlesSection.style.setProperty('--pin-progress', String(progress));
    principles.forEach((step, index) => {
      const active = index === activeIndex;
      step.classList.toggle('is-active', active);
      step.setAttribute('aria-hidden', String(!active));
    });
  };

  const initCardTilt = () => {
    if (prefersReducedMotion || !finePointer.matches) return;
    const cardSelector = '.doc-card, .contract-card';
    const resetTilt = (card) => {
      card.classList.remove('is-tilting');
      card.style.removeProperty('transform');
      card.style.removeProperty('box-shadow');
      card.style.removeProperty('border-color');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    };

    document.addEventListener('pointermove', (event) => {
      if (!finePointer.matches) return;
      const card = event.target instanceof Element ? event.target.closest(cardSelector) : null;
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.classList.add('is-tilting');
      card.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 5).toFixed(2)}deg) rotateY(${((x - 0.5) * 5).toFixed(2)}deg) translateY(-4px)`;
      card.style.boxShadow = '0 24px 54px rgba(0, 0, 0, 0.34), 0 0 24px rgba(201, 238, 87, 0.08)';
      card.style.borderColor = 'rgba(201, 238, 87, 0.42)';
      card.style.setProperty('--mouse-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${(y * 100).toFixed(1)}%`);
    });

    document.addEventListener('pointerout', (event) => {
      const card = event.target instanceof Element ? event.target.closest(cardSelector) : null;
      if (!card || (event.relatedTarget instanceof Node && card.contains(event.relatedTarget))) return;
      resetTilt(card);
    });

    finePointer.addEventListener('change', (event) => {
      if (event.matches) return;
      document.querySelectorAll('.doc-card.is-tilting, .contract-card.is-tilting').forEach(resetTilt);
    });
  };

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  let framePending = false;

  const updateScrollProgress = () => {
    framePending = false;
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const width = max > 0 ? (scrollTop / max) * 100 : 0;
    const bar = document.querySelector('.scroll-progress span');
    if (bar) {
      bar.style.width = `${width}%`;
    }
    updatePrinciples();
  };

  const scheduleUpdate = () => {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateScrollProgress);
    }
  };

  updateScrollProgress();
  initCardTilt();
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', () => {
    updatePrinciples();
    scheduleUpdate();
  });
}
