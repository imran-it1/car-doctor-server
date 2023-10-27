const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/*         ALL API      */

// Check API
app.get("/", (req, res) => {
	res.send("Doctor is running");
});

// Listen port
app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
