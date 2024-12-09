document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const userId = localStorage.getItem('userId');

    loadTasks();

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;

        createTask(title, description, dueDate);
    });

    function loadTasks() {
        fetch(`/api/tasks.php?user_id=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.records) {
                    taskList.innerHTML = '';
                    data.records.forEach(task => {
                        const taskElement = createTaskElement(task);
                        taskList.appendChild(taskElement);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function createTask(title, description, dueDate) {
        const task = {
            user_id: userId,
            title: title,
            description: description,
            due_date: dueDate
        };

        fetch('/api/tasks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            loadTasks();
            taskForm.reset();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function updateTask(taskId, status) {
        const task = {
            id: taskId,
            status: status
        };

        fetch('/api/tasks.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            loadTasks();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function deleteTask(taskId) {
        fetch('/api/tasks.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: taskId})
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            loadTasks();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Due: ${task.due_date}</p>
            <p>Status: ${task.status}</p>
            <button class="complete-btn" data-id="${task.id}">Complete</button>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;

        taskElement.querySelector('.complete-btn').addEventListener('click', function() {
            updateTask(this.dataset.id, 'completed');
        });

        taskElement.querySelector('.delete-btn').addEventListener('click', function() {
            deleteTask(this.dataset.id);
        });

        return taskElement;
    }
});