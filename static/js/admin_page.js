let productStats = []; // Store product stats globally
let feedbackChart; // To hold the feedback chart instance

// Fetch merchants data and create a chart
async function fetchMerchants() {
    const response = await fetch('http://127.0.0.1:8000/admin_panel/api/merchants');
    const data = await response.json();

    const merchantNames = data.merchants.map(merchant => merchant.merchant);
    const productCounts = data.merchants.map(merchant => merchant.product_count);

    const ctx = document.getElementById('merchantChart').getContext('2d');
    const merchantChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: merchantNames,
            datasets: [{
                label: 'Number of Products',
                data: productCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#374151', // Dark grid color
                    },
                    ticks: {
                        color: '#ffffff', // White ticks
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff', // White ticks
                    },
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff' // White legend labels
                    },
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    zoom: {
                        wheel: {
                            enabled: false, // Disable mouse wheel zooming
                        },
                        pinch: {
                            enabled: false // Disable pinch zooming
                        },
                        mode: 'x',
                    }
                }
            }
        }
    });

    addChartControls('merchant', merchantChart);
}

// Fetch product stats data and create sentiment chart
async function fetchProductStats() {
    const response = await fetch('http://127.0.0.1:8000/admin_panel/api/product-stats/');
    productStats = await response.json(); // Store data globally for later use

    const productNames = productStats.map(stat => stat.name);
    const positiveCounts = productStats.map(stat => stat.positive);
    const negativeCounts = productStats.map(stat => stat.negative);
    const neutralCounts = productStats.map(stat => stat.neutral);

    const ctx = document.getElementById('sentimentChart').getContext('2d');
    const sentimentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: productNames,
            datasets: [
                {
                    label: 'Positive',
                    data: positiveCounts,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                },
                {
                    label: 'Negative',
                    data: negativeCounts,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false
                },
                {
                    label: 'Neutral',
                    data: neutralCounts,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: '#374151'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#374151'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    },
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                    zoom: {
                        wheel: {
                            enabled: false, // Disable mouse wheel zooming
                        },
                        pinch: {
                            enabled: false // Disable pinch zooming
                        },
                        mode: 'x',
                    }
                }
            }
        }
    });

    addChartControls('sentiment', sentimentChart);

    // Remove this line as we're implementing a different scrolling mechanism
    // sentimentChart.zoom(productNames.length / 10);

    populateProductDropdown(productNames);
}

// Populate product dropdown for feedback chart
function populateProductDropdown(productNames) {
    const dropdown = document.getElementById('productDropdown');
    productNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        dropdown.appendChild(option);
    });
    dropdown.addEventListener('change', handleProductChange);
    
    // Trigger change event for the first product
    if (productNames.length > 0) {
        dropdown.value = productNames[0];
        handleProductChange();
    }
}

// Handle product change
function handleProductChange() {
    const selectedProduct = document.getElementById('productDropdown').value;
    updateFeedbackChart();
    fetchProductDetails(selectedProduct);
}

// Update feedback chart based on selected product
function updateFeedbackChart() {
    const selectedProduct = document.getElementById('productDropdown').value;
    const selectedStat = productStats.find(stat => stat.name === selectedProduct);

    if (selectedStat) {
        if (feedbackChart) {
            feedbackChart.destroy();
        }

        const ctx = document.getElementById('feedbackChart').getContext('2d');
        feedbackChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [{
                    label: 'Feedback',
                    data: [
                        selectedStat.positive,
                        selectedStat.negative,
                        selectedStat.neutral
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff'
                        }
                    },
                    title: {
                        display: true,
                        text: `Feedback for ${selectedProduct}`,
                        color: '#ffffff',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }
}

async function fetchProductDetails(productName) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/admin_panel/api/product_details/${productName}`);
        const data = await response.json();
        document.getElementById('suggestionContainer').innerHTML = `
            <h3 class="text-lg font-semibold mb-2">Summary:</h3>
            <p class="mb-4">${data.summary}</p>
            <h3 class="text-lg font-semibold mb-2">Suggestion:</h3>
            <p>${data.suggestion}</p>
        `;
    } catch (error) {
        console.error('Error fetching product details:', error);
        document.getElementById('suggestionContainer').innerHTML = `
            <p class="text-red-500">Error loading product details. Please try again.</p>
        `;
    }
}

async function fetchProducts() {
    const response = await fetch('http://127.0.0.1:8000/admin_panel/api/products/');
    const data = await response.json();
    const tableBody = document.getElementById('productTableBody');

    data.product_names.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">${product.id}</td>
            <td class="px-4 py-2">${product.asin}</td>
            <td class="px-4 py-2">${product.name}</td>
            <td class="px-4 py-2">${product.overall_rating}</td>
            <td class="px-4 py-2">${product.review_count}</td>
            <td class="px-4 py-2"><span class="merchant-tag">${product.merchant}</span></td>
        `;
        row.addEventListener('dblclick', () => toggleExpandedRow(row, product.name));
        tableBody.appendChild(row);
    });
}

function toggleExpandedRow(row, productName) {
    const existingExpanded = row.nextElementSibling;
    if (existingExpanded && existingExpanded.classList.contains('expanded-row')) {
        existingExpanded.remove();
    } else {
        const expandedRow = document.createElement('tr');
        expandedRow.classList.add('expanded-row');
        expandedRow.innerHTML = `
            <td colspan="6">
                <div class="close-button">&times;</div>
                <div class="loading-bar"></div>
                <div class="suggestion-content mt-2"></div>
            </td>
        `;
        row.parentNode.insertBefore(expandedRow, row.nextSibling);

        const closeButton = expandedRow.querySelector('.close-button');
        closeButton.addEventListener('click', () => expandedRow.remove());

        loadSuggestion(expandedRow, productName);
    }
}

async function loadSuggestion(expandedRow, productName) {
    const loadingBar = expandedRow.querySelector('.loading-bar');
    const suggestionContent = expandedRow.querySelector('.suggestion-content');

    // Animate loading bar
    loadingBar.style.width = '30%';
    await new Promise(resolve => setTimeout(resolve, 500));
    loadingBar.style.width = '60%';
    await new Promise(resolve => setTimeout(resolve, 500));
    loadingBar.style.width = '90%';

    try {
        const response = await fetch(`http://127.0.0.1:8000/admin_panel/suggestion/${encodeURIComponent(productName)}/`);
        const data = await response.json();

        // Complete loading bar
        loadingBar.style.width = '100%';
        await new Promise(resolve => setTimeout(resolve, 500));

        suggestionContent.innerHTML = `
            <div class="suggestion-box">
                <h3 class="suggestion-title">Suggestion:</h3>
                <p class="suggestion-text">${data.suggestion}</p>
            </div>
            <div style="height: 16px;"></div> <!-- Extra space below -->
        `;
    } catch (error) {
        console.error('Error fetching suggestion:', error);
        suggestionContent.innerHTML = '<p class="text-red-500">Error loading suggestion. Please try again.</p>';
    }

    // Hide loading bar
    loadingBar.style.display = 'none';
}

// Call the fetch functions to load data and create charts
fetchMerchants();
fetchProductStats();
fetchProducts();

function addChartControls(chartId, chart) {
    const scrollLeftBtn = document.getElementById(`${chartId}ScrollLeft`);
    const scrollRightBtn = document.getElementById(`${chartId}ScrollRight`);
    const zoomInBtn = document.getElementById(`${chartId}ZoomIn`);
    const zoomOutBtn = document.getElementById(`${chartId}ZoomOut`);

    scrollLeftBtn.addEventListener('click', () => {
        chart.pan({x: 100}, undefined, 'default');
    });

    scrollRightBtn.addEventListener('click', () => {
        chart.pan({x: -100}, undefined, 'default');
    });

    zoomInBtn.addEventListener('click', () => {
        chart.zoom(1.1);
    });

    zoomOutBtn.addEventListener('click', () => {
        chart.zoom(0.9);
    });

    // Add double-click event listener to reset zoom
    chart.canvas.addEventListener('dblclick', () => {
        chart.resetZoom();
    });
}
