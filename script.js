// scripts.js - Greens & Protein

document.addEventListener("DOMContentLoaded", () => {
  // ========== Dark Mode Toggle ==========
  const prefersDark = localStorage.getItem("dark-mode") === "true";
  if (prefersDark) document.body.classList.add("dark-mode");

  const darkToggle = document.querySelector("#darkToggle");
  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
    });
  }

  // ========== FAQ Accordion ==========
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });

  // ========== Smooth Scroll ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") return;
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ========== Modal Video Preview ==========
  document.querySelectorAll("video").forEach((vid) => {
    vid.addEventListener("click", () => {
      const modal = document.createElement("div");
      modal.className = "video-modal";
      modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
          <video src="${vid.src}" controls autoplay></video>
          <button class="modal-close">×</button>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector(".modal-close").onclick = () => modal.remove();
      modal.querySelector(".modal-backdrop").onclick = () => modal.remove();
    });
  });

  // ========== Cart Management ==========
  const updateCartDisplay = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let totalItems = 0;
    let totalPrice = 0;
    cart.forEach((item) => {
      totalItems += item.qty;
      totalPrice += item.qty * item.price;
    });
    const itemEl = document.querySelector("#cartItemCount");
    const totalEl = document.querySelector("#cartTotalPrice");
    if (itemEl) itemEl.textContent = totalItems;
    if (totalEl) totalEl.textContent = `₹${totalPrice}`;
  };

  if (document.body.classList.contains("cart-page") || document.querySelector("#cartItemCount")) {
    updateCartDisplay();
  }

  // ========== On-Scroll Animation ==========
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

  // ========== Bowl Custom Builder ==========
  const bowlForm = document.querySelector("#bowlBuilderForm");
  if (bowlForm) {
    bowlForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(bowlForm);
      const bowl = {
        protein: formData.get("protein"),
        base: formData.get("base"),
        dressing: formData.get("dressing"),
        price: parseInt(formData.get("price")),
        qty: 1
      };
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push(bowl);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Custom bowl added to cart!");
      updateCartDisplay();
    });
  }

  // ========== Thank You Redirect ==========
  const thankyouBtn = document.querySelector("#gotoHome");
  if (thankyouBtn) {
    thankyouBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});
