(function () {
  var LANGS = ["it", "en", "fr", "de"];
  var SKIP =
    ".omama-lang-codes, svg, script, style, noscript, .char, .word, [data-omama-map], .omama-map-legend, .leaflet-container, .omama-map-pop, .js-nexttab-button";

  // Pages are published once per language under /it, /en, /fr and /de, so the
  // URL and the <html lang> attribute are the source of truth. Translating in
  // the browser is only needed for copy this script builds itself (maps,
  // newsletter, booking panel).
  function staticI18n() {
    return document.documentElement.getAttribute("data-omama-i18n") === "static";
  }

  function currentLang() {
    var match = location.pathname.match(/^\/(it|en|fr|de)(\/|$)/);
    if (match) return match[1];
    var attr = (document.documentElement.lang || "").slice(0, 2).toLowerCase();
    if (LANGS.indexOf(attr) !== -1) return attr;
    try {
      return sessionStorage.getItem("omama-lang") || "it";
    } catch (e) {
      return "it";
    }
  }

  function pagePath(page, lang) {
    lang = lang || currentLang();
    return page === "homepage" ? "/" + lang : "/" + lang + "/" + page;
  }

  function isHome() {
    var path = location.pathname.replace(/\/$/, "");
    return LANGS.some(function (lang) {
      return path === "/" + lang;
    }) || path.indexOf("/homepage") !== -1;
  }

  // Same page, another language.
  function translatedUrl(lang) {
    var path = location.pathname.replace(/^\/(it|en|fr|de)(?=\/|$)/, "/" + lang);
    if (path === location.pathname) path = "/" + lang;
    return path + location.search + location.hash;
  }

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function isoDate(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function linguaInt(lang) {
    return { it: "ita", en: "eng", fr: "fra", de: "deu" }[lang] || "ita";
  }

  function bookUrl(lang, search) {
    var q =
      "lingua_int=" +
      linguaInt(lang) +
      "&id_albergo=21301&dc=6913&id_stile=";
    if (search && search.checkin && search.checkout) {
      var a = String(search.checkin).split("-");
      var b = String(search.checkout).split("-");
      q +=
        "&gg=" +
        a[2] +
        "&mm=" +
        a[1] +
        "&aa=" +
        a[0] +
        "&ggf=" +
        b[2] +
        "&mmf=" +
        b[1] +
        "&aaf=" +
        b[0] +
        "&tot_adulti=" +
        search.adults +
        "&tot_camere=" +
        search.rooms +
        "&tot_bambini=" +
        search.children;
      if (search.code) q += "&generic_codice=" + encodeURIComponent(search.code);
    }
    return "https://book.blastness.com/results?" + q;
  }

  function bookPanel() {
    return document.querySelector(".omama-book-panel");
  }

  function bookForm() {
    return document.querySelector("[data-omama-book-form]");
  }

  function fillDefaultDates(form) {
    if (!form) return;
    var inEl = form.querySelector('[name="checkin"]');
    var outEl = form.querySelector('[name="checkout"]');
    if (!inEl || !outEl) return;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var start = new Date(today);
    start.setDate(start.getDate() + 1);
    var end = new Date(start);
    end.setDate(end.getDate() + 2);
    inEl.min = isoDate(today);
    if (!inEl.value) inEl.value = isoDate(start);
    outEl.min = inEl.value;
    if (!outEl.value || outEl.value <= inEl.value) outEl.value = isoDate(end);
  }

  function readSearch(form) {
    return {
      checkin: form.checkin.value,
      checkout: form.checkout.value,
      adults: form.adults.value || "2",
      children: form.children.value || "0",
      rooms: form.rooms.value || "1",
      code: (form.code.value || "").trim(),
    };
  }

  function resetBookPanel() {
    var panel = bookPanel();
    var results = document.querySelector("[data-omama-book-results]");
    var form = bookForm();
    if (panel) panel.classList.remove("is-results");
    if (results) results.innerHTML = "";
    fillDefaultDates(form);
  }

  function copy(lang) {
    var rows = {
      it: {
        loading: "Cerco le camereâ€¦",
        empty: "Nessuna disponibilitÃ  per queste date.",
        error: "Non riesco a leggere il motore. Riprova.",
        from: "da",
        book: "Prenota",
        taxes: "tasse incluse",
        nights: "notti",
        guests: "ospiti",
        pay: "Il pagamento si conclude sul motore ufficiale OMAMA.",
      },
      en: {
        loading: "Looking for roomsâ€¦",
        empty: "No availability for these dates.",
        error: "The booking engine is unavailable. Try again.",
        from: "from",
        book: "Book",
        taxes: "taxes included",
        nights: "nights",
        guests: "guests",
        pay: "Payment is completed on the official OMAMA engine.",
      },
      fr: {
        loading: "Recherche des chambresâ€¦",
        empty: "Aucune disponibilitÃ© pour ces dates.",
        error: "Le moteur de rÃ©servation est indisponible. RÃ©essayez.",
        from: "Ã  partir de",
        book: "RÃ©server",
        taxes: "taxes incluses",
        nights: "nuits",
        guests: "personnes",
        pay: "Le paiement se termine sur le moteur officiel OMAMA.",
      },
      de: {
        loading: "Zimmer werden gesuchtâ€¦",
        empty: "Keine VerfÃ¼gbarkeit fÃ¼r diese Daten.",
        error: "Die Buchungsmaschine ist nicht erreichbar. Bitte erneut versuchen.",
        from: "ab",
        book: "Buchen",
        taxes: "inkl. Steuern",
        nights: "NÃ¤chte",
        guests: "GÃ¤ste",
        pay: "Die Zahlung erfolgt Ã¼ber die offizielle OMAMA-Buchung.",
      },
    };
    return rows[lang] || rows.it;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatPrice(amount, currency) {
    try {
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: currency || "EUR",
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (e) {
      return amount + " â‚¬";
    }
  }

  function renderResults(data, search) {
    var box = document.querySelector("[data-omama-book-results]");
    var t = copy(currentLang());
    if (!box) return;
    if (!data || !data.rooms || !data.rooms.length) {
      box.innerHTML = '<p class="omama-book-empty">' + escapeHtml(t.empty) + "</p>";
      return;
    }
    var html =
      '<p class="omama-book-summary">' +
      escapeHtml(data.nights + " " + t.nights) +
      "</p>";
    data.rooms.forEach(function (room) {
      var rate = room.rates && room.rates[0];
      html += '<article class="omama-book-room">';
      if (room.image) {
        html +=
          '<div class="omama-book-photo"><img src="' +
          escapeHtml(room.image) +
          '" alt=""></div>';
      }
      html += '<div class="omama-book-copy">';
      html += "<h3>" + escapeHtml(room.name) + "</h3>";
      if (room.short) html += "<p>" + escapeHtml(room.short) + "</p>";
      var meta = [];
      if (room.size) meta.push(room.size);
      if (room.guests) meta.push(room.guests + " " + t.guests);
      if (rate && rate.meal) meta.push(rate.meal);
      if (meta.length) html += '<p class="omama-book-meta">' + escapeHtml(meta.join(" Â· ")) + "</p>";
      html +=
        '<div class="omama-book-price"><span>' +
        escapeHtml(t.from) +
        "</span> <strong>" +
        escapeHtml(formatPrice(room.from, data.currency)) +
        "</strong> <em>" +
        escapeHtml(t.taxes) +
        "</em></div>";
      if (rate && rate.url) {
        html +=
          '<a class="omama-book-go" href="' +
          escapeHtml(rate.url) +
          '" target="_blank" rel="noopener">' +
          escapeHtml(t.book) +
          "</a>";
      }
      html += "</div></article>";
    });
    html += '<p class="omama-book-note">' + escapeHtml(t.pay) + "</p>";
    box.innerHTML = html;
  }

  function showBookResults(search) {
    var panel = bookPanel();
    var box = document.querySelector("[data-omama-book-results]");
    var t = copy(currentLang());
    if (panel) panel.classList.add("is-results");
    if (box) box.innerHTML = '<p class="omama-book-empty">' + escapeHtml(t.loading) + "</p>";
    fetch("/api/booking/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkin: search.checkin,
        checkout: search.checkout,
        adults: Number(search.adults || 2),
        children: Number(search.children || 0),
        rooms: Number(search.rooms || 1),
        lang: currentLang(),
        code: search.code || "",
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (out) {
        if (!out.ok) throw new Error(out.data && out.data.error);
        renderResults(out.data, search);
      })
      .catch(function () {
        if (box) box.innerHTML = '<p class="omama-book-empty">' + escapeHtml(t.error) + "</p>";
      });
  }

  function syncBook(lang) {
    var url = bookUrl(lang);
    document.querySelectorAll(
      ".open-modal-btn, .cta_book, [data-omama-book], .omama-contact-form a.button"
    ).forEach(function (el) {
      if (el.tagName === "A") el.setAttribute("href", url);
    });
  }

  function bookModalEls() {
    var modal = document.querySelector('.js-modal[data-id="monday"]');
    return {
      modal: modal,
      panel: modal && (modal.querySelector(".modal-blocker") || modal),
    };
  }

  function closeBookModal() {
    resetBookPanel();
    var els = bookModalEls();
    if (els.modal) els.modal.classList.remove("open");
    document.body.classList.remove("noscroll");
    if (window.emitter) {
      try {
        // Emit first: some theme handlers apply their own transform on close.
        // We then run GSAP after, so it "wins" and slides the panel out to the right.
        window.emitter.emit("evt-modal-close-monday");
      } catch (e) {}
    }
    if (window.gsap && els.modal && els.panel) {
      window.gsap.to(els.panel, { xPercent: 120, duration: 0.9, ease: "power2.inOut", overwrite: true });
      window.gsap.to(els.modal, { autoAlpha: 0, duration: 0.4, delay: 0.5, overwrite: "auto" });
    }
    if (window.lenis && typeof window.lenis.start === "function") {
      try {
        window.lenis.start();
      } catch (e) {}
    }
  }

  function ensureBookClose() {
    var modal = document.querySelector('.js-modal[data-id="monday"]');
    if (!modal) return;
    var host = modal.querySelector(".modal-blocker") || modal;
    var btn = host.querySelector(".omama-book-close");
    if (btn) return;
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "omama-book-close";
    btn.setAttribute("aria-label", textFor("Chiudi", currentLang()));
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
    host.appendChild(btn);
  }

  var bookUiHooked = false;

  function hookBookUi() {
    ensureBookClose();
    if (bookUiHooked) return;
    bookUiHooked = true;
    document.addEventListener(
      "click",
      function (e) {
        var close = e.target.closest &&
          e.target.closest(
            '.js-modal[data-id="monday"] .js-close-button, .js-modal[data-id="monday"] .blocker, .omama-book-close'
          );
        if (!close) return;
        var modal = document.querySelector('.js-modal[data-id="monday"]');
        if (!modal || !modal.classList.contains("open")) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        closeBookModal();
      },
      true
    );
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var modal = document.querySelector('.js-modal[data-id="monday"].open');
      if (!modal) return;
      e.preventDefault();
      closeBookModal();
    });
  }

  var cta360Hooked = false;
  var cta360Modal = null;

  function ensureCta360Modal() {
    if (cta360Modal) return cta360Modal;

    var root = document.querySelector(".omama-cta360-modal");
    if (root) {
      cta360Modal = root;
      return cta360Modal;
    }

    root = document.createElement("div");
    root.className = "omama-cta360-modal";
    root.setAttribute("aria-hidden", "true");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "Photo");
    root.style.display = "none";
    root.style.position = "fixed";
    root.style.inset = "0";
    root.style.zIndex = "100000";
    root.style.background = "rgba(0,0,0,0.75)";
    root.style.alignItems = "center";
    root.style.justifyContent = "center";
    root.style.padding = "18px";
    root.style.backdropFilter = "blur(2px)";

    var img = document.createElement("img");
    img.className = "omama-cta360-img";
    img.alt = "";
    img.decoding = "async";
    img.loading = "eager";
    img.style.maxWidth = "92vw";
    img.style.maxHeight = "92vh";
    img.style.objectFit = "contain";
    img.style.display = "block";
    img.style.borderRadius = "var(--border-radius, 16px)";
    img.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
    root.appendChild(img);

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "omama-cta360-close";
    closeBtn.setAttribute("aria-label", textFor("Chiudi", currentLang()));
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "18px";
    closeBtn.style.right = "18px";
    closeBtn.style.width = "56px";
    closeBtn.style.height = "56px";
    closeBtn.style.border = "0";
    closeBtn.style.borderRadius = "10px";
    closeBtn.style.background = "#ab54f7";
    closeBtn.style.color = "#111";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.display = "flex";
    closeBtn.style.alignItems = "center";
    closeBtn.style.justifyContent = "center";
    closeBtn.style.zIndex = "2";
    closeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
    root.appendChild(closeBtn);

    root._cta360Img = img;
    root._cta360CloseBtn = closeBtn;

    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeCta360Modal();
    });

    // Click sul backdrop = chiudi
    root.addEventListener("click", function (e) {
      if (e.target === root) closeCta360Modal();
    });

    document.addEventListener(
      "keydown",
      function (e) {
        if (e.key !== "Escape") return;
        if (!cta360Modal || cta360Modal.style.display === "none") return;
        e.preventDefault();
        closeCta360Modal();
      },
      true
    );

    document.body.appendChild(root);
    cta360Modal = root;
    return cta360Modal;
  }

  function openCta360Modal(src) {
    if (!src) return;
    var root = ensureCta360Modal();
    if (!root || !root._cta360Img) return;

    root._cta360Img.src = src;
    root.style.display = "flex";
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("noscroll");
  }

  function closeCta360Modal() {
    if (!cta360Modal) return;
    if (cta360Modal._cta360Img) cta360Modal._cta360Img.src = "";
    cta360Modal.style.display = "none";
    cta360Modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("noscroll");
  }

  var PHOTO_SKIP =
    "header, footer, .preloader, #block-cursor, .omama-cta360-modal, .leaflet-container, .omama-map-legend, section.hero, .swiper-button-prev, .swiper-button-next";

  function isPhoto(img) {
    if (!img || img.tagName !== "IMG") return false;
    var src = img.currentSrc || img.getAttribute("src") || "";
    if (!/\.(jpe?g|png|webp|avif)(\?|$)/i.test(src)) return false;
    if (img.classList.contains("omama-logo-img")) return false;
    if (img.closest(PHOTO_SKIP)) return false;
    return true;
  }

  function photoSrc(img) {
    return img.currentSrc || img.getAttribute("src") || "";
  }

  // Valutata a ogni evento: le pagine cambiano con Barba, quindi marcare gli
  // elementi una volta sola non basta.
  function photoFromEvent(e) {
    var el = e.target;
    if (!el || el.tagName !== "IMG") return null;
    return isPhoto(el) ? el : null;
  }

  var eyeCursorEl = null;
  var eyeCursorMove = null;

  function ensureEyeCursor() {
    if (eyeCursorEl) return eyeCursorEl;
    var el = document.createElement("div");
    el.className = "omama-eye-cursor";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="73.8107" height="73.8107" rx="36.9053" fill="#FF6100"/>' +
      '<path d="M36.5467 28.7042C28.0373 28.7042 21.3232 37.403 21.3232 37.403C21.3232 37.403 28.0373 46.1029 36.5467 46.1029C43.0533 46.1029 51.7701 37.403 51.7701 37.403C51.7701 37.403 43.0533 28.7042 36.5467 28.7042ZM36.5467 42.8225C33.5584 42.8225 31.126 40.3913 31.126 37.403C31.126 34.4147 33.5584 31.9823 36.5467 31.9823C39.535 31.9823 41.9674 34.4147 41.9674 37.403C41.9674 40.3913 39.535 42.8225 36.5467 42.8225ZM36.5467 34.2388C36.1262 34.2308 35.7084 34.3068 35.3176 34.4622C34.9268 34.6176 34.5709 34.8494 34.2707 35.144C33.9706 35.4385 33.7321 35.79 33.5693 36.1777C33.4066 36.5655 33.3227 36.9819 33.3227 37.4024C33.3227 37.823 33.4066 38.2393 33.5693 38.6271C33.7321 39.0149 33.9706 39.3663 34.2707 39.6609C34.5709 39.9554 34.9268 40.1872 35.3176 40.3426C35.7084 40.4981 36.1262 40.574 36.5467 40.5661C37.3754 40.5504 38.1649 40.2102 38.7454 39.6186C39.326 39.027 39.6512 38.2313 39.6512 37.4024C39.6512 36.5736 39.326 35.7778 38.7454 35.1862C38.1649 34.5946 37.3754 34.2544 36.5467 34.2388Z" fill="#6C2FAD"/>' +
      '<line x1="25.2857" y1="21.6884" x2="28.925" y2="27.1474" stroke="#6C2FAD" stroke-width="1.64024"/>' +
      '<line y1="-0.820118" x2="6.56095" y2="-0.820118" transform="matrix(-0.5547 0.83205 0.83205 0.5547 49.207 22.1433)" stroke="#6C2FAD" stroke-width="1.64024"/>' +
      '<line x1="36.9061" y1="18.8628" x2="36.9061" y2="25.4237" stroke="#6C2FAD" stroke-width="1.64024"/>' +
      "</svg>";
    document.body.appendChild(el);
    eyeCursorEl = el;
    if (window.gsap && window.gsap.quickTo) {
      var toX = window.gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      var toY = window.gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
      eyeCursorMove = function (x, y) {
        toX(x);
        toY(y);
      };
      window.gsap.set(el, { scale: 0 });
    } else {
      eyeCursorMove = function (x, y) {
        el.style.transform = "translate(" + x + "px, " + y + "px)";
      };
    }
    return el;
  }

  function showEyeCursor(x, y) {
    var el = ensureEyeCursor();
    if (eyeCursorMove) eyeCursorMove(x, y);
    el.classList.add("is-visible");
    if (window.gsap) window.gsap.to(el, { scale: 1, duration: 0.4, ease: "expo.out" });
  }

  function hideEyeCursor() {
    if (!eyeCursorEl) return;
    eyeCursorEl.classList.remove("is-visible");
    if (window.gsap) window.gsap.to(eyeCursorEl, { scale: 0, duration: 0.35, ease: "expo.out" });
  }

  function hookEyeCursor() {
    var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    document.addEventListener("mouseover", function (e) {
      var img = photoFromEvent(e);
      // Il tema Units gestisce gia' il cursore dentro i suoi contenitori [data-cursor]
      if (!img || img.closest("[data-cursor]")) return;
      img.style.cursor = "pointer";
      showEyeCursor(e.clientX, e.clientY);
    });

    document.addEventListener("mouseout", function (e) {
      if (!photoFromEvent(e)) return;
      hideEyeCursor();
    });

    document.addEventListener("mousemove", function (e) {
      if (!eyeCursorEl || !eyeCursorMove) return;
      eyeCursorMove(e.clientX, e.clientY);
    });
  }

  function hookCta360() {
    if (cta360Hooked) return;
    cta360Hooked = true;

    hookEyeCursor();

    document.addEventListener(
      "click",
      function (e) {
        var img = photoFromEvent(e);
        if (!img) return;
        if (img.closest("a[data-fancybox], a.cta_360")) return;
        var src = photoSrc(img);
        if (!src) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        hideEyeCursor();
        openCta360Modal(src);
      },
      true
    );

    document.addEventListener(
      "click",
      function (e) {
        var a =
          e.target &&
          e.target.closest &&
          e.target.closest("a.cta_360, a[data-fancybox]");
        if (!a) return;

        var href = a.getAttribute("href") || (a.dataset && a.dataset.src) || "";
        if (/\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i.test(href) === false) return;
        href = String(href || "").trim();
        if (!href) return;

        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        openCta360Modal(href);
      },
      true
    );
  }

  function openBookModal() {
    resetBookPanel();
    ensureBookClose();
    var els = bookModalEls();
    if (!els.modal) return;
    els.modal.classList.add("open");
    document.body.classList.add("noscroll");
    if (window.gsap) {
      window.gsap.set(els.modal, { autoAlpha: 1, opacity: 1, visibility: "visible" });
      window.gsap.fromTo(
        els.panel,
        { xPercent: 120 },
        { xPercent: 0, duration: 0.9, ease: "power2.inOut", overwrite: true }
      );
    } else {
      els.modal.style.opacity = "1";
      els.modal.style.visibility = "visible";
      els.modal.style.pointerEvents = "auto";
      els.panel.style.transform = "translate(0, 0)";
    }
    if (window.lenis && typeof window.lenis.stop === "function") {
      try {
        window.lenis.stop();
      } catch (e) {}
    }
    if (window.emitter) {
      try {
        window.emitter.emit("evt-modal-open-monday");
      } catch (e) {}
    }
  }

  function initBookForm() {
    var form = bookForm();
    if (!form || form.getAttribute("data-omama-ready")) return;
    form.setAttribute("data-omama-ready", "1");
    fillDefaultDates(form);

    form.addEventListener("change", function (e) {
      if (e.target && e.target.name === "checkin") {
        var outEl = form.querySelector('[name="checkout"]');
        if (!outEl) return;
        outEl.min = form.checkin.value;
        if (outEl.value && outEl.value <= form.checkin.value) {
          var next = new Date(form.checkin.value);
          next.setDate(next.getDate() + 1);
          outEl.value = isoDate(next);
        }
      }
    });

    form.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var search = readSearch(form);
        if (!search.checkin || !search.checkout) return;
        showBookResults(search);
      },
      true
    );

    var edit = form.querySelector("[data-omama-book-edit]");
    if (edit) {
      edit.addEventListener("click", function () {
        resetBookPanel();
      });
    }
  }

  function setLang(lang) {
    try {
      sessionStorage.setItem("omama-lang", lang);
    } catch (e) {}
    document.documentElement.lang = lang;
    document.querySelectorAll(".omama-lang-codes [data-lang]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-lang") === lang);
    });
    var labels = { it: "Lingua", en: "Language", fr: "Langue", de: "Sprache" };
    document.querySelectorAll(".omama-lang-codes").forEach(function (nav) {
      nav.setAttribute("aria-label", labels[lang] || "Lingua");
    });
  }

  function norm(s) {
    return String(s || "")
      .replace(/\u00a0/g, " ")
      .replace(/[\u2018\u2019\u02BC\u0060\u00B4']/g, "'")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function depth(el) {
    var n = 0;
    while (el && el.parentElement) {
      n += 1;
      el = el.parentElement;
    }
    return n;
  }

  function textFor(key, lang) {
    var row = window.OMAMA_I18N && window.OMAMA_I18N[key];
    if (!row) return key;
    if (lang === "it") return row.it || key;
    return row[lang] || row.it || key;
  }

  function hasEntry(key) {
    return !!(window.OMAMA_I18N && window.OMAMA_I18N[key]);
  }

  function setContent(el, value) {
    if (!el || value == null) return;
    if (/<[a-z][\s\S]*>/i.test(value)) {
      el.innerHTML = value;
      return;
    }
    if (el.childElementCount && el.querySelector("br, strong, em, a, span.char, div")) {
      el.innerHTML = value;
      return;
    }
    if (el.childElementCount === 0) {
      el.textContent = value;
      return;
    }
    var onlyText = true;
    for (var i = 0; i < el.childNodes.length; i += 1) {
      var node = el.childNodes[i];
      if (node.nodeType === 1 && node.tagName !== "BR") {
        onlyText = false;
        break;
      }
    }
    if (onlyText) el.textContent = value;
    else el.innerHTML = value;
  }

  function applyTitle(lang) {
    var titles = window.OMAMA_TITLES;
    if (!titles) return;
    var path = location.pathname;
    var key = "homepage";
    if (path.indexOf("/camere") !== -1) key = "camere";
    else if (path.indexOf("/living") !== -1) key = "living";
    else if (path.indexOf("/omamamood") !== -1) key = "omamamood";
    else if (path.indexOf("/richiesta") !== -1) key = "richiesta";
    else if (path.indexOf("/mappa") !== -1) key = "mappa";
    else if (path.indexOf("/demo") !== -1) key = "demo";
    else if (path.indexOf("/aosta") !== -1) key = "aosta";
    if (titles[key] && titles[key][lang]) document.title = titles[key][lang];
  }

  var i18nIndex = null;

  function buildI18nIndex() {
    i18nIndex = Object.create(null);
    var dict = window.OMAMA_I18N || {};
    Object.keys(dict).forEach(function (key) {
      var row = dict[key] || {};
      [key, row.it, row.en, row.fr, row.de].forEach(function (value) {
        if (!value) return;
        var plain = norm(String(value));
        if (!plain) return;
        if (plain.length < 2 && plain !== "e") return;
        var prev = i18nIndex[plain];
        if (!prev || key.length >= prev.length) i18nIndex[plain] = key;
      });
    });
  }

  function lookupKey(text) {
    if (!text) return "";
    if (!i18nIndex) buildI18nIndex();
    if (hasEntry(text)) return text;
    return i18nIndex[norm(text)] || "";
  }

  function applyAttrs(lang) {
    document.querySelectorAll("[aria-label]").forEach(function (el) {
      if (el.closest(".omama-lang-codes")) return;
      var stored = el.getAttribute("data-i18n-aria") || el.getAttribute("aria-label");
      var key = lookupKey(stored);
      if (!key || !hasEntry(key)) return;
      el.setAttribute("data-i18n-aria", key);
      el.setAttribute("aria-label", norm(textFor(key, lang)));
    });
    document.querySelectorAll("a[title], button[title]").forEach(function (el) {
      var stored = el.getAttribute("data-i18n-title") || el.getAttribute("title");
      var key = lookupKey(stored);
      if (!key || !hasEntry(key)) return;
      el.setAttribute("data-i18n-title", key);
      el.setAttribute("title", norm(textFor(key, lang)));
    });
    document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(function (el) {
      var stored = el.getAttribute("data-i18n-placeholder") || el.getAttribute("placeholder");
      var key = lookupKey(stored);
      if (!key || !hasEntry(key)) return;
      el.setAttribute("data-i18n-placeholder", key);
      el.setAttribute("placeholder", norm(textFor(key, lang)));
    });
  }

  function applyLang(lang) {
    if (!window.OMAMA_I18N) return;
    buildI18nIndex();
    setLang(lang);

    // Pre-rendered pages already ship the right copy, title and labels: only
    // the widgets this script creates at runtime need translating.
    if (staticI18n()) {
      syncBook(lang);
      refreshMapCopy();
      restyleNewsletter();
      return;
    }

    applyTitle(lang);
    syncBook(lang);
    applyAttrs(lang);

    var nodes = document.querySelectorAll(
      "span, p, a, button, strong, label, h1, h2, h3, h4, li, div.title, div.subtitle, div.description, address"
    );
    var items = [];
    nodes.forEach(function (el) {
      if (el.closest(SKIP)) return;
      if (el.classList.contains("omama-mark") || el.classList.contains("omama-hotel") || el.classList.contains("omama-wordmark") || el.classList.contains("omama-credit")) return;
      if (el.classList.contains("checkbox") || el.getAttribute("for") === "agreeToTerms") return;
      if (el.classList.contains("char") || el.classList.contains("word")) return;
      if (el.querySelector(".shape-overlays")) return;
      var stored = el.getAttribute("data-i18n");
      var key = stored && hasEntry(stored) ? stored : lookupKey(norm(el.innerText));
      if (!key || !hasEntry(key)) return;
      if (!stored && key.length < 2 && key !== "e") return;
      items.push({
        el: el,
        key: key,
        depth: depth(el),
        stored: !!stored,
        len: (window.OMAMA_I18N[key].it || key).length,
      });
    });
    items.sort(function (a, b) {
      if (a.stored !== b.stored) return a.stored ? -1 : 1;
      if (b.len !== a.len) return b.len - a.len;
      return b.depth - a.depth;
    });

    var claimed = [];
    items.forEach(function (item) {
      var el = item.el;
      var blocked = claimed.some(function (other) {
        return (other.contains(el) || el.contains(other)) && other !== el;
      });
      if (blocked) return;
      if (!el.getAttribute("data-i18n")) el.setAttribute("data-i18n", item.key);
      setContent(el, textFor(item.key, lang));
      claimed.push(el);
    });
    refreshMapCopy();
    restyleNewsletter();
  }

  function finishIntro() {
    var pre = document.querySelector(".preloader");
    if (window.gsap) {
      window.gsap.killTweensOf(".preloader");
      window.gsap.killTweensOf(".preloader *");
      window.gsap.killTweensOf("header");
      window.gsap.killTweensOf(".hero .image-wrap");
      window.gsap.killTweensOf(".hero .image-wrap img, .hero .image-wrap video");
      window.gsap.killTweensOf(".hero .inner-wrap > *");
      if (pre) {
        window.gsap.set(pre, { opacity: 0, pointerEvents: "none", display: "none" });
      }
      window.gsap.set("header", { x: "0%" });
      window.gsap.set(".hero .image-wrap", {
        borderRadius: "var(--border-radius)",
        bottom: 0,
        height: "100%",
        left: 0,
        marginTop: 0,
        overflow: "hidden",
        position: "absolute",
        width: "100%",
      });
      window.gsap.set(".hero .image-wrap img, .hero .image-wrap video", { y: 0 });
      window.gsap.set(
        ".hero .inner-wrap > span, .hero .inner-wrap > a, .hero .inner-wrap > button",
        { opacity: 1, y: 0 }
      );
    }
    if (pre) {
      pre.style.display = "none";
      pre.style.opacity = "0";
      pre.style.pointerEvents = "none";
    }
    document.body.style.opacity = "1";
  }

  try {
    if (sessionStorage.getItem("omama-entered") === "1") {
      document.documentElement.classList.add("omama-skip-preloader");
    } else {
      sessionStorage.setItem("omama-entered", "1");
    }
  } catch (e) {}

  document.addEventListener(
    "click",
    function (e) {
      var langBtn = e.target.closest(".omama-lang-codes [data-lang]");
      if (langBtn) {
        var wanted = langBtn.getAttribute("data-lang");
        e.preventDefault();
        e.stopPropagation();
        // Each language is its own URL, so switching means navigating there
        // instead of rewriting the current document.
        if (staticI18n()) {
          if (wanted !== currentLang()) {
            location.assign(langBtn.getAttribute("href") || translatedUrl(wanted));
          }
        } else {
          applyLang(wanted);
        }
        return;
      }

      var bookBtn = e.target.closest(
        ".open-modal-btn, .cta_book, [data-omama-book], .omama-contact-form a.button, a.cta.button"
      );
      if (bookBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        openBookModal();
        return;
      }

      var logo = e.target.closest("header a.logo");
      if (logo && isHome()) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  function loadLeaflet(cb) {
    if (window.L) {
      cb();
      return;
    }
    if (window.__omamaLeafletLoading) {
      window.__omamaLeafletLoading.push(cb);
      return;
    }
    window.__omamaLeafletLoading = [cb];
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);
    var s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = function () {
      var fns = window.__omamaLeafletLoading || [];
      window.__omamaLeafletLoading = null;
      fns.forEach(function (fn) {
        fn();
      });
    };
    document.head.appendChild(s);
  }

  function mapT(it) {
    var pack = window.OMAMA_I18N && window.OMAMA_I18N[it];
    var lang = currentLang();
    if (!pack) return it;
    if (lang === "it") return pack.it || it;
    return pack[lang] || pack.en || it;
  }

  var MAP_ICO = {
    hotel:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10l8-6 8 6v10"/><path d="M9 20v-6h6v6"/></svg>',
    arch:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><path d="M5 21V11a7 7 0 0 1 14 0v10"/><path d="M9 21v-7h6v7"/></svg>',
    gate:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><path d="M3 21V10a4 4 0 0 1 6 0v11"/><path d="M9 21V8a3.5 3.5 0 0 1 6 0v13"/><path d="M15 21V10a4 4 0 0 1 6 0v11"/></svg>',
    theatre:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><path d="M5 20V8"/><path d="M10 20V6"/><path d="M14 20V6"/><path d="M19 20V8"/><path d="M4 8h16"/></svg>',
    church:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4"/><path d="M10 5h4"/><path d="M6 21V11l6-4 6 4v10"/><path d="M10 21v-5h4v5"/></svg>',
    train:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="12" rx="2"/><path d="M8 20h8"/><path d="M8 16v4"/><path d="M16 16v4"/><path d="M6 10h12"/></svg>',
    pila:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19h18"/><path d="M5 19l5.5-10 3 5 2-3.5L19 19"/><path d="M8 9l2-4 2 4"/></svg>',
    bike:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="16.5" r="3"/><circle cx="17.5" cy="16.5" r="3"/><path d="M6.5 16.5L10 9h4l4 7.5"/><path d="M10 9l-2 4h6"/></svg>',
    tower:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V8l6-4 6 4v13"/><path d="M10 21v-6h4v6"/><path d="M9 11h6"/></svg>',
    square:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="1"/><path d="M8 8V5h8v3"/><path d="M12 12v4"/></svg>',
    start:
      '<svg viewBox="0 0 24 24" fill="#111" stroke="#111" stroke-width="0.6" stroke-linejoin="round"><path d="M12 3.2l2.35 6.62h7.05l-5.7 4.18 2.18 6.7L12 16.9l-5.88 3.8 2.18-6.7-5.7-4.18h7.05z"/></svg>',
  };

  var MAP_SPOTS = [
    {
      name: "Arco di Augusto",
      lat: 45.73916,
      lng: 7.32785,
      walk: "5 min",
      color: "#FFB200",
      icon: "arch",
      text: "25 a.C. Lâ€™ingresso orientale sulla via delle Gallie.",
    },
    {
      name: "Porta Praetoria",
      lat: 45.73772,
      lng: 7.3254,
      walk: "2 min",
      color: "#E6313A",
      icon: "gate",
      text: "La porta est delle mura. Due minuti da Via Torino 14.",
    },
    {
      name: "Teatro Romano",
      lat: 45.7386,
      lng: 7.32229,
      walk: "5 min",
      color: "#267E6E",
      icon: "theatre",
      text: "La facciata di 22 metri, ancora in cittÃ .",
    },
    {
      name: "Cattedrale",
      lat: 45.73735,
      lng: 7.31925,
      walk: "8 min",
      color: "#111111",
      icon: "church",
      text: "Santa Maria Assunta. Criptoportico e tesoro accanto.",
    },
    {
      name: "Santâ€™Orso",
      lat: 45.73805,
      lng: 7.3274,
      walk: "6 min",
      color: "#E6313A",
      icon: "church",
      text: "Collegiata, chiostro romanico, stalli intagliati.",
    },
    {
      name: "Piazza Chanoux",
      lat: 45.73722,
      lng: 7.32035,
      walk: "7 min",
      color: "#111111",
      icon: "square",
      text: "Il salotto civico. Municipio, portici, caffÃ¨ sotto i portici.",
    },
    {
      name: "Torre dei Balivi",
      lat: 45.73855,
      lng: 7.32175,
      walk: "6 min",
      color: "#E6313A",
      icon: "tower",
      text: "Angolo nord-est delle mura. Il bailliage medioevale.",
    },
    {
      name: "Stazione",
      lat: 45.73415,
      lng: 7.3229,
      walk: "4 min",
      color: "#267E6E",
      icon: "train",
      text: "FS Aosta. Torino e Milano senza scali alpini.",
    },
    {
      name: "Cabinovia Pila",
      lat: 45.72935,
      lng: 7.3189,
      walk: "8 min",
      color: "#AB54F7",
      icon: "pila",
      text: "Partenza valle. Pila in cabina, non in coda in auto.",
    },
  ];

  function mapPopup(title, walk, text) {
    return (
      '<div class="omama-map-pop">' +
      "<strong>" +
      mapT(title) +
      "</strong>" +
      (walk ? "<span>" + mapT(walk) + "</span>" : "") +
      "<p>" +
      mapT(text) +
      "</p></div>"
    );
  }

  function walkLayer(layer, fn) {
    if (!layer) return;
    fn(layer);
    if (layer.eachLayer) {
      layer.eachLayer(function (child) {
        walkLayer(child, fn);
      });
    }
  }

  function refreshMapCopy() {
    document.querySelectorAll("[data-omama-map]").forEach(function (el) {
      var map = el._omamaMap;
      if (!map) return;
      walkLayer(map, function (layer) {
        if (!layer._omamaPop || !layer.setPopupContent) return;
        var pop = layer._omamaPop;
        layer.setPopupContent(mapPopup(pop.title, pop.walk, pop.text));
      });
      el.querySelectorAll("[data-map-i18n]").forEach(function (node) {
        node.textContent = mapT(node.getAttribute("data-map-i18n"));
      });
    });
  }

  function mapIcon(svg, color, kind) {
    var start = kind === "start";
    return window.L.divIcon({
      className: "omama-map-ico-wrap" + (start ? " is-start" : ""),
      html:
        '<span class="omama-map-ico' +
        (start ? " is-start" : "") +
        '" style="background:' +
        color +
        '">' +
        svg +
        "</span>",
      iconSize: start ? [42, 52] : [34, 42],
      iconAnchor: start ? [21, 52] : [17, 42],
      popupAnchor: start ? [0, -44] : [0, -36],
    });
  }

  function paintOmamaMap(el) {
    var L = window.L;
    var lat = parseFloat(el.getAttribute("data-lat")) || 45.736969;
    var lng = parseFloat(el.getAttribute("data-lng")) || 7.325019;
    var isFull = el.hasAttribute("data-omama-map-full");
    var zoom = parseFloat(el.getAttribute("data-zoom")) || (isFull ? 14 : 15);
    var map = L.map(el, {
      scrollWheelZoom: isFull,
      attributionControl: false,
      zoomControl: true,
    }).setView([lat, lng], zoom);
    el._omamaMap = map;

    if (map.zoomControl) map.zoomControl.setPosition(isFull ? "topright" : "bottomright");

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    var centroLayer = null;
    var cycleLayer = null;
    var riverLayer = null;
    var parkLayer = null;
    fetch("/omama-aosta-geo.json")
      .then(function (res) {
        return res.json();
      })
      .then(function (geo) {
        parkLayer = L.featureGroup().addTo(map);
        (geo.parks || []).forEach(function (item) {
          var ring = item.ring || item;
          if (!ring || ring.length < 4) return;
          var poly = L.polygon(ring, {
            color: "#8AA35A",
            weight: 0,
            fillColor: "#B9CC8A",
            fillOpacity: 0.42,
            interactive: true,
          }).addTo(parkLayer);
          var parkName = item.name && item.name !== "Parco" ? item.name : "Parco";
          if (parkName === "Saumont") parkName = "Parco Saumont";
          poly.bindPopup(
            mapPopup(parkName, "Verde urbano", "Parchi e giardini della piana, come sulla carta della cittÃ .")
          );
          poly._omamaPop = {
            title: parkName,
            walk: "Verde urbano",
            text: "Parchi e giardini della piana, come sulla carta della cittÃ .",
          };
        });

        riverLayer = L.featureGroup().addTo(map);
        (geo.river || []).forEach(function (line) {
          L.polyline(line, {
            color: "#6E9EC4",
            weight: 5,
            opacity: 0.88,
            lineCap: "round",
            lineJoin: "round",
            interactive: true,
          })
            .addTo(riverLayer)
            .bindPopup(
              mapPopup(
                "Dora Baltea",
                "Fiume",
                "Il fiume a sud della cittÃ . Lungo la riva corre la Ciclovia Baltea."
              )
            );
          riverLayer.getLayers().slice(-1)[0]._omamaPop = {
            title: "Dora Baltea",
            walk: "Fiume",
            text: "Il fiume a sud della cittÃ . Lungo la riva corre la Ciclovia Baltea.",
          };
        });

        (geo.rail || []).forEach(function (line) {
          L.polyline(line, {
            color: "#9a9a9a",
            weight: 1.4,
            opacity: 0.55,
            dashArray: "5 7",
            interactive: false,
          }).addTo(map);
        });

        if (geo.centro && geo.centro.length) {
          centroLayer = L.polygon(geo.centro, {
            color: "#111",
            weight: 0,
            fillColor: "#FFB200",
            fillOpacity: 0.22,
            interactive: true,
          }).addTo(map);
          centroLayer.bindPopup(
            mapPopup(
              "Centro storico",
              "2 min",
              "Le mura di Augusta Praetoria. Il centro storico vero, a due minuti."
            )
          );
          centroLayer._omamaPop = {
            title: "Centro storico",
            walk: "2 min",
            text: "Le mura di Augusta Praetoria. Il centro storico vero, a due minuti.",
          };
          centroLayer.on("mouseover", function () {
            centroLayer.setStyle({ fillOpacity: 0.34 });
          });
          centroLayer.on("mouseout", function () {
            centroLayer.setStyle({ fillOpacity: 0.22 });
          });
        }
        (geo.walls || []).forEach(function (line) {
          L.polyline(line, {
            color: "#1a1a1a",
            weight: 3.2,
            opacity: 0.88,
            lineJoin: "round",
            interactive: false,
          }).addTo(map);
        });
        var cycleGroup = L.featureGroup().addTo(map);
        (geo.cycle || []).forEach(function (item) {
          var line = item.line || item;
          var id = item.id || "";
          var isRiverPath = id === "dora" || id === "s3";
          var layer = L.polyline(line, {
            color: "#267E6E",
            weight: id === "p1" ? 4.5 : isRiverPath ? 3 : 4,
            opacity: 0.92,
            dashArray: isRiverPath ? "7 8" : null,
            lineCap: "round",
            lineJoin: "round",
          }).addTo(cycleGroup);
          var walk = "P1 Â· Via Torino";
          var text =
            "Direttrice estâ€“ovest: Battaglione, Festaz, Via Torino, Corso Ivrea. Passa sotto OMAMA.";
          if (id === "p2") {
            walk = "P2 Â· Elter / Parigi";
            text = "Direttrice nordâ€“sud: via Elter, via Parigi, Tzamberlet. Collega Cogne a VÃ©loDoire.";
          } else if (id === "dora") {
            walk = "Ciclovia Baltea";
            text = "Lungo la Dora. Si collega alla cabinovia Pila e alla plaine.";
          } else if (id === "s3") {
            walk = "Buthier Â· Saumont";
            text = "Lungo il Buthier fino al parco Saumont e al parcheggio Consolata.";
          }
          layer.bindPopup(mapPopup(item.name || "Ciclabile", walk, text));
          layer._omamaPop = { title: item.name || "Ciclabile", walk: walk, text: text };
        });
        cycleLayer = cycleGroup;
      })
      .catch(function () {});

    MAP_SPOTS.forEach(function (spot) {
      var marker = L.marker([spot.lat, spot.lng], {
        icon: mapIcon(MAP_ICO[spot.icon], spot.color),
        zIndexOffset: 200,
        title: mapT(spot.name),
      })
        .addTo(map)
        .bindPopup(mapPopup(spot.name, spot.walk, spot.text));
      marker._omamaPop = { title: spot.name, walk: spot.walk, text: spot.text };
    });

    var startMarker = L.marker([lat, lng], {
      icon: mapIcon(MAP_ICO.start, "#ab54f7", "start"),
      zIndexOffset: 900,
      title: mapT("Punto di partenza"),
    })
      .addTo(map)
      .bindPopup(
        mapPopup(
          "OMAMA Social Hotel",
          "Punto di partenza",
          "Via Torino 14. Tutti i tempi di percorrenza partono da qui."
        )
      );
    startMarker._omamaPop = {
      title: "OMAMA Social Hotel",
      walk: "Punto di partenza",
      text: "Via Torino 14. Tutti i tempi di percorrenza partono da qui.",
    };

    var legend = L.control({ position: isFull ? "bottomright" : "bottomleft" });
    legend.onAdd = function () {
      var box = L.DomUtil.create("div", "omama-map-legend");
      box.innerHTML =
        '<button type="button" class="omama-map-legend-toggle" aria-expanded="false">' +
        '<span data-map-i18n="Aosta, a piedi">' +
        mapT("Aosta, a piedi") +
        "</span>" +
        '<svg class="omama-map-legend-chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="#111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</button>" +
        '<div class="omama-map-legend-panel" hidden>' +
        '<button type="button" data-centro="1"><i class="omama-map-leg-swatch" style="background:#FFB200"></i>' +
        '<span data-map-i18n="Centro storico">' +
        mapT("Centro storico") +
        "</span></button>" +
        '<button type="button" data-cycle="1"><span class="omama-map-leg-ico" style="background:#267E6E">' +
        MAP_ICO.bike +
        "</span>" +
        '<span data-map-i18n="Ciclabile">' +
        mapT("Ciclabile") +
        "</span></button>" +
        '<button type="button" data-river="1"><i class="omama-map-leg-swatch" style="background:#6E9EC4"></i>' +
        '<span data-map-i18n="Dora Baltea">' +
        mapT("Dora Baltea") +
        "</span></button>" +
        '<button type="button" data-parks="1"><i class="omama-map-leg-swatch" style="background:#B9CC8A"></i>' +
        '<span data-map-i18n="Parchi">' +
        mapT("Parchi") +
        "</span></button>" +
        '<button type="button" data-start="1"><span class="omama-map-leg-ico" style="background:#ab54f7">' +
        MAP_ICO.start +
        "</span>" +
        '<span data-map-i18n="Punto di partenza">' +
        mapT("Punto di partenza") +
        "</span></button>" +
        MAP_SPOTS.map(function (spot) {
          return (
            '<button type="button" data-spot="' +
            spot.name +
            '"><span class="omama-map-leg-ico" style="background:' +
            spot.color +
            '">' +
            MAP_ICO[spot.icon] +
            '</span><span data-map-i18n="' +
            spot.name.replace(/"/g, "") +
            '">' +
            mapT(spot.name) +
            "</span></button>"
          );
        }).join("") +
        "</div>";
      L.DomEvent.disableClickPropagation(box);
      L.DomEvent.disableScrollPropagation(box);
      var toggle = box.querySelector(".omama-map-legend-toggle");
      var panel = box.querySelector(".omama-map-legend-panel");
      function setLegendOpen(open) {
        box.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
      }
      toggle.addEventListener("click", function () {
        setLegendOpen(!box.classList.contains("is-open"));
      });
      if (isFull) setLegendOpen(true);
      box.addEventListener("keydown", function (event) {
        if (event.key === "Escape") setLegendOpen(false);
      });
      function markActive(btn) {
        panel.querySelectorAll("button").forEach(function (item) {
          item.classList.toggle("is-active", item === btn);
        });
      }
      box.querySelector("[data-centro]").addEventListener("click", function () {
        if (!centroLayer) return;
        markActive(this);
        map.fitBounds(centroLayer.getBounds(), { padding: [32, 32], maxZoom: 16 });
        centroLayer.openPopup();
      });
      box.querySelector("[data-cycle]").addEventListener("click", function () {
        if (!cycleLayer) return;
        markActive(this);
        map.fitBounds(cycleLayer.getBounds(), { padding: [36, 36], maxZoom: 15 });
      });
      box.querySelector("[data-river]").addEventListener("click", function () {
        if (!riverLayer || !riverLayer.getLayers().length) return;
        markActive(this);
        map.fitBounds(riverLayer.getBounds(), { padding: [36, 36], maxZoom: 14 });
      });
      box.querySelector("[data-parks]").addEventListener("click", function () {
        if (!parkLayer || !parkLayer.getLayers().length) return;
        markActive(this);
        map.fitBounds(parkLayer.getBounds(), { padding: [36, 36], maxZoom: 15 });
      });
      box.querySelector("[data-start]").addEventListener("click", function () {
        markActive(this);
        map.flyTo([lat, lng], 17, { duration: 0.7 });
      });
      box.querySelectorAll("[data-spot]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var spot = MAP_SPOTS.find(function (item) {
            return item.name === btn.getAttribute("data-spot");
          });
          if (!spot) return;
          markActive(btn);
          map.flyTo([spot.lat, spot.lng], 17, { duration: 0.7 });
        });
      });
      return box;
    };
    legend.addTo(map);

    el._omamaMap = map;
    function sizeMap() {
      map.invalidateSize();
    }
    setTimeout(sizeMap, 80);
    setTimeout(sizeMap, 200);
    setTimeout(sizeMap, 800);
    if (isFull) {
      setTimeout(sizeMap, 1400);
      window.addEventListener("resize", sizeMap);
    }
  }

  function isFullMapPage() {
    return !!(
      document.querySelector("[data-omama-map-full]") ||
      document.querySelector('[data-barba-namespace="mappa"]')
    );
  }

  function syncMapPageMode() {
    var on = isFullMapPage();
    var home =
      location.pathname.indexOf("/homepage") !== -1 ||
      !!document.querySelector('[data-barba-namespace*="homepage"]');
    document.body.classList.toggle("omama-map-page", on);
    document.body.classList.toggle("home", home && !on);
    if (!on) {
      document.body.classList.remove("omama-rail-collapsed");
      var btn = document.querySelector(".omama-rail-toggle");
      if (btn) btn.remove();
    }
  }

  function mapIsLive(el) {
    if (!el || !el.isConnected || !el._omamaMap) return false;
    try {
      if (el._omamaMap.getContainer && el._omamaMap.getContainer() !== el) return false;
    } catch (e) {
      return false;
    }
    return !!el.querySelector(".leaflet-pane, .leaflet-map-pane");
  }

  function watchMapVisible(el) {
    if (!el || el._omamaIo || typeof IntersectionObserver === "undefined") return;
    el._omamaIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          mountOmamaMap(el);
        });
      },
      { threshold: 0.01, rootMargin: "80px" }
    );
    el._omamaIo.observe(el);
  }

  function destroyOmamaMaps(root) {
    var scope = root || document;
    if (!scope || !scope.querySelectorAll) return;
    scope.querySelectorAll("[data-omama-map]").forEach(function (el) {
      resetLeafletEl(el);
    });
  }

  function resetLeafletEl(el) {
    if (el._omamaIo) {
      try {
        el._omamaIo.disconnect();
      } catch (e) {}
      el._omamaIo = null;
    }
    if (el._omamaMap) {
      try {
        el._omamaMap.remove();
      } catch (e) {}
      el._omamaMap = null;
    }
    if (el._leaflet_id) {
      try {
        delete el._leaflet_id;
      } catch (e) {
        el._leaflet_id = undefined;
      }
    }
    el.className = el.className
      .split(/\s+/)
      .filter(function (name) {
        return name && name.indexOf("leaflet") !== 0;
      })
      .join(" ");
    el.innerHTML = "";
  }

  function mountOmamaMap(el) {
    if (!el || !el.isConnected) return;
    if (!window.L) {
      initOmamaMaps();
      return;
    }
    if (el._omamaMounting) return;
    if (mapIsLive(el)) {
      try {
        el._omamaMap.invalidateSize();
      } catch (e) {}
      watchMapVisible(el);
      return;
    }
    if (el._omamaMountAt && Date.now() - el._omamaMountAt < 120) return;
    el._omamaMountAt = Date.now();
    el._omamaMounting = true;
    try {
      resetLeafletEl(el);
      paintOmamaMap(el);
    } catch (e) {
      resetLeafletEl(el);
      try {
        paintOmamaMap(el);
      } catch (err) {}
    }
    el._omamaMounting = false;
    watchMapVisible(el);
  }

  function kickOmamaMaps() {
    var nodes = document.querySelectorAll("[data-omama-map]");
    if (!nodes.length) return;
    if (!window.L) {
      initOmamaMaps();
      return;
    }
    nodes.forEach(mountOmamaMap);
  }

  function bootMaps() {
    syncMapPageMode();
    initOmamaMaps();
    initMapRail();
    requestAnimationFrame(function () {
      kickOmamaMaps();
      [80, 220, 500, 1000, 1800].forEach(function (ms) {
        setTimeout(kickOmamaMaps, ms);
      });
    });
  }

  function initMapRail() {
    if (!document.body.classList.contains("omama-map-page")) return;
    if (document.querySelector(".omama-rail-toggle")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "omama-rail-toggle";
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", textFor("Nascondi menu", currentLang()));
    btn.innerHTML =
      '<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9 2L4 7l5 5" stroke="#111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(btn);
    btn.addEventListener("click", function () {
      var closed = document.body.classList.toggle("omama-rail-collapsed");
      btn.setAttribute("aria-expanded", closed ? "false" : "true");
      btn.setAttribute(
        "aria-label",
        textFor(closed ? "Mostra menu" : "Nascondi menu", currentLang())
      );
      setTimeout(function () {
        var mapEl = document.querySelector("[data-omama-map-full]");
        if (mapEl && mapEl._omamaMap) mapEl._omamaMap.invalidateSize();
      }, 520);
    });
  }

  function initOmamaMaps() {
    if (!document.querySelector("[data-omama-map]")) return;
    loadLeaflet(kickOmamaMaps);
  }

  function goToRequest(email) {
    var url = pagePath("richiesta");
    if (email) url += "?email=" + encodeURIComponent(email);
    location.href = url;
  }

  function restyleNewsletter() {
    var host = document.querySelector('[data-name="newsletter"]');
    if (!host) return;
    var lang = currentLang();
    var label = host.querySelector('label[for="email"]');
    var wantLabel = textFor("Hai una richiesta?", lang);
    if (label && norm(label.textContent) !== norm(wantLabel)) {
      label.setAttribute("data-i18n", "Hai una richiesta?");
      setContent(label, wantLabel);
    }
    var input = host.querySelector("input[type='email'], input#email, input[name='email']");
    var wantPh = textFor("La tua email", lang);
    if (input && input.getAttribute("placeholder") !== wantPh) {
      input.setAttribute("data-i18n-placeholder", "La tua email");
      input.setAttribute("placeholder", wantPh);
    }
    var terms = host.querySelector('label[for="agreeToTerms"], label.checkbox');
    if (terms) {
      var copy = terms.querySelector("[data-omama-terms]");
      var wantTerms = textFor("Accetto termini e privacy", lang);
      Array.prototype.slice.call(terms.childNodes).forEach(function (node) {
        if (node.nodeType === 3) node.remove();
      });
      terms.querySelectorAll("span:not([data-omama-terms])").forEach(function (s) {
        if (!s.querySelector("input, svg") && !s.childElementCount) s.remove();
      });
      if (!copy) {
        copy = document.createElement("span");
        copy.setAttribute("data-omama-terms", "1");
        copy.setAttribute("data-i18n", "Accetto termini e privacy");
        terms.appendChild(copy);
      }
      if (copy.innerHTML !== wantTerms) copy.innerHTML = wantTerms;
    }
  }

  function watchNewsletter() {
    var host = document.querySelector('[data-name="newsletter"]');
    if (!host || host._omamaNewsWatched) return;
    host._omamaNewsWatched = true;
    restyleNewsletter();
    var obs = new MutationObserver(function () {
      restyleNewsletter();
    });
    obs.observe(host, { childList: true, subtree: true });
  }

  var newsletterHooked = false;

  function hookNewsletter() {
    if (newsletterHooked) return;
    newsletterHooked = true;
    document.addEventListener(
      "submit",
      function (e) {
        var form = e.target;
        if (!form || !form.closest) return;
        if (!form.matches("form.newsletter") && !form.closest('[data-name="newsletter"]')) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        var input = form.querySelector("input[type='email'], input#email, input[name='email']");
        if (input && typeof input.reportValidity === "function" && !input.checkValidity()) {
          input.reportValidity();
          return;
        }
        goToRequest(input ? String(input.value || "").trim() : "");
      },
      true
    );
    document.addEventListener(
      "click",
      function (e) {
        var btn = e.target && e.target.closest && e.target.closest('[data-name="newsletter"] button, form.newsletter .submit-button');
        if (!btn) return;
        var form = btn.closest("form");
        if (!form) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        var input = form.querySelector("input[type='email'], input#email, input[name='email']");
        if (input && typeof input.reportValidity === "function" && !input.checkValidity()) {
          input.reportValidity();
          return;
        }
        goToRequest(input ? String(input.value || "").trim() : "");
      },
      true
    );
  }

  function initRequestForm() {
    var form = document.querySelector("[data-omama-request]");
    if (!form) return;
    var params = new URLSearchParams(location.search);
    var email = params.get("email") || "";
    var emailEl = form.querySelector('[name="email"]');
    if (emailEl && email) emailEl.value = email;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var mail = String((form.email && form.email.value) || "").trim();
      var name = String((form.name && form.name.value) || "").trim();
      var msg = String((form.message && form.message.value) || "").trim();
      if (!mail || !msg) return;
      var body = "";
      if (name) body += "Nome: " + name + "\n";
      body += "Email: " + mail + "\n\n" + msg;
      location.href =
        "mailto:info@omamahotel.com?subject=" +
        encodeURIComponent("Richiesta OMAMA") +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  var barbaHooked = false;

  var igViewerEl = null;
  var igViewerVideo = null;
  var igViewerPhoto = null;
  var igViewerPlayBtn = null;
  var igViewerMuteBtn = null;
  var igViewerControls = null;
  var igViewerDots = null;
  var igViewerPostIndex = 0;
  var igViewerSlideIndex = 0;
  var igViewerMode = "video";
  var igViewerSwipeStartX = 0;

  var IG_VIEWER_CHEVRON =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function getIgCards() {
    return Array.prototype.slice.call(document.querySelectorAll(".omama-ig-list .omama-ig-card"));
  }

  function ensureIgViewer() {
    if (igViewerEl) return igViewerEl;

    var root = document.createElement("div");
    root.className = "omama-ig-viewer";
    root.setAttribute("aria-hidden", "true");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.innerHTML =
      '<button type="button" class="omama-ig-viewer-backdrop" aria-label="' +
      escapeHtml(textFor("Chiudi", currentLang())) +
      '"></button>' +
      '<button type="button" class="omama-ig-viewer-post-nav omama-ig-viewer-post-prev" data-omama-ig-viewer-post-prev aria-label="' +
      escapeHtml(textFor("Precedente", currentLang())) +
      '">' +
      IG_VIEWER_CHEVRON +
      "</button>" +
      '<div class="omama-ig-viewer-stage">' +
      '<button type="button" class="omama-ig-viewer-close" aria-label="' +
      escapeHtml(textFor("Chiudi", currentLang())) +
      '">' +
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
      "</button>" +
      '<video class="omama-ig-viewer-video" playsinline preload="metadata"></video>' +
      '<img class="omama-ig-viewer-photo" alt="" decoding="async" loading="eager">' +
      '<div class="omama-ig-viewer-dots" data-omama-ig-viewer-dots hidden></div>' +
      '<div class="omama-ig-viewer-controls">' +
      '<button type="button" class="omama-ig-viewer-btn" data-omama-ig-play aria-label="Play">' +
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="omama-ig-icon-play"><path d="M9 7.5v9l7.5-4.5L9 7.5z" fill="currentColor"/></svg>' +
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="omama-ig-icon-pause" style="display:none"><path d="M8 7h3v10H8V7zm5 0h3v10h-3V7z" fill="currentColor"/></svg>' +
      "<span>Play</span></button>" +
      '<button type="button" class="omama-ig-viewer-btn is-muted" data-omama-ig-mute aria-label="Audio">' +
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="omama-ig-icon-sound-off"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="omama-ig-icon-sound-on"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8a5 5 0 0 1 0 8M18 6a7.5 7.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      "<span>Audio</span></button>" +
      "</div></div>" +
      '<button type="button" class="omama-ig-viewer-post-nav omama-ig-viewer-post-next" data-omama-ig-viewer-post-next aria-label="' +
      escapeHtml(textFor("Successivo", currentLang())) +
      '">' +
      IG_VIEWER_CHEVRON +
      "</button>";

    document.body.appendChild(root);
    igViewerEl = root;
    igViewerVideo = root.querySelector(".omama-ig-viewer-video");
    igViewerPhoto = root.querySelector(".omama-ig-viewer-photo");
    igViewerPlayBtn = root.querySelector("[data-omama-ig-play]");
    igViewerMuteBtn = root.querySelector("[data-omama-ig-mute]");
    igViewerControls = root.querySelector(".omama-ig-viewer-controls");
    igViewerDots = root.querySelector("[data-omama-ig-viewer-dots]");

    function syncIgViewerButtons() {
      if (!igViewerVideo || !igViewerPlayBtn || !igViewerMuteBtn) return;
      var playIcon = igViewerPlayBtn.querySelector(".omama-ig-icon-play");
      var pauseIcon = igViewerPlayBtn.querySelector(".omama-ig-icon-pause");
      var playing = !igViewerVideo.paused;
      if (playIcon) playIcon.style.display = playing ? "none" : "block";
      if (pauseIcon) pauseIcon.style.display = playing ? "block" : "none";
      igViewerPlayBtn.querySelector("span").textContent = playing ? "Pausa" : "Play";
      igViewerMuteBtn.classList.toggle("is-muted", igViewerVideo.muted);
      igViewerMuteBtn.querySelector("span").textContent = igViewerVideo.muted ? "Audio" : "Muto";
    }

    function pauseAllInlineIgVideos() {
      document.querySelectorAll("[data-omama-ig-video]").forEach(function (video) {
        video.pause();
        syncInlineVideoButtons(video.closest("[data-omama-ig-media]"), video);
      });
    }

    root.querySelector(".omama-ig-viewer-backdrop").addEventListener("click", closeIgViewer);
    root.querySelector(".omama-ig-viewer-close").addEventListener("click", closeIgViewer);
    root.querySelector("[data-omama-ig-viewer-post-prev]").addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      navigateIgViewerPost(-1);
    });
    root.querySelector("[data-omama-ig-viewer-post-next]").addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      navigateIgViewerPost(1);
    });

    igViewerPlayBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!igViewerVideo) return;
      if (igViewerVideo.paused) {
        igViewerVideo.play().catch(function () {});
      } else {
        igViewerVideo.pause();
      }
      syncIgViewerButtons();
    });
    igViewerMuteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!igViewerVideo) return;
      igViewerVideo.muted = !igViewerVideo.muted;
      if (igViewerVideo.muted) delete igViewerVideo.dataset.omamaIgUserUnmuted;
      else igViewerVideo.dataset.omamaIgUserUnmuted = "1";
      syncIgViewerButtons();
    });
    if (igViewerVideo) {
      igViewerVideo.addEventListener("play", syncIgViewerButtons);
      igViewerVideo.addEventListener("pause", syncIgViewerButtons);
    }

    var stage = root.querySelector(".omama-ig-viewer-stage");
    stage.addEventListener(
      "touchstart",
      function (e) {
        igViewerSwipeStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    stage.addEventListener(
      "touchend",
      function (e) {
        var dx = e.changedTouches[0].clientX - igViewerSwipeStartX;
        handleIgViewerSwipe(dx);
      },
      { passive: true }
    );

    document.addEventListener("keydown", function (e) {
      if (!igViewerEl || !igViewerEl.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeIgViewer();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleIgViewerSwipe(50);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleIgViewerSwipe(-50);
      }
    });

    if (igViewerPhoto) {
      igViewerPhoto.addEventListener("dragstart", function (e) {
        e.preventDefault();
      });
    }
    stage.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    root._syncIgViewerButtons = syncIgViewerButtons;
    root._pauseAllInlineIgVideos = pauseAllInlineIgVideos;
    return root;
  }

  function getIgGallerySlides(card) {
    if (!card) return [];
    var gallery = card.querySelector("[data-omama-ig-gallery]");
    if (!gallery) return [];
    return Array.prototype.slice.call(gallery.querySelectorAll("[data-omama-ig-slide] img"));
  }

  function updateIgViewerDots(card, slideIndex) {
    if (!igViewerDots) return;
    var slides = getIgGallerySlides(card);
    if (slides.length <= 1) {
      igViewerDots.hidden = true;
      igViewerDots.innerHTML = "";
      return;
    }
    igViewerDots.hidden = false;
    igViewerDots.innerHTML = slides
      .map(function (_, index) {
        return (
          '<button type="button" class="omama-ig-dot' +
          (index === slideIndex ? " is-active" : "") +
          '" data-omama-ig-viewer-dot="' +
          index +
          '" aria-label="' +
          (index + 1) +
          "/" +
          slides.length +
          '"></button>'
        );
      })
      .join("");
    igViewerDots.querySelectorAll("[data-omama-ig-viewer-dot]").forEach(function (dot) {
      dot.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        showIgViewerContent(igViewerPostIndex, Number(dot.getAttribute("data-omama-ig-viewer-dot")) || 0, {});
      });
    });
  }

  function setIgViewerMode(mode) {
    igViewerMode = mode;
    if (igViewerVideo) igViewerVideo.style.display = mode === "video" ? "block" : "none";
    if (igViewerPhoto) igViewerPhoto.style.display = mode === "photo" ? "block" : "none";
    if (igViewerControls) igViewerControls.hidden = mode !== "video";
    if (mode !== "video" && igViewerVideo) {
      igViewerVideo.pause();
      igViewerVideo.removeAttribute("src");
      igViewerVideo.load();
    }
  }

  function showIgViewerContent(postIndex, slideIndex, opts) {
    var cards = getIgCards();
    if (!cards.length) return;
    var root = ensureIgViewer();
    postIndex = ((postIndex % cards.length) + cards.length) % cards.length;
    var card = cards[postIndex];
    var gallery = card.querySelector("[data-omama-ig-gallery]");
    var inlineVideo = card.querySelector("[data-omama-ig-video]");
    opts = opts || {};

    igViewerPostIndex = postIndex;
    if (root._pauseAllInlineIgVideos) root._pauseAllInlineIgVideos();

    if (gallery) {
      var slides = getIgGallerySlides(card);
      if (!slides.length) return;
      slideIndex = Math.max(0, Math.min(slideIndex, slides.length - 1));
      igViewerSlideIndex = slideIndex;
      setIgViewerMode("photo");
      var img = slides[slideIndex];
      igViewerPhoto.src = img.currentSrc || img.getAttribute("src") || "";
      igViewerPhoto.alt = img.alt || "";
      updateIgViewerDots(card, slideIndex);
    } else if (inlineVideo && igViewerVideo) {
      igViewerSlideIndex = 0;
      updateIgViewerDots(card, 0);
      setIgViewerMode("video");
      var source = inlineVideo.querySelector("source");
      var src = (source && source.getAttribute("src")) || inlineVideo.currentSrc || "";
      if (!src) return;
      var startAt = opts.startAt != null ? Number(opts.startAt) : 0;
      var wasPlaying = opts.wasPlaying != null ? !!opts.wasPlaying : true;
      var muted =
        opts.muted != null
          ? !!opts.muted
          : inlineVideo.dataset.omamaIgUserUnmuted === "1"
            ? false
            : true;
      if (inlineVideo.dataset.omamaIgUserUnmuted === "1") igViewerVideo.dataset.omamaIgUserUnmuted = "1";
      else delete igViewerVideo.dataset.omamaIgUserUnmuted;

      igViewerVideo.src = src;
      igViewerVideo.loop = true;
      igViewerVideo.playsInline = true;
      igViewerVideo.muted = muted;
      igViewerVideo.controls = false;
      igViewerVideo.onloadedmetadata = function () {
        try {
          igViewerVideo.currentTime = Math.max(0, startAt);
        } catch (e) {}
        if (wasPlaying) igViewerVideo.play().catch(function () {});
        else igViewerVideo.pause();
        if (root._syncIgViewerButtons) root._syncIgViewerButtons();
      };
      if (!wasPlaying) igViewerVideo.pause();
    }

    if (root._syncIgViewerButtons) root._syncIgViewerButtons();
    syncIgViewerSourceCard(card);
  }

  function syncIgViewerSourceCard(card) {
    document.querySelectorAll(".omama-ig-card.is-viewer-source").forEach(function (el) {
      el.classList.remove("is-viewer-source");
    });
    if (card) card.classList.add("is-viewer-source");
  }

  function openIgViewerAt(postIndex, slideIndex, opts) {
    var root = ensureIgViewer();
    showIgViewerContent(postIndex, slideIndex, opts);
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("noscroll");
    document.body.classList.add("omama-ig-viewer-open");
  }

  function navigateIgViewerPost(delta) {
    var cards = getIgCards();
    if (!cards.length) return;
    var next = igViewerPostIndex + delta;
    showIgViewerContent(next, 0, { wasPlaying: true, muted: igViewerVideo && igViewerVideo.dataset.omamaIgUserUnmuted !== "1" });
  }

  function handleIgViewerSwipe(dx) {
    if (Math.abs(dx) < 40) return;
    var cards = getIgCards();
    var card = cards[igViewerPostIndex];
    var slides = getIgGallerySlides(card);
    if (slides.length > 1) {
      if (dx < 0) {
        if (igViewerSlideIndex < slides.length - 1) {
          showIgViewerContent(igViewerPostIndex, igViewerSlideIndex + 1, {});
          return;
        }
        navigateIgViewerPost(1);
        return;
      }
      if (igViewerSlideIndex > 0) {
        showIgViewerContent(igViewerPostIndex, igViewerSlideIndex - 1, {});
        return;
      }
      navigateIgViewerPost(-1);
      return;
    }
    navigateIgViewerPost(dx < 0 ? 1 : -1);
  }

  function openIgGalleryViewer(gallery, slideIndex) {
    if (!gallery) return;
    var card = gallery.closest(".omama-ig-card");
    var cards = getIgCards();
    var idx = card ? cards.indexOf(card) : 0;
    if (idx < 0) idx = 0;
    openIgViewerAt(idx, slideIndex || 0, {});
  }

  function syncInlineVideoButtons(media, video) {
    if (!media || !video) return;
    var playBtn = media.querySelector("[data-omama-ig-inline-play]");
    var muteBtn = media.querySelector("[data-omama-ig-inline-mute]");
    if (playBtn) {
      playBtn.classList.toggle("is-playing", !video.paused);
      playBtn.setAttribute("aria-label", video.paused ? "Play" : "Pausa");
    }
    if (muteBtn) {
      muteBtn.classList.toggle("is-muted", video.muted);
      muteBtn.setAttribute("aria-label", video.muted ? "Audio" : "Muto");
    }
  }

  function resumeInlineIgVideos() {
    document.querySelectorAll("[data-omama-ig-video]").forEach(function (video) {
      video.controls = false;
      if (video.dataset.omamaIgUserUnmuted !== "1") video.muted = true;
      var media = video.closest("[data-omama-ig-media]");
      syncInlineVideoButtons(media, video);
      var rect = video.getBoundingClientRect();
      var visible = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
      if (visible) video.play().catch(function () {});
    });
  }

  function openIgViewer(inlineVideo) {
    if (!inlineVideo) return;
    var card = inlineVideo.closest(".omama-ig-card");
    var cards = getIgCards();
    var idx = card ? cards.indexOf(card) : 0;
    if (idx < 0) idx = 0;
    openIgViewerAt(idx, 0, {
      startAt: Number(inlineVideo.currentTime || 0),
      wasPlaying: !inlineVideo.paused,
      muted: inlineVideo.muted,
    });
  }

  function closeIgViewer() {
    if (!igViewerEl) return;
    if (igViewerVideo) {
      igViewerVideo.pause();
      igViewerVideo.removeAttribute("src");
      igViewerVideo.load();
    }
    if (igViewerPhoto) {
      igViewerPhoto.removeAttribute("src");
      igViewerPhoto.alt = "";
    }
    if (igViewerDots) {
      igViewerDots.hidden = true;
      igViewerDots.innerHTML = "";
    }
    igViewerEl.classList.remove("is-open");
    igViewerEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("noscroll");
    document.body.classList.remove("omama-ig-viewer-open");
    syncIgViewerSourceCard(null);
    resumeInlineIgVideos();
  }

  function resetIgVideoState(video) {
    if (!video) return;
    video.pause();
    if (video._omamaIgIo) {
      video._omamaIgIo.disconnect();
      video._omamaIgIo = null;
    }
    if (video._omamaIgAbort) {
      video._omamaIgAbort.abort();
      video._omamaIgAbort = null;
    }
    delete video._omamaIgReady;
    var media = video.closest("[data-omama-ig-media]");
    if (media) {
      var playBtn = media.querySelector("[data-omama-ig-inline-play]");
      var muteBtn = media.querySelector("[data-omama-ig-inline-mute]");
      var expandBtn = media.querySelector("[data-omama-ig-expand]");
      if (playBtn) delete playBtn._omamaIgReady;
      if (muteBtn) delete muteBtn._omamaIgReady;
      if (expandBtn) delete expandBtn._omamaIgReady;
    }
  }

  function resetIgGalleryState(gallery) {
    if (!gallery) return;
    if (gallery._omamaIgAbort) {
      gallery._omamaIgAbort.abort();
      gallery._omamaIgAbort = null;
    }
    delete gallery._omamaIgGalleryReady;
  }

  function igVideoNeedsInit(video) {
    if (!video._omamaIgReady) return true;
    if (!video._omamaIgAbort || video._omamaIgAbort.signal.aborted) return true;
    if (typeof IntersectionObserver !== "undefined") {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce && !video._omamaIgIo) return true;
    }
    var media = video.closest("[data-omama-ig-media]");
    if (media) {
      var playBtn = media.querySelector("[data-omama-ig-inline-play]");
      if (playBtn && !playBtn._omamaIgReady) return true;
    }
    return false;
  }

  function igGalleryNeedsInit(gallery) {
    if (!gallery._omamaIgGalleryReady) return true;
    if (!gallery._omamaIgAbort || gallery._omamaIgAbort.signal.aborted) return true;
    return false;
  }

  function teardownIgMedia(container) {
    if (!container) return;
    container.querySelectorAll("[data-omama-ig-video]").forEach(resetIgVideoState);
    container.querySelectorAll("[data-omama-ig-gallery]").forEach(resetIgGalleryState);
    container.querySelectorAll(".omama-hero-video").forEach(function (video) {
      video.pause();
      delete video._omamaHeroReady;
    });
    container.querySelectorAll(".omama-ig-card.is-viewer-source").forEach(function (card) {
      card.classList.remove("is-viewer-source");
    });
  }

  function teardownCurrentPageIgMedia() {
    teardownIgMedia(document.querySelector('[data-barba="container"]'));
  }

  function isHomepageContainer(container) {
    return !!(container && (container.getAttribute("data-barba-namespace") || "").indexOf("homepage") !== -1);
  }

  function bootIgMedia(forceReset) {
    var container = document.querySelector('[data-barba="container"]');
    if (!container) return;
    if (forceReset || container.querySelector("[data-omama-ig-video], [data-omama-ig-gallery]")) {
      teardownIgMedia(container);
    }
    initIgVideos();
    initIgGalleries();
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(wakeIgVideos);
    });
  }

  function wakeIgVideos() {
    if (igViewerEl && igViewerEl.classList.contains("is-open")) return;
    document.querySelectorAll("[data-omama-ig-video]").forEach(function (video) {
      var media = video.closest("[data-omama-ig-media]");
      syncInlineVideoButtons(media, video);
      var rect = video.getBoundingClientRect();
      var visible =
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth;
      if (!visible) return;
      if (video.dataset.omamaIgUserUnmuted !== "1") video.muted = true;
      video.play().catch(function () {});
    });
  }

  function initIgGalleries() {
    document.querySelectorAll("[data-omama-ig-gallery]").forEach(function (gallery) {
      if (!igGalleryNeedsInit(gallery)) return;
      if (gallery._omamaIgGalleryReady) resetIgGalleryState(gallery);
      gallery._omamaIgGalleryReady = true;
      var galleryAbort = new AbortController();
      gallery._omamaIgAbort = galleryAbort;
      var gallerySignal = galleryAbort.signal;
      var passiveOpts = { passive: true, signal: gallerySignal };
      var passiveFalseOpts = { passive: false, signal: gallerySignal };

      var slides = gallery.querySelectorAll("[data-omama-ig-slide]");
      var dots = gallery.querySelectorAll("[data-omama-ig-dot]");
      if (!slides.length) return;

      var index = 0;

      function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }

      var prev = gallery.querySelector(".omama-ig-prev");
      var nextBtn = gallery.querySelector(".omama-ig-next");
      if (prev) {
        prev.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            show(index - 1);
          },
          { signal: gallerySignal }
        );
      }
      if (nextBtn) {
        nextBtn.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            show(index + 1);
          },
          { signal: gallerySignal }
        );
      }
      dots.forEach(function (dot) {
        dot.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            show(Number(dot.getAttribute("data-omama-ig-dot")) || 0);
          },
          { signal: gallerySignal }
        );
      });

      var startX = 0;
      var startY = 0;
      var tracking = false;
      var lockGallery = false;
      var didSwipe = false;
      var swipeThreshold = 28;

      function onSwipeStart(clientX, clientY) {
        startX = clientX;
        startY = clientY;
        tracking = true;
        lockGallery = false;
        didSwipe = false;
      }

      function onSwipeMove(clientX, clientY, e) {
        if (!tracking) return;
        var dx = clientX - startX;
        var dy = clientY - startY;
        if (!lockGallery && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.15) {
          lockGallery = true;
          gallery.classList.add("is-swiping");
        }
        if (lockGallery && e && e.cancelable) e.preventDefault();
      }

      function onSwipeEnd(clientX) {
        if (!tracking) return;
        tracking = false;
        gallery.classList.remove("is-swiping");
        var dx = clientX - startX;
        if (Math.abs(dx) < swipeThreshold) return;
        didSwipe = true;
        show(dx < 0 ? index + 1 : index - 1);
        window.setTimeout(function () {
          didSwipe = false;
        }, 320);
      }

      gallery.addEventListener(
        "touchstart",
        function (e) {
          if (!e.changedTouches || !e.changedTouches.length) return;
          onSwipeStart(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        },
        passiveOpts
      );
      gallery.addEventListener(
        "touchmove",
        function (e) {
          if (!e.changedTouches || !e.changedTouches.length) return;
          onSwipeMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e);
        },
        passiveFalseOpts
      );
      gallery.addEventListener(
        "touchend",
        function (e) {
          if (!e.changedTouches || !e.changedTouches.length) return;
          onSwipeEnd(e.changedTouches[0].clientX);
        },
        passiveOpts
      );

      gallery.addEventListener(
        "pointerdown",
        function (e) {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          if (e.target.closest(".omama-ig-dot, .omama-ig-nav, .omama-ig-tool, .omama-ig-toolbar")) return;
          onSwipeStart(e.clientX, e.clientY);
          try {
            gallery.setPointerCapture(e.pointerId);
          } catch (err) {}
        },
        { signal: gallerySignal }
      );
      gallery.addEventListener(
        "pointermove",
        function (e) {
          onSwipeMove(e.clientX, e.clientY, e);
        },
        { signal: gallerySignal }
      );
      gallery.addEventListener(
        "pointerup",
        function (e) {
          onSwipeEnd(e.clientX);
          try {
            gallery.releasePointerCapture(e.pointerId);
          } catch (err) {}
        },
        { signal: gallerySignal }
      );
      gallery.addEventListener(
        "pointercancel",
        function () {
          tracking = false;
          lockGallery = false;
          gallery.classList.remove("is-swiping");
        },
        { signal: gallerySignal }
      );

      gallery.addEventListener(
        "click",
        function (e) {
          if (slides.length <= 1 || didSwipe) return;
          if (e.target.closest(".omama-ig-dot, .omama-ig-nav, .omama-ig-tool, .omama-ig-toolbar")) return;
          var rect = gallery.getBoundingClientRect();
          var x = e.clientX - rect.left;
          if (x < rect.width * 0.28) {
            e.preventDefault();
            e.stopPropagation();
            show(index - 1);
          } else if (x > rect.width * 0.72) {
            e.preventDefault();
            e.stopPropagation();
            show(index + 1);
          }
        },
        { signal: gallerySignal }
      );

      var expandBtn = gallery.querySelector("[data-omama-ig-expand-photo]");
      if (expandBtn) {
        expandBtn.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            var activeSlide = gallery.querySelector("[data-omama-ig-slide].is-active");
            var img = activeSlide && activeSlide.querySelector("img");
            if (!img) return;
            openIgGalleryViewer(gallery, index);
          },
          { signal: gallerySignal }
        );
      }
    });
  }

  function initIgVideos() {
    var nodes = document.querySelectorAll("[data-omama-ig-video]");
    if (!nodes.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function playSafe(video) {
      if (igViewerEl && igViewerEl.classList.contains("is-open")) return;
      if (video.dataset.omamaIgUserUnmuted !== "1") video.muted = true;
      var play = video.play();
      if (play && play.catch) play.catch(function () {});
      syncInlineVideoButtons(video.closest("[data-omama-ig-media]"), video);
    }

    nodes.forEach(function (video) {
      if (!igVideoNeedsInit(video)) return;
      if (video._omamaIgReady) resetIgVideoState(video);
      video._omamaIgReady = true;
      var videoAbort = new AbortController();
      video._omamaIgAbort = videoAbort;
      var videoSignal = videoAbort.signal;
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.controls = false;

      var media = video.closest("[data-omama-ig-media]");
      if (media) {
        var playBtn = media.querySelector("[data-omama-ig-inline-play]");
        var muteBtn = media.querySelector("[data-omama-ig-inline-mute]");
        var expandBtn = media.querySelector("[data-omama-ig-expand]");

        if (playBtn && !playBtn._omamaIgReady) {
          playBtn._omamaIgReady = true;
          playBtn.addEventListener(
            "click",
            function (e) {
              e.preventDefault();
              e.stopPropagation();
              if (video.paused) video.play().catch(function () {});
              else video.pause();
              syncInlineVideoButtons(media, video);
            },
            { signal: videoSignal }
          );
        }

        if (muteBtn && !muteBtn._omamaIgReady) {
          muteBtn._omamaIgReady = true;
          muteBtn.addEventListener(
            "click",
            function (e) {
              e.preventDefault();
              e.stopPropagation();
              video.muted = !video.muted;
              if (video.muted) delete video.dataset.omamaIgUserUnmuted;
              else video.dataset.omamaIgUserUnmuted = "1";
              syncInlineVideoButtons(media, video);
            },
            { signal: videoSignal }
          );
        }

        if (expandBtn && !expandBtn._omamaIgReady) {
          expandBtn._omamaIgReady = true;
          expandBtn.addEventListener(
            "click",
            function (e) {
              e.preventDefault();
              e.stopPropagation();
              openIgViewer(video);
            },
            { signal: videoSignal }
          );
        }

        video.addEventListener(
          "play",
          function () {
            syncInlineVideoButtons(media, video);
          },
          { signal: videoSignal }
        );
        video.addEventListener(
          "pause",
          function () {
            syncInlineVideoButtons(media, video);
          },
          { signal: videoSignal }
        );

        syncInlineVideoButtons(media, video);
      }

      if (reduce) {
        video.pause();
        video.removeAttribute("autoplay");
        return;
      }

      if (typeof IntersectionObserver === "undefined") {
        playSafe(video);
        return;
      }

      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (igViewerEl && igViewerEl.classList.contains("is-open")) return;
            if (entry.isIntersecting) playSafe(video);
            else {
              video.pause();
              syncInlineVideoButtons(media, video);
            }
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
      );
      video._omamaIgIo = io;
      io.observe(video);
    });
  }

  function isLivingPage() {
    return (
      document.body.classList.contains("template-way-of-living") ||
      document.body.classList.contains("our-way-of-living")
    );
  }

  function isMobileViewport() {
    return !!(window.matchMedia && window.matchMedia("(max-width: 1023px)").matches);
  }

  function resetLivingMobileScroll() {
    if (!isLivingPage() || !isMobileViewport()) return;

    document.documentElement.classList.add("omama-living-mobile");

    if (window.ScrollTrigger && typeof window.ScrollTrigger.getAll === "function") {
      window.ScrollTrigger.getAll().forEach(function (st) {
        try {
          st.kill(true);
        } catch (e) {}
      });
      try {
        window.ScrollTrigger.clearScrollMemory();
        window.ScrollTrigger.refresh(true);
      } catch (e) {}
    }

    if (window.gsap) {
      window.gsap.killTweensOf(
        ".template-way-of-living .info, .template-way-of-living .eye, .template-way-of-living .smiley, .template-way-of-living .way-of-living, .template-way-of-living .what_it_means, .template-way-of-living .what_define_us, .template-way-of-living .why_we_stand_out, .template-way-of-living .total-scroll"
      );
      window.gsap.set(".template-way-of-living .info", {
        autoAlpha: 1,
        clearProps: "transform,x,y,xPercent,yPercent",
      });
      window.gsap.set(
        ".template-way-of-living .what_it_means .list-item, .template-way-of-living .what_define_us .item, .template-way-of-living .why_we_stand_out .item",
        { autoAlpha: 1, y: 0, clearProps: "transform,height" }
      );
      window.gsap.set(".template-way-of-living .eye, .template-way-of-living .smiley, .template-way-of-living .way-of-living", {
        autoAlpha: 1,
        clearProps: "transform,x,y,xPercent,yPercent",
      });
      window.gsap.set(".template-way-of-living .eye .title, .template-way-of-living .eye .subtitle_1, .template-way-of-living .eye .subtitle_2", {
        autoAlpha: 1,
      });
    }

    var swiperEl = document.querySelector(".template-way-of-living .what-it-means-swiper");
    if (swiperEl && swiperEl.swiper) {
      swiperEl.swiper.params.allowTouchMove = true;
      swiperEl.swiper.params.pagination = swiperEl.swiper.params.pagination || { clickable: true };
      swiperEl.swiper.update();
    }

    var totalScroll = document.querySelector(".template-way-of-living .total-scroll");
    if (totalScroll) {
      totalScroll.classList.remove("lenis", "lenis-smooth");
      totalScroll.style.removeProperty("transform");
    }

    if (window.lenis && typeof window.lenis.destroy === "function") {
      try {
        window.lenis.destroy();
        window.lenis = null;
      } catch (e) {}
    } else if (window.lenis && typeof window.lenis.start === "function") {
      try {
        window.lenis.start();
      } catch (e) {}
    }
  }

  function scheduleLivingMobileFix() {
    if (!isLivingPage() || !isMobileViewport()) return;
    [400, 900, 1600].forEach(function (delay) {
      window.setTimeout(resetLivingMobileScroll, delay);
    });
  }

  function lockLivingSwiperControlsLayout(controls) {
    if (!controls) return;
    if (window.gsap) {
      window.gsap.killTweensOf(controls);
      window.gsap.set(controls, { clearProps: "transform,x,y,xPercent,yPercent,opacity" });
    }
    controls.style.setProperty("transform", "none", "important");
    controls.style.setProperty("opacity", "1", "important");
    controls.style.removeProperty("translate");
  }

  function watchLivingSwiperControlsStyle(controls) {
    if (!controls || controls._omamaStyleWatch || typeof MutationObserver === "undefined") return;
    controls._omamaStyleWatch = true;
    new MutationObserver(function () {
      if (!isMobileViewport()) return;
      if (controls.style.transform && controls.style.transform.indexOf("none") === -1) {
        lockLivingSwiperControlsLayout(controls);
      }
      if (controls.style.opacity && controls.style.opacity !== "1") {
        controls.style.setProperty("opacity", "1", "important");
      }
    }).observe(controls, { attributes: true, attributeFilter: ["style"] });
  }

  function bindLivingSwiperControls(swiper, controls) {
    if (!swiper || !controls || controls._omamaNavBound) return;
    controls._omamaNavBound = true;

    var nextBtn = controls.querySelector(".button-next");
    var prevBtn = controls.querySelector(".button-prev");

    function goNext(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      lockLivingSwiperControlsLayout(controls);
      if (!swiper.destroyed) swiper.slideNext();
    }

    function goPrev(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      lockLivingSwiperControlsLayout(controls);
      if (!swiper.destroyed) swiper.slidePrev();
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", goNext, true);
      nextBtn.addEventListener("touchend", goNext, { capture: true, passive: false });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", goPrev, true);
      prevBtn.addEventListener("touchend", goPrev, { capture: true, passive: false });
    }

    try {
      swiper.params.allowTouchMove = true;
      swiper.allowTouchMove = true;
      if (swiper.navigation) {
        swiper.params.navigation.nextEl = nextBtn;
        swiper.params.navigation.prevEl = prevBtn;
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
      }
      swiper.update();
    } catch (e) {}
  }

  function fixHomeLivingSwiperMobile() {
    if (!isMobileViewport()) return;

    document.querySelectorAll("section.living .living-track .swiper-living").forEach(function (swiperEl) {
      var controls = swiperEl.querySelector(".swiper-controls");
      if (!controls) return;

      if (!controls._omamaRelocated) {
        controls._omamaRelocated = true;
        swiperEl.insertAdjacentElement("afterend", controls);
      }

      lockLivingSwiperControlsLayout(controls);
      watchLivingSwiperControlsStyle(controls);

      var swiper = swiperEl.swiper;
      if (swiper) {
        bindLivingSwiperControls(swiper, controls);
        swiper.on("slideChangeTransitionEnd", function () {
          lockLivingSwiperControlsLayout(controls);
        });
      } else if (!swiperEl._omamaSwiperPoll) {
        swiperEl._omamaSwiperPoll = true;
        var attempts = 0;
        var poll = window.setInterval(function () {
          attempts += 1;
          if (swiperEl.swiper) {
            window.clearInterval(poll);
            fixHomeLivingSwiperMobile();
          } else if (attempts > 50) {
            window.clearInterval(poll);
          }
        }, 150);
      }
    });
  }

  function scheduleHomeLivingSwiperFix() {
    if (!isMobileViewport()) return;
    [0, 300, 700, 1200, 2000, 3500, 5000].forEach(function (delay) {
      window.setTimeout(fixHomeLivingSwiperMobile, delay);
    });
  }

  function restoreHomeLivingSwiperDesktop() {
    if (isMobileViewport()) return;

    document.querySelectorAll("section.living .living-track > .swiper-controls").forEach(function (controls) {
      var track = controls.closest(".living-track");
      var swiperEl = track && track.querySelector(".swiper-living");
      if (!swiperEl) return;

      if (controls.previousElementSibling !== swiperEl) {
        swiperEl.appendChild(controls);
      }

      controls._omamaRelocated = false;
      controls.style.removeProperty("transform");
      controls.style.removeProperty("opacity");
    });
  }

  function livingPinScrollDistance(track, pinWrap) {
    if (!track) return 0;
    // Measure overflow against the pinned container, not window.innerWidth
    // (sidebar + padding made the theme formula end early → snap to footer).
    var visible = pinWrap && pinWrap.clientWidth ? pinWrap.clientWidth : window.innerWidth;
    return Math.max(0, Math.round(track.scrollWidth - visible));
  }

  function killHomeLivingPinTriggers() {
    if (!window.ScrollTrigger || typeof window.ScrollTrigger.getAll !== "function") return;
    window.ScrollTrigger.getAll()
      .slice()
      .forEach(function (st) {
        var trigger = st.trigger;
        var node = typeof trigger === "string" ? document.querySelector(trigger) : trigger;
        if (!node || !node.classList || !node.classList.contains("pin-wrap")) return;
        try {
          st.kill(true);
        } catch (e) {}
      });
  }

  function calibrateHomeLivingPin(force) {
    if (isMobileViewport()) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    var track = document.querySelector("section.living .living-track");
    var pinWrap = document.querySelector(".pin-wrap");
    if (!track || !pinWrap) return;

    var distance = livingPinScrollDistance(track, pinWrap);
    if (distance < 80) return;

    // Skip no-op recalibrations (avoids the “impazzisce” loop when stopping mid-section).
    if (
      !force &&
      pinWrap._omamaLivingPinDistance &&
      Math.abs(pinWrap._omamaLivingPinDistance - distance) < 40
    ) {
      return;
    }

    killHomeLivingPinTriggers();
    window.gsap.set(track, { x: 0, clearProps: "transform" });
    window.gsap.set(track, { x: 0 });

    // end matches travel exactly — theme used distance+400 which left a dead pin
    // zone then dumped the user into the footer.
    window.gsap.to(track, {
      x: -distance,
      ease: "none",
      scrollTrigger: {
        trigger: pinWrap,
        start: "top top",
        end: function () {
          return "+=" + livingPinScrollDistance(track, pinWrap);
        },
        scrub: 0.55,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: false,
      },
    });

    pinWrap._omamaLivingPinDistance = distance;

    try {
      window.ScrollTrigger.refresh();
    } catch (e) {}
  }

  function scheduleHomeLivingPinCalibration() {
    if (isMobileViewport() || !document.querySelector("section.living .living-track")) return;

    function runWhenReady() {
      var track = document.querySelector("section.living .living-track");
      if (!track) return;

      var imgs = track.querySelectorAll("img");
      var pending = 0;
      imgs.forEach(function (img) {
        if (!img.complete) pending += 1;
      });

      function go() {
        // Wait one frame so layout/scrollWidth is final.
        window.requestAnimationFrame(function () {
          calibrateHomeLivingPin(true);
        });
      }

      if (!pending) {
        go();
        return;
      }

      var left = pending;
      function onDone() {
        left -= 1;
        if (left <= 0) go();
      }
      imgs.forEach(function (img) {
        if (!img.complete) {
          img.addEventListener("load", onDone, { once: true });
          img.addEventListener("error", onDone, { once: true });
        }
      });
      window.setTimeout(go, 3500);
    }

    // Theme creates the pin in finalize — wait past that, then replace once.
    [700, 1600].forEach(function (delay) {
      window.setTimeout(runWhenReady, delay);
    });

    if (!window._omamaLivingPinResizeHook) {
      window._omamaLivingPinResizeHook = true;
      var resizeTimer = null;
      var lastW = window.innerWidth;
      window.addEventListener("resize", function () {
        if (isMobileViewport()) return;
        if (Math.abs(window.innerWidth - lastW) < 48) return;
        lastW = window.innerWidth;
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
          calibrateHomeLivingPin(true);
        }, 280);
      });
    }
  }

  function scheduleThemeScrollRefresh() {
    // One soft refresh after images settle — never rebuild pins or spam refresh(true).
    [800, 1800].forEach(function (delay) {
      window.setTimeout(function () {
        if (!window.ScrollTrigger || typeof window.ScrollTrigger.refresh !== "function") return;
        try {
          window.ScrollTrigger.refresh();
        } catch (e) {}
      }, delay);
    });
  }

  function webglAvailable() {
    if (typeof document._omamaWebgl === "boolean") return document._omamaWebgl;
    var ok = false;
    try {
      var probe = document.createElement("canvas");
      ok = !!(probe.getContext("webgl2") || probe.getContext("webgl") || probe.getContext("experimental-webgl"));
    } catch (e) {
      ok = false;
    }
    document._omamaWebgl = ok;
    return ok;
  }

  function fixTypicalUnitGalleryDom() {
    document.querySelectorAll("section.typical_unit .gallery-wrap").forEach(function (wrap) {
      // Drop leftover photo mosaics from earlier builds / cached HTML.
      wrap.querySelectorAll(".omama-typical-fallback").forEach(function (node) {
        node.remove();
      });

      if (!webglAvailable()) return;

      // Theme mounts the tunnel with Tailwind-only classes; give it real box sizes
      // so renderer.setSize() gets non-zero dimensions instead of collapsing.
      var root = wrap.querySelector(":scope > .relative") || wrap.querySelector(":scope > div");
      if (!root) return;

      root.style.setProperty("position", "absolute", "important");
      root.style.setProperty("inset", "0", "important");
      root.style.setProperty("width", "100%", "important");
      root.style.setProperty("height", "100%", "important");

      var stage = root.querySelector(".fixed") || root.querySelector(":scope > div");
      if (stage) {
        stage.style.setProperty("position", "absolute", "important");
        stage.style.setProperty("inset", "0", "important");
        stage.style.setProperty("width", "100%", "important");
        stage.style.setProperty("height", "100%", "important");
        stage.style.setProperty("overflow", "hidden", "important");
      }

      var canvas = wrap.querySelector("canvas");
      if (!canvas) return;

      canvas.style.setProperty("display", "block", "important");
      canvas.style.setProperty("width", "100%", "important");
      canvas.style.setProperty("height", "100%", "important");

      // Theme WS.handleResize reads mountElement.clientWidth/Height on window resize,
      // which is what repairs a renderer that was sized before layout settled.
      if (wrap.clientWidth > 0 && wrap.clientHeight > 0 && canvas.width < wrap.clientWidth) {
        window.dispatchEvent(new Event("resize"));
      }
    });
  }

  function watchTypicalUnitGallery() {
    if (document.documentElement._omamaTypicalWatch) return;
    document.documentElement._omamaTypicalWatch = true;

    if (typeof MutationObserver !== "undefined") {
      var obs = new MutationObserver(function () {
        if (!document.querySelector("section.typical_unit .gallery-wrap")) return;
        fixTypicalUnitGalleryDom();
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }

    if (typeof ResizeObserver !== "undefined") {
      document.querySelectorAll("section.typical_unit .gallery-wrap").forEach(function (wrap) {
        if (wrap._omamaTypicalRo) return;
        wrap._omamaTypicalRo = true;
        new ResizeObserver(function () {
          if (wrap.querySelector("canvas")) window.dispatchEvent(new Event("resize"));
        }).observe(wrap);
      });
    }
  }

  function scheduleTypicalUnitGalleryFix() {
    if (!document.querySelector("section.typical_unit .gallery-wrap")) return;
    watchTypicalUnitGallery();
    [0, 250, 800, 2000, 4000, 7000].forEach(function (delay) {
      window.setTimeout(fixTypicalUnitGalleryDom, delay);
    });
  }

  function afterBarbaPage() {
    applyLang(currentLang());
    bootMaps();
    initRequestForm();
    watchNewsletter();
    hookBookUi();
    hookCta360();
    initBookForm();
    initHeroVideo();
    bootIgMedia(isHomepageContainer(document.querySelector('[data-barba="container"]')));
    scheduleLivingMobileFix();
    scheduleHomeLivingSwiperFix();
    restoreHomeLivingSwiperDesktop();
    scheduleThemeScrollRefresh();
    scheduleTypicalUnitGalleryFix();
    scheduleHomeLivingPinCalibration();
  }

  function scheduleIgBootRetries() {
    [300, 700, 1400].forEach(function (delay) {
      window.setTimeout(function () {
        var container = document.querySelector('[data-barba="container"]');
        if (!isHomepageContainer(container)) return;
        if (!hasPendingIgBoot()) return;
        bootIgMedia(true);
      }, delay);
    });
  }

  function barbaContainerSignature() {
    var container = document.querySelector('[data-barba="container"]');
    if (!container) return "";
    return (
      (container.getAttribute("data-barba-namespace") || "") +
      ":" +
      (container.getAttribute("data-post-id") || "")
    );
  }

  function hasPendingIgBoot() {
    var pending = false;
    document.querySelectorAll("[data-omama-ig-video]").forEach(function (video) {
      if (!video._omamaIgReady) pending = true;
    });
    document.querySelectorAll("[data-omama-ig-gallery]").forEach(function (gallery) {
      if (!gallery._omamaIgGalleryReady) pending = true;
    });
    return pending;
  }

  function mutationIsBarbaSwap(mutations) {
    var container = document.querySelector('[data-barba="container"]');
    if (!container) return false;
    return mutations.some(function (mutation) {
      if (mutation.type === "attributes" && mutation.target === container) return true;
      if (mutation.type !== "childList") return false;
      if (mutation.target === container) return true;
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        var node = mutation.addedNodes[i];
        if (node.nodeType === 1 && node.getAttribute && node.getAttribute("data-barba") === "container") return true;
      }
      return false;
    });
  }

  function watchBarbaPages() {
    var root = document.querySelector('[data-barba="wrapper"]') || document.body;
    if (root._omamaBarbaWatch) return;
    root._omamaBarbaWatch = true;

    var lastSignature = barbaContainerSignature();
    var bootTimer = null;

    function schedulePageBoot() {
      clearTimeout(bootTimer);
      bootTimer = setTimeout(function () {
        var sig = barbaContainerSignature();
        if (sig && sig !== lastSignature) lastSignature = sig;
        afterBarbaPage();
      }, 120);
    }

    function handleContainerChange() {
      closeIgViewer();
      schedulePageBoot();
    }

    var obs = new MutationObserver(function (mutations) {
      if (!mutationIsBarbaSwap(mutations)) return;
      handleContainerChange();
    });

    obs.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-barba-namespace", "data-post-id"],
    });

    document.addEventListener(
      "click",
      function (e) {
        var link = e.target && e.target.closest ? e.target.closest("a[href]") : null;
        if (!link || link.closest(".no-barba")) return;
        if (link.getAttribute("data-barba-prevent") != null) return;
        var href = link.getAttribute("href") || "";
        if (!href || href.charAt(0) === "#") return;
        if (/^(https?:|mailto:|tel:)/i.test(href)) return;
        if (link.target === "_blank") return;
        teardownCurrentPageIgMedia();
        schedulePageBoot();
      },
      true
    );

    window.addEventListener("popstate", function () {
      teardownCurrentPageIgMedia();
      schedulePageBoot();
    });

    window.addEventListener("pageshow", function (e) {
      if (!e.persisted) return;
      window.setTimeout(function () {
        afterBarbaPage();
      }, 0);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible") return;
      if (!isHomepageContainer(document.querySelector('[data-barba="container"]'))) return;
      var needsBoot = false;
      document.querySelectorAll("[data-omama-ig-video]").forEach(function (video) {
        if (igVideoNeedsInit(video)) needsBoot = true;
      });
      if (needsBoot) bootIgMedia(true);
    });

    window.setTimeout(function () {
      if (hasPendingIgBoot()) afterBarbaPage();
    }, 250);
    scheduleIgBootRetries();
  }

  function leavingContainer(data) {
    return (data && data.current && data.current.container) || null;
  }

  var barbaHookAttempts = 0;

  function hookBarba() {
    try {
      if (window.barba && window.barba.hooks) {
        if (barbaHooked) return;
        barbaHooked = true;
        window.barba.hooks.beforeLeave(function (data) {
          closeIgViewer();
          teardownIgMedia(leavingContainer(data));
          destroyOmamaMaps(leavingContainer(data));
        });
        window.barba.hooks.after(afterBarbaPage);
        if (window.barba.hooks.afterEnter) window.barba.hooks.afterEnter(afterBarbaPage);
        return;
      }
    } catch (e) {}
    barbaHookAttempts += 1;
    if (barbaHookAttempts < 15) setTimeout(hookBarba, 400);
  }

  function watchMapMount() {
    var root = document.querySelector('[data-barba="wrapper"]') || document.body;
    if (root._omamaMapWatch) return;
    root._omamaMapWatch = true;
    var timer = null;
    var obs = new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var pending = false;
        document.querySelectorAll("[data-omama-map]").forEach(function (el) {
          if (!mapIsLive(el)) pending = true;
        });
        if (pending) bootMaps();
        else if (!isFullMapPage() && document.body.classList.contains("omama-map-page")) {
          syncMapPageMode();
        }
      }, 80);
    });
    obs.observe(root, { childList: true, subtree: true });
  }

  function initHeroVideo() {
    var nodes = document.querySelectorAll(".omama-hero-video");
    if (!nodes.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodes.forEach(function (video) {
      if (reduce) {
        video.pause();
        video.removeAttribute("autoplay");
        return;
      }
      if (video._omamaHeroReady) return;
      video._omamaHeroReady = true;
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.preload = "auto";
      function playSafe() {
        var play = video.play();
        if (play && play.catch) play.catch(function () {});
      }
      playSafe();
      if (typeof IntersectionObserver === "undefined") return;
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) playSafe();
            else video.pause();
          });
        },
        { threshold: 0.15 }
      );
      io.observe(video);
    });
  }

  function onReady() {
    hookCta360();
    initBookForm();
    hookBookUi();
    bootMaps();
    initRequestForm();
    hookNewsletter();
    watchNewsletter();
    watchMapMount();
    initHeroVideo();
    bootIgMedia(false);
    watchBarbaPages();
    if (document.documentElement.classList.contains("omama-skip-preloader")) {
      finishIntro();
      setTimeout(finishIntro, 50);
      setTimeout(finishIntro, 250);
    }
    hookBarba();
    scheduleLivingMobileFix();
    scheduleHomeLivingSwiperFix();
    restoreHomeLivingSwiperDesktop();
    scheduleThemeScrollRefresh();
    scheduleTypicalUnitGalleryFix();
    scheduleHomeLivingPinCalibration();

    window.addEventListener("load", function () {
      scheduleThemeScrollRefresh();
      scheduleTypicalUnitGalleryFix();
      scheduleHomeLivingPinCalibration();
    });
  }

  document.addEventListener(
    "DOMContentLoaded",
    function () {
      applyLang(currentLang());
    },
    true
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    applyLang(currentLang());
    onReady();
  }
})();
