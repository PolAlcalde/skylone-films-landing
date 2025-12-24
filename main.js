const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const body = document.body;
const menuOverlay = document.querySelector("[data-menu]");
const menuOpenButton = document.querySelector("[data-menu-open]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const menuLinks = menuOverlay?.querySelectorAll("a") ?? [];

const modal = document.getElementById("modal");
const modalTitle = modal?.querySelector("#modal-title");
const modalSynopsis = modal?.querySelector(".modal__synopsis");
const modalVideo = modal?.querySelector("video");
const modalCloseButtons = modal?.querySelectorAll("[data-modal-close]");

const modalContent = {
  reel: {
    title: "Reel Skylone",
    synopsis: "Un recorrido breve por la estética y el ritmo editorial.",
  },
  urbano: {
    title: "Ciudad en pausa",
    synopsis: "Campaña urbana con detalle, calma y energía controlada.",
  },
  marca: {
    title: "Presencia discreta",
    synopsis: "Narrativa de marca con textura premium y dirección precisa.",
  },
  nocturno: {
    title: "Luz editorial",
    synopsis: "Nocturno cinematográfico con contraste y atmósfera.",
  },
  movimiento: {
    title: "Ritmo controlado",
    synopsis: "Movimiento medido para una experiencia visual elegante.",
  },
};

const openMenu = () => {
  if (!menuOverlay) return;
  menuOverlay.classList.add("is-open");
  menuOverlay.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
};

const closeMenu = () => {
  if (!menuOverlay) return;
  menuOverlay.classList.remove("is-open");
  menuOverlay.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
};

menuOpenButton?.addEventListener("click", openMenu);
menuCloseButtons.forEach((button) => {
  button.addEventListener("click", closeMenu);
});

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const openModal = (key) => {
  const data = modalContent[key];
  if (!data || !modal || !modalTitle || !modalSynopsis) return;
  modalTitle.textContent = data.title;
  modalSynopsis.textContent = data.synopsis;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
  if (modalVideo && !prefersReducedMotion) {
    modalVideo.currentTime = 0;
    modalVideo.play().catch(() => {});
  }
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
  modalVideo?.pause();
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

modalCloseButtons?.forEach((button) => {
  button.addEventListener("click", closeModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (modal?.classList.contains("is-open")) {
      closeModal();
    }
    if (menuOverlay?.classList.contains("is-open")) {
      closeMenu();
    }
  }
});

const themeSection = document.querySelector("[data-theme='dark']");
if (themeSection) {
  const themeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          body.classList.add("theme-dark");
          body.classList.remove("theme-light");
          themeSection.classList.add("is-active");
        } else if (entry.boundingClientRect.top > 0) {
          body.classList.remove("theme-dark");
          body.classList.add("theme-light");
        }
      });
    },
    { threshold: 0.35 }
  );

  themeObserver.observe(themeSection);
}

const workGrid = document.querySelector("[data-work-grid]");
const workCards = document.querySelectorAll(".work-card");

workCards.forEach((card) => {
  const video = card.querySelector(".work-card__video");
  if (video) {
    video.addEventListener("loadedmetadata", () => {
      video.pause();
      video.currentTime = 0;
    });
  }

  const handleEnter = () => {
    if (workGrid) {
      workGrid.classList.add("has-hover");
    }
    card.classList.add("is-hovered");
    if (video && !prefersReducedMotion) {
      video.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    card.classList.remove("is-hovered");
    if (workGrid) {
      workGrid.classList.remove("has-hover");
    }
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  card.addEventListener("pointerenter", handleEnter);
  card.addEventListener("pointerleave", handleLeave);
  card.addEventListener("focusin", handleEnter);
  card.addEventListener("focusout", handleLeave);
});
