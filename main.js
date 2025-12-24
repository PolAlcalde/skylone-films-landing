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
  sobre: {
    title: "Sobre mí",
    synopsis:
      "Cineasta con enfoque editorial, obsesionado por el ritmo y la dirección visual. Trabajo con marcas y talentos que buscan imágenes premium, silenciosas y con propósito.",
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
    smoothScrollTo(targetId, prefersReducedMotion ? 0 : 220);
  });
});

document.querySelectorAll("[data-scroll]").forEach((link) => {
  if (!(link instanceof HTMLAnchorElement)) return;
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId?.startsWith("#")) return;
    event.preventDefault();
    const delay = menuOverlay?.classList.contains("is-open") && !prefersReducedMotion ? 220 : 0;
    if (menuOverlay?.classList.contains("is-open")) {
      closeMenu();
    }
    smoothScrollTo(targetId, delay);
  });
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

const themeSections = document.querySelectorAll("[data-theme]");
const setTheme = (theme) => {
  if (theme === "light") {
    body.classList.add("theme-light");
    body.classList.remove("theme-dark");
  } else {
    body.classList.add("theme-dark");
    body.classList.remove("theme-light");
  }
};

if (themeSections.length) {
  const themeObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length) {
        const theme = visibleEntries[0].target.dataset.theme || "dark";
        setTheme(theme);
      }
    },
    { threshold: [0.35, 0.6, 0.9] }
  );

  themeSections.forEach((section) => themeObserver.observe(section));
}

const workSection = document.querySelector(".work");
if (workSection) {
  const workObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          workSection.classList.add("is-active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  workObserver.observe(workSection);
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
  const video = card.querySelector(".work-card__video");
  if (video) {
    video.addEventListener("loadedmetadata", () => {
      video.pause();
      video.currentTime = 0;
    });
  }

  const handleEnter = () => {
    card.classList.add("is-hovered");
    if (video && !prefersReducedMotion) {
      video.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    card.classList.remove("is-hovered");
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
