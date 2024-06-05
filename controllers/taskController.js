const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');

// Добавляем обработчик для GET запроса на /task
router.get('/', (req, res) => {
    res.render("task/addOrEdit", {
        viewTitle: "Insert Task"
    });
});

// Добавление новой задачи
router.post('/', async (req, res) => {
    try {
        if (req.body._id == '') {
            await insertRecord(req.body);
        } else {
            await updateRecord(req.body);
        }
        res.redirect('/task/list');
    } catch (err) {
        console.error('Error during record insertion/update:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Функция для вставки новой задачи
async function insertRecord(data) {
    const task = new Task({
        name: data.name,
        description: data.description
    });
    await task.save();
}

// Функция для обновления задачи
async function updateRecord(data) {
    await Task.findByIdAndUpdate(data._id, data, { new: true });
}

// Отображение списка задач
router.get('/list', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.render("task/list", {
            list: tasks
        });
    } catch (err) {
        console.error('Error in retrieving task list:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Новый маршрут для поиска задач по имени
router.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.name;
        const tasks = await Task.find({ name: new RegExp(searchQuery, 'i') }); // Регулярное выражение для поиска без учета регистра
        res.render("task/list", {
            list: tasks
        });
    } catch (err) {
        console.error('Error in retrieving task list:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Получение задачи по ID для обновления
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.render("task/addOrEdit", {
            viewTitle: "Update Task",
            task: task
        });
    } catch (err) {
        console.error('Error in retrieving task by ID:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Удаление задачи
router.get('/delete/:id', async (req, res) => {
    try {
        await Task.deleteOne({ _id: req.params.id });
        res.redirect('/task/list');
    } catch (err) {
        console.error('Error in deleting task:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
