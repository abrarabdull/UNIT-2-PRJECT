document.addEventListener("DOMContentLoaded", function() {
  const archRows = document.querySelectorAll(".arch-row");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.2 });

  archRows.forEach(row => observer.observe(row));
});
