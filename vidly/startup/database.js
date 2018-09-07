const mongoose = require("mongoose");

function connectToDatabase() {
  mongoose
    .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully..."))
    .catch(err => console.log("MongDB connection error: ", err.message));
}

connectToDatabase();
