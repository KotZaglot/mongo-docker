const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const employeeController = require('./controllers/employeeController');
const departmentController = require('./controllers/departmentController');
const taskController = require('./controllers/taskController');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, '/views/login'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

// Маршрут для отображения страницы входа
app.get('/login', (req, res) => {
    res.render('login');
});

app.use('/employee', employeeController);
app.use('/department', departmentController);
app.use('/task', taskController);

// Маршрут для обработки данных формы входа
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Подключение к MongoDB с аутентификацией
    // const mongoConnectionString = `mongodb://${username}:${password}@mongo:27017/EmployeeDB`;
    const mongoConnectionString = `mongodb://mongo:27017/EmployeeDB`;
    mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('MongoDB Connection Succeeded.');
        app.set('views', path.join(__dirname, '/views/'));
        res.redirect('/department'); // Перенаправляем на страницу после успешного подключения
    }).catch((err) => {
        console.error('Error in DB connection:', err);
        res.status(500).send('Internal Server Error');
    });
});

app.listen(port, () => {
    console.log(`Express server started at port : ${port}`);
});
