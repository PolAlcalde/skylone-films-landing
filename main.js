const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const heroPanel = document.querySelector(".hero__panel");
const sections = document.querySelectorAll(".section-reveal");
const processLine = document.querySelector(".process__line");
const spotlight = document.querySelector(".hero__spotlight");

const modal = document.getElementById("modal");
const modalTitle = modal.querySelector("#modal-title");
const modalSynopsis = modal.querySelector(".modal__synopsis");
const modalCloseButtons = modal.querySelectorAll("[data-modal-close]");

const modalContent = {
  "modal-urban": {
    title: "Urban Pulse",
    synopsis: "A night portrait of movement and quiet in the city core.",
  },
  "modal-brand": {
    title: "Quiet Brand Story",
    synopsis: "A brand film built on restraint, light, and honest rhythm.",
  },
  "modal-introspective": {
    title: "Inner Lines",
    synopsis: "Introspective frames that track breath, balance, and release.",
  },
  "modal-night": {
    title: "Night Study",
    synopsis: "A study of contrast, glow, and the tension between silence and sound.",
  },
  "modal-motion": {
    title: "Motion & Light",
    synopsis: "Slow motion and precise lighting for a meditative pace.",
  },
  "modal-quiet": {
    title: "Quiet Power",
    synopsis: "A grounded portrait of presence under pressure.",
  },
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = prefersReducedMotion ? 0 : index * 120;
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach((section) => revealObserver.observe(section));

if (processLine) {
  const processObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          processLine.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.4 }
  );
  processObserver.observe(processLine);
}

window.addEventListener("load", () => {
  if (heroPanel) {
    heroPanel.classList.add("is-visible");
  }
});

if (!prefersReducedMotion) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    document.documentElement.style.setProperty("--parallax-y", `${scrollTop * 0.08}px`);
    const grid = document.querySelector(".page-grid");
    if (grid) {
      grid.style.transform = `translateY(${scrollTop * 0.03}px)`;
    }
  });
}

if (spotlight && !prefersReducedMotion) {
  document.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty("--spot-x", `${x}%`);
    document.documentElement.style.setProperty("--spot-y", `${y}%`);
    spotlight.style.setProperty("--spot-x", `${x}%`);
    spotlight.style.setProperty("--spot-y", `${y}%`);
  });
}

const workCards = document.querySelectorAll(".work-card");
workCards.forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.modal;
    const data = modalContent[key];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalSynopsis.textContent = data.synopsis;
    modal.classList.add("is-open");
    modalContentElementFocus();
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.click();
    }
  });

  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
});

const closeModal = () => {
  modal.classList.remove("is-open");
};

const modalContentElementFocus = () => {
  const closeButton = modal.querySelector(".modal__close");
  if (closeButton) closeButton.focus();
};

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

const accordion = document.querySelector(".accordion");
if (accordion) {
  const trigger = accordion.querySelector(".accordion__trigger");
  const content = accordion.querySelector(".accordion__content");
  trigger.addEventListener("click", () => {
    const isOpen = accordion.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    content.style.maxHeight = isOpen ? `${content.scrollHeight}px` : "0px";
  });
}

window.addEventListener("resize", () => {
  if (accordion && accordion.classList.contains("is-open")) {
    const content = accordion.querySelector(".accordion__content");
    content.style.maxHeight = `${content.scrollHeight}px`;
  }
});
