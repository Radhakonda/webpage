


document.getElementById('saveBtn').addEventListener('click', async function () {
  const serviceType = document.getElementById('serviceType').value;
  const serviceName = document.getElementById('serviceName').value.trim();
  const tagline = document.getElementById('tagline').value.trim();
  const description = document.getElementById('description').value.trim();
  const duration = document.getElementById('duration').value;
  const bufferTime = document.getElementById('bufferTime').value;

  if (!serviceName) {
    alert("Service Name is required.");
    return;
  }

  const formData = {
    serviceType,
    serviceName,
    tagline,
    description,
    duration,
    bufferTime
  };

  try {
    const res = await fetch("http://localhost:4000/consultation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const result = await res.json();
    alert(result.message || "Saved successfully!");
  } catch (err) {
    console.error("Save failed:", err);
    alert("Error saving data. Try again.");
  }
});

