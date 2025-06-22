// ui.js
const menuOptions = document.querySelectorAll("#menu-options li");
let selectedIndex = 0;

function updateMenuSelection() {
  menuOptions.forEach((li, index) => {
    li.innerText = li.innerText.replace("▶ ", "");
    if (index === selectedIndex) {
      li.innerText = "▶ " + li.innerText;
    }
  });
}

function handleMenuNavigation(e) {
  const total = menuOptions.length;
  if (e.key === "ArrowDown") {
    selectedIndex = (selectedIndex + 1) % total;
    updateMenuSelection();
  } else if (e.key === "ArrowUp") {
    selectedIndex = (selectedIndex - 1 + total) % total;
    updateMenuSelection();
  } else if (e.key === "Enter") {
    menuOptions[selectedIndex].click();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (menuOptions.length > 0) {
    updateMenuSelection();
    document.addEventListener("keydown", handleMenuNavigation);
  }
});

// Mostra o menu de dificuldade
function showDifficulty() {
  document.getElementById("menu-container").classList.add("hidden");
  document.getElementById("difficulty-container").classList.remove("hidden");
}

// Voltar ao menu principal
function backToMenu() {
  document.getElementById("difficulty-container").classList.add("hidden");
  document.getElementById("menu-container").classList.remove("hidden");
}
