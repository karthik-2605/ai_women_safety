// ----- LOGIN PAGE -----
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
  
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
  
        if (username && password) {
          // Simulate login
          window.location.href = "dashboard.html";
        } else {
          alert("Please enter username and password.");
        }
      });
    }
  
    if (registerForm) {
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
  
        if (name && email && password) {
          alert("Registration successful!");
          window.location.href = "index.html";
        } else {
          alert("Please fill all fields.");
        }
      });
    }
  
    // ----- DASHBOARD PAGE -----
  
    // Emergency Button
    const emergencyBtn = document.getElementById("emergencyBtn");
    if (emergencyBtn) {
      emergencyBtn.addEventListener("click", () => {
        alert("Emergency alert sent to your contacts!");
      });
    }
  
    // Voice Detection Button
    const listenBtn = document.getElementById("listenBtn");
    if (listenBtn) {
      listenBtn.addEventListener("click", () => {
        alert("Voice detection activated (simulated)!");
        listenBtn.innerText = "Listening...";
        listenBtn.disabled = true;
  
        // Simulate listening
        setTimeout(() => {
          listenBtn.innerText = "Start Listening";
          listenBtn.disabled = false;
          alert("Detected distress word: 'Help'");
        }, 5000);
      });
    }
  
    // Location Tracking Toggle
    const locationBtn = document.getElementById("locationBtn");
    const locationStatus = document.getElementById("locationStatus");
    if (locationBtn && locationStatus) {
      let tracking = false;
  
      locationBtn.addEventListener("click", () => {
        tracking = !tracking;
        locationBtn.innerText = tracking ? "Stop Tracking" : "Start Tracking";
        locationStatus.innerText = tracking ? "Location tracking is active" : "Location tracking is disabled";
        locationStatus.style.color = tracking ? "#006400" : "#7a7a7a";
      });
    }
  
    // Status Check-in Slider
    const checkinSlider = document.getElementById("checkinSlider");
    const checkinInterval = document.getElementById("checkinInterval");
    const startCheckin = document.getElementById("startCheckin");
  
    if (checkinSlider && checkinInterval && startCheckin) {
      checkinSlider.addEventListener("input", () => {
        checkinInterval.innerText = checkinSlider.value + "m";
      });
  
      startCheckin.addEventListener("click", () => {
        alert(`Status check-in activated every ${checkinSlider.value} minutes.`);
      });
    }
  });

  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  const slider = document.getElementById('checkin-slider');
  const startButton = document.getElementById('start-checkin');
  
  const intervals = [5, 15, 30];
  
  slider.addEventListener('input', () => {
    const selected = intervals[parseInt(slider.value)];
    startButton.innerText = `🔔 Start Status Check-in (${selected} min)`;
  });
  
  startButton.addEventListener('click', () => {
    const selected = intervals[parseInt(slider.value)];
    alert(`Status check-in started at ${selected} minute intervals.`);
  });
  
  function toggleMenu() {
    const nav = document.getElementById("navMenu");
    nav.classList.toggle("show");
  }

  let isListening = false;
  const statusDisplay = document.getElementById('voice-status');
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  recognition.onstart = () => {
    isListening = true;
    statusDisplay.textContent = 'Status: Listening...';
  };
  
  recognition.onend = () => {
    isListening = false;
    statusDisplay.textContent = 'Status: Not Listening';
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log('Transcript:', transcript);
    if (transcript.includes('help') || transcript.includes('stop')) {
      alert("Emergency keyword detected!");
      // You can also trigger other things here, like:
      // - Show emergency button
      // - Send location (if integrated)
      // - Play siren sound
    }
  };
  
  document.getElementById('startListeningBtn').addEventListener('click', () => {
    if (!isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  });
  
      
      window.addEventListener("DOMContentLoaded", () => {
        const startBtn = document.getElementById("startListeningBtn");
        const statusText = document.getElementById("voice-status");
      
        if (!('webkitSpeechRecognition' in window)) {
          statusText.textContent = "Speech Recognition not supported in this browser.";
          startBtn.disabled = true;
          return;
        }
      
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
      
        let isListening = false;
      
        recognition.onstart = () => {
          statusText.textContent = "Status: Listening...";
          startBtn.textContent = "Stop Listening";
        };
      
        recognition.onend = () => {
          statusText.textContent = "Status: Not Listening";
          startBtn.textContent = "Start Listening";
          isListening = false;
        };
      
        recognition.onerror = (event) => {
          console.error("Speech Recognition Error:", event.error);
        };
      
        recognition.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
          console.log("Recognized:", transcript);
      
          if (transcript.includes("help") || transcript.includes("stop")) {
            alert("🚨 Emergency Triggered by Voice!");
            // Optional: call your emergency function here
          }
        };
      
        startBtn.addEventListener("click", () => {
          if (!isListening) {
            recognition.start();
            isListening = true;
          } else {
            recognition.stop();
          }
        });
      });
      
      window.addEventListener("load", function () {
        if (!navigator.geolocation) {
          alert("Geolocation is not supported by your browser.");
          return;
        }
      
        navigator.geolocation.getCurrentPosition(function (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
      
          // Initialize Leaflet map
          const map = L.map('map').setView([lat, lng], 15);
      
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
      
          // Add a marker to the user's location
          L.marker([lat, lng]).addTo(map)
            .bindPopup('You are here!')
            .openPopup();
        }, function () {
          alert("Unable to retrieve your location.");
        });
      });
      