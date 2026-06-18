// Main App Logic
let currentUser = null;
let expenseChart = null;
let profitChart = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const session = await supabase.auth.getSession();
    if (!session?.data?.session) {
        window.location.href = 'index.html';
        return;
    }

    currentUser = session.data.session.user;
    document.getElementById('userEmail').textContent = currentUser.email;

    // Initialize UI
    initializeSidebar();
    initializeButtons();
    loadDashboard();

    // Load initial data
    await refreshDashboard();
});

// Sidebar Navigation
function initializeSidebar() {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(section) {
    // Update active item
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        expenses: 'Expenses',
        invoices: 'Invoices',
        projects: 'Projects',
        customers: 'Customers',
        wht: 'Withholding Tax',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section];

    // Show/hide content
    document.querySelectorAll('.section-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${section}-content`).classList.remove('hidden');

    // Load section data
    if (section === 'expenses') loadExpenses();
    if (section === 'projects') loadProjects();
    if (section === 'customers') loadCustomers();
}

// Initialize Buttons
function initializeButtons() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        window.location.href = 'index.html';
    });

    // Settings - Save Config
    document.getElementById('saveConfigBtn').addEventListener('click', () => {
        const url = document.getElementById('supabaseUrl').value;
        const key = document.getElementById('supabaseKey').value;

        if (!url || !key) {
            alert('❌ Please enter both URL and Anon Key');
            return;
        }

        localStorage.setItem('SUPABASE_URL', url);
        localStorage.setItem('SUPABASE_ANON_KEY', key);
        alert('✅ Configuration saved! Please refresh the page.');
    });

    // Buttons
    document.getElementById('addExpenseBtn')?.addEventListener('click', () => {
        alert('📝 Add Expense feature coming soon');
    });

    document.getElementById('addInvoiceBtn')?.addEventListener('click', () => {
        alert('📄 Add Invoice feature coming soon');
    });

    document.getElementById('addProjectBtn')?.addEventListener('click', () => {
        alert('🏗️ Add Project feature coming soon');
    });

    document.getElementById('addCustomerBtn')?.addEventListener('click', () => {
        alert('👥 Add Customer feature coming soon');
    });
}

// Dashboard
async function loadDashboard() {
    const chartExpense = document.getElementById('expenseChart');
    const chartProfit = document.getElementById('profitChart');

    if (chartExpense && !expenseChart) {
        expenseChart = new Chart(chartExpense, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Expenses (฿)',
                    data: [5000, 6000, 5500, 7000, 6500, 8000],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    if (chartProfit && !profitChart) {
        profitChart = new Chart(chartProfit, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Income (฿)',
                        data: [15000, 18000, 16000, 20000, 19000, 22000],
                        backgroundColor: '#10b981'
                    },
                    {
                        label: 'Expenses (฿)',
                        data: [5000, 6000, 5500, 7000, 6500, 8000],
                        backgroundColor: '#ef4444'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

async function refreshDashboard() {
    // Mock data - replace with real Supabase queries
    document.getElementById('totalExpenses').textContent = '฿ 38,000';
    document.getElementById('totalIncome').textContent = '฿ 110,000';
    document.getElementById('netProfit').textContent = '฿ 72,000';
    document.getElementById('activeProjects').textContent = '5';
}

// Expenses
async function loadExpenses() {
    const table = document.getElementById('expenseTable');
    
    // Mock data
    const mockExpenses = [
        { id: 1, date: '2024-01-15', description: 'Office Supplies', amount: 2500, category: 'Supplies' },
        { id: 2, date: '2024-01-20', description: 'Electricity Bill', amount: 5000, category: 'Utilities' },
        { id: 3, date: '2024-01-25', description: 'Equipment Maintenance', amount: 8500, category: 'Maintenance' }
    ];

    if (mockExpenses.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">No expenses yet</td></tr>';
        return;
    }

    table.innerHTML = mockExpenses.map(exp => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${exp.date}</td>
            <td class="py-3 px-4">${exp.description}</td>
            <td class="py-3 px-4 font-semibold">฿ ${exp.amount.toLocaleString()}</td>
            <td class="py-3 px-4"><span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">${exp.category}</span></td>
            <td class="py-3 px-4">
                <button class="text-blue-600 hover:underline text-sm">Edit</button>
                <button class="text-red-600 hover:underline text-sm ml-2">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Projects
async function loadProjects() {
    const table = document.getElementById('projectTable');

    const mockProjects = [
        { id: 1, name: 'Office Building Renovation', status: 'In Progress', budget: 500000 },
        { id: 2, name: 'Bridge Construction', status: 'In Progress', budget: 2000000 },
        { id: 3, name: 'Water System Upgrade', status: 'Planning', budget: 750000 }
    ];

    if (mockProjects.length === 0) {
        table.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-gray-500">No projects yet</td></tr>';
        return;
    }

    table.innerHTML = mockProjects.map(proj => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${proj.name}</td>
            <td class="py-3 px-4">
                <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">${proj.status}</span>
            </td>
            <td class="py-3 px-4 font-semibold">฿ ${proj.budget.toLocaleString()}</td>
            <td class="py-3 px-4">
                <button class="text-blue-600 hover:underline text-sm">View</button>
            </td>
        </tr>
    `).join('');
}

// Customers
async function loadCustomers() {
    const table = document.getElementById('customerTable');

    const mockCustomers = [
        { id: 1, company: 'City Municipality', contact: 'Somchai S.', phone: '02-123-4567' },
        { id: 2, company: 'Provincial Administration', contact: 'Siriporn T.', phone: '043-123-456' },
        { id: 3, company: 'Private Developer Co.', contact: 'Anong B.', phone: '08-1234-5678' }
    ];

    if (mockCustomers.length === 0) {
        table.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-gray-500">No customers yet</td></tr>';
        return;
    }

    table.innerHTML = mockCustomers.map(cust => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${cust.company}</td>
            <td class="py-3 px-4">${cust.contact}</td>
            <td class="py-3 px-4">${cust.phone}</td>
            <td class="py-3 px-4">
                <button class="text-blue-600 hover:underline text-sm">Edit</button>
            </td>
        </tr>
    `).join('');
}
