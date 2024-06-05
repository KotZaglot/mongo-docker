#!/bin/bash


# Создаем данные для MongoDB с использованием mongosh
mongosh "mongodb://mongo:27017/EmployeeDB" <<EOF
db.tasks.insertMany([
    { _id: ObjectId("6655a21de4427b8e76c1cf4e"), name: "Poigrat s pacanami", description: "Dotadotadota", __v: 0 },
    { _id: ObjectId("6655a783678ac92882965ab2"), name: "Otdih", description: "chill", __v: 0 },
    { _id: ObjectId("6655c733c427fc6f3d4c421f"), name: "Rabota", description: "work", __v: 0 }
]);

db.employees.insertMany([
    { _id: ObjectId("6658bf2aa6d8e34b3239ce3a"), fullName: "konfuciy", email: "das@gmail.com", mobile: "213213", salary: 228, __v: 0 },
    { _id: ObjectId("6658c1e7a6d8e34b3239ce9a"), fullName: "Bebr", email: "bebr@gmail.com", mobile: "228", salary: 124, __v: 0 },
    { _id: ObjectId("6658fcdadcb2effdccb4a161"), fullName: "qwe", email: "qwe@gmail.com", mobile: "123", salary: 500, __v: 0 }
]);

db.departments.insertMany([
    { _id: ObjectId("6658c9887537646755fb5587"), name: "dep1", description: "desc", task: ObjectId("6655a21de4427b8e76c1cf4e"), employees: [ObjectId("6658bf2aa6d8e34b3239ce3a"), ObjectId("6658c1e7a6d8e34b3239ce9a")], __v: 0 },
    { _id: ObjectId("6658fb7de40b0b3b00dcb15a"), name: "qwe", description: "qweeqwewqeqw", task: ObjectId("6658c1e7a6d8e34b3239ce9a"), employees: [ObjectId("6658bf2aa6d8e34b3239ce3a"), ObjectId("6658c1e7a6d8e34b3239ce9a")], __v: 0 }
]);

EOF

echo "Data initialized successfully"
