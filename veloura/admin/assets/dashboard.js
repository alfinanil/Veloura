/* =========================================================
   VELOURA ADMIN DASHBOARD
   DESIGN PREVIEW
   Database belum digunakan pada tahap ini.
========================================================= */


/* =========================================================
   ICON
========================================================= */

const D_ICONS = {

    search:
        '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',

    bell:
        '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>',

    calendar:
        '<rect x="3" y="4" width="18" height="17" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path>',

    cart:
        '<path d="M3 4h2l2.5 11h10L21 7H6"></path><circle cx="9" cy="19" r="1.5"></circle><circle cx="17" cy="19" r="1.5"></circle>',

    money:
        '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v10M15 9.5c-.5-1-1.5-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 2 3 2 3 .8 3 2-1.3 2-3 2c-1.5 0-2.5-.5-3-1.5"></path>',

    box:
        '<path d="m4 7 8-4 8 4-8 4-8-4Z"></path><path d="M4 7v10l8 4 8-4V7M12 11v10"></path>',

    users:
        '<circle cx="9" cy="8" r="3"></circle><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"></path><path d="M16 5a3 3 0 0 1 0 6M18 14c2 .8 3 2.5 3 5"></path>',

    grid:
        '<rect x="4" y="4" width="6" height="6" rx="1"></rect><rect x="14" y="4" width="6" height="6" rx="1"></rect><rect x="4" y="14" width="6" height="6" rx="1"></rect><rect x="14" y="14" width="6" height="6" rx="1"></rect>',

    order:
        '<path d="M6 3h12v18H6z"></path><path d="M9 8h6M9 12h6M9 16h3"></path>',

    tag:
        '<path d="M3 12V4h8l10 10-7 7L3 12Z"></path><circle cx="8" cy="8" r="1"></circle>',

    settings:
        '<circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"></path>',

    logout:
        '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"></path>'
};


function dIcon(name, className = '') {

    return `
        <svg
            class="${className}"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            ${D_ICONS[name] || ''}
        </svg>
    `;
}


/* =========================================================
   SIDEBAR
========================================================= */

function renderDashboardSidebar() {

    const sidebar = document.querySelector('#sidebar');

    if (!sidebar) return;

    sidebar.innerHTML = `

        <div class="admin-logo">

            <img
                src="../images/logo-128.png"
                alt="Veloura"
            >

            <div class="admin-logo-text">
                <strong>VELOURA</strong>
                <span>Admin Panel</span>
            </div>

        </div>


        <nav class="admin-nav">

            <div class="admin-nav-title">
                Main Menu
            </div>

            <ul>

                <li>
                    <a href="index.html" class="active">
                        ${dIcon('grid')}
                        <span>Dashboard</span>
                    </a>
                </li>


                <li>
                    <a href="products.html">
                        ${dIcon('box')}
                        <span>Products</span>
                    </a>
                </li>


                <li>
                    <a href="orders.html">

                        ${dIcon('order')}

                        <span>Orders</span>

                        <span class="nav-order-badge">
                            12
                        </span>

                    </a>
                </li>


                <li>
                    <a href="customers.html">
                        ${dIcon('users')}
                        <span>Customers</span>
                    </a>
                </li>


                <li>
                    <a href="#">
                        ${dIcon('tag')}
                        <span>Promotions</span>
                    </a>
                </li>


                <li>
                    <a href="#">
                        ${dIcon('grid')}
                        <span>Reports</span>
                    </a>
                </li>


            </ul>


            <div
                class="admin-nav-title"
                style="margin-top:32px;"
            >
                Others
            </div>


            <ul>

                <li>
                    <a href="settings.html">
                        ${dIcon('settings')}
                        <span>Settings</span>
                    </a>
                </li>

            </ul>

        </nav>


        <div class="admin-sidebar-bottom">

            <a
                href="../index.html"
                class="back-store-btn"
            >
                ${dIcon('logout')}
                Back to Store
            </a>

        </div>
    `;
}


/* =========================================================
   TOPBAR
========================================================= */

function renderDashboardTopbar() {

    const topbar = document.querySelector('#topbar');

    if (!topbar) return;

    topbar.innerHTML = `

        <div class="admin-search">

            ${dIcon('search')}

            <input
                type="text"
                placeholder="Search here..."
            >

        </div>


        <div class="topbar-right">

            <button
                type="button"
                class="notification-btn"
                title="Notifications"
            >

                ${dIcon('bell')}

                <span class="notification-dot"></span>

            </button>


            <div class="admin-profile">

                <div class="admin-avatar">
                    A
                </div>


                <div class="admin-profile-info">

                    <strong>
                        Admin Veloura
                    </strong>

                    <span>
                        admin@veloura.com
                    </span>

                </div>


                <span class="admin-profile-chevron">
                    ▾
                </span>

            </div>

        </div>
    `;
}


/* =========================================================
   STAT CARDS
========================================================= */

const dashboardStats = [

    {
        label: 'Total Orders',
        value: '256',
        growth: '+12.5%',
        icon: 'cart'
    },

    {
        label: 'Total Revenue',
        value: 'Rp24.560.000',
        growth: '+18.2%',
        icon: 'money'
    },

    {
        label: 'Total Products',
        value: '48',
        growth: '+4.3%',
        icon: 'box'
    },

    {
        label: 'Total Customers',
        value: '198',
        growth: '+10.1%',
        icon: 'users'
    }

];


/* =========================================================
   SALES CHART
========================================================= */

function renderSalesChart() {

    return `

        <section class="dashboard-card sales-card">

            <div class="card-header">

                <div>

                    <h2>
                        Sales Overview
                    </h2>

                    <p>
                        Revenue and orders performance
                    </p>

                </div>


                <div class="chart-legend">

                    <span class="legend-item">
                        <i class="legend-dot"></i>
                        Revenue
                    </span>

                    <span class="legend-item">
                        <i class="legend-dot orders"></i>
                        Orders
                    </span>

                </div>

            </div>


            <div class="chart-area">

                <div class="chart-y">

                    <span>Rp5.000.000</span>
                    <span>Rp4.000.000</span>
                    <span>Rp3.000.000</span>
                    <span>Rp2.000.000</span>
                    <span>Rp1.000.000</span>
                    <span>Rp0</span>

                </div>


                <div class="chart-grid">

                    <div class="chart-line"></div>
                    <div class="chart-line"></div>
                    <div class="chart-line"></div>
                    <div class="chart-line"></div>
                    <div class="chart-line"></div>
                    <div class="chart-line"></div>

                </div>


                <svg
                    class="chart-svg"
                    viewBox="0 0 700 220"
                    preserveAspectRatio="none"
                >

                    <defs>

                        <linearGradient
                            id="revenueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >

                            <stop
                                offset="0%"
                                stop-color="#d47791"
                                stop-opacity=".25"
                            />

                            <stop
                                offset="100%"
                                stop-color="#d47791"
                                stop-opacity="0"
                            />

                        </linearGradient>

                    </defs>


                    <path
                        d="
                        M0 190
                        C55 180,
                        80 175,
                        120 160
                        S185 145,
                        220 150
                        S280 120,
                        315 130
                        S375 95,
                        410 105
                        S465 55,
                        500 72
                        S560 85,
                        600 50
                        S660 45,
                        700 30
                        L700 220
                        L0 220 Z
                        "
                        fill="url(#revenueGradient)"
                    />


                    <path
                        d="
                        M0 190
                        C55 180,
                        80 175,
                        120 160
                        S185 145,
                        220 150
                        S280 120,
                        315 130
                        S375 95,
                        410 105
                        S465 55,
                        500 72
                        S560 85,
                        600 50
                        S660 45,
                        700 30
                        "
                        fill="none"
                        stroke="#c95b79"
                        stroke-width="3"
                    />


                    <path
                        d="
                        M0 205
                        C60 200,
                        90 195,
                        120 188
                        S190 182,
                        220 185
                        S280 170,
                        320 175
                        S380 150,
                        420 158
                        S480 130,
                        520 140
                        S590 125,
                        630 115
                        S680 110,
                        700 105
                        "
                        fill="none"
                        stroke="#e7a9bb"
                        stroke-width="2"
                        stroke-dasharray="5 4"
                    />

                </svg>


                <div class="chart-x">

                    <span>1 Jan</span>
                    <span>5 Jan</span>
                    <span>9 Jan</span>
                    <span>13 Jan</span>
                    <span>17 Jan</span>
                    <span>21 Jan</span>
                    <span>25 Jan</span>
                    <span>29 Jan</span>

                </div>

            </div>

        </section>
    `;
}


/* =========================================================
   RECENT ORDERS
========================================================= */

function renderRecentOrders() {

    const orders = [

        ['#VL-0256', 'Siti Amelia', 'Rp249.000', 'Processing', 'processing'],
        ['#VL-0255', 'Rizky Pratama', 'Rp99.000', 'Completed', 'completed'],
        ['#VL-0254', 'Nadia Putri', 'Rp349.000', 'Completed', 'completed'],
        ['#VL-0253', 'Dicky Santoso', 'Rp198.000', 'Shipped', 'shipped'],
        ['#VL-0252', 'Alya Ramadhani', 'Rp149.000', 'Completed', 'completed']

    ];


    return `

        <section class="dashboard-card orders-card">

            <div class="card-header">

                <div>

                    <h2>
                        Recent Orders
                    </h2>

                    <p>
                        Latest customer orders
                    </p>

                </div>


                <a
                    href="orders.html"
                    class="view-all"
                >
                    View All →
                </a>

            </div>


            <div style="overflow-x:auto;">

                <table class="orders-table">

                    <thead>

                        <tr>

                            <th>
                                Order ID
                            </th>

                            <th>
                                Customer
                            </th>

                            <th>
                                Total
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${orders.map(order => `

                            <tr>

                                <td>
                                    <span class="order-code">
                                        ${order[0]}
                                    </span>
                                </td>

                                <td>
                                    ${order[1]}
                                </td>

                                <td>
                                    ${order[2]}
                                </td>

                                <td>

                                    <span
                                        class="status ${order[4]}"
                                    >
                                        ${order[3]}
                                    </span>

                                </td>

                            </tr>

                        `).join('')}

                    </tbody>

                </table>

            </div>

        </section>
    `;
}


/* =========================================================
   TOP PRODUCTS
========================================================= */

function renderTopProducts() {

    const products = [

        {
            name: 'Pink Himalayan Salt Body Scrub',
            category: 'Bodycare',
            sold: '86',
            revenue: 'Rp8.514.000',
            image: '../images/bodycare.jpg'
        },

        {
            name: 'Radiant Glow Face Serum',
            category: 'Skincare',
            sold: '72',
            revenue: 'Rp7.128.000',
            image: '../images/skincare.jpg'
        },

        {
            name: 'Powder Cushion SPF 50',
            category: 'Makeup',
            sold: '61',
            revenue: 'Rp6.039.000',
            image: '../images/makeup.jpg'
        }

    ];


    return `

        <section class="dashboard-card">

            <div class="card-header">

                <div>

                    <h2>
                        Top Selling Products
                    </h2>

                    <p>
                        Best performing products
                    </p>

                </div>


                <a
                    href="products.html"
                    class="view-all"
                >
                    View All →
                </a>

            </div>


            ${products.map(product => `

                <div class="product-row">

                    <div class="product-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            onerror="this.src='../images/logo-128.png'"
                        >

                    </div>


                    <div>

                        <div class="product-name">
                            ${product.name}
                        </div>

                        <div class="product-category">
                            ${product.category}
                        </div>

                    </div>


                    <div class="product-sold">
                        ${product.sold}
                    </div>


                    <div class="product-revenue">
                        ${product.revenue}
                    </div>

                </div>

            `).join('')}

        </section>
    `;
}


/* =========================================================
   SALES BY CATEGORY
========================================================= */

function renderCategoryChart() {

    return `

        <section class="dashboard-card">

            <div class="card-header">

                <div>

                    <h2>
                        Sales by Category
                    </h2>

                    <p>
                        Revenue distribution
                    </p>

                </div>

            </div>


            <div class="category-content">


                <div class="donut">

                    <svg
                        viewBox="0 0 42 42"
                    >

                        <circle
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke="#f5dce4"
                            stroke-width="5"
                        />


                        <circle
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke="#c95b79"
                            stroke-width="5"
                            stroke-dasharray="42.6 57.4"
                            stroke-dashoffset="25"
                        />


                        <circle
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke="#dd8da5"
                            stroke-width="5"
                            stroke-dasharray="28.4 71.6"
                            stroke-dashoffset="-17.6"
                        />


                        <circle
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke="#edb7c6"
                            stroke-width="5"
                            stroke-dasharray="18.7 81.3"
                            stroke-dashoffset="-46"
                        />

                    </svg>


                    <div class="donut-center">

                        <strong>
                            Rp24.56M
                        </strong>

                        <span>
                            Total Revenue
                        </span>

                    </div>

                </div>


                <div class="category-list">

                    <div class="category-item">

                        <span class="category-label">
                            <i class="category-dot"></i>
                            Skincare
                        </span>

                        <strong class="category-percent">
                            42.6%
                        </strong>

                    </div>


                    <div class="category-item">

                        <span class="category-label">
                            <i
                                class="category-dot"
                                style="background:#dd8da5"
                            ></i>
                            Bodycare
                        </span>

                        <strong class="category-percent">
                            28.4%
                        </strong>

                    </div>


                    <div class="category-item">

                        <span class="category-label">
                            <i
                                class="category-dot"
                                style="background:#edb7c6"
                            ></i>
                            Makeup
                        </span>

                        <strong class="category-percent">
                            18.7%
                        </strong>

                    </div>


                    <div class="category-item">

                        <span class="category-label">
                            <i
                                class="category-dot"
                                style="background:#f3d6df"
                            ></i>
                            Haircare
                        </span>

                        <strong class="category-percent">
                            10.3%
                        </strong>

                    </div>

                </div>

            </div>

        </section>
    `;
}


/* =========================================================
   RENDER DASHBOARD
========================================================= */

window.renderPage = function () {

    renderDashboardSidebar();

    renderDashboardTopbar();


    const main = document.querySelector('#content');

    if (!main) return;


    main.innerHTML = `

        <section class="dashboard-heading">

            <div>

                <h1>
                    Welcome back, Admin Veloura! 👋
                </h1>

                <p>
                    Here's what's happening with your store today.
                </p>

            </div>


            <div class="date-filter-wrapper">

                <button
                    type="button"
                    class="date-filter"
                    id="dateFilterButton"
                    onclick="toggleDateFilter()"
                >
                    <span class="date-filter-icon">
                        ${dIcon('calendar')}
                    </span>

                    <span id="dateFilterLabel">
                        Last 30 Days
                    </span>

                    <span class="date-filter-arrow">▾</span>
                </button>

                <div
                    class="date-filter-dropdown"
                    id="dateFilterDropdown"
                >

                    <button
                        type="button"
                        class="date-option"
                        data-period="7"
                        onclick="selectDateFilter(7, 'Last 7 Days')"
                    >
                        <span>Last 7 Days</span>
                    </button>

                    <button
                        type="button"
                        class="date-option active"
                        data-period="30"
                        onclick="selectDateFilter(30, 'Last 30 Days')"
                    >
                        <span>Last 30 Days</span>
                        <span class="check">✓</span>
                    </button>

                    <button
                        type="button"
                        class="date-option"
                        data-period="90"
                        onclick="selectDateFilter(90, 'Last 3 Months')"
                    >
                        <span>Last 3 Months</span>
                    </button>

                    <button
                        type="button"
                        class="date-option"
                        data-period="180"
                        onclick="selectDateFilter(180, 'Last 6 Months')"
                    >
                        <span>Last 6 Months</span>
                    </button>

                    <button
                        type="button"
                        class="date-option"
                        data-period="365"
                        onclick="selectDateFilter(365, 'This Year')"
                    >
                        <span>This Year</span>
                    </button>

                </div>

            </div>

        </section>


        <section class="stats-grid">

            ${dashboardStats.map(stat => `

                <article class="stat-card">

                    <div class="stat-card-top">

                        <div class="stat-label">
                            ${stat.label}
                        </div>

                        <div class="stat-icon">

                            ${dIcon(stat.icon)}

                        </div>

                    </div>


                    <div class="stat-value">
                        ${stat.value}
                    </div>


                    <div class="stat-growth">

                        ↑ ${stat.growth}

                        <span>
                            vs last 30 days
                        </span>

                    </div>

                </article>

            `).join('')}

        </section>


        <section class="dashboard-grid">

            ${renderSalesChart()}

            ${renderRecentOrders()}

        </section>


        <section class="bottom-grid">

            ${renderTopProducts()}

            ${renderCategoryChart()}

        </section>

    `;
};

/* =========================================
   DATE FILTER
========================================= */

let selectedDatePeriod = 30;


/* Open / close dropdown */

window.toggleDateFilter = function () {

    const dropdown =
        document.getElementById('dateFilterDropdown');

    const wrapper =
        document.querySelector('.date-filter-wrapper');

    if (!dropdown || !wrapper) return;

    dropdown.classList.toggle('show');

    wrapper.classList.toggle(
        'open',
        dropdown.classList.contains('show')
    );
};


/* Select period */

window.selectDateFilter = function (
    days,
    label
) {

    selectedDatePeriod = days;

    const labelElement =
        document.getElementById('dateFilterLabel');

    const dropdown =
        document.getElementById('dateFilterDropdown');

    const wrapper =
        document.querySelector('.date-filter-wrapper');

    if (labelElement) {
        labelElement.textContent = label;
    }


    /* Update active option */

    document
        .querySelectorAll('.date-option')
        .forEach(option => {

            option.classList.remove('active');

            const optionText =
                option.querySelector('span');

            if (
                optionText &&
                optionText.textContent.trim() === label
            ) {
                option.classList.add('active');

                if (!option.querySelector('.check')) {

                    const check =
                        document.createElement('span');

                    check.className = 'check';
                    check.textContent = '✓';

                    option.appendChild(check);
                }
            }

        });


    /* Close dropdown */

    if (dropdown) {
        dropdown.classList.remove('show');
    }

    if (wrapper) {
        wrapper.classList.remove('open');
    }


    /*
       Untuk sementara kita hanya mengubah
       pilihan periode.

       Nanti selectedDatePeriod akan digunakan
       untuk menghitung data dashboard dari database.
    */

    console.log(
        'Selected period:',
        selectedDatePeriod,
        'days'
    );
};


/* Close when clicking outside */

document.addEventListener(
    'click',
    function (event) {

        const wrapper =
            document.querySelector(
                '.date-filter-wrapper'
            );

        const dropdown =
            document.getElementById(
                'dateFilterDropdown'
            );

        if (
            wrapper &&
            dropdown &&
            !wrapper.contains(event.target)
        ) {

            dropdown.classList.remove('show');

            wrapper.classList.remove('open');
        }

    }


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        renderPage();
    }, 100);

});

