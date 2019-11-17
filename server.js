const express = require('express');
const db = require('./db');

const app = express();

app.get('/api/students', async (req, res) => {

    //  [ [Row Data], [Field Data] ]
    const [ result ] = await db.query('SELECT * FROM grades');

    res.send({
        students: result
    });
});

app.listen(3000, () => {
    console.log('Server listening @ localhost:3000');
});
