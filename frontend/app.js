document.addEventListener("DOMContentLoaded", function () {
   const loginForm = document.getElementById("loginForm");
   if (loginForm) {
   loginForm.addEventListener("submit", async function (event) {
   event.preventDefault();
  
 
   const email = document.getElementById("email").value;
   const password = document.getElementById("password").value;
  
 
   console.log("Entered Email:", email);
   console.log("Entered Password:", password);
  
 
   if (!email || !password) {
   alert("Please enter both email and password");
   return;
   }
  
 
   try {
   const response = await fetch("/login", {
   method: "POST",
   headers: {
   "Content-Type": "application/json",
   },
   body: JSON.stringify({
   email,
   password
   }),
   });
  
 
   const result = await response.json();
  
 
   if (response.ok && result.message === "Login successful") {
   console.log("Login successful:", result);
   // Store JWT token and user ID in local storage
   localStorage.setItem('token', result.token);
   localStorage.setItem('userId', result.userId);
   window.location.href = "dashboard.html";
   } else if (result.message === "No account found. Please sign up!") {
   alert(result.message);
   window.location.href = "signup.html";
   } else if (result.message === "Invalid credentials") {
   alert("Incorrect password. Please try again.");
   // Stay on the login page (do nothing)
   } else {
   alert("Login failed. Please try again.");
   }
   } catch (error) {
   console.error("Error during login:", error);
   alert("An error occurred. Please try again.");
   }
   });
   }
  
 
   const registerForm = document.getElementById("registerForm");
   if (registerForm) {
   registerForm.addEventListener("submit", async function (event) {
   event.preventDefault();
  
 
   const username = document.getElementById("name").value;
   const email = document.getElementById("email").value;
   const phone_number = document.getElementById("phno").value;
   const psw = document.getElementById("psw").value;
   const confirm_psw = document.getElementById("confirm_psw").value;
  
 
   console.log("Username:", username);
   console.log("Email:", email);
   console.log("Phone Number:", phone_number);
   console.log("Password:", psw);
   console.log("Confirm Password:", confirm_psw);
  
 
   if (!username || !email || !phone_number || !psw || !confirm_psw) {
   alert("Please fill in all fields.");
   return;
   }
  
 
   if (psw !== confirm_psw) {
   alert("Passwords do not match.");
   return;
   }
  
 
   try {
   const response = await fetch("/signup", {
   method: "POST",
   headers: {
   "Content-Type": "application/json",
   },
   body: JSON.stringify({
   username,
   email,
   phone_number,
   password: psw,
   }),
   });
  
 
   const result = await response.json();
  
 
   if (response.ok) {
   console.log("Signup successful:", result);
   alert("Signup successful! Please log in.");
   window.location.href = "login.html";
   } else {
   console.log("Signup failed:", result.message);
   alert(result.message || "Signup failed. Try again.");
   }
   } catch (error) {
   console.error("Error during signup:", error);
   alert("An error occurred during signup.");
   }
   });
   }
  
 
   const contactList = document.getElementById('contactList');
   if (contactList) {
   fetchExistingContacts(); // Fetch existing contacts when on the dashboard page
   }
  
 
   const contactAddBtn = document.getElementById('contactAddBtn');
   if (contactAddBtn) {
   contactAddBtn.addEventListener('click', function () {
   // your logic...
   const name = document.getElementById('contactName').value.trim();
   const phone = document.getElementById('contactNumber').value.trim();
  
 
   console.log('Contact Name:', name);
   console.log('Contact Phone Number:', phone);
  
 
   if (!name || !phone) {
   alert("Please fill out both fields.");
   return;
   }
  
 
   const token = localStorage.getItem('token'); // Retrieve JWT token
   const userId = localStorage.getItem('userId'); // Retrieve user ID
  
 
   console.log('JWT Token:', token);
   console.log('User ID:', userId);
  
 
   fetch('/contacts', { // Your backend API endpoint
   method: 'POST',
   headers: {
   "Content-Type": "application/json",
   'Authorization': `Bearer ${token}` // Include JWT token for authentication
   },
   body: JSON.stringify({
   userId,
   name,
   phone
   }), // Note: You should not pass userId here if using JWT for auth
   })
   .then(response => {
   console.log('Response Status:', response.status);
   return response.json();
   })
   .then(data => {
   console.log('Response Data:', data);
   alert('Contact added successfully!');
   // Optionally refresh the contact list here
   console.log(name);
   console.log(phone);
   addContactToList(name, phone);
   refreshContactForm();
   })
   .catch(error => {
   console.error('Error:', error);
   alert('Failed to add contact.');
   });
   });
   }
  
 
   const emergencyBtn = document.getElementById('emergencyBtn');
   if (emergencyBtn) {
   emergencyBtn.addEventListener('click', function () {
   console.log('Emergency button pressed!');
   sendEmergencySMS();
   });
   }
   // adding the functionality for voice distress signal--------------------------------------

   
  });


  
  
 
  function sendEmergencySMS() {
   const token = localStorage.getItem('token');
   if (!token) {
   alert("Not logged in. Cannot send emergency SMS.");
   return;
   }
  
 
   // Get user location using Geolocation API
   if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(
   function (position) {
   const latitude = position.coords.latitude;
   const longitude = position.coords.longitude;
   const userLocation = `https://maps.google.com/?q=${latitude},${longitude}`; // Location string
  
 
   // Now call the backend API with the location
   fetch('/send-alert', {
   method: 'POST',
   headers: {
   'Content-Type': 'application/json',
   'Authorization': `Bearer ${token}`
   },
   body: JSON.stringify({
   userLocation
   }) // Send location only
   })
   .then(response => response.json())
   .then(data => {
   if (data.message === 'SMS alert sent successfully') { // Message check
   alert('Emergency SMS sent successfully!');
   } else {
   alert(`Failed to send emergency SMS: ${data.message || data.error}`); //Display error from back end
   }
   })
   .catch(error => {
   console.error('Error sending SMS:', error);
   alert('Error sending SMS. Check console for details.');
   });
   },
   function (error) {
   // Handle geolocation errors
   switch (error.code) {
   case error.PERMISSION_DENIED:
   alert("Geolocation request denied. Please enable location services to access emergency functions. Make sure that you allowed the website to use the location");
   break;
   case error.POSITION_UNAVAILABLE:
   alert("Location information is unavailable.");
   break;
   case error.TIMEOUT:
   alert("The request to get user location timed out.");
   break;
   case error.UNKNOWN_ERROR:
   alert("An unknown error occurred.");
   break;
   }
   }
   );
   } else {
   alert("Geolocation is not supported by this browser.");
   }
  }
  
 
  function fetchExistingContacts() {
   const token = localStorage.getItem('token'); // Retrieve JWT token
  
 
   if (!token) {
   console.log('No token found. Cannot fetch contacts.');
   return;
   }
  
 
   fetch('/contacts', { // Your backend API endpoint
   method: 'GET',
   headers: {
   'Authorization': `Bearer ${token}` // Include JWT token for authentication
   }
   })
   .then(response => response.json())
   .then(data => {
   console.log('Raw Fetched Data:', data); // Log raw data for debugging
  
 
   try {
   if (Array.isArray(data)) {
   const uniqueContacts = [...new Map(data.map(item => [JSON.stringify(item), item])).values()];
   uniqueContacts.forEach(contact => {
   addContactToList(contact.name, contact.phone_number, contact.id); // Pass contact ID
   });
   } else if (typeof data === 'object' && data !== null) {
   if (data.contacts && Array.isArray(data.contacts)) {
   const uniqueContacts = [...new Map(data.contacts.map(item => [JSON.stringify(item), item])).values()];
   uniqueContacts.forEach(contact => {
   addContactToList(contact.name, contact.phone_number, contact.id); // Pass contact ID
   });
   } else {
   throw new Error('Data is not an array or does not contain a contacts array.');
   }
   } else {
   throw new Error('Data is neither an array nor an object.');
   }
   } catch (error) {
   console.error(error.message);
   console.log('Data Type:', typeof data);
   console.log('Data Value:', data);
   }
   })
   .catch(error => {
   console.error('Error fetching contacts:', error);
   });
  }
  
 
  
 
  // Function to add contact to the list
  function addContactToList(name, phone, contactId) {
   const contactList = document.getElementById('contactList');
  
 
   if (!contactList) {
   console.error('Error: contactList element not found.');
   return;
   }
  
 
   const contactEntry = document.createElement('div');
   contactEntry.className = 'contact-entry';
  
 
   const contactInfo = document.createElement('div');
   contactInfo.className = 'contact-info';
  
 
   const contactName = document.createElement('div');
   contactName.className = 'contact-name';
   contactName.innerHTML = `👤 <strong>${name}</strong>`;
  
 
   const contactNumber = document.createElement('div');
   contactNumber.className = 'contact-number';
   contactNumber.innerHTML = `📞 ${phone}`;
  
 
   contactInfo.appendChild(contactName);
   contactInfo.appendChild(contactNumber);
  
 
   const contactActions = document.createElement('div');
   contactActions.className = 'contact-actions';
  
 
   const contactRemove = document.createElement('button');
   contactRemove.className = 'contact-remove';
   contactRemove.textContent = '✖';
   contactRemove.onclick = function () {
   deleteContact(contactId, contactEntry);
   };
  
 
   contactActions.appendChild(contactRemove);
  
 
   contactEntry.appendChild(contactInfo);
   contactEntry.appendChild(contactActions);
  
 
   contactList.appendChild(contactEntry); // Append to the list
  }
  
 
  function deleteContact(contactId, contactEntry) {
   const token = localStorage.getItem('token');
  
 
   if (!token) {
   console.log('No token found. Cannot delete contact.');
   return;
   }
  
 
   fetch(`/contacts/${contactId}`, {
   method: 'DELETE',
   headers: {
   'Authorization': `Bearer ${token}`
   }
   })
   .then(response => {
   if (response.ok) {
   console.log('Contact deleted successfully.');
   contactEntry.remove(); // Remove the contact entry from the DOM
   } else {
   console.error('Failed to delete contact.');
   }
   })
   .catch(error => {
   console.error('Error deleting contact:', error);
   });
  }
  
 
  // Function to refresh the contact form
  function refreshContactForm() {
   document.getElementById('contactName').value = '';
   document.getElementById('contactNumber').value = '';
  }


  let isListening = false;
  const statusDisplay = document.getElementById('voice-status');
 

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
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
  if (transcript.includes('help') || transcript.includes('stop') || transcript.includes("emergency") || transcript.includes("leave me alone") || transcript.includes("someone is following me") || transcript.includes("police") || transcript.includes("call the police") || transcript.includes("he has a gun") || transcript.includes("danger")) {
  alert("Emergency keyword detected!");
  sendEmergencySMS()
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
  } else {
  statusDisplay.textContent = "Speech Recognition not supported in this browser.";
  document.getElementById('startListeningBtn').disabled = true;
  }
 


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
 
 