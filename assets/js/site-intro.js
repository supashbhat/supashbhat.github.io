(() => {
  const intro = document.querySelector("[data-site-intro]");
  if (!intro) return;
  const key = `supash-intro-seen:${intro.dataset.siteIntro || location.pathname}`;
  const ready = () => document.body.classList.add("site-ready");
  const finish = () => {
    try { sessionStorage.setItem(key, "1"); } catch (_) {}
    ready();
  };
  const skip = intro.querySelector("[data-intro-skip]");
  if (skip) skip.addEventListener("click", finish, { once: true });
  let seen = false;
  try { seen = sessionStorage.getItem(key) === "1"; } catch (_) {}
  if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    ready();
    return;
  }
  window.addEventListener("load", () => window.setTimeout(finish, 1750), { once: true });
})();
