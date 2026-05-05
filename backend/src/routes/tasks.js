const express = require('express');
const router = express.Router();

const {
    getTasks,
    createTask,
    deleteTask,
    updateTask,
    toggleTask
} = require('../controllers/tasksController');

router.get('/', getTasks);
router.post('/', createTask);
router.delete("/:id", deleteTask);
router.put("/:id", updateTask);
router.patch("/:id/toggle", toggleTask);

module.exports = router;
