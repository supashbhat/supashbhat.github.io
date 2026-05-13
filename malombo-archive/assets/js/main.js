// Shared enhancement layer: theme toggle, mobile navigation, reveal animation,
// and timestamp controls for the listening page.
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
        <div class="intro-mark"><canvas class="icosa-shell" data-shell-size="72" aria-hidden="true"></canvas></div>
        <div class="intro-title">Malombo Archive</div>
        <div class="intro-caption">Sound as action</div>
      </div>
    `;
    document.body.appendChild(intro);
  }

  if (!document.querySelector(".corner-orb")) {
    const orb = document.createElement("div");
    orb.className = "corner-orb";
    orb.innerHTML = `<canvas class="icosa-shell" data-shell-size="56" aria-hidden="true"></canvas>`;
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

const ICOSA_VERTICES = (() => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
  ];
  return raw.map(([x, y, z]) => {
    const mag = Math.hypot(x, y, z);
    return { x: x / mag, y: y / mag, z: z / mag };
  });
})();

const ICOSA_EDGES = (() => {
  const edges = [];
  for (let i = 0; i < ICOSA_VERTICES.length; i += 1) {
    for (let j = i + 1; j < ICOSA_VERTICES.length; j += 1) {
      const a = ICOSA_VERTICES[i];
      const b = ICOSA_VERTICES[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
      if (dist < 1.12) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
})();

const rotateVertex = (vertex, rx, ry, rz) => {
  let { x, y, z } = vertex;
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;
  y = y1;
  z = z1;

  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x2 = x * cosY + z * sinY;
  const z2 = -x * sinY + z * cosY;
  x = x2;
  z = z2;

  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x3 = x * cosZ - y * sinZ;
  const y3 = x * sinZ + y * cosZ;
  return { x: x3, y: y3, z };
};

const setupIcosaShell = (canvas) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let rotationX = 0.8;
  let rotationY = 0.55;
  let rotationZ = 0.12;
  let velocityX = 0.022;
  let velocityY = 0.048;
  let velocityZ = 0.014;
  let dragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let lastPointerTime = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const size = Math.min(width, height);
    const radius = size * 0.44;
    const distance = 2.8;
    const projected = ICOSA_VERTICES.map((vertex) => {
      const rotated = rotateVertex(vertex, rotationX, rotationY, rotationZ);
      const scale = radius / (rotated.z + distance);
      return {
        x: width * 0.5 + rotated.x * scale,
        y: height * 0.5 + rotated.y * scale,
        z: rotated.z
      };
    });

    ICOSA_EDGES.forEach(([aIndex, bIndex]) => {
      const a = projected[aIndex];
      const b = projected[bIndex];
      const depth = (a.z + b.z) * 0.5;
      const alpha = Math.max(0.18, Math.min(0.82, 0.24 + (depth + 1) * 0.28));
      ctx.strokeStyle = depth > 0
        ? `rgba(159, 196, 165, ${alpha})`
        : `rgba(104, 133, 112, ${Math.max(0.14, alpha * 0.58)})`;
      ctx.lineWidth = depth > 0 ? 1.9 : 1.1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    projected
      .slice()
      .sort((a, b) => a.z - b.z)
      .forEach((point) => {
        const r = point.z > 0 ? 2.5 : 1.7;
        const orb = ctx.createRadialGradient(point.x - r * 0.35, point.y - r * 0.4, r * 0.15, point.x, point.y, r * 1.45);
        if (point.z > 0) {
          orb.addColorStop(0, "rgba(244, 250, 243, 0.98)");
          orb.addColorStop(0.44, "rgba(215, 186, 116, 0.96)");
          orb.addColorStop(1, "rgba(131, 173, 141, 0.88)");
        } else {
          orb.addColorStop(0, "rgba(207, 221, 202, 0.76)");
          orb.addColorStop(1, "rgba(93, 124, 100, 0.56)");
        }
        ctx.fillStyle = orb;
        ctx.beginPath();
        ctx.arc(point.x, point.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
  };

  const animate = () => {
    if (!dragging) {
      velocityX *= 0.992;
      velocityY *= 0.992;
      velocityZ *= 0.992;
    }
    rotationX += velocityX;
    rotationY += velocityY;
    rotationZ += velocityZ;
    draw();
    window.requestAnimationFrame(animate);
  };

  const onPointerDown = (event) => {
    event.preventDefault();
    dragging = true;
    canvas.classList.add("dragging");
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    lastPointerTime = performance.now();
    canvas.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!dragging) return;
    event.preventDefault();
    const now = performance.now();
    const dx = event.clientX - lastPointerX;
    const dy = event.clientY - lastPointerY;
    const dt = Math.max(16, now - lastPointerTime);
    rotationY += dx * 0.012;
    rotationX += dy * 0.012;
    velocityY = (dx / dt) * 0.34;
    velocityX = (dy / dt) * 0.34;
    velocityZ = ((dx - dy) / dt) * 0.07;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    lastPointerTime = now;
  };

  const stopDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove("dragging");
    if (event && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  };

  resize();
  draw();
  animate();
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointerleave", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);
  window.addEventListener("resize", resize);
};

document.querySelectorAll(".icosa-shell").forEach(setupIcosaShell);
