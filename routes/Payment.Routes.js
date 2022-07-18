const { Router } = require('express');
// const express = require("express")
const responseTime= require("../response-time")
const router = Router();
const { splitPayment } = require('../controller/payment.contoller');
router.post('/split-payments/compute',responseTime, splitPayment);

module.exports = router;
