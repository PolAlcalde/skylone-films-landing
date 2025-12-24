const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const body = document.body;
const menuOverlay = document.querySelector("[data-menu]");
const menuOpenButton = document.querySelector("[data-menu-open]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const menuLinks = menuOverlay?.querySelectorAll("a") ?? [];
const heroVideo = document.querySelector("[data-hero-video]");

const modal = document.getElementById("modal");
const modalTitle = modal?.querySelector("#modal-title");
const modalLabel = modal?.querySelector("#modal-label");
const modalSynopsis = modal?.querySelector(".modal__synopsis");
const modalDetails = modal?.querySelector("#modal-details");
const modalCloseButtons = modal?.querySelectorAll("[data-modal-close]");
const modalVideo = modal?.querySelector(".modal__video");

const setupHeroAutoplay = () => {
  if (!(heroVideo instanceof HTMLVideoElement)) return;

  let gestureRetryUsed = false;
  const gestureEvents = ["click", "touchstart", "scroll", "keydown"];

  const removeGestureListeners = () => {
    gestureEvents.forEach((eventName) => {
      window.removeEventListener(eventName, handleGesture);
    });
  };

  const tryPlay = () => {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    const playAttempt = heroVideo.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        if (!gestureRetryUsed) {
          gestureRetryUsed = true;
          gestureEvents.forEach((eventName) => {
            window.addEventListener(eventName, handleGesture, { passive: true });
          });
        }
      });
    }
  };

  const handleGesture = () => {
    removeGestureListeners();
    tryPlay();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryPlay, { once: true });
  } else {
    tryPlay();
  }
  window.addEventListener("load", tryPlay, { once: true });
};

setupHeroAutoplay();

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

const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

const lockScroll = () => {
  const scrollbarWidth = getScrollbarWidth();
  body.style.overflow = "hidden";
  body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : "";
};

const unlockScroll = () => {
  body.style.overflow = "";
  body.style.paddingRight = "";
};

const openMenu = () => {
  if (!menuOverlay) return;
  menuOverlay.classList.add("is-open");
  menuOverlay.setAttribute("aria-hidden", "false");
  lockScroll();
  body.classList.add("menu-open");
};

const closeMenu = () => {
  if (!menuOverlay) return;
  menuOverlay.classList.remove("is-open");
  menuOverlay.setAttribute("aria-hidden", "true");
  unlockScroll();
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

const clearFocus = (element) => {
  if (element instanceof HTMLElement) {
    element.blur();
  }
};

menuLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!link.getAttribute("href")?.startsWith("#")) return;
    event.preventDefault();
    const targetId = link.getAttribute("href");
    closeMenu();
    smoothScrollTo(targetId, prefersReducedMotion ? 0 : 520);
    clearFocus(link);
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
    clearFocus(link);
  });
});

let lastModalTrigger = null;

const setModalVideo = () => {
  if (!modalVideo) return;
  const video = document.createElement("video");
  video.src = "assets/videotest.mp4";
  video.setAttribute("playsinline", "true");
  video.setAttribute("controls", "true");
  video.preload = "metadata";
  modalVideo.innerHTML = "";
  modalVideo.appendChild(video);
};

const focusModalClose = () => {
  const closeButton = modal?.querySelector("[data-modal-close]");
  if (closeButton instanceof HTMLElement) {
    closeButton.focus();
  }
};

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
  setModalVideo();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  lockScroll();
  focusModalClose();
};

const openProjectModal = (card) => {
  if (!modal || !modalTitle || !modalSynopsis) return;
  const title =
    card.dataset.title?.trim() ||
    card.querySelector("h3")?.textContent?.trim() ||
    "Proyecto";
  if (modalLabel) {
    modalLabel.textContent = "Proyecto";
  }
  modalTitle.textContent = title;
  modalSynopsis.textContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vitae euismod arcu, vitae viverra nisl.";
  if (modalDetails) {
    modalDetails.innerHTML =
      "<p><strong>Tags:</strong> Marca / Editorial / Urbano</p>";
  }
  setModalVideo();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
  focusModalClose();
};

const closeModal = () => {
  if (!modal) return;
  const video = modalVideo?.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  unlockScroll();
  if (lastModalTrigger instanceof HTMLElement) {
    lastModalTrigger.focus();
  }
  lastModalTrigger = null;
};

const modalTriggers = document.querySelectorAll("[data-modal]");
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    lastModalTrigger = trigger;
    if (trigger.classList.contains("work-card")) {
      openProjectModal(trigger);
      return;
    }
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
  if (event.key === "Tab" && modal?.classList.contains("is-open")) {
    const focusable = modal.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const workSection = document.querySelector(".work");

const setWorkTheme = (isActive) => {
  const useNoTransition = prefersReducedMotion || !isActive;
  if (useNoTransition) {
    body.classList.add("no-transition");
  }
  body.classList.toggle("theme-work-light", isActive);
  if (useNoTransition) {
    requestAnimationFrame(() => {
      body.classList.remove("no-transition");
    });
  }
};

const workThemeSection = document.querySelector("#trabajos");
if (workThemeSection) {
  const workThemeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        setWorkTheme(entry.isIntersecting);
      });
    },
    { threshold: 0.35 }
  );
  workThemeObserver.observe(workThemeSection);
}

if (workSection) {
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

const whatWeDoPanels = document.querySelectorAll(
  "[data-what-we-do-panel], [data-que-hacemos-panel], .what-we-do__panel, .que-hacemos__panel"
);
const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (!supportsHover && whatWeDoPanels.length) {
  whatWeDoPanels.forEach((panel) => {
    panel.addEventListener("click", () => {
      whatWeDoPanels.forEach((item) => item.classList.remove("is-active"));
      panel.classList.add("is-active");
    });
  });
}

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
