// Archive behavior: intro, navigation, theme, reveal effects, and listening controls.
const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

const setupArchiveChrome = () => {
  if (!document.querySelector(".intro-splash")) {
    const intro = document.createElement("div");
    intro.className = "intro-splash";
    intro.setAttribute("aria-hidden", "true");
    intro.innerHTML = `
      <div class="intro-wrap">
        <div class="intro-mark"><canvas class="icosa-shell" data-shell-size="102" aria-hidden="true"></canvas></div>
        <div class="intro-title">Malombo Archive</div>
        <div class="intro-caption">Sound as action</div>
      </div>
    `;
    document.body.appendChild(intro);
  }

  if (!document.querySelector(".corner-orb")) {
    const orb = document.createElement("div");
    orb.className = "corner-orb";
    orb.innerHTML = `<canvas class="icosa-shell" data-shell-size="90" aria-hidden="true"></canvas>`;
    document.body.appendChild(orb);
  }
};

setupArchiveChrome();

const savedTheme = localStorage.getItem("malombo-theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("malombo-theme", body.classList.contains("dark") ? "dark" : "light");
  });
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("open");
  });
}

const currentPage = body.dataset.page;
const pageMatches = {
  home: "index.html",
  framework: "theoretical-framework.html",
  history: "historical-context.html",
  ritual: "ritual-practice.html",
  audio: "audio-analysis.html",
  festival: "from-ritual-to-festival.html",
  works: "works-cited.html",
  about: "about.html"
};

document.querySelectorAll(".site-nav a").forEach((link) => {
  const target = pageMatches[currentPage];
  if (target && link.getAttribute("href")?.endsWith(target)) {
    link.classList.add("active");
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const enablePage = () => {
  body.classList.add("page-ready");
  body.classList.remove("is-loading");
};

const introSeenKey = "malombo-archive-intro-seen";
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem(introSeenKey) === "1") {
  enablePage();
} else {
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      sessionStorage.setItem(introSeenKey, "1");
      enablePage();
    }, 1850);
  }, { once: true });
}

const player = document.getElementById("analysis-player");
const timestampButtons = document.querySelectorAll(".timestamp-button");
const analysisSections = document.querySelectorAll(".scroll-spot");

const setActiveButton = (id) => {
  timestampButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === id);
  });
};

timestampButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const start = button.dataset.start;
    const target = button.dataset.target;
    if (player) {
      player.src = `https://www.youtube-nocookie.com/embed/NRcm4V__De4?start=${start}&autoplay=1`;
    }
    const section = document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setActiveButton(target);
  });
});

if (analysisSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveButton(entry.target.id);
      }
    });
  }, { threshold: 0.55 });

  analysisSections.forEach((section) => sectionObserver.observe(section));
}
