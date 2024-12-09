class StatisticsHandler {
    constructor() {
        this.chartColors = [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
        ];
        this.userId = localStorage.getItem('userId');
    }

    async fetchTaskStatistics() {
        try {
            const response = await fetch(`./api/get_task_status.php?user_id=${this.userId}&status_type=weekly_summary`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching task statistics:', error);
            return null;
        }
    }

    async fetchTaskTrends() {
        try {
            const response = await fetch(`./api/get_task_trends.php?user_id=${this.userId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching task trends:', error);
            return null;
        }
    }

    createTaskStatusChart(containerId) {
        this.fetchTaskStatistics().then(data => {
            if (!data) return;

            const ctx = document.getElementById(containerId).getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Overdue', 'Upcoming'],
                    datasets: [{
                        data: [data.completed_tasks, data.overdue_tasks, data.upcoming_tasks],
                        backgroundColor: this.chartColors,
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Task Status Distribution'
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            });
        });
    }

    createTaskTrendsChart(containerId) {
        this.fetchTaskTrends().then(data => {
            if (!data) return;

            const ctx = document.getElementById(containerId).getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.dates,
                    datasets: [{
                        label: 'Completed Tasks',
                        data: data.completed,
                        borderColor: this.chartColors[0],
                        fill: false
                    }, {
                        label: 'New Tasks',
                        data: data.new,
                        borderColor: this.chartColors[1],
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Task Completion Trends'
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Number of Tasks'
                            }
                        }]
                    }
                }
            });
        });
    }

    displayProductivityScore(containerId) {
        this.fetchTaskStatistics().then(data => {
            if (!data) return;

            const productivityScore = this.calculateProductivityScore(data);
            const container = document.getElementById(containerId);
            container.innerHTML = `
                <h3>Productivity Score</h3>
                <div class="productivity-score">${productivityScore}</div>
                <p>Based on your task completion rate and timeliness.</p>
            `;
        });
    }

    calculateProductivityScore(data) {
        const completionRate = data.completed_tasks / data.total_tasks;
        const overdueRate = data.overdue_tasks / data.total_tasks;
        return Math.round((completionRate * 100) - (overdueRate * 50));
    }
}

// Usage
document.addEventListener('DOMContentLoaded', function() {
    const statisticsHandler = new StatisticsHandler();
    statisticsHandler.createTaskStatusChart('taskStatusChart');
    statisticsHandler.createTaskTrendsChart('taskTrendsChart');
    statisticsHandler.displayProductivityScore('productivityScore');
});