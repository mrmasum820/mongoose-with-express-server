const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

//create product schema
const productsSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    createAt: {
        type: Date,
        default: Date.now,
    },
})

// create product model
const product = mongoose.model("products", productsSchema);

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/testDB');
        console.log('database is connected');
    }
    catch (error) {
        console.log('database is not connected');
        console.log(error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('welcome to hompage');
})

app.listen(PORT, async () => {
    console.log(`Server is running at http://locahost:${PORT}`);
    await connectDB();
})