/* ============================================================
   Stephen's Asphalt Paving - Main JS
   Mobile nav, contact form, lightbox, sticky CTA, scroll reveal
   ============================================================ */

(function () {
  'use strict';

  // --- Mobile Nav ---
  var hamburger = document.querySelector('.hamburger');
  var overlay = document.querySelector('.nav-panel-overlay');

  function toggleNav() {
    document.body.classList.toggle('nav-open');
  }

  function closeNav() {
    document.body.classList.remove('nav-open');
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleNav);
  }

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  // Close nav when clicking panel links
  var panelLinks = document.querySelectorAll('.nav-panel a');
  panelLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });


  // --- Contact Form ---
  var form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;

      var data = {};
      var formData = new FormData(form);
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // Honeypot: silently drop bot submissions
      if (data._honey) {
        showFormSuccess(data.name);
        return;
      }

      btn.textContent = 'Sending...';
      btn.disabled = true;

      // FormSubmit delivers the lead by email - no server to maintain.
      data._subject = 'New Website Lead: ' + (data.name || 'Unknown') + " - Stephen's Asphalt";
      data._cc = 'evan.t.stephen@gmail.com';
      data._template = 'table';
      data._captcha = 'false';
      if (data.email) {
        data._replyto = data.email;
        data._autoresponse = "Thanks for reaching out to Stephen's Asphalt Paving. We got your request and will get back to you within one business day. If it's urgent, call us at (330) 284-9121.";
      }

      // Hashed FormSubmit alias for jacob@king-intelligence.com (keeps the address out of page source)
      fetch('https://formsubmit.co/ajax/a429c6527805c5da2eb44277baaad7df', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json && (json.success === 'true' || json.success === true)) {
            showFormSuccess(data.name);
          } else {
            showFormError(btn, originalText);
          }
        })
        .catch(function () {
          showFormError(btn, originalText);
        });
    });
  }

  function showFormSuccess(name) {
    var wrapper = document.getElementById('formWrapper');
    if (!wrapper) return;
    wrapper.innerHTML =
      '<div class="form-success">' +
      '<h3>Thanks, ' + escapeHTML(name || 'there') + '.</h3>' +
      '<p>We got your request and will reach out soon - usually within one business day.</p>' +
      '</div>';
  }

  function showFormError(btn, originalText) {
    if (btn) {
      btn.textContent = originalText || 'Send Request';
      btn.disabled = false;
    }
    if (document.querySelector('.form-error-msg')) return;
    var note = document.createElement('p');
    note.className = 'form-error-msg';
    note.style.color = '#b00020';
    note.style.marginTop = '12px';
    note.style.fontSize = '14px';
    note.innerHTML = "Sorry, something went wrong sending your request. Please call us at <a href=\"tel:+13302849121\">(330) 284-9121</a> and we'll take care of you.";
    var formEl = document.getElementById('contactForm');
    if (formEl) formEl.appendChild(note);
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }


  // --- Sticky Mobile Call Bar ---
  var stickyCall = document.getElementById('stickyCall');
  var heroEl = document.querySelector('.hero') || document.querySelector('.page-header');

  if (stickyCall && heroEl) {
    var stickyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            stickyCall.classList.remove('is-visible');
          } else {
            stickyCall.classList.add('is-visible');
          }
        });
      },
      { threshold: 0 }
    );
    stickyObserver.observe(heroEl);
  }


  // --- Scroll Reveal ---
  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }


  // --- Gallery Lightbox ---
  var galleryItems = document.querySelectorAll('.gallery-item img');

  if (galleryItems.length > 0) {
    var images = [];
    galleryItems.forEach(function (img) {
      images.push(img.src);
    });

    var currentIndex = 0;

    // Build lightbox DOM
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>' +
      '<img src="" alt="Project photo">' +
      '<button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector('img');
    var lbClose = lightbox.querySelector('.lightbox-close');
    var lbPrev = lightbox.querySelector('.lightbox-prev');
    var lbNext = lightbox.querySelector('.lightbox-next');

    function openLightbox(index) {
      currentIndex = index;
      lbImg.src = images[currentIndex];
      lightbox.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lbImg.src = images[currentIndex];
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      lbImg.src = images[currentIndex];
    }

    galleryItems.forEach(function (img, i) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function () {
        openLightbox(i);
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', showPrev);
    lbNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }
})();
