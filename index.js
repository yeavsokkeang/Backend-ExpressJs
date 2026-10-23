require("dotenv").config();

const express = require("express");

const { storage } = require("./storage/storage");
const multer = require("multer");
const upload = multer({ storage });

const app = express();
const PORT = 3000;

const db = require("./models");
const { User } = require("./models/index");
const { Product } = require("./models/index");
const { Order } = require("./models");
const { orderDetail: OrderDetail } = require("./models");

const productRoute = require("./src/routes/product.routes");
const orderDetailRoute = require("./src/routes/orderDetail.routes");
const authRoute = require("./src/routes/auth.routes");
const authMiddleware = require("./src/middleware/auth.midleware");

db.sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Unable to connect the database", error));

app.use(express.json()); //for enable midleware to parse JSON data in request body

//we used upload.single to tell "multer" to upload
// only single image
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);

  res.json({
    data: req.file,
  });
});

// upload multiple images
app.post("/upload-batch", upload.array("images"), (req, res) => {
  res.json({
    data: req.files,
  });
});

// show order data that already have in database
app.get("/orders", async (req, res) => {
  const orders = await Order.findAll();

  return res.json({
    data: orders,
  });
});

//Create orderDetail
app.post("/order-details", async (req, res) => {
  const { orderId, productId, productName, productPrice, qty, amount } =
    req.body;
  const savedOrderDetail = await OrderDetail.create({
    orderId: orderId,
    productId: productId,
    productName: productName,
    productPrice: productPrice,
    qty: qty,
    amount: amount,
  });
  return res.json({
    message: "Order detail created successfully",
    data: savedOrderDetail,
  });
});
// get all order detail
app.get("/order-details", async (req, res) => {
  const orderDetails = await OrderDetail.findAll();
  return res.json({ data: orderDetails });
});
// update order detail
app.put("/order-details/:orderDetailId", async (req, res) => {
  const orderDetailId = req.params.orderDetailId;
  const { orderId, productId, productName, productPrice, qty, amount } =
    req.body;

  const savedOrderDetail = await OrderDetail.update(
    { orderId, productId, productName, productPrice, qty, amount },
    { where: { id: orderDetailId } },
  );
  // find the updated order detail
  const orderDetail = await OrderDetail.findByPk(orderDetailId);

  return res.json({
    message: "Order detail updated successfully",
    data: orderDetail,
  });
});
// delete order detail by id
app.delete("/order-details/:orderDetailId", async (req, res) => {
  const orderDetailId = req.params.orderDetailId;
  // validate order detail id
  const orderDetail = await OrderDetail.findByPk(orderDetailId);
  if (!orderDetail) {
    return res.json({
      message: `Order detail with id ${orderDetailId} not found`,
    });
  }
  await OrderDetail.destroy({ where: { id: orderDetailId } });
  return res.json({
    message: "Order detail deleted successfully",
    data: orderDetailId,
  });
});

//----------------------------------------------
// Create order
app.post("/orders", async (req, res) => {
  const { orderNumber, total, discount, orderDate, location } = req.body;
  const savedOrder = await Order.create({
    orderNumber: orderNumber,
    total: total,
    discount: discount,
    orderDate: orderDate,
    location: location,
  });

  return res.json({
    message: "Order created successfully",
    data: savedOrder,
  });
});
// get all Order
app.get("/orders", async (req, res) => {
  const orders = await Order.findAll();
  return res.json({ data: orders });
});
// update order
app.put("/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  const { orderNumber, total, discount, orderDate, location } = req.body;

  const savedOrder = await Order.update(
    { orderNumber, total, discount, orderDate, location },
    { where: { id: orderId } },
  );
  // find order detial
  const order = await Order.findByPk(orderId);

  return res.json({
    message: "Order updated successfully",
    data: order,
  });
});
// delete order by id
app.delete("/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  // validate order id
  const order = await Order.findByPk(orderId);
  if (!order) {
    return res.json({
      message: `Order with id ${orderId} not found`,
    });
  }
  await Order.destroy({ where: { id: orderId } });
  return res.json({
    message: "Order deleted successfully",
    data: orderId,
  });
});
//-------------------------------------------------

//to get all user
app.get("/users", async (req, res) => {
  const users = await User.findAll();
  return res.json({ data: users });
});

// app.get("/users/:id", (req, res) => {
//   const userId = req.params.id;
//   const search = req.query.s;

//   console.log("Read search", search | "Read userId", userId);

//   if (search === "page_number&page_size") {
//     return res.send(`User id=${userId} found`);
//   }
//   return res.send(`User id=${userId} not found`);
// });

//Get by id
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);

  return res.json({ data: user });
});

// Get user by email
app.get("/users/email/:email", async (req, res) => {
  const email = req.params.email;

  //find by email
  const user = await User.findOne({ where: { email: email } });

  // validate user
  if (!user) {
    return res.json({
      message: `User with email ${email} not found`,
      data: null,
    });
  }

  return res.json({
    message: "User found successfully",
    data: user,
  });
});

//Create user
app.post("/users", async (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;
  const savedUser = await User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    gender: gender,
  });

  return res.json({
    message: "User created successfully!",
    data: savedUser,
  });
});

//update user
app.put("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { firstName, lastName, email, password, gender } = req.body;

  const SavedUser = await User.update(
    { firstName, lastName, email, password, gender },
    { where: { id: userId } },
  );

  // find user details
  const user = await User.findByPk(userId);

  return res.json({
    message: "User updated successfully",
    data: user,
  });
});

//delete user
//Route parameter
//send user id
app.delete("/users/:userId", async (req, res) => {
  const userId = req.params.userId;

  //validate user id
  const user = await User.findByPk(userId);
  if (!user) {
    return res.json({
      message: `User with id ${userId} not found`,
    });
  }
  await User.destroy({ where: { id: userId } });
  return res.json({
    message: "User deleted successfully",
    data: userId,
  });
});

//-----------------------------------------------------------
//Get all products
app.get("/products", async (req, res) => {
  const products = await Product.findAll();

  return res.json({
    message: "Products retrieved successfully",
    data: products,
  });
});

//Get product by id
app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByPk(id);

  return res.json({ data: product });
});

//Create product
app.post("/products", async (req, res) => {
  const { name, description, color, price, qty } = req.body;
  const savedProduct = await Product.create({
    name: name,
    description: description,
    color: color,
    price: price,
    qty: qty,
  });

  return res.json({
    message: "Product created successfully",
    data: savedProduct,
  });
});

//Update product
app.put("/products/:productId", async (req, res) => {
  const productId = req.params.productId;
  const { name, description, color, price, qty } = req.body;

  const savedProduct = await Product.update(
    { name, description, color, price, qty },
    { where: { id: productId } },
  );
  // find product detail
  const product = await Product.findByPk(productId);

  return res.json({
    message: "product update successfully",
    data: productId,
  });
});

// delete by id
//Route parameter
//send user id
app.delete("/products/:productId", async (req, res) => {
  const productId = req.params.productId;

  //validate product id
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.json({
      message: `Product with id ${productId} not found`,
    });
  }
  await Product.destroy({ where: { id: productId } });
  return res.json({
    message: "Product has been deleted",
    data: productId,
  });
});

app.use(express.json());

app.use("/api/order-details", authMiddleware, orderDetailRoute);
// app.use("/api/products", authMiddleware, productRoute);
app.use("/api/products", productRoute);
// app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
