const express = require("express");
const app = express();

const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express App!..." });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
