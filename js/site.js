// Shared navigation and the three jQuery effects: sliding, fading, and scrolling.
const Site = {
    duration: () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220),
    fadeIn(element) {
        element.hidden = false;
        $(element).stop(true, true).hide().fadeIn(this.duration());
    },
};

const navigationToggle = document.querySelector(".navbar-toggler");
const navigationMenu = document.getElementById("mainNav");
function closeNavigation() {
    navigationToggle.setAttribute("aria-expanded", "false");
    navigationMenu.classList.remove("show");
}
navigationToggle.addEventListener("click", () => {
    const expanded = navigationToggle.getAttribute("aria-expanded") !== "true";
    navigationToggle.setAttribute("aria-expanded", String(expanded));
    navigationMenu.classList.toggle("show", expanded);
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigationToggle.getAttribute("aria-expanded") === "true") {
        closeNavigation();
        navigationToggle.focus();
    }
});

for (const button of document.querySelectorAll(".faq-toggle")) {
    button.addEventListener("click", () => {
        const panel = document.getElementById(button.getAttribute("aria-controls"));
        const expanded = button.getAttribute("aria-expanded") !== "true";
        $(panel).stop(true, true);
        button.setAttribute("aria-expanded", String(expanded));
        if (expanded) {
            panel.hidden = false;
            $(panel).hide().slideDown(Site.duration());
        } else {
            $(panel).slideUp(Site.duration(), () => {
                panel.hidden = true;
            });
        }
    });
}

for (const link of document.querySelectorAll('a[href*="#"]')) {
    link.addEventListener("click", (event) => {
        const url = new URL(link.href);
        if (url.pathname !== location.pathname || !url.hash) return;
        const target = document.getElementById(url.hash.slice(1));
        if (!target) return;
        event.preventDefault();
        closeNavigation();
        const offset = document.querySelector(".site-nav").offsetHeight + 16;
        $("html, body")
            .stop(true)
            .animate({ scrollTop: Math.max(0, $(target).offset().top - offset) }, Site.duration());
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
    });
}
