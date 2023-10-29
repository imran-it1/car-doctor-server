const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;

// App
const app = express();

// Middleware
app.use(
	cors({
		origin: ["http://localhost:5173"],
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

// Created MiddleWare
const logger = async (req, res, next) => {
	console.log("Called", req.protocol, req.host, req.originalUrl);
	next();
};

// Vrify token middleware

const verifyToken = async (req, res, next) => {
	const token = req.cookies?.token;
	// console.log("Token in middlewarw", token);
	if (!token) {
		return res.status(401).send({ message: "unAuthorized" });
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			console.log(err);
			return res.status(401).send({ message: "unAuthorize" });
		}
		console.log("Info from decoded", decoded);
		req.user = decoded;
		next();
	});
};

/*         MongoDB + ALL API      */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7o1h45b.mongodb.net/?retryWrites=true&w=majority`;

// Client
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect
		// await client.connect();

		// Service Collection
		const serviceCollection = client.db("carDoctor").collection("services");
		const orderCollection = client.db("carDoctor").collection("orders");

		// Auth related API
		app.post("/jwt", logger, async (req, res) => {
			try {
				const user = req.body;
				const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
					expiresIn: "1h",
				});
				res
					.cookie("token", token, {
						httpOnly: true,
						secure: false,
					})
					.send({ message: "success" });
			} catch (error) {
				console.error(error);
			}
		});

		// Get all service data
		app.get("/services", async (req, res) => {
			try {
				const result = await serviceCollection.find().toArray();
				res.send(result);
			} catch (error) {
				console.log(error);
			}
		});

		// Get signle service data
		app.get("/services/:id", async (req, res) => {
			try {
				const id = req.params.id;
				const query = { _id: new ObjectId(id) };

				const options = {
					projection: {
						service_id: 1,
						price: 1,
						title: 1,
						description: 1,
						img: 1,
					},
				};

				const result = await serviceCollection.findOne(query, options);
				res.send(result);
			} catch (error) {
				console.log(error);
			}
		});

		// Order related API

		// Get specific order by query parameters
		app.get("/orders", verifyToken, async (req, res) => {
			try {
				// console.log("user from valid token", req.user);
				// console.log("Request user", req.query.email);

				// Cross check decoded user email and qurey email that request data
				if (req.query.email !== req.user.email) {
					return res.status(403).send({ message: "Forbiden access" });
				}
				let query = {};
				if (req.query?.email) {
					query = { customerEmail: req.query?.email };
				}
				const result = await orderCollection.find(query).toArray();
				res.send(result);
			} catch (error) {
				console.error(error);
			}
		});
		// Post customer order

		app.post("/orders", async (req, res) => {
			try {
				const orderDataBody = req.body;
				const result = await orderCollection.insertOne(orderDataBody);
				res.send(result);
			} catch (error) {
				console.error(error);
			}
		});

		//Update
		app.patch("/orders/:id", async (req, res) => {
			const id = req.params.id;
			// const updatedOrder = req.body;
			console.log("Updated status", updatedOrder);
			const filter = { _id: new ObjectId(id) };
			const updateDoc = {
				$set: {
					status: updatedOrder.status,
				},
			};
			const result = await orderCollection.updateOne(filter, updateDoc);
			res.send(result);
		});

		// Delete order
		app.delete("/orders/:id", async (req, res) => {
			try {
				const id = req.params.id;
				const query = { _id: new ObjectId(id) };
				const result = await orderCollection.deleteOne(query);
				res.send(result);
			} catch (error) {
				console.error(error);
			}
		});

		// Send ping
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

// Check API
app.get("/", (req, res) => {
	res.send("Doctor is running");
});

// Listen port
app.listen(port, () => {
	console.log(`Car doctor server is runnig on port ${port}`);
});
