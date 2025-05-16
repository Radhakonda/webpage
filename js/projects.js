 AOS.init(); 
  
  
   
  // Enable hover dropdowns for submenus
  document.querySelectorAll('.dropdown-submenu > a').forEach(function (element) {
    element.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      let submenu = this.nextElementSibling;

      if (submenu && submenu.classList.contains('dropdown-menu')) {
        submenu.classList.toggle('show');

        // Close other open submenus
        document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(function (menu) {
          if (menu !== submenu) {
            menu.classList.remove('show');
          }
        });
      }
    });
  });

  // Close submenus when clicking outside
  window.addEventListener('click', function () {
    document.querySelectorAll('.dropdown-submenu .dropdown-menu').forEach(function (submenu) {
      submenu.classList.remove('show');
    });
  });


document.getElementById("registrationForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload

    const formData = new FormData(this); // Get form data

    const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    document.getElementById("responseMessage").textContent = result.message;

    // Clear the form
    this.reset();
});




  const sections = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, {
    threshold: 0.1  // triggers when 10% of the section is visible
  });

  sections.forEach(section => observer.observe(section));


