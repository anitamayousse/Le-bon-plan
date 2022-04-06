const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const handlebars = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
// Models
const User = require("./models/User");
const secret = "TZbMladabXvKgceHxrS9tHMwx8hE58";
// Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Connexion à MongoDB
mongoose
	.connect(
		"mongodb+srv://Anita:gtXSsxboyg5LMeQQ@cluster0.oppld.mongodb.net/LPB?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
		}
	)
	.then(() => {
		console.log("Connected to MongoDB");
	});


// Middlewares
app.use(cookieParser());
// pour le css et le js dans le html
app.use(express.static(path.join(__dirname, "/public")));
// body du form de login
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
	// renvoie un fichier html
	res.render("homepage", {
		isLoggedIn: false,
	});
});

app.get("/login", (req, res) => {
	res.render("login");
});
app.get("/signup", (req, res) => {
	res.render("signup");
});

app.post("/signup", async (req, res) => {
    // créer un utilisateur
	if (req.body.confirmPassword != req.body.password ){
        return res.status(400).json({
        message: "Confirmation password does not match",
    });
    } 
	// 1 - Hasher le mot de passe
	const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const hashedConfirmPassword = await bcrypt.hash(req.body.confirmPassword, 12);

	// 2 - Créer un utilisateur
	try {
		await User.create({
			username: req.body.email,
			email: req.body.email,
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
		});
	} catch (err) {
		return res.status(400).json({
			message: "This account already exists",
		});
	}
	console.log(req.body);

	// créer token
	res.redirect("/profile");
});
app.get("/profile", (req, res) => {
    
	res.render("profile");
});
app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	console.log(req.body);

	// 1 - Vérifier si le compte associé à l'email existe
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).json({
			message: "Invalid email or password",
		});
	}

	// 2 - Comparer le mot de passe au hash qui est dans la DB
	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		return res.status(400).json({
			message: "Invalid email or password",
		});
	}
	// 3 - Générer un token
	const token = jwt.sign({ id: user._id }, secret);

	// 4 - On met le token dans un cookie
	res.cookie("jwt", token, { httpOnly: true, secure: false });

	// 5 - Aller sur le page des products

	res.redirect("/");
});

app.get("/contact", (req, res) => {
	res.render("contact");
});

app.post("/contact", (req, res) => {
	// nodemailer
	// enregistrer dans la db
});

app.get("/products", async (req, res) => {

	 const userData = await User.findById(userId);
		// 1 - Vérifier le token qui est dans le cookie
		let data;
		let products;
		try {
			data = jwt.verify(req.cookies.jwt, secret);
			products= await Product.find();
		} catch (err) {
			returnres.redirect("/");
		}
	res.render("profile", {
		username: userData.name,
		email: userData.email,
	});
});

app.get("/users", (req, res) => {
	res.json({
		name: "Jean",
	});
});

// Start server
app.listen(8000, () => console.log("Listening"));