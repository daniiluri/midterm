const Site = {
    keys: {
        theme: "brawl-club-theme",
        users: "brawl-club-users",
        session: "brawl-club-session",
        favorites: "brawl-club-favorites",
    },
    readJson(key, fallback) {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    },
    saveJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getUsers() {
        return this.readJson(this.keys.users, []);
    },
    getSession() {
        return this.readJson(this.keys.session, null);
    },
    getFavorites() {
        return this.readJson(this.keys.favorites, []);
    },
    setFavorites(items) {
        this.saveJson(this.keys.favorites, items);
        this.updateSavedCount();
    },
    updateSavedCount() {
        const count = this.getFavorites().length;
        for (const badge of document.querySelectorAll("[data-saved-count]")) {
            badge.textContent = count;
        }
    },
    duration: () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220),
    fadeIn(element) {
        element.hidden = false;
        $(element).stop(true, true).hide().fadeIn(this.duration());
    },
};

const navigationToggle = document.querySelector(".navbar-toggler");
const navigationMenu = document.getElementById("mainNav");
const navigationList = navigationMenu.querySelector(".navbar-nav");
const joinLink = navigationList.querySelector('a[href="index.html#join"]');
const activePage = location.pathname.split("/").pop() || "index.html";

function addNavigationItem(element) {
    const item = document.createElement("li");
    item.className = "nav-item";
    item.append(element);
    joinLink.parentElement.before(item);
    return element;
}

function addNavigationLink(label, href, className = "nav-link") {
    const link = document.createElement("a");
    link.className = className;
    link.href = href;
    link.textContent = label;
    if (activePage === href) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }
    return addNavigationItem(link);
}

const favoritesLink = addNavigationLink("My picks", "favorites.html");
const savedCount = document.createElement("span");
savedCount.className = "saved-count";
savedCount.dataset.savedCount = "";
savedCount.setAttribute("aria-label", "saved brawlers");
favoritesLink.append(" ", savedCount);
Site.updateSavedCount();

const session = Site.getSession();
if (session) {
    const logout = document.createElement("button");
    logout.type = "button";
    logout.className = "nav-link nav-button";
    logout.textContent = "Log out";
    addNavigationItem(logout);
    logout.addEventListener("click", () => {
        localStorage.removeItem(Site.keys.session);
        location.href = "index.html";
    });
    joinLink.textContent = "My profile ↗";
    joinLink.href = "profile.html";
    if (activePage === "profile.html") {
        joinLink.classList.add("active");
        joinLink.setAttribute("aria-current", "page");
    }
} else {
    addNavigationLink("Log in", "login.html");
    joinLink.textContent = "Sign up ↗";
}

const themeButton = document.createElement("button");
themeButton.type = "button";
themeButton.className = "theme-toggle";
themeButton.dataset.themeToggle = "";
themeButton.setAttribute("role", "switch");
themeButton.setAttribute("aria-label", "Light mode");
addNavigationItem(themeButton);

function updateThemeButton() {
    const isLight = document.documentElement.dataset.bsTheme === "light";
    themeButton.innerHTML = `<i class="bi bi-${isLight ? "sun-fill" : "moon-stars-fill"}" aria-hidden="true"></i><span>Light mode</span>`;
    themeButton.title = `Switch to ${isLight ? "dark" : "light"} mode`;
    themeButton.setAttribute("aria-checked", String(isLight));
}
updateThemeButton();
themeButton.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.bsTheme === "light" ? "dark" : "light";
    document.documentElement.dataset.bsTheme = nextTheme;
    Site.saveJson(Site.keys.theme, nextTheme);
    updateThemeButton();
});

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

window.addEventListener("storage", (event) => {
    if (event.key === Site.keys.favorites) Site.updateSavedCount();
    if (event.key === Site.keys.theme) {
        document.documentElement.dataset.bsTheme = Site.readJson(Site.keys.theme, "dark");
        updateThemeButton();
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
