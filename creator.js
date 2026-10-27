const TOTAL_POINTS = 20;
const MIN_CLASS_SKILL = 6;
const MAX_ATTACK_AND_HEALING = 12;
const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 20;
const TAKEN_NAMES = ["Shelly", "Colt", "Bull", "Nita", "Poco", "Piper", "Spike", "Crow"];
const SKILLS = { attack: "Attack", defense: "Defense", speed: "Speed", healing: "Healing" };
const CLASSES = {
    damage: { label: "Damage Dealer", skill: "attack" },
    tank: { label: "Tank", skill: "defense" },
    support: { label: "Support", skill: "healing" }
};

const form = document.getElementById("brawler-form");
const fields = [...form.querySelectorAll("input, select")];
const skillFields = [...form.querySelectorAll("[data-skill]")];
const nameField = document.getElementById("brawler-name");
const classField = document.getElementById("brawler-class");
const colorField = document.getElementById("brawler-color");
const errorSummary = document.getElementById("error-summary");
const pointsCounter = document.getElementById("points-counter");
const preview = document.getElementById("brawler-preview");
const resultSection = document.getElementById("created-brawler");
const result = document.getElementById("brawler-result");
const resultTitle = document.getElementById("created-title");

const touched = new Set();
let submitted = false;
form.noValidate = true;

function readBrawler() {
    const brawler = {
        name: nameField.value.trim(),
        classId: classField.value,
        color: colorField.value
    };

    for (const field of skillFields) {
        brawler[field.name] = field.valueAsNumber;
    }

    return brawler;
}

function buildCard(brawler) {
    const card = document.createElement("article");
    card.classList.add("brawler-card", "creator-card");
    card.style.setProperty("--brawler-color", brawler.color);

    const avatar = document.createElement("span");
    avatar.classList.add("brawler-avatar", "creator-avatar");
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = brawler.name.slice(0, 1).toUpperCase() || "?";

    const name = document.createElement("h3");
    name.textContent = brawler.name || "Your brawler";

    const className = document.createElement("p");
    className.textContent = CLASSES[brawler.classId]?.label || "Choose a class";

    const stats = document.createElement("dl");
    stats.classList.add("facts", "mb-0");

    for (const skill of Object.keys(SKILLS)) {
        const label = document.createElement("dt");
        label.textContent = SKILLS[skill];
        const value = document.createElement("dd");
        value.textContent = Number.isFinite(brawler[skill]) ? `${brawler[skill]} / 10` : "Not set";
        stats.append(label, value);
    }

    card.append(avatar, name, className, stats);
    return card;
}

function updatePreview() {
    const brawler = readBrawler();
    preview.replaceChildren(buildCard(brawler));
    const values = skillFields.map((field) => field.valueAsNumber);

    if (values.some((value) => !Number.isFinite(value))) {
        pointsCounter.textContent = "Complete all four skill values to calculate the remaining points.";
        return;
    }

    let total = 0;
    for (const value of values) total += value;
    const remaining = TOTAL_POINTS - total;
    pointsCounter.textContent = remaining >= 0
        ? `${total} / ${TOTAL_POINTS} points used · ${remaining} points remaining`
        : `${total} / ${TOTAL_POINTS} points used · ${Math.abs(remaining)} points over budget`;
}

function validate() {
    const errors = {};
    const brawler = readBrawler();

    for (const field of fields) {
        field.setCustomValidity("");
        if (!field.checkValidity()) errors[field.id] = field.validationMessage;
    }

    function addError(field, message) {
        errors[field.id] = errors[field.id] ? `${errors[field.id]} ${message}` : message;
    }

    if (!errors[nameField.id]) {
        if (brawler.name.length < MIN_NAME_LENGTH || brawler.name.length > MAX_NAME_LENGTH) {
            addError(nameField, `Use ${MIN_NAME_LENGTH}–${MAX_NAME_LENGTH} characters, excluding surrounding spaces.`);
        }
        if (TAKEN_NAMES.some((name) => name.toLowerCase() === brawler.name.toLowerCase())) {
            addError(nameField, "That name is already taken. Choose another brawler name.");
        }
    }

    const selectedClass = CLASSES[brawler.classId];
    if (!selectedClass && !errors[classField.id]) {
        addError(classField, "Choose one of the listed classes.");
    }

    const skillsValid = skillFields.every((field) => field.validity.valid);

    if (selectedClass) {
        const mainSkill = document.getElementById(selectedClass.skill);
        if (mainSkill.validity.valid && brawler[selectedClass.skill] < MIN_CLASS_SKILL) {
            addError(mainSkill, `${selectedClass.label} requires ${SKILLS[selectedClass.skill]} of at least ${MIN_CLASS_SKILL}.`);
        }
    }

    if (skillsValid) {
        let total = 0;
        for (const skill of Object.keys(SKILLS)) total += brawler[skill];

        if (total !== TOTAL_POINTS) {
            for (const field of skillFields) {
                addError(field, `Use exactly ${TOTAL_POINTS} points across all skills. Your total is ${total}.`);
            }
        }
    }

    const attackField = document.getElementById("attack");
    const healingField = document.getElementById("healing");
    if (attackField.validity.valid && healingField.validity.valid && brawler.attack + brawler.healing > MAX_ATTACK_AND_HEALING) {
        const message = `Attack and Healing combined cannot exceed ${MAX_ATTACK_AND_HEALING}.`;
        addError(attackField, message);
        addError(healingField, message);
    }

    for (const field of fields) field.setCustomValidity(errors[field.id] || "");
    return errors;
}

function updateValidation() {
    const errors = validate();

    for (const field of fields) {
        const message = touched.has(field.id) ? errors[field.id] || "" : "";
        document.getElementById(`${field.id}-error`).textContent = message;
        field.setAttribute("aria-invalid", String(message !== ""));
        field.classList.toggle("is-invalid", message !== "");
    }

    const errorCount = Object.keys(errors).length;
    errorSummary.hidden = !submitted || errorCount === 0;
    errorSummary.textContent = submitted && errorCount > 0
        ? `Please correct ${errorCount} ${errorCount === 1 ? "field" : "fields"} before creating your brawler.`
        : "";
    return errors;
}

function resetForm() {
    form.reset();
    touched.clear();
    submitted = false;
    errorSummary.hidden = true;
    errorSummary.textContent = "";

    for (const field of fields) {
        field.setCustomValidity("");
        field.setAttribute("aria-invalid", "false");
        field.classList.remove("is-invalid");
        document.getElementById(`${field.id}-error`).textContent = "";
    }

    updatePreview();
}

function handleInput() {
    updatePreview();
    updateValidation();
}

for (const field of fields) {
    field.addEventListener("blur", () => {
        touched.add(field.id);
        updateValidation();
    });
}

form.addEventListener("input", handleInput);
form.addEventListener("change", handleInput);
form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
    for (const field of fields) touched.add(field.id);

    const errors = updateValidation();
    const firstInvalidField = fields.find((field) => errors[field.id]);
    if (firstInvalidField) {
        firstInvalidField.focus();
        return;
    }

    const brawler = readBrawler();
    result.replaceChildren(buildCard(brawler));
    resultSection.hidden = false;
    resultTitle.focus();
    TAKEN_NAMES.push(brawler.name);
    resetForm();
});

document.getElementById("reset-form").addEventListener("click", () => {
    resetForm();
    nameField.focus();
});

const navigationToggle = document.querySelector(".navbar-toggler");
const navigationMenu = document.getElementById("mainNav");
navigationToggle.addEventListener("click", () => {
    const expanded = navigationToggle.getAttribute("aria-expanded") === "true";
    navigationToggle.setAttribute("aria-expanded", String(!expanded));
    navigationMenu.classList.toggle("show", !expanded);
});

updatePreview();
