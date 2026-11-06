const form = document.getElementById("join-form");
const fields = [...form.querySelectorAll("input, select")];
const touched = new Set();
const success = document.getElementById("join-success");

function validationMessage(field) {
    const value = field.value.trim();
    if (field.type === "checkbox") return field.checked ? "" : "Confirm that you understand this is a demo.";
    if (!value) return "Please complete this field.";
    const validName = /^[a-zA-Z0-9_ -]{3,15}$/.test(value);
    if (field.id === "player" && !validName) {
        return "Use 3–15 English letters, digits, spaces, underscores, or hyphens.";
    }
    if (field.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Enter an email like player@example.com.";
    }
    if (
        field.id === "trophies" &&
        (!Number.isInteger(field.valueAsNumber) || field.valueAsNumber < 0 || field.valueAsNumber > 200000)
    ) {
        return "Enter a whole number from 0 to 200,000.";
    }
    return "";
}

function showError(field) {
    const error = touched.has(field.id) ? validationMessage(field) : "";
    document.getElementById(`${field.id}-error`).textContent = error;
    field.classList.toggle("is-invalid", Boolean(error));
    field.setAttribute("aria-invalid", String(Boolean(error)));
}

for (const field of fields) {
    field.addEventListener("blur", () => {
        touched.add(field.id);
        showError(field);
    });
    for (const event of ["input", "change"]) {
        field.addEventListener(event, () => {
            showError(field);
            $(success).stop(true, true);
            success.hidden = true;
        });
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    for (const field of fields) {
        touched.add(field.id);
        showError(field);
    }
    const invalidField = fields.find((field) => validationMessage(field));
    if (invalidField) {
        invalidField.focus();
        return;
    }
    success.textContent = `Welcome, ${form.elements.player.value.trim()}! Your ${form.elements.style.value.toLowerCase()} profile is ready for ${form.elements.mode.value}. This demo profile lasts for this page visit; no email was sent.`;
    form.reset();
    touched.clear();
    for (const field of fields) showError(field);
    Site.fadeIn(success);
    success.focus();
});
