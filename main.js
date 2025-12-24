const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

const modal = document.getElementById("modal");
const modalTitle = modal.querySelector("#modal-title");
const modalSynopsis = modal.querySelector(".modal__synopsis");
const modalVideo = modal.querySelector("video");
const modalCloseButtons = modal.querySelectorAll("[data-modal-close]");

const modalContent = {
  reel: {
    title: "Reel Skylone",
    synopsis: "Un recorrido breve por la estética y el ritmo de Skylone Films.",
  },
  urbano: {
    title: "Ritmo de ciudad",
    synopsis: "Un retrato contenido de movimiento urbano y pausa emocional.",
  },
  marca: {
    title: "Presencia de marca",
    synopsis: "Una pieza sobria con foco en detalle, textura y claridad.",
  },
  nocturno: {
    title: "Luz en silencio",
    synopsis: "Exploración nocturna con contrastes suaves y ritmo sereno.",
  },
  introspectivo: {
    title: "Dentro de la calma",
    synopsis: "Narrativa interna donde cada plano respira.",
  },
  movimiento: {
    title: "Flujo natural",
    synopsis: "Movimiento preciso y una cadencia que sostiene la emoción.",
  },
  silencio: {
    title: "Fuerza quieta",
    synopsis: "Presencia silenciosa, tensión controlada y composición limpia.",
  },
};

const openModal = (key) => {
  const data = modalContent[key];
  if (!data) return;
  modalTitle.textContent = data.title;
  modalSynopsis.textContent = data.synopsis;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (modalVideo) {
    modalVideo.currentTime = 0;
    modalVideo.play().catch(() => {});
  }
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (modalVideo) {
    modalVideo.pause();
  }
};

const modalTriggers = document.querySelectorAll("[data-modal]");
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openModal(trigger.dataset.modal);
  });

  if (trigger.tagName === "ARTICLE") {
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("role", "button");
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        trigger.click();
      }
    });
  }
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
