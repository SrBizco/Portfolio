document.documentElement.classList.add("js");

const revealElements = document.querySelectorAll(".reveal");

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
