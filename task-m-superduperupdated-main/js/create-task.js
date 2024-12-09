document.addEventListener('DOMContentLoaded', function() {
    const createTaskForm = document.getElementById('createTaskForm');
    const userId = localStorage.getItem('userId');

    createTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;

        const taskData = {
            user_id: userId,
            title: title,
            description: description,
            due_date: dueDate,
            priority: priority,
            status: 'pending'
        };

        try {
            const response = await fetch('/api/tasks.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Task created successfully!');
                createTaskForm.reset();
            } else {
                alert(data.message || 'Failed to create task. Please try again.');
            }
        } catch (error) {
            console.error('Task creation error:', error);
            alert('Failed to create task. Please check your connection and try again.');
        }
    });

    // Set min date for due date input to today
    const taskDueDateInput = document.getElementById('taskDueDate');
    taskDueDateInput.min = new Date().toISOString().split('T')[0];
});