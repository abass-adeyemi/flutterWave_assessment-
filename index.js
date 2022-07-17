require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const displayRoutes = require('express-routemap');
const port = process.env.PORT || 8100;
const splitPayment = require('./routes/Payment.Routes');
// bodyParser
app.use(bodyParser.json());

// app.listen(port,console.log("adeyemi"))
app.use(splitPayment);
// i'm listening on port ....
app.listen(port, () => {
	console.log(`i am listening on ${port}`);
	displayRoutes(app);
});


app.get('/', (req, res) => {
	res.send('welcome');
});
// Error 404
app.use((req, res, next) => {
	res.status(404).send({
		status: 'error',
		message: 'it Seems you got lost. so sorry',
	});
});
