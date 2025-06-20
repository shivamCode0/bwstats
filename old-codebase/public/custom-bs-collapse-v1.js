window.addEventListener("DOMContentLoaded", function () {
  // Handler that uses various data-bs-* attributes to trigger
  // specific actions, mimicing bootstraps attributes

  const fnmap = {
    toggle: "toggle",
    show: "add",
    hide: "remove",
  };

  const collapse = (selector, cmd) => {
    const targets = Array.from(document.querySelectorAll(selector));
    targets.forEach((target) => target.classList[fnmap[cmd]]("show"));
  };

  const triggers = Array.from(document.querySelectorAll('[data-bs-toggle="collapse"]'));
  triggers.forEach((trigger) =>
    trigger.addEventListener("click", (e) => {
      const selector = trigger.getAttribute("data-bs-target");
      collapse(selector, "toggle");
    })
  );
});
