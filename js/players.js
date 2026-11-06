const FOLLOW_LIMIT = 3;

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
    {
        id: 10,
        name: "BrawlLegend",
        trophies: 72000,
        isFollowed: false,
        favoriteBrawlers: ["Brock", "Dynamike"],
    },
];

const container = document.getElementById("players-list");
const summary = document.getElementById("players-summary");
const message = document.getElementById("players-message");
const emptyState = document.getElementById("players-empty-state");

const searchInput = document.getElementById("player-search");
const sortInput = document.getElementById("player-sort");
const filterInput = document.getElementById("player-filter");

let searchTerm = "";
let ruleMessage = "";

function countFollowedPlayers() {
    let count = 0;

    for (const player of players) {
        if (player.isFollowed) count++;
    }

    return count;
}

function render() {
    container.replaceChildren();

    const filteredPlayers = players.filter((player) => {
        return (
            player.name.toLowerCase().includes(searchTerm) &&
            (filterInput.value !== "following" || player.isFollowed)
        );
    });

    filteredPlayers.sort((a, b) =>
        sortInput.value === "name" ? a.name.localeCompare(b.name) : b.trophies - a.trophies,
    );
    const followedCount = countFollowedPlayers();
    summary.textContent = `Showing ${filteredPlayers.length} of ${players.length} players · Following: ${followedCount} / ${FOLLOW_LIMIT}`;
    message.textContent = ruleMessage;
    message.hidden = ruleMessage === "";
    emptyState.textContent =
        filteredPlayers.length === 0 ? "No players found. Try another name or show all players." : "";

    container.hidden = filteredPlayers.length === 0;
    if (filteredPlayers.length === 0) return;

    const table = document.createElement("table");
    table.classList.add("table", "table-hover", "align-middle", "mb-0", "brawler-table");

    const caption = document.createElement("caption");
    caption.classList.add("visually-hidden");
    caption.textContent = "Fictional player directory";

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
            player.favoriteBrawlers.join(", "),
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
    const updatedButton = container.querySelector(`button[data-player-id="${playerId}"]`);
    (updatedButton || filterInput).focus();
});

render();

for (const control of [sortInput, filterInput]) {
    control.addEventListener("change", () => {
        ruleMessage = "";
        render();
    });
}
