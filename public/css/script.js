// =========================================================
// RAITec — comportamento do site
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  const prefersReduced =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* =========================================================
     MENU MOBILE
     ========================================================= */

  const navToggle = document.querySelector('.navtoggle');
  const mainNav = document.querySelector('.mainnav');

  if (navToggle && mainNav) {

    navToggle.addEventListener('click', () => {

      const open = mainNav.classList.toggle('is-open');

      navToggle.setAttribute(
        'aria-expanded',
        String(open)
      );

    });

    mainNav.querySelectorAll('a').forEach(a => {

      a.addEventListener('click', () => {

        mainNav.classList.remove('is-open');

        navToggle.setAttribute(
          'aria-expanded',
          'false'
        );

      });

    });

  }


  /* =========================================================
     BOTÕES DE ROLAGEM
     ========================================================= */

  document.querySelectorAll('[data-scroll-to]').forEach(btn => {

    btn.addEventListener('click', () => {

      const target = document.querySelector(
        btn.getAttribute('data-scroll-to')
      );

      if (target) {

        target.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start'
        });

      }

    });

  });


  /* =========================================================
     REVELAR SEÇÕES AO ROLAR
     ========================================================= */

  const revealEls =
    document.querySelectorAll('.reveal-on-scroll');

  if (
    'IntersectionObserver' in window &&
    revealEls.length
  ) {

    const io = new IntersectionObserver(
      (entries) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add('is-visible');

            io.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.15
      }
    );

    revealEls.forEach(el => io.observe(el));

  } else {

    revealEls.forEach(el => {
      el.classList.add('is-visible');
    });

  }


  /* =========================================================
     LIGHTBOX
     ========================================================= */

  const lightbox =
    document.querySelector('[data-lightbox-overlay]');


  function openLightbox(caption, sourcePh) {

    if (!lightbox) return;


    const figure =
      lightbox.querySelector('[data-lightbox-figure]');

    const captionEl =
      lightbox.querySelector('[data-lightbox-caption]');


    if (figure && sourcePh) {

      const imageClass =
        Array.from(sourcePh.classList)
          .find(className =>
            className.startsWith('ph--')
          );


      // Remove classes antigas
      figure.className =
        'lightbox-figure ph';


      // Adiciona a classe da imagem clicada
      if (imageClass) {

        figure.classList.add(imageClass);

      }

    }


    if (captionEl) {

      captionEl.textContent = caption;

    }


    // Mostra o lightbox
    lightbox.hidden = false;


    requestAnimationFrame(() => {

      lightbox.classList.add('is-open');

    });


    // Impede a página de rolar por trás
    document.body.style.overflow = 'hidden';

  }


  function closeLightbox() {

    if (!lightbox) return;


    lightbox.classList.remove('is-open');


    document.body.style.overflow = '';


    setTimeout(() => {

      lightbox.hidden = true;

    }, 300);

  }


  // Botão X
  if (lightbox) {

    const closeButton =
      lightbox.querySelector('[data-lightbox-close]');


    if (closeButton) {

      closeButton.addEventListener(
        'click',
        closeLightbox
      );

    }


    // Fecha clicando fora da imagem
    lightbox.addEventListener(
      'click',
      (event) => {

        if (event.target === lightbox) {

          closeLightbox();

        }

      }
    );


    // Fecha com ESC
    document.addEventListener(
      'keydown',
      (event) => {

        if (
          event.key === 'Escape' &&
          !lightbox.hidden
        ) {

          closeLightbox();

        }

      }
    );

  }


  /* =========================================================
     CARROSSÉIS
     ========================================================= */

  document
    .querySelectorAll('[data-carousel]')
    .forEach(initCarousel);


  function initCarousel(root) {

    const track =
      root.querySelector('.carousel-track');

    const viewport =
      root.querySelector('.carousel-viewport');

    const slides =
      Array.from(
        root.querySelectorAll('.carousel-slide')
      );

    const prevBtn =
      root.querySelector('[data-prev]');

    const nextBtn =
      root.querySelector('[data-next]');

    const dotsWrap =
      root.querySelector('.dots');

    const clickable =
      root.getAttribute('data-clickable');


    if (
      !slides.length ||
      !track ||
      !viewport
    ) return;


    let index = 0;

    let itemWidth = 0;

    let gap = 0;

    let visibleCount = 1;

    let maxIndex = 0;

    let dots = [];


    function measure() {

      const trackStyles =
        getComputedStyle(track);


      gap =
        parseFloat(
          trackStyles.columnGap ||
          trackStyles.gap
        ) || 0;


      itemWidth =
        slides[0].getBoundingClientRect().width;


      visibleCount =
        itemWidth > 0

          ? Math.max(
              1,
              Math.round(
                (viewport.clientWidth + gap) /
                (itemWidth + gap)
              )
            )

          : 1;


      maxIndex =
        Math.max(
          0,
          slides.length - visibleCount
        );


      index =
        Math.min(index, maxIndex);


      buildDots();

      render();

    }


    function buildDots() {

      if (!dotsWrap) return;


      const wanted =
        maxIndex + 1;


      if (dots.length === wanted) return;


      dotsWrap.innerHTML = '';


      dots =
        Array.from(
          { length: wanted },
          (_, i) => {

            const button =
              document.createElement('button');


            button.type = 'button';


            button.setAttribute(
              'aria-label',
              `Ir para item ${i + 1}`
            );


            button.addEventListener(
              'click',
              () => go(i)
            );


            dotsWrap.appendChild(button);


            return button;

          }
        );

    }


    function render() {

      const offset =
        index * (itemWidth + gap);


      track.style.transform =
        `translateX(-${offset}px)`;


      dots.forEach((dot, i) => {

        dot.setAttribute(
          'aria-current',
          String(i === index)
        );

      });


      if (prevBtn) {

        prevBtn.disabled =
          index <= 0;

      }


      if (nextBtn) {

        nextBtn.disabled =
          index >= maxIndex;

      }

    }


    function go(i) {

      index =
        Math.min(
          Math.max(i, 0),
          maxIndex
        );


      render();

    }


    /* ---- setas ---- */

    if (prevBtn) {

      prevBtn.addEventListener(
        'click',
        () => go(index - 1)
      );

    }


    if (nextBtn) {

      nextBtn.addEventListener(
        'click',
        () => go(index + 1)
      );

    }


    /* ---- teclado ---- */

    root.setAttribute(
      'tabindex',
      '0'
    );


    root.addEventListener(
      'keydown',
      (event) => {

        if (event.key === 'ArrowLeft') {

          go(index - 1);

        }


        if (event.key === 'ArrowRight') {

          go(index + 1);

        }

      }
    );


    /* ---- swipe ---- */

    let startX = null;


    viewport.addEventListener(
      'pointerdown',
      (event) => {

        startX = event.clientX;

      }
    );


    viewport.addEventListener(
      'pointerup',
      (event) => {

        if (startX === null) return;


        const dx =
          event.clientX - startX;


        if (Math.abs(dx) > 40) {

          go(
            index +
            (dx < 0 ? 1 : -1)
          );

        }


        startX = null;

      }
    );


    /* =====================================================
       CLIQUE NA IMAGEM
       ===================================================== */


    // Caso seja um carrossel que leva para outra página
    if (clickable) {

      slides.forEach(slide => {

        slide.addEventListener(
          'click',
          () => {

            window.location.href =
              clickable;

          }
        );

      });

    }


    // Caso seja uma galeria com lightbox
    if (
      root.hasAttribute('data-lightbox') &&
      lightbox
    ) {

      slides.forEach(slide => {

        slide.addEventListener(
          'click',
          (event) => {

            // Impede o botão de executar comportamentos extras
            event.preventDefault();


            const sourcePh =
              slide.querySelector('.ph');


            const caption =
              slide.getAttribute(
                'data-caption'
              ) || '';


            openLightbox(
              caption,
              sourcePh
            );

          }
        );

      });

    }


    /* ---- autoplay ---- */

    const autoplayMs =
      parseInt(
        root.getAttribute(
          'data-autoplay'
        ),
        10
      );


    let autoplayTimer = null;


    if (
      autoplayMs &&
      !prefersReduced
    ) {


      const stopAutoplay = () => {

        if (autoplayTimer) {

          clearInterval(
            autoplayTimer
          );

          autoplayTimer = null;

        }

      };


      const startAutoplay = () => {

        stopAutoplay();


        autoplayTimer =
          setInterval(
            () => {

              go(
                index >= maxIndex
                  ? 0
                  : index + 1
              );

            },
            autoplayMs
          );

      };


      root.addEventListener(
        'mouseenter',
        stopAutoplay
      );


      root.addEventListener(
        'mouseleave',
        startAutoplay
      );


      root.addEventListener(
        'focusin',
        stopAutoplay
      );


      root.addEventListener(
        'focusout',
        startAutoplay
      );


      startAutoplay();

    }


    measure();


    window.addEventListener(
      'resize',
      debounce(
        measure,
        150
      )
    );

  }


  /* =========================================================
     TABS — VEM AÍ / EVENTOS ANTERIORES
     ========================================================= */

  const tabBtns =
    document.querySelectorAll(
      '[data-tab-target]'
    );


  if (tabBtns.length) {

    tabBtns.forEach(btn => {

      btn.addEventListener(
        'click',
        () => {


          const group =
            btn.closest(
              '.tab-switch'
            ).parentElement;


          group
            .querySelectorAll(
              '[data-tab-target]'
            )
            .forEach(button => {

              button.classList.remove(
                'is-active'
              );


              button.setAttribute(
                'aria-selected',
                'false'
              );

            });


          btn.classList.add(
            'is-active'
          );


          btn.setAttribute(
            'aria-selected',
            'true'
          );


          const targetId =
            btn.getAttribute(
              'data-tab-target'
            );


          group
            .querySelectorAll(
              '.event-list[id]'
            )
            .forEach(panel => {

              panel.hidden =
                panel.id !== targetId;

            });

        }
      );

    });

  }


  /* =========================================================
     ACORDEÃO
     ========================================================= */

  document
    .querySelectorAll(
      '[data-reveal-toggle]'
    )
    .forEach(btn => {


      const panel =
        document.getElementById(
          btn.getAttribute(
            'aria-controls'
          )
        );


      if (!panel) return;


      btn.addEventListener(
        'click',
        () => {


          const expanded =
            btn.getAttribute(
              'aria-expanded'
            ) === 'true';


          btn.setAttribute(
            'aria-expanded',
            String(!expanded)
          );


          panel.style.maxHeight =
            expanded
              ? '0px'
              : panel.scrollHeight + 'px';

        }
      );

    });


  /* =========================================================
     CONTADOR REGRESSIVO
     ========================================================= */

  document
    .querySelectorAll(
      '[data-countdown]'
    )
    .forEach(el => {


      const target =
        new Date(
          el.getAttribute(
            'data-countdown'
          )
        ).getTime();


      const daysEl =
        el.querySelector(
          '[data-unit="days"]'
        );


      const hoursEl =
        el.querySelector(
          '[data-unit="hours"]'
        );


      const minutesEl =
        el.querySelector(
          '[data-unit="minutes"]'
        );


      const secondsEl =
        el.querySelector(
          '[data-unit="seconds"]'
        );


      function pad(n) {

        return String(
          Math.max(n, 0)
        ).padStart(2, '0');

      }


      let timer;


      function tick() {


        const diff =
          target - Date.now();


        if (diff <= 0) {


          [
            daysEl,
            hoursEl,
            minutesEl,
            secondsEl
          ]
          .forEach(
            element => {

              if (element) {

                element.textContent =
                  '00';

              }

            }
          );


          el.dispatchEvent(
            new CustomEvent(
              'countdown:done'
            )
          );


          clearInterval(timer);


          return;

        }


        const d =
          Math.floor(
            diff / 86400000
          );


        const h =
          Math.floor(
            (diff % 86400000) /
            3600000
          );


        const m =
          Math.floor(
            (diff % 3600000) /
            60000
          );


        const s =
          Math.floor(
            (diff % 60000) /
            1000
          );


        if (daysEl) {

          daysEl.textContent =
            pad(d);

        }


        if (hoursEl) {

          hoursEl.textContent =
            pad(h);

        }


        if (minutesEl) {

          minutesEl.textContent =
            pad(m);

        }


        if (secondsEl) {

          secondsEl.textContent =
            pad(s);

        }

      }


      tick();


      timer =
        setInterval(
          tick,
          1000
        );

    });


  /* =========================================================
     PARALLAX
     ========================================================= */

  const parallaxTracks =
    document.querySelectorAll(
      '[data-parallax]'
    );


  if (parallaxTracks.length) {


    parallaxTracks.forEach(track => {


      const diamond =
        track.querySelector(
          '.parallax-diamond'
        );


      if (!diamond) return;


      if (prefersReduced) {

        diamond.style.left =
          '100%';


        return;

      }


      const duration =
        1600;


      let played =
        false;


      let locked =
        false;


      const blockWheel =
        (event) => {

          if (locked) {

            event.preventDefault();

          }

        };


      const blockTouch =
        (event) => {

          if (locked) {

            event.preventDefault();

          }

        };


      const blockKeys =
        (event) => {


          if (!locked) return;


          if (
            [
              'ArrowDown',
              'ArrowUp',
              'PageDown',
              'PageUp',
              ' '
            ]
            .includes(
              event.key
            )
          ) {

            event.preventDefault();

          }

        };


      function runAnimation() {


        if (played) return;


        played =
          true;


        locked =
          true;


        window.addEventListener(
          'wheel',
          blockWheel,
          {
            passive: false
          }
        );


        window.addEventListener(
          'touchmove',
          blockTouch,
          {
            passive: false
          }
        );


        window.addEventListener(
          'keydown',
          blockKeys
        );


        diamond.style.transition =
          `left ${duration}ms cubic-bezier(.5,0,.25,1)`;


        requestAnimationFrame(
          () => {

            diamond.style.left =
              '100%';

          }
        );


        setTimeout(
          () => {


            locked =
              false;


            window.removeEventListener(
              'wheel',
              blockWheel
            );


            window.removeEventListener(
              'touchmove',
              blockTouch
            );


            window.removeEventListener(
              'keydown',
              blockKeys
            );


          },
          duration + 80
        );

      }


      const io =
        new IntersectionObserver(
          (entries) => {


            entries.forEach(
              entry => {


                if (
                  entry.isIntersecting &&
                  entry.intersectionRatio >= 0.6
                ) {


                  runAnimation();


                  io.disconnect();

                }

              }
            );

          },
          {
            threshold: [0.6]
          }
        );


      io.observe(track);

    });

  }


  /* =========================================================
     DEBOUNCE
     ========================================================= */

  function debounce(fn, wait) {

    let timeout;


    return (...args) => {

      clearTimeout(timeout);


      timeout =
        setTimeout(
          () => fn(...args),
          wait
        );

    };

  }

});