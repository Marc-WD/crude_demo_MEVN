// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/mevncrud", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Schema + Model
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
});
const Item = mongoose.model("Item", ItemSchema);

// Routes (CRUD)

// Read all
app.get("/api/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Create
app.post("/api/items", async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
});

// Update
app.put("/api/items/:id", async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(item);
});

// Delete
app.delete("/api/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
