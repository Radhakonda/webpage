const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config(); // Load environment variables

const app = express();
const upload = multer();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "html")));

// MySQL Connection (check before trying to use it)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// Routes
app.post("/register", upload.none(), (req, res) => {
  const { yourName, email, yourPhone, message } = req.body;

  const sql = "INSERT INTO projects (`Your Name`, `Email`, `Your Phone`, `Message`) VALUES (?, ?, ?, ?)";
  db.query(sql, [yourName, email, yourPhone, message], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ message: "Server error" });
    }
     console.log("elements inserted")
    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Hello ${yourName}, thanks for contacting LANDIO!`,
      html: `
        <h2>Hi ${yourName},</h2>
        <p>Thanks for reaching out to LANDIO. We'll get back to you soon.</p>
        <p><strong>Phone:</strong> ${yourPhone}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Regards, LANDIO Team</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email Error:", error);
        return res.status(500).json({ message: "Saved to DB, but email failed." });
      }
      console.log("📧 Email sent:", info.response);
      res.json({ message: "Thank you!" });
    });
  });
});

app.post("/consultation", upload.none(), (req, res) => {
  const { serviceType, serviceName, tagline, description, duration, bufferTime } = req.body;

  const sql = `INSERT INTO consultations 
    (service_type, service_name, tagline, description, duration, buffer_time) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [serviceType, serviceName, tagline, description, duration, bufferTime], (err, result) => {
    if (err) {
      console.error("❌ DB Insert Error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json({ message: "Consultation service saved!" });
  });
});

// Fallback to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html/index.html"));
});

// Use dynamic port (important for Render)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
