const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');

// Обработчик GET запроса на /employee для отображения формы добавления сотрудника
router.get('/', async (req, res) => {
    try {
        const employeeCount = await Employee.countDocuments(); // Получаем количество сотрудников
        res.render("employee/addOrEdit", {
            viewTitle: "Insert Employee",
            employeeCount: employeeCount // Передаем количество сотрудников в шаблон
        });
    } catch (err) {
        console.error('Error in getting departments:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Обработчик POST запроса для добавления или обновления сотрудника
router.post('/', async (req, res) => {
    try {
        if (!req.body._id) {
            await insertEmployee(req.body);
        } else {
            await updateEmployee(req.body);
        }
        res.redirect('/employee/list');
    } catch (err) {
        console.error('Error during employee insertion/update:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Функция для вставки нового сотрудника
async function insertEmployee(data) {
    const employee = new Employee({
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        salary: data.salary
    });
    await employee.save();
}

// Функция для обновления существующего сотрудника
async function updateEmployee(data) {
    await Employee.findByIdAndUpdate(data._id, {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        salary: data.salary
    }, { new: true });
}

// Обработчик GET запроса на /employee/list для отображения списка сотрудников
router.get('/list', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.render("employee/list", {
            list: employees
        });
    } catch (err) {
        console.error('Error in retrieving employee list:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Обработчик GET запроса на /employee/:id для отображения формы редактирования сотрудника
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        res.render("employee/addOrEdit", {
            viewTitle: "Update Employee",
            employee: employee
        });
    } catch (err) {
        console.error('Error in retrieving employee by ID:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Обработчик GET запроса на /employee/delete/:id для удаления сотрудника
router.get('/delete/:id', async (req, res) => {
    try {
        await Employee.deleteOne({ _id: req.params.id });
        res.redirect('/employee/list');
    } catch (err) {
        console.error('Error in deleting employee:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
