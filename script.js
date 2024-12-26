const orderForm = document.getElementById('orderForm');
const openOrdersList = document.getElementById('openOrdersList');
const orderHistoryList = document.getElementById('orderHistoryList');
const filterDate = document.getElementById('filterDate');

let orders = JSON.parse(localStorage.getItem('orders')) || [];

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = screen.id === screenId ? 'block' : 'none';
    });
}

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const table = e.target.table.value;
    const items = e.target.items.value;
    const notes = e.target.notes.value;
    const timestamp = new Date().toISOString();

    const newOrder = { table, items, notes, timestamp, status: 'open' };
    orders.push(newOrder);

    saveOrders();
    renderOrders();

    e.target.reset();
});

function renderOrders() {
    openOrdersList.innerHTML = '';
    orderHistoryList.innerHTML = '';

    const filteredOrders = orders.filter(order => order.status === 'open');
    filteredOrders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <p><strong>Mesa:</strong> ${order.table}</p>
            <p><strong>Itens:</strong> ${order.items}</p>
            <p><strong>Observações:</strong> ${order.notes || 'Nenhuma'}</p>
            <button onclick="markAsReady('${order.timestamp}')">Marcar como Pronto</button>
        `;
        openOrdersList.appendChild(orderItem);
    });

    orders
        .filter(order => order.status === 'ready')
        .filter(order => !filterDate.value || order.timestamp.startsWith(filterDate.value))
        .forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <p><strong>Mesa:</strong> ${order.table}</p>
                <p><strong>Itens:</strong> ${order.items}</p>
                <p><strong>Observações:</strong> ${order.notes || 'Nenhuma'}</p>
                <p><strong>Status:</strong> Pronto</p>
                <p><strong>Data:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
            `;
            orderHistoryList.appendChild(orderItem);
        });
}

function markAsReady(timestamp) {
    const order = orders.find(o => o.timestamp === timestamp);
    if (order) order.status = 'ready';
    saveOrders();
    renderOrders();
}

filterDate.addEventListener('change', renderOrders);

// Initial render
renderOrders();
