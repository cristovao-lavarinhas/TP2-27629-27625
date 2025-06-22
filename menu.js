// menu.js

// Abre um modal (remove a classe 'hidden')
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("hidden");
}

// Fecha um modal (adiciona a classe 'hidden')
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  // Garante que os modais estão escondidos ao carregar
  document.getElementById("modalInstrucoes")?.classList.add("hidden");
  document.getElementById("modalDefinicoes")?.classList.add("hidden");

  // Botões do menu
  document.getElementById("instrucoesBtn").addEventListener("click", () => {
    openModal("modalInstrucoes");
  });

  document.getElementById("definicoesBtn").addEventListener("click", () => {
    openModal("modalDefinicoes");
  });

  // Botão X dentro de cada modal
  document.querySelectorAll(".fecharModal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) modal.classList.add("hidden");
    });
  });

  // Clica fora do modal → fecha
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.classList.add("hidden");
    }
  });
});
