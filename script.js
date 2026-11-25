/* =========================================================
   TURNING POINT CHURCH INTERNATIONAL
   Vanilla JavaScript interactions and hero portal motion
   ========================================================= */

// 01. MOBILE NAVIGATION
const menuButton = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector(".main-nav");

if (menuButton && mainNavigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = mainNavigation.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        menuButton.textContent = isOpen ? "×" : "☰";
    });

    mainNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNavigation.classList.remove("is-open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.textContent = "☰";
        });
    });
}

// 02. GALLERY LIGHTBOX
const galleryDialog = document.querySelector("#gallery-lightbox");
const galleryDialogImage = galleryDialog?.querySelector("img");
const galleryCloseButton = galleryDialog?.querySelector(".lightbox-close");

document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
        if (!galleryDialog || !galleryDialogImage) return;
        galleryDialogImage.src = item.dataset.full;
        galleryDialogImage.alt = item.querySelector("img")?.alt || "TPCI gallery photograph";
        galleryDialog.showModal();
    });
});

galleryCloseButton?.addEventListener("click", () => galleryDialog.close());

galleryDialog?.addEventListener("click", (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
});

// 02b. GALLERY-ONLY circular carousel interaction (no page-wide input listeners).
const gallerySection = document.querySelector("#gallery");
const galleryTrack = gallerySection?.querySelector(".gallery-grid");
if (gallerySection && galleryTrack) {
    const galleryCards = Array.from(galleryTrack.querySelectorAll(".gallery-item"));
    const previousButton = gallerySection.querySelector(".gallery-nav-prev");
    const nextButton = gallerySection.querySelector(".gallery-nav-next");
    let dragging = false;
    let dragStartX = 0;
    let dragScrollStart = 0;
    let didDrag = false;
    let frame = 0;

    const updateGalleryCurve = () => {
        frame = 0;
        const trackRect = galleryTrack.getBoundingClientRect();
        const center = trackRect.left + trackRect.width / 2;
        const radius = Math.max(trackRect.width * 0.58, 1);
        galleryCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const distance = (rect.left + rect.width / 2 - center) / radius;
            const bend = Math.max(-1, Math.min(1, distance));
            card.style.setProperty("--gallery-y", `${Math.abs(bend) * 30}px`);
            card.style.setProperty("--gallery-rotate", `${bend * -11}deg`);
            card.style.setProperty("--gallery-scale", `${1 - Math.abs(bend) * 0.10}`);
        });
    };
    const requestCurveUpdate = () => {
        if (!frame) frame = requestAnimationFrame(updateGalleryCurve);
    };
    galleryTrack.addEventListener("scroll", requestCurveUpdate, { passive: true });
    window.addEventListener("resize", requestCurveUpdate, { passive: true });
    requestCurveUpdate();

    const scrollGallery = (direction) => {
        const card = galleryCards[0];
        const gap = parseFloat(getComputedStyle(galleryTrack).columnGap) || 20;
        galleryTrack.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || 280) + gap), behavior: prefersReducedMotion ? "auto" : "smooth" });
    };
    previousButton?.addEventListener("click", () => scrollGallery(-1));
    nextButton?.addEventListener("click", () => scrollGallery(1));

    galleryTrack.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        dragging = true;
        didDrag = false;
        dragStartX = event.clientX;
        dragScrollStart = galleryTrack.scrollLeft;
        galleryTrack.classList.add("is-dragging");
        galleryTrack.setPointerCapture?.(event.pointerId);
    });
    galleryTrack.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        const delta = event.clientX - dragStartX;
        if (Math.abs(delta) > 5) didDrag = true;
        if (didDrag) galleryTrack.scrollLeft = dragScrollStart - delta;
    });
    const stopDragging = () => {
        dragging = false;
        galleryTrack.classList.remove("is-dragging");
        requestCurveUpdate();
    };
    galleryTrack.addEventListener("pointerup", stopDragging);
    galleryTrack.addEventListener("pointercancel", stopDragging);
    galleryTrack.addEventListener("click", (event) => {
        if (!didDrag) return;
        event.preventDefault();
        event.stopPropagation();
        didDrag = false;
    }, true);
    galleryTrack.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            galleryTrack.scrollLeft += event.deltaY;
        }
    }, { passive: false });
}

// 03. AUTOMATIC COPYRIGHT YEAR
const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

// 04. Letter-by-letter section reveals (all sections except the hero).
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function wrapTextLetters(element, className, delayProperty, step) {
    if (element.dataset.lettersReady === "true") return;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let count = 0;
    nodes.forEach((node) => {
        const value = node.nodeValue || "";
        if (!value.trim()) return;
        const fragment = document.createDocumentFragment();
        for (const char of value) {
            if (/\s/.test(char)) {
                fragment.appendChild(document.createTextNode(char === " " ? "\u00a0" : char));
            } else {
                const span = document.createElement("span");
                span.className = className;
                span.textContent = char;
                span.style.setProperty(delayProperty, `${Math.min(count, 45) * step}ms`);
                fragment.appendChild(span);
                count++;
            }
        }
        node.parentNode?.replaceChild(fragment, node);
    });
    element.dataset.lettersReady = "true";
    element.classList.add("text-reveal-ready");
}

if (!prefersReducedMotion) {
    const targets = document.querySelectorAll(
      "main section:not(.hero) h2,main section:not(.hero) h3,main section:not(.hero) p," +
      "main section:not(.hero) .section-kicker,main section:not(.hero) .eyebrow," +
      "main section:not(.hero) .location-info small,main section:not(.hero) .ministry-card span," +
      "main section:not(.hero) .message-copy>span,main section:not(.hero) .event-notice small," +
      "main section:not(.hero) .contact-list article"
    );
    targets.forEach(el => wrapTextLetters(el, "letter-reveal", "--letter-delay", 18));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-revealed");
                observer.unobserve(entry.target);
            }
        });
    }, {threshold:.12,rootMargin:"0px 0px -35px 0px"});
    document.querySelectorAll(".text-reveal-ready").forEach(el => observer.observe(el));
}



// 05. HERO PORTAL — scroll-position-driven and isolated to #home.
// The static hero remains the fallback when JS is unavailable or motion is reduced.
const portalHero = document.querySelector("#home.hero");
const portalStage = portalHero?.querySelector(".hero-stage");
if (portalHero && portalStage && !prefersReducedMotion) {
    portalHero.classList.add("portal-motion-ready");
    let portalFrame = 0;

    const clamp01 = (value) => Math.max(0, Math.min(1, value));
    const updatePortal = () => {
        portalFrame = 0;
        const travel = Math.max(1, portalHero.offsetHeight - portalStage.clientHeight);
        const progress = clamp01(-portalHero.getBoundingClientRect().top / travel);
        const leftTravel = -112 * progress;
        const rightTravel = 112 * progress;
        const outward = Math.min(window.innerWidth * 0.43, 560) * progress;
        const vertical = Math.min(window.innerHeight * 0.18, 150) * progress;

        portalHero.style.setProperty("--portal-progress", progress.toFixed(4));
        portalHero.style.setProperty("--portal-left-x", `${leftTravel}%`);
        portalHero.style.setProperty("--portal-right-x", `${rightTravel}%`);
        portalHero.style.setProperty("--portal-image-scale", (1.12 - progress * 0.12).toFixed(4));
        portalHero.style.setProperty("--portal-duotone-opacity", (progress * 0.14).toFixed(4));
        portalHero.style.setProperty("--portal-title-scale", (1 + progress * 0.16).toFixed(4));
        portalHero.style.setProperty("--portal-word-left", `${-outward}px`);
        portalHero.style.setProperty("--portal-word-right", `${outward}px`);
        portalHero.style.setProperty("--portal-amber-x", `${-outward}px`);
        portalHero.style.setProperty("--portal-amber-y", `${-vertical}px`);
        portalHero.style.setProperty("--portal-teal-x", `${outward}px`);
        portalHero.style.setProperty("--portal-teal-y", `${vertical + 14}px`);
        portalHero.querySelector("h1")?.style.setProperty("letter-spacing", `${-0.025 - progress * 0.025}em`);
    };
    const requestPortalUpdate = () => {
        if (!portalFrame) portalFrame = window.requestAnimationFrame(updatePortal);
    };

    updatePortal();
    window.addEventListener("scroll", requestPortalUpdate, { passive: true });
    window.addEventListener("resize", requestPortalUpdate, { passive: true });
    window.addEventListener("pagehide", () => {
        window.removeEventListener("scroll", requestPortalUpdate);
        window.removeEventListener("resize", requestPortalUpdate);
        if (portalFrame) window.cancelAnimationFrame(portalFrame);
    }, { once: true });
}
