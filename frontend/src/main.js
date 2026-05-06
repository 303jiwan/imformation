import "./style.css";

const MAX_TILT = 14;

function attachTilt(el) {
  const baseTransform = getComputedStyle(el).transform;
  const base = baseTransform && baseTransform !== "none" ? baseTransform : "";

  function onMove(e) {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 2 * MAX_TILT;
    const rotateX = -(y - 0.5) * 2 * MAX_TILT;

    el.style.transform =
      `${base} perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    el.dataset.active = "true";
  }

  function onLeave() {
    el.style.transform = base;
    el.dataset.active = "false";
  }

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
}

document.querySelectorAll("[data-tilt]").forEach(attachTilt);
