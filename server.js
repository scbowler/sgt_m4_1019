const express = require('express');
const db = require('./db');
const path = require('path');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/api/students', async (req, res) => {

    //  [ [Row Data], [Field Data] ]
    const [ result ] = await db.query('SELECT * FROM grades');

    res.send({
        students: result
    });
});

app.get('/api/students/:id', async (req, res) => {
    const { id } = req.params;

    // Write a JOIN query to get a grade record and related assignments
    // Send data back in response
    // If a no data was found record property should be null
    const [[ record ]] = await db.execute(`
        SELECT g.course AS courseName, g.name AS studentName, g.grade AS courseGrade, a.name AS assignmentName, a.grade AS assignmentGrade 
        FROM grades AS g 
        JOIN assignments AS a
        ON g.id=a.grade_id
        WHERE g.id=?`
        , [id]);

    res.send({
        message: `Get a grade record and assignments for grade ID: ${id}`,
        record: record
    });
});

app.post('/api/students', async (req, res) => {
    const { name, course, grade } = req.body;
    const errors = [];

    if(!name) {
        errors.push('No student name received');
    }
    if(!course) {
        errors.push('No student course received');
    }
    if( !grade && grade !== 0 ) {
        errors.push('No student course grade received');
    } else if(isNaN(grade)) {
        errors.push('Student course grade must be a number');
    } else if(grade < 0 || grade > 100) {
        errors.push('Student grade must be from 0 up to 100');
    }

    if(errors.length){
        res.status(422).send({
            errors: errors
        });
        return;
    }

    const [ result ] = await db.execute(`
        INSERT INTO grades 
        (name, course, grade) 
        VALUES (?, ?, ?)
    `, [name, course, grade]);

    res.send({
        message: `Successfully added grade record for ${name}`,
        student: {
            id: result.insertId,
            name: name,
            course: course,
            grade: grade
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening @ localhost:3000');
});
