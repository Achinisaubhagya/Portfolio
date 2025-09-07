// Initialize AOS (Animate on Scroll)
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: false, // Changed to false to ensure animations work after filtering
  mirror: false,
});

// DOM Elements
const header = document.querySelector("header");
const navLinks = document.querySelectorAll(".nav-links a");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".nav-links");
const progressBars = document.querySelectorAll(".progress");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const dots = document.querySelectorAll(".dot");
const dynamicText = document.querySelector(".dynamic-text");

// Track active filter
let currentFilter = "all";
// Flag to track if filtering is in progress
let isFiltering = false;

// Typing animation variables
const textArray = [
  "Full Stack Developer",
  "UI/UX Designer",
  "Mobile App Developer",
  "Desktop App Developer",
  "Web Developer",
  "Iot Developer",
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer;

// Fixed timing values for smooth, consistent animation
const typingDelay = 100;
const erasingDelay = 100;
const newTextDelay = 3000;
const startNewTextDelay = 1000;

// Typing animation function
function typeEffect() {
  clearTimeout(typingTimer);

  const currentText = textArray[textIndex];

  if (isDeleting) {
    dynamicText.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    dynamicText.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? erasingDelay : typingDelay;

  if (!isDeleting && charIndex === currentText.length) {
    delay = newTextDelay;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % textArray.length;
    delay = startNewTextDelay;
  }

  typingTimer = setTimeout(typeEffect, delay);
}

// Enhance the click behavior on nav links
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    // Remove active class from all links
    navLinks.forEach((innerLink) => {
      innerLink.classList.remove("active");
    });

    // Add active class to clicked link
    this.classList.add("active");

    // The closeMenu function is already being called in your existing code
  });
});

// Handle Dark/Light Mode
function toggleTheme() {
  body.classList.toggle("light-mode");
  if (body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}

// Theme image toggle for mobile
const themeImageToggle = document.getElementById("theme-image-toggle");
if (themeImageToggle) {
  themeImageToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
  });
}

// Check for saved theme preference
function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    // If there's a saved preference, use it
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (themeToggle) {
            themeToggle.checked = true;
        }
    } else {
        // Otherwise default to dark mode
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        if (themeToggle) {
            themeToggle.checked = false;
        }
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  body.classList.toggle("no-scroll");
}

// Close mobile menu when a link is clicked
function closeMenu() {
  hamburger.classList.remove("active");
  mobileMenu.classList.remove("active");
  body.classList.remove("no-scroll");
}

// Animate skill bars when scrolled into view
function animateSkillBars() {
  progressBars.forEach((progress) => {
    const value = progress.parentElement.nextElementSibling.textContent;
    progress.style.width = value;
  });
}

// Improved filter projects function
function filterProjects() {
  try {
    if (isFiltering) return;
    isFiltering = true;

    const filter = this.getAttribute("data-filter");
    currentFilter = filter;

    filterBtns.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");

    projectCards.forEach((card) => {
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 10);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });

    setTimeout(() => {
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }

      // Explicitly refresh certification and contact sections
      const certSection = document.getElementById("certifications");
      if (certSection) {
        certSection.classList.add("aos-animate");
        certSection.classList.add("aos-refreshed");
      }

      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.classList.add("aos-animate");
        contactSection.classList.add("aos-refreshed");
      }

      isFiltering = false;
    }, 500);
  } catch (error) {
    console.error("Error in filterProjects:", error);
    isFiltering = false;
  }
}

// Network Animation for Home Section
function initNetworkAnimation() {
  const canvas = document.getElementById("networkCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  const particleCount = 100;
  const connectionDistance = 180;

  function getColors() {
    const isLightMode = document.body.classList.contains("light-mode");
    return {
      particleColor: isLightMode
        ? "rgba(79, 70, 229, 0.6)"
        : "rgba(129, 140, 248, 0.7)",
      lineColor: isLightMode
        ? "rgba(79, 70, 229, 0.25)"
        : "rgba(129, 140, 248, 0.2)",
      highlightColor: isLightMode
        ? "rgba(79, 70, 229, 0.8)"
        : "rgba(129, 140, 248, 0.8)",
    };
  }

  function resizeCanvas() {
    const heroSection = document.querySelector(".hero");
    if (!heroSection) return;

    width = heroSection.offsetWidth;
    height = heroSection.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    createParticles();
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 2,
        vx: Math.random() * 1.5 - 0.75,
        vy: Math.random() * 1.5 - 0.75,
        highlighted: false,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    const colors = getColors();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx = -p.vx;
      if (p.y < 0 || p.y > height) p.vy = -p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.highlighted
        ? colors.highlightColor
        : colors.particleColor;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = 1 - distance / connectionDistance;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = document.body.classList.contains("light-mode")
            ? `rgba(79, 70, 229, ${opacity * 0.25})`
            : `rgba(129, 140, 248, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  function handleMouseMove(e) {
    const heroSection = document.querySelector(".hero");
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    particles.forEach((p) => (p.highlighted = false));

    particles.forEach((p) => {
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        p.highlighted = true;
        p.vx += dx * 0.01;
        p.vy += dy * 0.01;

        const maxVel = 2;
        const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (vel > maxVel) {
          p.vx = (p.vx / vel) * maxVel;
          p.vy = (p.vy / vel) * maxVel;
        }
      }
    });
  }

  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("mousemove", handleMouseMove);

  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "-1";

  resizeCanvas();
  drawParticles();
}

// Scroll to Top Button Functionality
function initScrollToTop() {
  const scrollTopBtn = document.querySelector(".scroll-top");
  if (!scrollTopBtn) return;

  let isVisible = false;
  let ticking = false;

  function scrollToTop() {
    scrollTopBtn.style.transform = "translateY(0) scale(0.95)";

    setTimeout(() => {
      scrollTopBtn.style.transform = "";
    }, 150);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      if (window.scrollY < 100) {
        hideScrollTopButton();
      }
    }, 500);
  }

  function showScrollTopButton() {
    if (!isVisible) {
      isVisible = true;
      scrollTopBtn.classList.add("show");

      setTimeout(() => {
        scrollTopBtn.classList.add("pulse");
        setTimeout(() => {
          scrollTopBtn.classList.remove("pulse");
        }, 600);
      }, 100);
    }
  }

  function hideScrollTopButton() {
    if (isVisible) {
      isVisible = false;
      scrollTopBtn.classList.remove("show");
    }
  }

  function handleScrollForButton() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;

        if (scrollPosition > 300) {
          showScrollTopButton();
        } else {
          hideScrollTopButton();
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  scrollTopBtn.addEventListener("click", scrollToTop);
  window.addEventListener("scroll", handleScrollForButton, { passive: true });
  scrollTopBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToTop();
    }
  });

  handleScrollForButton();
}

// Contact form submission handler
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) {
    console.error("Contact form not found");
    return;
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submission initiated");

    const submitButton = contactForm.querySelector(".form-submit");
    if (!submitButton) {
      console.error("Submit button not found");
      return;
    }

    // Validate form fields
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      showFormMessage("Please fill in all required fields.", "error");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage("Please enter a valid email address.", "error");
      return;
    }

    const originalContent = submitButton.innerHTML;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.style.opacity = "0.7";
    submitButton.style.cursor = "not-allowed";

    // Get all form data
    const phone = document.getElementById("phone").value.trim();

    console.log("Form data:", { name, email, subject, message, phone });

    // Create form data object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("_replyto", email);
    formData.append("phone", phone);
    formData.append("subject", subject);
    formData.append("message", message);

    // Submit to Formspree
    fetch("https://formspree.io/f/xwpnabdl", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log("Response received:", response.status);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .then((data) => {
        console.log("Success data:", data);
        showFormMessage("Message sent successfully! I'll get back to you soon.", "success");
        contactForm.reset();
      })
      .catch((error) => {
        console.error("Error sending form:", error);
        showFormMessage("Failed to send message. Please try again or contact me directly.", "error");
      })
      .finally(() => {
        // Always restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalContent;
        submitButton.style.opacity = "1";
        submitButton.style.cursor = "pointer";
      });
  });
}

// Show form messages
function showFormMessage(message, type) {
  console.log(`Showing message: ${message}, type: ${type}`);
  
  // Remove any existing status message
  const existingStatus = document.querySelector(".form-status");
  if (existingStatus) {
    existingStatus.remove();
  }

  // Create new status message
  const formStatus = document.createElement("div");
  formStatus.className = `form-status ${type}`;
  formStatus.textContent = message;

  // Add to form
  const form = document.getElementById("contactForm");
  if (!form) {
    console.error("Form not found for message display");
    return;
  }

  form.appendChild(formStatus);

  // Remove message after 5 seconds
  setTimeout(() => {
    if (formStatus && formStatus.parentNode) {
      formStatus.remove();
    }
  }, 5000);
}

// Add missing testimonial slider function
function setupTestimonialSlider() {
  // This function was referenced but missing
  // Add basic implementation or remove the call if not needed
  console.log("Testimonial slider setup - function placeholder");
}

// Setup download button feedback
function setupDownloadButtons() {
  const downloadBtn = document.querySelector(".primary-btn-about");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      const originalContent = this.innerHTML;

      this.innerHTML = '<i class="fas fa-check"></i> CV Downloaded';
      this.style.background = "linear-gradient(135deg, #10b981, #059669)";
      this.style.pointerEvents = "none";

      setTimeout(() => {
        this.innerHTML = originalContent;
        this.style.background = "";
        this.style.pointerEvents = "auto";
      }, 3000);
    });
  }

  const coverLetterBtn = document.querySelector(".download-btn");
  if (coverLetterBtn) {
    coverLetterBtn.addEventListener("click", function () {
      const originalContent = this.innerHTML;

      this.innerHTML =
        '<span><i class="fas fa-check"></i>Cover Letter Downloaded</span>';
      this.style.background = "linear-gradient(135deg, #10b981, #059669)";
      this.style.pointerEvents = "none";

      setTimeout(() => {
        this.innerHTML = originalContent;
        this.style.background = "";
        this.style.pointerEvents = "auto";
      }, 3000);
    });
  }
}

// Scroll handler for all sections
function handleScroll() {
  // Use requestAnimationFrame for smoother performance
  if (!window.scrollUpdateScheduled) {
    window.scrollUpdateScheduled = true;

    requestAnimationFrame(() => {
      try {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Handle header styling on scroll
        if (header) {
          if (scrollPosition > 50) {
            header.classList.add("scrolled");
          } else {
            header.classList.remove("scrolled");
          }
        }

        // Create an array to store sections and their visibility percentage
        const sectionVisibility = [];

        // Get all sections with IDs
        const sections = document.querySelectorAll("section[id]");

        // Calculate visibility for each section
        sections.forEach((section) => {
          if (!section) return;

          const rect = section.getBoundingClientRect();
          const sectionHeight = rect.height;

          // Calculate how much of the section is visible
          let visibleHeight = 0;

          if (rect.top < 0) {
            // Section top is above viewport
            visibleHeight = Math.min(sectionHeight + rect.top, windowHeight);
          } else if (rect.top < windowHeight) {
            // Section top is in viewport
            visibleHeight = Math.min(windowHeight - rect.top, sectionHeight);
          }

          // Calculate percentage of section visible (0 to 1)
          const visibilityPercentage = visibleHeight / sectionHeight;

          sectionVisibility.push({
            id: section.getAttribute("id"),
            visibility: visibilityPercentage,
          });
        });

        // Special case for top of page (home)
        if (scrollPosition < 150) {
          sectionVisibility.push({
            id: "home",
            visibility: 1.0,
          });
        }

        // Special case for bottom of page (last section)
        if (scrollPosition + windowHeight >= documentHeight - 50) {
          const lastSection = sections[sections.length - 1];
          if (lastSection) {
            sectionVisibility.push({
              id: lastSection.getAttribute("id"),
              visibility: 1.0,
            });
          }
        }

        // Find the section with highest visibility
        let mostVisibleSection = null;
        let highestVisibility = 0;

        sectionVisibility.forEach((section) => {
          if (section.visibility > highestVisibility) {
            highestVisibility = section.visibility;
            mostVisibleSection = section.id;
          }
        });

        // Update active navigation link
        if (mostVisibleSection) {
          navLinks.forEach((link) => {
            link.classList.remove("active");
            const linkHref = link.getAttribute("href");
            if (linkHref === `#${mostVisibleSection}`) {
              link.classList.add("active");
            }
          });
        }

        // Handle skill bars animation
        const skillsSection = document.getElementById("skills");
        if (skillsSection) {
          const sectionTop = skillsSection.offsetTop;
          const sectionHeight = skillsSection.offsetHeight;

          if (
            scrollPosition > sectionTop - windowHeight + 200 &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            animateSkillBars();
          }
        }

        // Check certification and contact sections for AOS
        const certificationsSection = document.getElementById("certifications");
        if (certificationsSection) {
          const sectionTop = certificationsSection.offsetTop;
          const viewportBottom = scrollPosition + windowHeight;

          if (viewportBottom > sectionTop - 400) {
            certificationsSection.classList.add("aos-animate");

            if (!certificationsSection.classList.contains("aos-refreshed")) {
              certificationsSection.classList.add("aos-refreshed");
              if (typeof AOS !== "undefined") {
                AOS.refresh();
              }
            }
          }
        }

        const contactSection = document.getElementById("contact");
        if (contactSection) {
          const sectionTop = contactSection.offsetTop;
          const viewportBottom = scrollPosition + windowHeight;

          if (viewportBottom > sectionTop - 400) {
            contactSection.classList.add("aos-animate");

            if (!contactSection.classList.contains("aos-refreshed")) {
              contactSection.classList.add("aos-refreshed");
              if (typeof AOS !== "undefined") {
                AOS.refresh();
              }
            }
          }
        }

        window.scrollUpdateScheduled = false;
      } catch (error) {
        console.error("Error in handleScroll:", error);
        window.scrollUpdateScheduled = false;
      }
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  try {
    console.log("DOM Content Loaded - Initializing...");
    
    checkTheme();
    initNetworkAnimation();

    if (dynamicText) {
      setTimeout(typeEffect, 1000);
    }

    if (themeToggle) {
      themeToggle.addEventListener("change", toggleTheme);
    }

    if (hamburger) {
      hamburger.addEventListener("click", toggleMobileMenu);
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", filterProjects);
    });

    initScrollToTop();
    setupTestimonialSlider();
    
    // Initialize contact form
    console.log("Initializing contact form...");
    initContactForm();
    
    setupDownloadButtons();

    window.addEventListener("scroll", handleScroll, { passive: true });

    setTimeout(() => {
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    }, 500);

    // Refresh AOS every 3 seconds to ensure animations work
    setInterval(() => {
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    }, 3000);
    
    console.log("Initialization complete");
  } catch (error) {
    console.error("Error in initialization:", error);
  }

  // In your DOMContentLoaded event handler:
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Also call it once on page load to set initial state
  setTimeout(handleScroll, 100);
});
