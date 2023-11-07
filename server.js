const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const {
    errorResponseHandler,
    invalidPathHandler,
} = require("./middleware/errorHandler");
const path = require("path");
const cors = require("cors");

// Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const corsOpts = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(cors(corsOpts));

app.get("/", (req, res) => {
    res.send("Server is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(invalidPathHandler);
app.use(errorResponseHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server is up and listening on port " + PORT);
});
