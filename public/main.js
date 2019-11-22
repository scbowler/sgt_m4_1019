$(document).ready(initApp);

function initApp(){
    console.log('App Initialized');

    getStudents();
}

function getStudents(){
    const config = {
        url: '/api/students',
        success: resp => {
            console.log('Resp:', resp);
            addStudentsToDom(resp.students);
        }
    }
    
    $.ajax(config);
}

function addStudentsToDom(students){
    const studentElements = [];
    const tbody = $('#student-data');

    tbody.text('');

    students.forEach(student => {
        const tr = $('<tr>');
        const name = $('<td>', { text: student.name });
        const course = $('<td>', { text: student.course });
        const grade = $('<td>', { text: student.grade });

        tr.append(name, course, grade);

        studentElements.push(tr);
    });

    tbody.append(studentElements);
}

function addStudent(name, course, grade){
    $.ajax({
        method: 'POST',
        url: '/api/students',
        data: {
            name: name,
            course: course,
            grade: grade
        },
        success: (resp) => {
            console.log('Student Added:', resp);
            getStudents();
        }
    });
}
