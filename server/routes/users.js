const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
var sanitize = require("mongo-sanitize");
const config = require("./../config/key");
const google = require("googleapis");

const oAuth2Client = new google.Auth.OAuth2Client();
oAuth2Client.setCredentials({ refresh_token: config.Oauth_Refresh_Token });

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		username: req.user.username,
		firstName: req.user.firstName,
		lastName: req.user.lastName,
		role: req.user.role,
		image: req.user.image,
	});
});

router.post("/register", (req, res) => {
	User.find(
		{
			$or: [{ username: req.body.username }, { email: req.body.email }],
		},
		(err, user) => {
			if (err) {
				return res.status(400).send(err);
			} else if (user.length === 0) {
				const user = new User(sanitize(req.body));

				user.save((err, doc) => {
					if (err) return res.json({ success: false, err });
					return res.status(200).json({
						success: true,
					});
				});
			} else {
				return res.json({
					success: false,
					err: "Email or username already used !",
				});
			}
		}
	);
});

router.post("/update", auth, (req, res) => {
	let imgURL =
		req.body.image === "" ? req.user.image : sanitize(req.body.image);

	User.find(
		{
			_id: { $ne: req.user._id },
			$or: [{ username: req.body.username }, { email: req.body.email }],
		},
		(err, user) => {
			if (err) {
				return res.status(400).send(err);
			} else if (user.length === 1) {
				return res.json({
					success: false,
					err: "Email or username already used !",
				});
			} else {
				User.findOneAndUpdate(
					{ _id: req.user._id },
					{
						$set: {
							email: sanitize(req.body.email),
							username: sanitize(req.body.username),
							firstName: sanitize(req.body.firstName),
							lastName: sanitize(req.body.lastName),
							image: imgURL,
						},
					},
					(err, doc) => {
						if (err) return res.json({ success: false, err });
						return res.status(200).send({
							success: true,
							doc,
						});
					}
				);
			}
		}
	);
});

router.post("/updatePassword", auth, async (req, res) => {
	let errors = {
		password: false,
		password_confirm: false,
	};
	try {
		const user = await User.findOne({ _id: req.user._id });
		if (user) {
			let password = sanitize(req.body.password);
			let password_confirm = sanitize(req.body.password_confirm);
			if (!errors.password && !errors.password_confirm) {
				user.password = password;
				user.save();
				return res.status(200).json({});
			} else throw new Error("Error password");
		} else throw new Error("Token not find");
	} catch (err) {
		console.log(err);
		if (errors.password || errors.password_confirm)
			return res.status(400).json({ errors: errors });
		return res.status(400).json({});
	}
});

router.post("/login", (req, res) => {
	User.findOne({ username: sanitize(req.body.username) }, (err, user) => {
		if (!user)
			return res.json({
				loginSuccess: false,
				message: "Auth failed, username not found",
			});

		user.comparePassword(sanitize(req.body.password), (err, isMatch) => {
			if (!isMatch)
				return res.json({ loginSuccess: false, message: "Wrong password" });

			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err);
				res.cookie("w_authExp", user.tokenExp);
				res
					.cookie("w_auth", user.token, {
						maxAge: 2 * 60 * 60 * 1000,
						secure: true,
						sameSite: "none",
						httpOnly: false,
					})
					.status(200)
					.json({
						loginSuccess: true,
						userId: user._id,
					});
			});
		});
	});
});


router.get("/logout", auth, (req, res) => {
	User.findOneAndUpdate(
		{ _id: req.user._id },
		{ token: "", tokenExp: "" },
		(err, doc) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).send({
				success: true,
			});
		}
	);
});

//Get All users
router.get("/getUsers", auth, async (req, res) => {
	await User.find().exec((err, users) => {
		if (err) return res.status(400).send(err);
		res.status(200).json({ success: true, users });
	});
});

//Get a specific user
router.get("/:userId", auth, async (req, res) => {
	User.find({ _id: req.user._id }).exec((err, users) => {
		if (err) return res.status(400).send(err);
		return res.status(200).json({ success: true, users });
	});
});

module.exports = router;
