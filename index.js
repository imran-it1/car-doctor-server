const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
		await client.connect();

		// Service Collection
		const serviceCollection = client.db("carDoctor").collection("services");
		const orderCollection = client.db("carDoctor").collection("orders");

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
					},
				};

				const result = await serviceCollection.findOne(query, options);
				res.send(result);
			} catch (error) {
				console.log(error);
			}
		});

		// Order related API

		app.post("/orders", async (req, res) => {
			const orderDataBody = req.body;
			const result = await orderCollection.insertOne(orderDataBody);
			res.send(result);
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
