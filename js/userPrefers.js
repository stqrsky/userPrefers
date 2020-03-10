const checkbox = document.querySelector('input[type="checkbox"]');
const root = document.querySelector("html");

function checkSystem() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDark) {
        root.classList.add("DarkMode");
    } else {
        root.classList.remove("DarkMode")
    }
}

function initDarkMode() {
    checkSystem();

    if (root.classList.contains("DarkMode")) {
        checkbox.setAttribute("checked", true);
    }

    checkbox.addEventListener("change", (event) => {
        root.classList.toggle("DarkMode");
        const isDarkMode = root.classList.contains("DarkMode");
        checkbox.setAttribute("checked", isDarkMode)
    });
}


initDarkMode();