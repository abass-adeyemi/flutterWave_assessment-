const { Router } = require('express');
// const express = require("express")
const router = Router();
const { splitPayment } = require('../controller/payment.contoller');
router.post('/split-payments/compute', splitPayment);

module.exports = router;
