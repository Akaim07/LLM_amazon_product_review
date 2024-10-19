// Line Chart Data
const lineChartCtx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(lineChartCtx, {
    type: 'line',
    data: {
        labels: ['Product1', 'Product2', 'Product3', 'Product4', 'Product5', 'Product6'],
        datasets: [{
            label: 'Sales',
            data: [1, 2, 3, 4, 5],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Pie Chart 1 Data
const pieChart1Ctx = document.getElementById('pieChart1').getContext('2d');
const pieChart1 = new Chart(pieChart1Ctx, {
    type: 'pie',
    data: {
        labels: ['Electronics', 'Clothing', 'Furniture'],
        datasets: [{
            label: 'Category Share',
            data: [30, 45, 25],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverOffset: 6, // Slight hover offset for more visual effect
            borderWidth: 2,
            borderColor: '#fff' // White border for better visibility
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        }
    }
});

// Dynamic Dropdown Options
const products = [
    { value: 'northAmerica', label: 'Product1' },
    { value: 'europe', label: 'Product2' },
    { value: 'asia', label: 'Product3' }
];

// Populating Dropdown
const productSelect = document.getElementById('productSelect');
products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.value;
    option.textContent = product.label;
    productSelect.appendChild(option);
});

// Initial Pie Chart 2 Data for Product1
const pieChart2Ctx = document.getElementById('pieChart2').getContext('2d');
let pieChart2 = new Chart(pieChart2Ctx, {
    type: 'pie',
    data: {
        labels: ['USA', 'Canada', 'Mexico'],
        datasets: [{
            label: 'Sales by Country',
            data: [50, 30, 20],
            backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF'],
            hoverOffset: 6, // Slight hover offset for more visual effect
            borderWidth: 2,
            borderColor: '#fff' // White border for better visibility
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        }
    }
});

// Function to update pie chart based on the selected product
function getDistinctColors(numColors) {
    const colors = [];
    const step = 360 / numColors; // Divide the circle into equal parts based on the number of colors

    for (let i = 0; i < numColors; i++) {
        const hue = Math.floor(i * step); // Calculate the hue
        colors.push(`hsl(${hue}, 70%, 50%)`); // Generate the color in HSL format
    }
    return colors;
}

function updatePieChart(product) {
    let newData;
    let newColors;

    if (product === 'northAmerica') {
        newData = [50, 30, 20]; // USA, Canada, Mexico
        pieChart2.data.labels = ['USA', 'Canada', 'Mexico'];
    } else if (product === 'europe') {
        newData = [40, 35, 25]; // UK, Germany, France
        pieChart2.data.labels = ['UK', 'Germany', 'France'];
    } else if (product === 'asia') {
        newData = [60, 25, 15]; // China, Japan, India
        pieChart2.data.labels = ['China', 'Japan', 'India'];
    }

    // Generate colors dynamically based on the number of data points
    newColors = getDistinctColors(newData.length);

    pieChart2.data.datasets[0].data = newData;
    pieChart2.data.datasets[0].backgroundColor = newColors;
    pieChart2.update();
}

// Event listener for product dropdown
$('#productSelect').on('change', function () {
    const selectedProduct = $(this).val();
    updatePieChart(selectedProduct);
});

// Table Data (using jQuery to append rows dynamically)
$(document).ready(function () {
    const tableData = [
        { id: 1, product: 'Laptop', recommendation: 'Recommended' },
        { id: 2, product: 'Smartphone', recommendation: 'Highly Recommended' },
        { id: 3, product: 'Desk Chair', recommendation: 'Recommended' },
        { id: 4, product: 'Tablet', recommendation: 'Moderate' }
    ];

    tableData.forEach(item => {
        $('#tableBody').append(`
            <tr>
                <td>${item.id}</td>
                <td>${item.product}</td>
                <td>${item.recommendation}</td>
            </tr>
        `);
    });
});
