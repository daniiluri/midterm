const favoritesGrid = document.getElementById("favorites-grid");
const clearFavorites = document.getElementById("clear-favorites");
function renderFavorites() {
    const favorites = Site.getFavorites();
    favoritesGrid.replaceChildren();
    document.getElementById("favorites-summary").textContent =
        `${favorites.length} saved ${favorites.length === 1 ? "brawler" : "brawlers"}`;
    document.getElementById("favorites-empty").hidden = favorites.length !== 0;
    clearFavorites.disabled = favorites.length === 0;
    for (const brawler of favorites) {
        const card = document.createElement("article");
        card.className = `brawler-card rarity-${brawler.rarity}`;
        const art = document.createElement("div");
        art.className = "brawler-art";
        const portrait = document.createElement("img");
        portrait.src = brawler.icon;
        portrait.alt = "";
        portrait.width = 128;
        portrait.height = 128;
        art.append(portrait);
        const rarity = document.createElement("span");
        rarity.className = "rarity-tag";
        rarity.textContent = brawler.rarity;
        const title = document.createElement("h3");
        title.textContent = brawler.name;
        const description = document.createElement("p");
        description.textContent = `${brawler.role} · ${brawler.mode}`;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "btn btn-outline-brawl save-brawler";
        remove.textContent = "Remove pick";
        remove.setAttribute("aria-label", `Remove ${brawler.name}`);
        remove.dataset.removeName = brawler.name;
        card.append(art, rarity, title, description, remove);
        favoritesGrid.append(card);
    }
}
favoritesGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-remove-name]");
    if (!button) return;
    const buttons = [...favoritesGrid.querySelectorAll("button")];
    const position = buttons.indexOf(button);
    Site.setFavorites(Site.getFavorites().filter((item) => item.name !== button.dataset.removeName));
    renderFavorites();
    const remaining = favoritesGrid.querySelectorAll("button");
    (
        remaining[Math.min(position, remaining.length - 1)] || document.querySelector("#favorites-empty a")
    ).focus();
});
clearFavorites.addEventListener("click", () => {
    Site.setFavorites([]);
    renderFavorites();
    document.querySelector("#favorites-empty a").focus();
});
window.addEventListener("storage", (event) => {
    if (event.key === Site.keys.favorites || event.key === null) renderFavorites();
});
renderFavorites();
