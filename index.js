const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const Nexmo = require("nexmo");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

nunjucks.configure("views", { express: app });

const nexmo = new Nexmo({
	apiKey: "85749b02",
	apiSecret: "1wTsbOrccUeMIKMa",
});

app.get("/", (req, res) => {
	res.render("index.html", { message: "hello bangladesh" });
});

app.post("/verify", (req, res) => {
	const { number } = req.body;

	nexmo.verify.request(
		{
			number: number,
			brand: "My App",
		},
		(err, result) => {
			if (err) {
				res.render("index.html", { message: err.message });
			} else {
				console.log(result);
				res.render("check.html", { requestId: result.request_id });
			}
		}
	);
});

app.post("/check", (req, res) => {
	const { code, request_id } = req.body;
	console.log(code, request_id);
	nexmo.verify.check(
		{ request_id: req.body.request_id, code: req.body.code },
		(err, result) => {
			console.log(err, result);
			if (err) {
				res.render("index.html", { message: err.message });
			} else {
				res.render("success.html", { message: result.status });
			}
		}
	);
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
