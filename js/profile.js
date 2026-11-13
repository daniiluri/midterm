const profileSession = Site.getSession();
const profileUser = Site.getUsers().find((user) => user.email === profileSession?.email);
if (!profileUser) {
    localStorage.removeItem(Site.keys.session);
    location.replace("login.html");
} else {
    document.getElementById("profile-content").hidden = false;
    const details = {
        "profile-avatar": profileUser.player.slice(0, 2).toUpperCase(),
        "profile-name": profileUser.player,
        "profile-style": profileUser.style,
        "profile-trophies": profileUser.trophies.toLocaleString("en-US"),
        "profile-email": profileUser.email,
        "profile-mode": profileUser.mode,
        "profile-play-style": profileUser.style,
    };
    for (const [id, value] of Object.entries(details)) document.getElementById(id).textContent = value;
    if (profileSession.notice) {
        const successMessage = document.getElementById("profile-success");
        successMessage.textContent = profileSession.notice;
        Site.fadeIn(successMessage);
        successMessage.focus();
        Site.saveJson(Site.keys.session, { email: profileUser.email });
    }
}
