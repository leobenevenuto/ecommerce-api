const express = require("express")
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const cors = require("cors");

dotenv.config();


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DBConnection successfull!")
}).catch(err => {
    console.log(err)
})

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)

app.listen(process.env.PORT, () => {
    console.log("Backend is running on port " + process.env.PORT)
})