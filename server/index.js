const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const config = require("./config/key");

const mongoose = require("mongoose");
const connect = mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log("MongoDB Connected..."))
	.catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", require("./routes/users"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/like", require("./routes/like"));
app.use("/api/favorite", require("./routes/favorite"));
app.use("/api/", require("./routes/recommendation"));


app.use("/uploads", express.static("uploads"));


app.use(express.static("client/build"));

app.get("*", (req, res) => {
	res.cookie("same-site-cookie", "foo", { sameSite: "lax" });
	res.cookie("cross-site-cookie", "bar", { sameSite: "none", secure: true });
	res.setHeader("set-cookie", [
		"same-site-cookie=bar; SameSite=Lax",
		"cross-site-cookie=foo; SameSite=None; Secure",
	]);
	res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
});

app.get("/movie/:movieId", function (req, res) {
	res.cookie("cross-site-cookie", "bar", { sameSite: "none", secure: true });
});

// Error messages
app.get("*", function (req, res) {
	res.status(404).send("You are in the wrong place ;)");
});

const port = 3000;

app.listen(port, () => {
	console.log(`Server Running at ${port}`);
});
