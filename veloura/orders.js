const STATUS_INFO = {
    pending: {
        label: 'Pesanan dibuat',
        icon: '📝'
    },

    processing: {
        label: 'Sedang diproses',
        icon: '⚙️'
    },

    shipped: {
        label: 'Sedang dikirim',
        icon: '🚚'
    },

    completed: {
        label: 'Pesanan sampai',
        icon: '✓'
    }
};

const STATUS_ORDER = [
    'pending',
    'processing',
    'shipped',
    'completed'
];

function rupiahOrder(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value);
}

function formatOrderDate(value) {
    if (!value) return '-';

    return new Date(value.replace(' ', 'T')).toLocaleDateString(
        'id-ID',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }
    );
}

function getStatusLabel(status) {
    return {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        completed: 'Completed',
        cancelled: 'Cancelled'
    }[status] || status;
}

function renderTracking(status) {

    if (status === 'cancelled') {
        return `
            <div class="tracking">
                <div class="tracking-title">
                    ❌ Pesanan Dibatalkan
                </div>

                <p>
                    Pesanan ini telah dibatalkan.
                </p>
            </div>
        `;
    }

    const currentIndex = STATUS_ORDER.indexOf(status);

    return `
        <div class="tracking">

            <div class="tracking-title">
                📦 Order Tracking
            </div>

            <div class="tracking-line">

                <div class="tracking-progress"></div>

                ${STATUS_ORDER.map((item, index) => {

                    let state = '';

                    if (index < currentIndex) {
                        state = 'done';
                    }

                    if (index === currentIndex) {
                        state = 'active';
                    }

                    return `
                        <div class="tracking-step ${state}">

                            <div class="tracking-dot">
                                ${STATUS_INFO[item].icon}
                            </div>

                            <div class="tracking-label">
                                ${STATUS_INFO[item].label}
                            </div>

                        </div>
                    `;

                }).join('')}

            </div>

        </div>
    `;
}

function renderOrder(order) {

    const statusClass = `status-${order.status}`;

    return `
        <article class="order-card">

            <div class="order-top">

                <div>
                    <div class="order-code">
                        #${escapeHTML(order.code)}
                    </div>

                    <div class="order-date">
                        ${formatOrderDate(order.created_at)}
                    </div>
                </div>

                <span class="status-badge ${statusClass}">
                    ${getStatusLabel(order.status)}
                </span>

            </div>


            <div class="order-items">

                ${order.items.map(item => `
                    <div class="order-item">

                        <div>
                            <div class="order-item-name">
                                ${escapeHTML(item.name)}
                            </div>

                            <div class="order-item-qty">
                                Qty: ${item.qty}
                            </div>
                        </div>

                        <div class="order-item-price">
                            ${rupiahOrder(item.price * item.qty)}
                        </div>

                    </div>
                `).join('')}

            </div>


            <div class="order-total">

                <span>
                    Total
                </span>

                <strong>
                    ${rupiahOrder(order.total)}
                </strong>

            </div>


            ${renderTracking(order.status)}

        </article>
    `;
}

async function loadOrders() {

    const container = document.querySelector('#orders-container');
    const count = document.querySelector('#order-count');

    if (!getToken()) {
        location.href = 'login.html';
        return;
    }

    container.innerHTML = `
        <div class="orders-loading">
            <div class="loading-spinner"></div>
            <p>Loading your orders...</p>
        </div>
    `;

    try {

        const response = await apiFetch('/my-orders');

        const orders = response.data || [];

        count.textContent =
            `${orders.length} order${orders.length !== 1 ? 's' : ''}`;

        if (!orders.length) {

            container.innerHTML = `
                <div class="empty-orders">

                    <div class="empty-icon">
                        🛍️
                    </div>

                    <h3>
                        No Orders Yet
                    </h3>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <a
                        href="shop.html"
                        class="shop-now-btn"
                    >
                        Start Shopping
                    </a>

                </div>
            `;

            return;
        }

        container.innerHTML = orders
            .map(renderOrder)
            .join('');

    } catch (error) {

        container.innerHTML = `
            <div class="empty-orders">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to Load Orders
                </h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

                <button
                    class="shop-now-btn"
                    onclick="loadOrders()"
                >
                    Try Again
                </button>

            </div>
        `;

    }
}

document.addEventListener('DOMContentLoaded', () => {

    loadOrders();

    const refreshButton =
        document.querySelector('#refresh-orders');

    if (refreshButton) {
        refreshButton.addEventListener(
            'click',
            loadOrders
        );
    }

});