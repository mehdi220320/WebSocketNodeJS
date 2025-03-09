const express = require('express');
const ChatController = require('../controllers/ChatController');
const MessageController = require('../controllers/MessageController');
const authvalidator = require("../controllers/authvalidation");

const router = express.Router();

router.get('/', ChatController.getAllChats);
router.get('/:id', ChatController.getChatByProjectID);
router.get('/messages/:id', MessageController.getMessagesByChat);
router.post('/message/:id', MessageController.sendMessage);


module.exports = router;
