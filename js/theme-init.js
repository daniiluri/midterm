const savedTheme = localStorage.getItem("brawl-club-theme");
document.documentElement.dataset.bsTheme = savedTheme === null ? "dark" : JSON.parse(savedTheme);
