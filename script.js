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
  