// Sidebar Toggle
function openNav() {
  document.getElementById("sideNav").style.width = "250px";
}

function closeNav() {
  document.getElementById("sideNav").style.width = "0";
}

// Navigation
function navigateToExplore() {
  window.location.href = 'explore.html';
}

// Toggle Details Visibility
function toggleDetails(id) {
  const element = document.getElementById(id);
  element.style.display = element.style.display === "block" ? "none" : "block";
}

// Chat Functionality
const chatBtn = document.getElementById('chatBtn');
const chatPopup = document.getElementById('chatPopup');
const closeChat = document.getElementById('closeChat');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

chatBtn.addEventListener('click', () => {
  chatPopup.style.display = 'flex';
  chatBtn.style.display = 'none';
});

closeChat.addEventListener('click', () => {
  chatPopup.style.display = 'none';
  chatBtn.style.display = 'block';
});

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    appendUserMessage(message);
    chatInput.value = '';
    setTimeout(showForm, 1000);
  }
}

function appendUserMessage(msg) {
  const div = document.createElement('div');
  div.className = 'user-message';
  div.innerText = msg;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showForm() {
  const agentMsg = document.createElement('div');
  agentMsg.className = 'agent-message';
  agentMsg.innerText = "Hey there, please leave your details so we can contact you even if you are no longer on the site.";

  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  formContainer.innerHTML = `
    <input type="text" id="nameInput" placeholder="Name" required>
    <input type="email" id="emailInput" placeholder="Email" required>
    <input type="tel" id="phoneInput" placeholder="Phone">
    <textarea id="msgInput" placeholder="Message" required></textarea>
    <button id="formSubmitBtn">Submit</button>
    <p id="responseMessage" style="color: green;"></p>
  `;

  chatBody.appendChild(agentMsg);
  chatBody.appendChild(formContainer);
  chatBody.scrollTop = chatBody.scrollHeight;

  document.getElementById('formSubmitBtn').addEventListener('click', handleFormSubmit);
}

async function handleFormSubmit() {
  const yourName = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const yourPhone = document.getElementById('phoneInput').value.trim();
  const message = document.getElementById('msgInput').value.trim();
  const responseMessage = document.getElementById('responseMessage');
  const btn = document.getElementById('formSubmitBtn');

  if (!yourName || !email || !message) {
    alert("Please fill in Name, Email, and Message!");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Sending...";

  const formData = new FormData();
  formData.append("yourName", yourName);
  formData.append("email", email);
  formData.append("yourPhone", yourPhone);
  formData.append("message", message);

  try {
    const res = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: formData
    });

    let result;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      result = await res.json();
    } else {
      const text = await res.text();
      throw new Error("Expected JSON but received: " + text);
    }

    responseMessage.textContent = result.message || "Submitted successfully!";

    const thankYouMsg = document.createElement('div');
    thankYouMsg.className = 'agent-message';
    thankYouMsg.innerText = "Ok, thank you for the information. We will get back to you.";
    chatBody.appendChild(thankYouMsg);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Submit";
    }, 3000);

    setTimeout(() => {
      chatPopup.style.display = 'none';
      chatBtn.style.display = 'block';
    }, 5000);

  } catch (err) {
    console.error("Submission failed:", err);
    responseMessage.style.color = "red";
    responseMessage.textContent = "Submission failed. Please try again.";
    btn.disabled = false;
    btn.textContent = "Submit";
  }
}

// Main contact form submission
document.getElementById("registrationForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  const formData = new FormData(this);

  try {
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: formData
    });

    let result;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      throw new Error("Expected JSON but received: " + text);
    }

    document.getElementById("responseMessage").textContent = result.message || "Submitted successfully!";
    this.reset();
  } catch (error) {
    console.error("Error submitting form:", error);
    document.getElementById("responseMessage").textContent = "Submission failed. Please try again.";
  }
});
