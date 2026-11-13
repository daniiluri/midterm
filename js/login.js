const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const loginFields = [...loginForm.querySelectorAll("input")];
const loginTouched = new Set();

if (Site.getUsers().some((user) => user.email === Site.getSession()?.email)) {
    location.replace("profile.html");
}

function loginValidationMessage(field) {
    if (!field.value.trim()) {
        return field.type === "email" ? "Enter your email address." : "Enter your demo password.";
    }
    if (field.type === "email" && !field.validity.valid) {
        return "Enter a valid email like player@example.com.";
    }
    return "";
}

function showLoginError(field) {
    const error = loginTouched.has(field.id) ? loginValidationMessage(field) : "";
    document.getElementById(`${field.id}-error`).textContent = error;
    field.classList.toggle("is-invalid", Boolean(error));
    field.setAttribute("aria-invalid", String(Boolean(error)));
}

for (const field of loginFields) {
    field.addEventListener("blur", () => {
        loginTouched.add(field.id);
        showLoginError(field);
    });
    field.addEventListener("input", () => {
        loginError.textContent = "";
        for (const input of loginFields) showLoginError(input);
    });
}

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginError.textContent = "";
    for (const field of loginFields) {
        loginTouched.add(field.id);
        showLoginError(field);
    }
    const invalidField = loginFields.find((field) => loginValidationMessage(field));
    if (invalidField) {
        invalidField.focus();
        return;
    }
    const emailField = loginForm.elements.email;
    const passwordField = loginForm.elements.password;
    const user = Site.getUsers().find(
        (item) =>
            item.email === emailField.value.trim().toLowerCase() && item.demoPassword === passwordField.value,
    );
    if (!user) {
        loginError.textContent =
            "Email or demo password is incorrect. New here? Create a demo account first.";
        passwordField.classList.add("is-invalid");
        passwordField.setAttribute("aria-invalid", "true");
        passwordField.focus();
        return;
    }
    Site.saveJson(Site.keys.session, {
        email: user.email,
        notice: `Logged in successfully. Welcome back, ${user.player}!`,
    });
    location.href = "profile.html";
});
