document.documentElement.classList.add("js");

const revealItemSelectors = [
  ".about-grid article",
  ".project-card",
  ".project-section-header",
  ".project-showcase",
  ".project-writeup section",
  ".project-gallery img",
  ".archive-item",
  ".skills-grid > div",
  ".timeline-item",
  ".contact-methods > *",
  ".contact-form label",
  ".contact-form .button",
  ".form-note",
];

document.querySelectorAll(revealItemSelectors.join(",")).forEach((element, index) => {
  element.classList.add("reveal-item");
  element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
});

const revealElements = document.querySelectorAll(".reveal, .reveal-item");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const projectToggles = document.querySelectorAll("[data-project-toggle]");
const projectDetails = document.querySelectorAll("[data-project-detail]");

projectToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const project = toggle.dataset.projectToggle;
    const detail = document.querySelector(`[data-project-detail="${project}"]`);
    const isOpen = detail && !detail.hidden;

    projectDetails.forEach((item) => {
      item.hidden = true;
    });

    projectToggles.forEach((button) => {
      button.classList.remove("is-active");
      button.textContent = "Open project";
    });

    if (detail && !isOpen) {
      detail.hidden = false;
      toggle.classList.add("is-active");
      toggle.textContent = "Close project";
      detail.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

document.querySelectorAll("[data-project-close]").forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    projectDetails.forEach((item) => {
      item.hidden = true;
    });

    projectToggles.forEach((button) => {
      button.classList.remove("is-active");
      button.textContent = "Open project";
    });

    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const lightbox = document.querySelector("#gallery-lightbox");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const galleryImages = Array.from(document.querySelectorAll(".project-gallery img"));
let activeImageIndex = 0;

const showLightboxImage = (index) => {
  if (!lightbox || !lightboxImage || !lightboxCaption || galleryImages.length === 0) {
    return;
  }

  activeImageIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[activeImageIndex];
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.alt;
};

const openLightbox = (index) => {
  if (!lightbox) {
    return;
  }

  showLightboxImage(index);
  lightbox.hidden = false;
  document.body.classList.add("is-lightbox-open");
  lightboxClose?.focus();
};

const closeLightbox = () => {
  if (!lightbox) {
    return;
  }

  lightbox.hidden = true;
  document.body.classList.remove("is-lightbox-open");
};

galleryImages.forEach((image, index) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `Open ${image.alt}`);

  image.addEventListener("click", () => openLightbox(index));
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => showLightboxImage(activeImageIndex - 1));
lightboxNext?.addEventListener("click", () => showLightboxImage(activeImageIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    showLightboxImage(activeImageIndex - 1);
  } else if (event.key === "ArrowRight") {
    showLightboxImage(activeImageIndex + 1);
  }
});

const contactForm = document.querySelector("#contact-form");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(contactForm);
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const message = String(form.get("message") || "").trim();
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  window.location.href = `mailto:maximo.gianetti@hotmail.com?subject=${subject}&body=${body}`;
});
