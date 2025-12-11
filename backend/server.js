// server.js
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables from the backend folder's config.env reliably
dotenv.config({ path: path.join(__dirname, "config.env") });

const app = require("./App");

const db = process.env.DB;
if (!db) {
  console.error(
    "Missing DB connection string: set process.env.DB in config.env"
  );
  process.exit(1);
}

// connect the application to database using MongoDB
mongoose
  .connect(db)
  .then(() => {
    console.log("DB connection Successful");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
