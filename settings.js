// settings.js
window.addEventListener("DOMContentLoaded", () => {
  const musicToggle = document.getElementById("musicToggle");
  const volumeSlider = document.getElementById("volumeSlider");
  const music = document.getElementById("bg-music");

  // Carregar preferências guardadas
  const musicEnabled = localStorage.getItem("musicEnabled") === "true";
  const volume = parseFloat(localStorage.getItem("musicVolume")) || 0.5;

  // Aplicar valores ao início
  if (musicToggle) musicToggle.checked = musicEnabled;
  if (volumeSlider) volumeSlider.value = volume;
  music.volume = volume;
  if (musicEnabled) music.play();

  // Guardar alterações feitas pelo utilizador
  if (musicToggle) {
    musicToggle.addEventListener("change", () => {
      const enabled = musicToggle.checked;
      localStorage.setItem("musicEnabled", enabled);
      if (enabled) {
        music.play();
      } else {
        music.pause();
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      const value = parseFloat(volumeSlider.value);
      music.volume = value;
      localStorage.setItem("musicVolume", value);
    });
  }
});
