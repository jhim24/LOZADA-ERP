// ======================================
// LOZADA ERP Dashboard Loader
// ======================================

async function loadComponent(id, file) {

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error("Cannot load " + file);
        }

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    } catch (error) {

        console.error(error);

        const element = document.getElementById(id);

        if (element) {

            element.innerHTML = `
                <div style="padding:20px;color:red;">
                    Failed to load: ${file}
                </div>
            `;

        }

    }

}

// ======================================
// LOAD COMPONENTS
// ======================================

window.addEventListener("DOMContentLoaded", () => {

    loadComponent("sidebar", "../components/sidebar.html");

    loadComponent("navbar", "../components/navbar.html");

    loadComponent("dashboard-cards", "../components/dashboard-cards.html");

    loadComponent("dashboard-charts", "../components/dashboard-charts.html");

    loadComponent("dashboard-orders", "../components/dashboard-orders.html");

    loadComponent("dashboard-kitchen", "../components/dashboard-kitchen.html");

    loadComponent("dashboard-inventory", "../components/dashboard-inventory.html");

    loadComponent("dashboard-summary", "../components/dashboard-summary.html");

});

// ======================================
// CHART.JS
// ======================================

window.addEventListener("load", () => {

    setTimeout(() => {

        // SALES CHART

        const salesCanvas = document.getElementById("salesChart");

        if (salesCanvas) {

            new Chart(salesCanvas, {

                type: "line",

                data: {

                    labels: [

                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun"

                    ],

                    datasets: [{

                        label: "Sales",

                        data: [

                            20000,
                            35000,
                            28000,
                            45000,
                            32000,
                            48000,
                            38000

                        ],

                        borderColor: "#1E3A8A",

                        backgroundColor: "rgba(30,58,138,.15)",

                        fill: true,

                        tension: .4

                    }]

                }

            });

        }

        // CATEGORY CHART

        const categoryCanvas = document.getElementById("categoryChart");

        if (categoryCanvas) {

            new Chart(categoryCanvas, {

                type: "doughnut",

                data: {

                    labels: [

                        "Main Course",

                        "Beverages",

                        "Desserts",

                        "Snacks"

                    ],

                    datasets: [{

                        data: [

                            35,

                            25,

                            20,

                            20

                        ],

                        backgroundColor: [

                            "#2563EB",

                            "#10B981",

                            "#F59E0B",

                            "#EF4444"

                        ]

                    }]

                }

            });

        }

    },500);

});
