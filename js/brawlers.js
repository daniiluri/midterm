const brawlers = [
    {
        name: "Shelly",
        rarity: "starting",
        role: "Damage Dealer",
        range: "Short",
        mode: "Showdown",
        description: "Her shotgun hits hardest up close, and her Super blasts through walls and bushes.",
        icon: "assets/icons/brawlers/shelly.png",
    },
    {
        name: "Colt",
        rarity: "rare",
        role: "Damage Dealer",
        range: "Long",
        mode: "Heist",
        description: "A sharpshooter who fires a long line of bullets. Deadly if every shot lands.",
        icon: "assets/icons/brawlers/colt.png",
    },
    {
        name: "Bull",
        rarity: "rare",
        role: "Tank",
        range: "Short",
        mode: "Showdown",
        description: "A tank with lots of health. His Super charges forward and knocks enemies around.",
        icon: "assets/icons/brawlers/bull.png",
    },
    {
        name: "Nita",
        rarity: "rare",
        role: "Damage Dealer",
        range: "Medium",
        mode: "Gem Grab",
        description: "Sends out shockwaves and summons Bruce, her bear, to fight by her side.",
        icon: "assets/icons/brawlers/nita.png",
    },
    {
        name: "Poco",
        rarity: "rare",
        role: "Support",
        range: "Medium",
        mode: "Brawl Ball",
        description: "Strums wide sound waves that hit several enemies, and his Super heals the whole team.",
        icon: "assets/icons/brawlers/poco.png",
    },
    {
        name: "Piper",
        rarity: "epic",
        role: "Marksman",
        range: "Long",
        mode: "Bounty",
        description:
            "A sniper whose shots hit harder the farther they fly. Her Super jumps away and drops grenades.",
        icon: "assets/icons/brawlers/piper.png",
    },
    {
        name: "Spike",
        rarity: "legendary",
        role: "Damage Dealer",
        range: "Long",
        mode: "Knockout",
        description: "Throws cactus grenades that burst into spikes. His Super slows enemies in an area.",
        icon: "assets/icons/brawlers/spike.png",
    },
    {
        name: "Crow",
        rarity: "legendary",
        role: "Assassin",
        range: "Medium",
        mode: "Showdown",
        description: "Poisons enemies with his daggers and leaps across the map with his Super.",
        icon: "assets/icons/brawlers/crow.png",
    },
];

const grid = document.getElementById("brawler-grid");
const search = document.getElementById("brawler-search");
const rarity = document.getElementById("rarity-filter");
const role = document.getElementById("class-filter");

function renderBrawlers() {
    const term = search.value.trim().toLowerCase();
    const matches = brawlers.filter(
        (brawler) =>
            `${brawler.name} ${brawler.mode}`.toLowerCase().includes(term) &&
            (rarity.value === "all" || brawler.rarity === rarity.value) &&
            (role.value === "all" || brawler.role === role.value),
    );
    grid.replaceChildren();
    document.getElementById("roster-count").textContent =
        `${matches.length} of ${brawlers.length} brawlers · Pick your next main`;
    document.getElementById("roster-empty").hidden = matches.length !== 0;
    for (const brawler of matches) {
        const card = document.createElement("article");
        card.className = `brawler-card rarity-${brawler.rarity}`;
        const art = document.createElement("div");
        art.className = "brawler-art";
        art.setAttribute("aria-hidden", "true");
        const icon = document.createElement("img");
        icon.src = brawler.icon;
        icon.alt = "";
        icon.width = 128;
        icon.height = 128;
        art.append(icon);
        const tag = document.createElement("span");
        tag.className = "rarity-tag";
        tag.textContent = brawler.rarity;
        const name = document.createElement("h3");
        name.textContent = brawler.name;
        const description = document.createElement("p");
        description.textContent = brawler.description;
        const stats = document.createElement("dl");
        stats.className = "card-stats";
        for (const [label, value] of [
            ["Class", brawler.role],
            ["Range", brawler.range],
            ["Try in", brawler.mode],
        ]) {
            const term = document.createElement("dt");
            const detail = document.createElement("dd");
            term.textContent = label;
            detail.textContent = value;
            stats.append(term, detail);
        }
        card.append(art, tag, name, description, stats);
        const saveButton = document.createElement("button");
        const isSaved = Site.getFavorites().some((item) => item.name === brawler.name);
        saveButton.type = "button";
        saveButton.className = `btn btn-brawl btn-sm save-brawler${isSaved ? " is-saved" : ""}`;
        saveButton.dataset.brawlerName = brawler.name;
        saveButton.setAttribute("aria-pressed", String(isSaved));
        saveButton.setAttribute("aria-label", `Save ${brawler.name}`);
        saveButton.textContent = isSaved ? "★ Saved" : "☆ Save brawler";
        card.append(saveButton);
        grid.append(card);
    }
}
grid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-brawler-name]");
    if (!button) return;
    const brawler = brawlers.find((item) => item.name === button.dataset.brawlerName);
    if (!brawler) throw new Error("Selected brawler is missing from the roster.");
    const favorites = Site.getFavorites();
    const isSaved = favorites.some((item) => item.name === brawler.name);
    Site.setFavorites(
        isSaved ? favorites.filter((item) => item.name !== brawler.name) : [...favorites, brawler],
    );
    renderBrawlers();
    grid.querySelector(`button[data-brawler-name="${brawler.name}"]`)?.focus();
});
search.addEventListener("input", renderBrawlers);
for (const filter of [rarity, role]) filter.addEventListener("change", renderBrawlers);
document.getElementById("clear-filters").addEventListener("click", () => {
    search.value = "";
    rarity.value = "all";
    role.value = "all";
    renderBrawlers();
    search.focus();
});
renderBrawlers();
