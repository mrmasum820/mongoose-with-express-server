const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create product schema
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
})

// create product model
const Product = mongoose.model("products", productsSchema);

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

//POST: / products -> Create a product
app.post('/products', async (req, res) => {
    try {
        // //get data from request body
        // const title = req.body.title;
        // const price = req.body.price;
        // const description = req.body.description;
        // const newProduct = new Product({
        //     title: title,
        //     price: price,
        //     description: description,
        // })

        const newProduct = new Product({
            title: req.body.title,
            price: req.body.price,
            rating: req.body.rating,
            description: req.body.description,
        })
        const productData = await newProduct.save();

        // const productData = await Product.insertMany([
        //     {
        //         title: 'iphone 13',
        //         price: 1200,
        //         description: 'This is the before version of iphone 14'
        //     },
        //     {
        //         title: 'iphone 12',
        //         price: 1100,
        //         description: 'This is the before version of iphone 13'
        //     }
        // ])

        res.status(201).send(productData);
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }
})

//GET: /products -> Return all the products
app.get('/products', async (req, res) => {
    try {
        const price = req.query.price;
        const rating = req.query.rating;
        let products;
        if (price && rating) {
            products = await Product.find({
                $or: [{ price: { $gt: price } }, { rating: { $gt: rating } }],
            });
        } else {
            products = await Product.find();
        }
        if (products) {
            res.status(200).send({
                success: true,
                message: 'return all products',
                data: products
            });
        } else {
            res.status(404).send({
                success: false,
                message: "products not found",
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

//GET: /products/:id -> Return the specific products
app.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id });
        if (product) {
            res.status(200).send({
                success: true,
                message: 'return single product',
                data: product
            });
        } else {
            res.status(404).send({
                success: false,
                message: "product not found",
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

//PUT: / products/:id -> Update a product based on id
app.put('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate({ _id: id }, {
            $set: {
                title: req.body.title,
                price: req.body.price,
                rating: req.body.rating,
                description: req.body.description,
            }
        },
            { new: true }
        );
        if (updatedProduct) {
            res.status(200).send({
                success: true,
                message: 'updated single product',
                data: updatedProduct,
            });
        } else {
            res.status(404).send({
                success: false,
                message: "product not updated",
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


//DELETE: / products/:id -> Delete a product based on id
app.delete('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.deleteOne({ _id: id })
        if (product) {
            res.status(200).send({
                success: true,
                message: 'deleted single product',
                data: product,
            });
        } else {
            res.status(404).send({
                success: false,
                message: "product not deleted",
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})



app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    await connectDB();
})