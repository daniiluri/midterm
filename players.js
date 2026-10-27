const players = [
    { id: 1, name: "StarPlayer", trophies: 95000, isFollowed: false, favoriteBrawlers: ["Colt", "Nita"] },
    { id: 2, name: "CrowKing", trophies: 92000, isFollowed: false, favoriteBrawlers: ["Crow", "Spike"] },
    { id: 3, name: "BearBoss", trophies: 89000, isFollowed: false, favoriteBrawlers: ["Nita", "Bull"] },
    { id: 4, name: "SharpShot", trophies: 87000, isFollowed: false, favoriteBrawlers: ["Piper", "Colt"] },
    { id: 5, name: "SpikeMaster", trophies: 85000, isFollowed: false, favoriteBrawlers: ["Spike", "Shelly"] },
    { id: 6, name: "SuperShelly", trophies: 82000, isFollowed: false, favoriteBrawlers: ["Shelly", "Bull"] },
    { id: 7, name: "PocoPower", trophies: 80000, isFollowed: false, favoriteBrawlers: ["Poco", "Nita"] },
    { id: 8, name: "BullRush", trophies: 78000, isFollowed: false, favoriteBrawlers: ["Bull", "Crow"] },
    { id: 9, name: "GemHunter", trophies: 75000, isFollowed: false, favoriteBrawlers: ["Penny", "Jessie"] },
    { id: 10, name: "BrawlLegend", trophies: 72000, isFollowed: false, favoriteBrawlers: ["Brock", "Dynamike"] }
];

const FOLLOW_LIMIT = 3;
const container = document.getElementById("players-list");
const summary = document.getElementById("players-summary");
const message = document.getElementById("players-message");
const emptyState = document.getElementById("players-empty-state");

const navigation = document.getElementById("players-nav");
const brand = document.createElement("a");
brand.href = "index.html";
brand.classList.add("navbar-brand", "brand");

const brandIcon = document.createElement("i");
brandIcon.classList.add("bi", "bi-star-fill");
brandIcon.setAttribute("aria-hidden", "true");
brand.append(brandIcon, document.createTextNode(" Brawl Stars"));

const navigationToggle = document.createElement("button");
navigationToggle.type = "button";
navigationToggle.classList.add("navbar-toggler");
navigationToggle.setAttribute("aria-controls", "mainNav");
navigationToggle.setAttribute("aria-expanded", "false");
navigationToggle.setAttribute("aria-label", "Toggle navigation");

const toggleIcon = document.createElement("span");
toggleIcon.classList.add("navbar-toggler-icon");
navigationToggle.append(toggleIcon);

const navigationMenu = document.createElement("div");
navigationMenu.id = "mainNav";
navigationMenu.classList.add("collapse", "navbar-collapse");

const navigationList = document.createElement("ul");
navigationList.classList.add("navbar-nav", "ms-auto", "align-items-md-center", "gap-md-2");

for (const item of [
    { text: "Home", href: "index.html" },
    { text: "Brawlers", href: "brawlers.html" },
    { text: "Quiz", href: "quiz.html" },
    { text: "Top Players", href: "players.html" },
    { text: "Creator", href: "creator.html" },
    { text: "Join", href: "index.html#join" }
]) {
    const listItem = document.createElement("li");
    listItem.classList.add("nav-item");

    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.text;

    if (item.href === "index.html#join") {
        link.classList.add("btn", "btn-brawl", "btn-sm", "my-2", "my-md-0");
    } else {
        link.classList.add("nav-link");
    }

    if (item.href === "players.html") {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }

    listItem.append(link);
    navigationList.append(listItem);
}

navigationMenu.append(navigationList);
navigation.append(brand, navigationToggle, navigationMenu);

navigationToggle.addEventListener("click", () => {
    const expanded = navigationToggle.getAttribute("aria-expanded") === "true";
    navigationToggle.setAttribute("aria-expanded", String(!expanded));
    navigationMenu.classList.toggle("show", !expanded);
});

const header = document.getElementById("players-header");
const eyebrow = document.createElement("p");
eyebrow.classList.add("eyebrow");
eyebrow.textContent = "Build your favorites list";

const title = document.createElement("h1");
title.classList.add("hero-title");
title.textContent = "Top Players";

const introduction = document.createElement("p");
introduction.classList.add("lead", "mb-0");
introduction.textContent = `Explore this fictional leaderboard and follow up to ${FOLLOW_LIMIT} players. Unfollow a player to free a spot.`;
header.append(eyebrow, title, introduction);

const footerText = document.createElement("h3");
footerText.classList.add("mb-0");
footerText.textContent = "This is the end of the page";
document.getElementById("players-footer").append(footerText);

const controls = document.getElementById("players-controls");
const searchLabel = document.createElement("label");
searchLabel.htmlFor = "player-search";
searchLabel.classList.add("form-label");
searchLabel.textContent = "Search players";

const searchInput = document.createElement("input");
searchInput.id = "player-search";
searchInput.type = "search";
searchInput.placeholder = "Search by player name";
searchInput.classList.add("form-control");
controls.append(searchLabel, searchInput);

let searchTerm = "";
let ruleMessage = "";

function countFollowedPlayers() {
    let count = 0;

    for (const player of players) {
        if (player.isFollowed) count++;
    }

    return count;
}

searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    ruleMessage = "";
    render();
});

container.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-player-id]");
    if (!button || !container.contains(button)) return;

    const playerId = Number(button.dataset.playerId);
    const player = players.find((item) => item.id === playerId);
    if (!player) throw new Error(`Player ${playerId} does not exist.`);

    if (!player.isFollowed && countFollowedPlayers() >= FOLLOW_LIMIT) {
        ruleMessage = `You can follow at most ${FOLLOW_LIMIT} players. Unfollow someone before following ${player.name}.`;
    } else {
        player.isFollowed = !player.isFollowed;
        ruleMessage = "";
    }

    render();
    container.querySelector(`button[data-player-id="${playerId}"]`).focus();
});

function render() {
    container.replaceChildren();

    const filteredPlayers = players.filter((player) => {
        return player.name.toLowerCase().includes(searchTerm);
    });

    const followedCount = countFollowedPlayers();
    summary.textContent = `Showing ${filteredPlayers.length} of ${players.length} players · Following: ${followedCount} / ${FOLLOW_LIMIT}`;
    message.textContent = ruleMessage;
    message.hidden = ruleMessage === "";
    emptyState.textContent = filteredPlayers.length === 0 ? "No players found. Try another name." : "";

    if (filteredPlayers.length === 0) return;

    const table = document.createElement("table");
    table.classList.add("table", "table-hover", "align-middle", "mb-0", "brawler-table");

    const caption = document.createElement("caption");
    caption.classList.add("visually-hidden");
    caption.textContent = "Fictional top players ordered by trophies";

    const tableHead = document.createElement("thead");
    const headingRow = document.createElement("tr");

    for (const title of ["Player", "Trophies", "Favorite brawlers", "Following"]) {
        const heading = document.createElement("th");
        heading.scope = "col";
        heading.textContent = title;
        headingRow.append(heading);
    }

    tableHead.append(headingRow);

    const tableBody = document.createElement("tbody");

    for (const player of filteredPlayers) {
        const row = document.createElement("tr");
        if (player.isFollowed) row.classList.add("table-active");

        for (const value of [
            player.name,
            player.trophies.toLocaleString("en-US"),
            player.favoriteBrawlers.join(", ")
        ]) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);
        }

        const actionCell = document.createElement("td");
        actionCell.classList.add("text-nowrap");

        const button = document.createElement("button");
        button.type = "button";
        button.dataset.playerId = player.id;
        button.classList.add("btn", "btn-brawl", "btn-sm");
        if (player.isFollowed) button.classList.add("btn-brawl-blue");
        button.textContent = player.isFollowed ? "Unfollow" : "Follow";
        button.setAttribute("aria-label", `${button.textContent} ${player.name}`);
        button.setAttribute("aria-pressed", String(player.isFollowed));
        actionCell.append(button);
        row.append(actionCell);

        tableBody.append(row);
    }

    table.append(caption, tableHead, tableBody);
    container.append(table);
}

render();
