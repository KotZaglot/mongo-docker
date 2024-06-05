const express = require('express');
const router = express.Router();
const Department = require('../models/department.model');
const Task = require('../models/task.model');
const Employee = require('../models/employee.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Обработчик GET запроса на /department для отображения формы добавления отдела
router.get('/', async (req, res) => {
    try {
        // Получаем все задачи и сотрудников для отображения в выпадающем списке
        const tasks = await Task.find();
        const employees = await Employee.find();
        res.render("department/addOrEdit", {
            viewTitle: "Insert Department",
            tasks: tasks,
            employees: employees
        });
    } catch (err) {
        console.error('Error in getting tasks or employees:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Обработчик POST запроса для добавления или обновления отдела
router.post('/', async (req, res) => {
    try {
        if (!req.body._id) {
            await insertDepartment(req.body);
        } else {
            await updateDepartment(req.body);
        }
        res.redirect('/department/list'); // Перенаправляем на страницу списка отделов после добавления или обновления
    } catch (err) {
        console.error('Error during department insertion/update:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Функция для вставки нового отдела
async function insertDepartment(data) {
    // Разбиваем строку с ID сотрудников на массив сотрудников
    const employeeIds = data.employees.split(',').map(employeeId => employeeId.trim());

    const department = new Department({
        name: data.name,
        description: data.description,
        task: data.task,
        employees: employeeIds
    });
    await department.save();
}

// Функция для обновления отдела
async function updateDepartment(data) {
    try {
        // Разбиваем строку с ID сотрудников на массив
        const employeeIds = data.employees.split(',').map(employeeId => new ObjectId(employeeId.trim()));

        const updatedDepartment = await Department.findByIdAndUpdate(data._id, {
            name: data.name,
            description: data.description,
            task: data.task,
            employees: employeeIds // Присваиваем массив ObjectId полю employees
        }, { new: true });

        return updatedDepartment;
    } catch (error) {
        console.error("Error during department update:", error);
        throw error; // Пробросить ошибку для обработки в вызывающем коде
    }
}

module.exports = { updateDepartment };


// Обработчик GET запроса на /department/list для отображения списка отделов
router.get('/list', async (req, res) => {
    try {
        const departments = await Department.find().populate('task').populate('employees');
        res.render("department/list", {
            list: departments
        });
    } catch (err) {
        console.error('Error in retrieving department list:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Обработчик GET запроса на /department/:id для отображения формы редактирования отдела
router.get('/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        const tasks = await Task.find();
        const employees = await Employee.find();
        res.render("department/addOrEdit", {
            viewTitle: "Update Department",
            department: department,
            tasks: tasks,
            employees: employees
        });
    } catch (err) {
        console.error('Error in retrieving department by ID:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Обработчик GET запроса на /department/delete/:id для удаления отдела
router.get('/delete/:id', async (req, res) => {
    try {
        await Department.deleteOne({ _id: req.params.id });
        res.redirect('/department/list'); // Перенаправляем на страницу списка отделов после удаления
    } catch (err) {
        console.error('Error in deleting department:', err);
        res.status(500).send('Internal Server Error');
    }
});



// Обработчик GET запроса на /department/average-salary/:id для расчета средней зарплаты
router.get('/average-salary/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate('employees');
        if (!department || !department.employees.length) {
            return res.json({ averageSalary: 0 });
        }

        const totalSalary = department.employees.reduce((sum, employee) => sum + employee.salary, 0);
        const averageSalary = totalSalary / department.employees.length;

        res.json({ averageSalary: averageSalary.toFixed(2) });
    } catch (err) {
        console.error('Error in calculating average salary:', err);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;
