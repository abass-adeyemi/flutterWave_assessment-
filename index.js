require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const displayRoutes = require('express-routemap');
const port = process.env.PORT || 8100;
const splitPayment = require('./routes/Payment.Routes');
app.use(bodyParser.json());
app.use(splitPayment);

app.get('/', (req, res) => {
	res.send('welcome');
});

app.listen(port, () => {
	console.log(`i am listening on ${port}`);
	displayRoutes(app);
});

// Error 404
app.use((req, res, next) => {
	res.status(404).send({
		status: 'error',
		message: 'it Seems you got lost. so sorry',
	});
});
