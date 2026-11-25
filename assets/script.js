/* =========================================================
   TURNING POINT CHURCH INTERNATIONAL
   JavaScript — navigation, gallery viewer and footer year
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

// 03. AUTOMATIC COPYRIGHT YEAR
const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
