const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const body = document.body;
const menuOverlay = document.querySelector("[data-menu]");
const menuOpenButton = document.querySelector("[data-menu-open]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const menuLinks = menuOverlay?.querySelectorAll("a") ?? [];

const modal = document.getElementById("modal");
const modalTitle = modal?.querySelector("#modal-title");
const modalLabel = modal?.querySelector("#modal-label");
const modalSynopsis = modal?.querySelector(".modal__synopsis");
const modalDetails = modal?.querySelector("#modal-details");
const modalCloseButtons = modal?.querySelectorAll("[data-modal-close]");

const modalContent = {
  sobre: {
    label: "Sobre mí",
    title: "Sobre mí",
    synopsis:
      "Cineasta con enfoque editorial, obsesionado por el ritmo y la dirección visual. Trabajo con marcas y talentos que buscan imágenes premium, silenciosas y con propósito.",
    details:
      "<p>Trabajo desde Barcelona con marcas que quieren imágenes silenciosas, elegantes y con intención. Cada proyecto se diseña para transmitir atmósfera y carácter cinematográfico.</p>",
  },
  "trabajo-1": {
    label: "Proyecto",
    title: "Ciudad en pausa",
    synopsis:
      "Una campaña nocturna que observa el pulso urbano con precisión editorial.",
    details:
      "<p>Dirección visual centrada en textura, reflejos y ritmo lento. <strong>Placeholder:</strong> assets/proyecto-01.mp4</p>",
  },
  "trabajo-2": {
    label: "Proyecto",
    title: "Presencia discreta",
    synopsis:
      "Narrativa minimalista para destacar la presencia sin sobre-explicar.",
    details:
      "<p>Planos cerrados, respiración sonora y montaje limpio. <strong>Placeholder:</strong> assets/proyecto-02.mp4</p>",
  },
  "trabajo-3": {
    label: "Proyecto",
    title: "Luz editorial",
    synopsis:
      "Una pieza lifestyle donde la luz guía el relato y el gesto.",
    details:
      "<p>Foco en movimientos orgánicos y contrastes suaves. <strong>Placeholder:</strong> assets/proyecto-03.mp4</p>",
  },
  "trabajo-4": {
    label: "Proyecto",
    title: "Ritmo controlado",
    synopsis:
      "Automoción premium con tempo pausado y dirección precisa.",
    details:
      "<p>Dirección técnica para vehículos, detalles y texturas. <strong>Placeholder:</strong> assets/proyecto-04.mp4</p>",
  },
};

const openMenu = () => {
  if (!menuOverlay) return;
  menuOverlay.classList.add("is-open");
  menuOverlay.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
  body.classList.add("menu-open");
};

const closeMenu = () => {
  if (!menuOverlay) return;
  menuOverlay.classList.remove("is-open");
  menuOverlay.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
  body.classList.remove("menu-open");
};

menuOpenButton?.addEventListener("click", openMenu);
menuCloseButtons.forEach((button) => {
  button.addEventListener("click", closeMenu);
});

const smoothScrollTo = (targetId, closeDelay = 0) => {
  const target = document.querySelector(targetId);
  if (!target) return;
  window.setTimeout(() => {
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, closeDelay);
};

menuLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!link.getAttribute("href")?.startsWith("#")) return;
    event.preventDefault();
    const targetId = link.getAttribute("href");
    closeMenu();
    smoothScrollTo(targetId, prefersReducedMotion ? 0 : 520);
  });
});

document.querySelectorAll("[data-scroll]").forEach((link) => {
  if (!(link instanceof HTMLAnchorElement)) return;
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId?.startsWith("#")) return;
    event.preventDefault();
    const delay = menuOverlay?.classList.contains("is-open") && !prefersReducedMotion ? 520 : 0;
    if (menuOverlay?.classList.contains("is-open")) {
      closeMenu();
    }
    smoothScrollTo(targetId, delay);
  });
});

const openModal = (key) => {
  const data = modalContent[key];
  if (!data || !modal || !modalTitle || !modalSynopsis) return;
  if (modalLabel) {
    modalLabel.textContent = data.label ?? "Detalle";
  }
  modalTitle.textContent = data.title;
  modalSynopsis.textContent = data.synopsis;
  if (modalDetails) {
    modalDetails.innerHTML = data.details ?? "";
  }
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
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

const applyBackground = (mode, { immediate = false } = {}) => {
  if (immediate) {
    body.classList.add("no-transition");
  }
  body.classList.remove("bg-hero", "bg-works-dark", "bg-light", "bg-focus-dark");
  body.classList.add(mode);
  if (immediate) {
    requestAnimationFrame(() => {
      body.classList.remove("no-transition");
    });
  }
};

const workSection = document.querySelector(".work");
const focusSection = document.querySelector(".focus");
const exitWorksTrigger = document.querySelector("[data-exit-works]");

if (workSection) {
  const workObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          applyBackground("bg-works-dark");
        }
      });
    },
    { threshold: 0.35 }
  );
  workObserver.observe(workSection);

  const workCardObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          workSection.classList.add("is-active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );
  workCardObserver.observe(workSection);
}

if (exitWorksTrigger) {
  const exitObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          applyBackground("bg-light");
        }
      });
    },
    { threshold: 0.6 }
  );
  exitObserver.observe(exitWorksTrigger);
}

if (focusSection) {
  const focusObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          applyBackground("bg-focus-dark", { immediate: true });
        }
      });
    },
    { threshold: 0.35 }
  );
  focusObserver.observe(focusSection);
}

const revealElements = document.querySelectorAll(".reveal");
if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}
const workCards = document.querySelectorAll(".work-card");

workCards.forEach((card) => {
  const handleEnter = () => {
    card.classList.add("is-hovered");
  };

  const handleLeave = () => {
    card.classList.remove("is-hovered");
  };

  card.addEventListener("pointerenter", handleEnter);
  card.addEventListener("pointerleave", handleLeave);
  card.addEventListener("focusin", handleEnter);
  card.addEventListener("focusout", handleLeave);
});

const cookieBanner = document.querySelector("[data-cookie-banner]");
const cookieModal = document.querySelector("[data-cookie-modal]");
const cookieAccept = document.querySelector("[data-cookie-accept]");
const cookieReject = document.querySelector("[data-cookie-reject]");
const cookieConfig = document.querySelector("[data-cookie-config]");
const cookieSave = document.querySelector("[data-cookie-save]");
const cookieCloseButtons = document.querySelectorAll("[data-cookie-close]");
const analyticsToggle = document.querySelector("[data-cookie-analytics]");
const marketingToggle = document.querySelector("[data-cookie-marketing]");
const COOKIE_KEY = "cookie-preferences";

const applyCookiePreferences = (preferences) => {
  body.dataset.analytics = preferences.analytics ? "on" : "off";
  body.dataset.marketing = preferences.marketing ? "on" : "off";
  if (!preferences.analytics) {
    // TODO: evitar activar analíticas cuando estén rechazadas.
  }
};

const setCookiePreferences = (preferences) => {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(preferences));
  applyCookiePreferences(preferences);
  if (cookieBanner) {
    cookieBanner.classList.remove("is-visible");
    cookieBanner.setAttribute("aria-hidden", "true");
  }
  if (cookieModal) {
    cookieModal.classList.remove("is-open");
    cookieModal.setAttribute("aria-hidden", "true");
  }
};

const showCookieBanner = () => {
  if (!cookieBanner) return;
  cookieBanner.classList.add("is-visible");
  cookieBanner.setAttribute("aria-hidden", "false");
};

const showCookieModal = () => {
  if (!cookieModal) return;
  cookieModal.classList.add("is-open");
  cookieModal.setAttribute("aria-hidden", "false");
};

const getStoredPreferences = () => {
  const stored = localStorage.getItem(COOKIE_KEY);
  return stored ? JSON.parse(stored) : null;
};

const storedPreferences = getStoredPreferences();
if (storedPreferences) {
  applyCookiePreferences(storedPreferences);
} else {
  showCookieBanner();
}

cookieAccept?.addEventListener("click", () => {
  setCookiePreferences({ analytics: true, marketing: true, necessary: true });
});

cookieReject?.addEventListener("click", () => {
  setCookiePreferences({ analytics: false, marketing: false, necessary: true });
});

cookieConfig?.addEventListener("click", () => {
  const currentPreferences = getStoredPreferences();
  if (analyticsToggle) {
    analyticsToggle.checked = currentPreferences?.analytics ?? false;
  }
  if (marketingToggle) {
    marketingToggle.checked = currentPreferences?.marketing ?? false;
  }
  showCookieModal();
});

cookieSave?.addEventListener("click", () => {
  setCookiePreferences({
    analytics: analyticsToggle?.checked ?? false,
    marketing: marketingToggle?.checked ?? false,
    necessary: true,
  });
});

cookieCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cookieModal?.classList.remove("is-open");
    cookieModal?.setAttribute("aria-hidden", "true");
  });
});
