// ===== GLOBAL VARIABLES =====
let transactions = [];
let categories = [];
let budgets = [];
let goals = [];
let recurringTransactions = [];
let currentFilter = { type: 'all', category: 'all', search: '' };
let currentSection = 'dashboard';
let editingTransactionId = null;
let selectedTransactions = new Set();
let currentTheme = 'light';
let currentCurrency = 'USD';
let searchHistory = [];
let categoryChart = null;
let trendChart = null;

// Currency conversion rates (simplified - in production, use real-time API)
const currencyRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.12,
    JPY: 149.50,
    CNY: 7.24,
    AUD: 1.52,
    CAD: 1.36
};

const currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', INR: '₹',
    JPY: '¥', CNY: '¥', AUD: '$', CAD: '$'
};

// Default categories
const defaultCategories = [
    { name: 'Food', emoji: '🍔', type: 'expense', isDefault: true },
    { name: 'Transportation', emoji: '🚗', type: 'expense', isDefault: true },
    { name: 'Entertainment', emoji: '🎬', type: 'expense', isDefault: true },
    { name: 'Shopping', emoji: '🛍️', type: 'expense', isDefault: true },
    { name: 'Bills', emoji: '💡', type: 'expense', isDefault: true },
    { name: 'Healthcare', emoji: '🏥', type: 'expense', isDefault: true },
    { name: 'Education', emoji: '📚', type: 'expense', isDefault: true },
    { name: 'Salary', emoji: '💼', type: 'income', isDefault: true },
    { name: 'Freelance', emoji: '💻', type: 'income', isDefault: true },
    { name: 'Investment', emoji: '📈', type: 'income', isDefault: true },
    { name: 'Other', emoji: '📌', type: 'both', isDefault: true }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupKeyboardShortcuts();
});

function initializeApp() {
    loadFromLocalStorage();
    initializeCategories();
    setupEventListeners();
    updateCurrentDate();
    setTodayDate();
    loadTheme();
    loadCurrency();
    processRecurringTransactions();
    updateUI();
    systemHealthCheck();
}

function initializeCategories() {
    if (categories.length === 0) {
        categories = [...defaultCategories];
        saveToLocalStorage();
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Currency selector
    document.getElementById('currencySelect').addEventListener('change', handleCurrencyChange);

    // Modal
    document.getElementById('addTransactionBtn').addEventListener('click', () => openTransactionModal());
    document.getElementById('modalClose').addEventListener('click', closeTransactionModal);
    document.getElementById('cancelBtn').addEventListener('click', closeTransactionModal);

    // Form
    document.getElementById('transactionForm').addEventListener('submit', handleTransactionSubmit);
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', handleTypeSelection);
    });

    // Description autocomplete
    const descInput = document.getElementById('description');
    descInput.addEventListener('input', handleDescriptionInput);
    descInput.addEventListener('focus', () => {
        if (descInput.value) handleDescriptionInput({ target: descInput });
    });
    descInput.addEventListener('blur', () => {
        setTimeout(() => {
            document.getElementById('suggestionsDropdown').innerHTML = '';
        }, 200);
    });

    // Filters
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', handleFilterChip);
    });
    document.getElementById('categoryFilter').addEventListener('change', handleCategoryFilter);
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Bulk actions
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', handleSelectAll);
    }
    document.getElementById('bulkDeleteBtn')?.addEventListener('click', handleBulkDelete);
    document.getElementById('bulkCategorizeBtn')?.addEventListener('click', () => openModal('bulkCategoryModal'));

    // View All
    document.getElementById('viewAllBtn').addEventListener('click', () => {
        switchSection('transactions');
    });

    // Export/Import
    document.getElementById('exportBtn').addEventListener('click', () => openModal('exportModal'));
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importData);

    // Export options
    document.getElementById('exportJSON')?.addEventListener('click', exportJSON);
    document.getElementById('exportCSV')?.addEventListener('click', exportCSV);
    document.getElementById('exportPDF')?.addEventListener('click', exportPDF);

    // Period selectors
    document.getElementById('categoryPeriod')?.addEventListener('change', updateCategoryChart);
    document.getElementById('trendPeriod')?.addEventListener('change', updateTrendChart);

    // Budget
    document.getElementById('addBudgetBtn')?.addEventListener('click', () => openModal('budgetModal'));
    document.getElementById('budgetForm')?.addEventListener('submit', handleBudgetSubmit);

    // Goal
    document.getElementById('addGoalBtn')?.addEventListener('click', () => openModal('goalModal'));
    document.getElementById('goalForm')?.addEventListener('submit', handleGoalSubmit);

    // Recurring
    document.getElementById('addRecurringBtn')?.addEventListener('click', () => {
        openTransactionModal();
        document.getElementById('isRecurring').checked = true;
    });

    // Category
    document.getElementById('addCategoryBtn')?.addEventListener('click', () => openModal('categoryModal'));
    document.getElementById('categoryForm')?.addEventListener('submit', handleCategorySubmit);

    // Bulk category change
    document.getElementById('bulkCategoryForm')?.addEventListener('submit', handleBulkCategoryChange);

    // Modal overlays
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });
}

// ===== KEYBOARD SHORTCUTS =====
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in input
        if (e.target.matches('input, textarea, select')) return;

        switch(e.key.toLowerCase()) {
            case 'n':
                e.preventDefault();
                openTransactionModal();
                break;
            case 'e':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    openModal('exportModal');
                }
                break;
            case 'd':
                e.preventDefault();
                switchSection('dashboard');
                break;
            case 't':
                e.preventDefault();
                switchSection('transactions');
                break;
            case 'a':
                e.preventDefault();
                switchSection('analytics');
                break;
            case 'b':
                e.preventDefault();
                switchSection('budgets');
                break;
            case 'g':
                e.preventDefault();
                switchSection('goals');
                break;
            case 'escape':
                closeAllModals();
                break;
        }
    });
}

// ===== THEME MANAGEMENT =====
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
    localStorage.setItem('theme', currentTheme);
}

function applyTheme() {
    document.body.setAttribute('data-theme', currentTheme);
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        currentTheme = saved;
        applyTheme();
    }
}

// ===== CURRENCY MANAGEMENT =====
function handleCurrencyChange(e) {
    currentCurrency = e.target.value;
    localStorage.setItem('currency', currentCurrency);
    updateUI();
}

function loadCurrency() {
    const saved = localStorage.getItem('currency');
    if (saved) {
        currentCurrency = saved;
        document.getElementById('currencySelect').value = currentCurrency;
    }
}

function formatCurrency(amount) {
    const symbol = currencySymbols[currentCurrency];
    const converted = amount * currencyRates[currentCurrency] / currencyRates.USD;
    
    if (currentCurrency === 'JPY' || currentCurrency === 'CNY') {
        return `${symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${symbol}${converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

// ===== NAVIGATION =====
function handleNavigation(e) {
    const section = e.currentTarget.dataset.section;
    switchSection(section);
}

function switchSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const navItem = document.querySelector(`[data-section="${section}"]`);
    if (navItem) navItem.classList.add('active');

    // Update sections with animation
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        setTimeout(() => targetSection.classList.add('active'), 50);
    }

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        transactions: 'All Transactions',
        analytics: 'Analytics & Insights',
        budgets: 'Monthly Budgets',
        goals: 'Savings Goals',
        recurring: 'Recurring Transactions',
        categories: 'Manage Categories'
    };
    document.querySelector('.page-title').textContent = titles[section] || section;

    currentSection = section;

    // Update UI for specific sections
    if (section === 'analytics') updateAnalytics();
    if (section === 'budgets') updateBudgets();
    if (section === 'goals') updateGoals();
    if (section === 'recurring') updateRecurringList();
    if (section === 'categories') updateCategoriesGrid();
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-active');
}

// ===== DATE FUNCTIONS =====
function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = today;
}

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// ===== TRANSACTION MODAL =====
function openTransactionModal(edit = false, transactionId = null) {
    const modal = document.getElementById('transactionModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');

    // Populate category dropdown
    updateCategoryDropdown();

    if (edit && transactionId) {
        const transaction = transactions.find(t => t.id === transactionId);
        if (transaction) {
            modalTitle.textContent = 'Edit Transaction';
            submitBtn.textContent = 'Update Transaction';
            editingTransactionId = transactionId;
            populateTransactionForm(transaction);
        }
    } else {
        modalTitle.textContent = 'Add Transaction';
        submitBtn.textContent = 'Add Transaction';
        editingTransactionId = null;
        document.getElementById('transactionForm').reset();
        setTodayDate();
        selectType('expense');
    }

    openModal('transactionModal');
}

function closeTransactionModal() {
    closeModal('transactionModal');
    document.getElementById('transactionForm').reset();
    editingTransactionId = null;
    document.getElementById('suggestionsDropdown').innerHTML = '';
}

function populateTransactionForm(transaction) {
    document.getElementById('transactionType').value = transaction.type;
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('category').value = transaction.category;
    document.getElementById('date').value = transaction.date;
    document.getElementById('isRecurring').checked = transaction.isRecurring || false;
    selectType(transaction.type);
}

function handleTypeSelection(e) {
    const type = e.currentTarget.dataset.type;
    selectType(type);
}

function selectType(type) {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const typeBtn = document.querySelector(`.type-btn[data-type="${type}"]`);
    if (typeBtn) typeBtn.classList.add('active');
    document.getElementById('transactionType').value = type;
    updateCategoryDropdown();
}

function updateCategoryDropdown() {
    const type = document.getElementById('transactionType')?.value || 'expense';
    const categorySelect = document.getElementById('category');
    
    if (!categorySelect) return;
    
    const currentValue = categorySelect.value;
    categorySelect.innerHTML = '<option value="">Select category</option>';
    
    const filteredCategories = categories.filter(cat => 
        cat.type === type || cat.type === 'both'
    );
    
    filteredCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = `${cat.emoji} ${cat.name}`;
        categorySelect.appendChild(option);
    });
    
    if (currentValue) categorySelect.value = currentValue;
}

// ===== SEARCH SUGGESTIONS =====
function handleDescriptionInput(e) {
    const input = e.target.value.trim().toLowerCase();
    const dropdown = document.getElementById('suggestionsDropdown');
    
    if (input.length < 2) {
        dropdown.innerHTML = '';
        return;
    }
    
    // Get unique descriptions that match
    const suggestions = [...new Set(
        transactions
            .map(t => t.description)
            .filter(desc => desc.toLowerCase().includes(input))
    )].slice(0, 5);
    
    if (suggestions.length === 0) {
        dropdown.innerHTML = '';
        return;
    }
    
    dropdown.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item" onclick="selectSuggestion('${suggestion.replace(/'/g, "\\'")}')">
            <span class="suggestion-icon">🔍</span>
            <span>${suggestion}</span>
        </div>
    `).join('');
}

function selectSuggestion(description) {
    document.getElementById('description').value = description;
    document.getElementById('suggestionsDropdown').innerHTML = '';
    
    // Find the most recent transaction with this description and prefill
    const similar = transactions.find(t => t.description === description);
    if (similar) {
        document.getElementById('category').value = similar.category;
        selectType(similar.type);
    }
}

// ===== FORM SUBMISSION =====
function handleTransactionSubmit(e) {
    e.preventDefault();

    const type = document.getElementById('transactionType').value;
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const isRecurring = document.getElementById('isRecurring').checked;

    // Validation
    if (!type || !description || !amount || !category || !date) {
        showError('Please fill in all required fields');
        return;
    }

    if (amount <= 0) {
        showError('Amount must be greater than 0');
        return;
    }

    if (new Date(date) > new Date()) {
        showError('Date cannot be in the future');
        return;
    }

    const transactionData = {
        type,
        description,
        amount,
        category,
        date,
        isRecurring,
        createdAt: new Date().toISOString()
    };

    if (editingTransactionId) {
        // Update existing transaction
        const index = transactions.findIndex(t => t.id === editingTransactionId);
        if (index !== -1) {
            transactions[index] = {
                ...transactions[index],
                ...transactionData
            };
            showToast('Transaction updated successfully!', 'success');
        }
    } else {
        // Add new transaction
        const transaction = {
            id: Date.now(),
            ...transactionData
        };
        transactions.unshift(transaction);
        
        // Add to recurring if checked
        if (isRecurring) {
            const recurring = {
                id: Date.now() + 1,
                ...transactionData,
                lastProcessed: date
            };
            recurringTransactions.push(recurring);
        }
        
        showToast('Transaction added successfully!', 'success');
    }

    saveToLocalStorage();
    updateUI();
    systemHealthCheck();
    closeTransactionModal();
}

// ===== TRANSACTION OPERATIONS =====
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveToLocalStorage();
        updateUI();
        systemHealthCheck();
        showToast('Transaction deleted successfully!', 'success');
    }
}

function editTransaction(id) {
    openTransactionModal(true, id);
}

// ===== BULK ACTIONS =====
function handleSelectAll(e) {
    const checkboxes = document.querySelectorAll('.transaction-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = e.target.checked;
        if (e.target.checked) {
            selectedTransactions.add(parseInt(cb.dataset.id));
        } else {
            selectedTransactions.clear();
        }
    });
    updateBulkActionsBar();
}

function toggleTransactionSelection(id, checked) {
    if (checked) {
        selectedTransactions.add(id);
    } else {
        selectedTransactions.delete(id);
    }
    updateBulkActionsBar();
}

function updateBulkActionsBar() {
    const bar = document.getElementById('bulkActionsBar');
    const count = selectedTransactions.size;
    
    if (count > 0) {
        bar.style.display = 'flex';
        document.getElementById('selectedCount').textContent = `${count} selected`;
    } else {
        bar.style.display = 'none';
    }
}

function handleBulkDelete() {
    if (selectedTransactions.size === 0) return;
    
    if (confirm(`Delete ${selectedTransactions.size} transactions?`)) {
        transactions = transactions.filter(t => !selectedTransactions.has(t.id));
        selectedTransactions.clear();
        saveToLocalStorage();
        updateUI();
        systemHealthCheck();
        showToast('Transactions deleted successfully!', 'success');
    }
}

function handleBulkCategoryChange(e) {
    e.preventDefault();
    
    if (selectedTransactions.size === 0) {
        showToast('No transactions selected', 'error');
        return;
    }
    
    const newCategory = document.getElementById('bulkCategory').value;
    if (!newCategory) {
        showError('Please select a category');
        return;
    }
    
    transactions.forEach(t => {
        if (selectedTransactions.has(t.id)) {
            t.category = newCategory;
        }
    });
    
    selectedTransactions.clear();
    saveToLocalStorage();
    updateUI();
    closeModal('bulkCategoryModal');
    showToast('Categories updated successfully!', 'success');
}

// ===== FILTER FUNCTIONS =====
function handleFilterChip(e) {
    const type = e.currentTarget.dataset.type;
    currentFilter.type = type;

    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    e.currentTarget.classList.add('active');

    updateTransactionsList();
}

function handleCategoryFilter(e) {
    currentFilter.category = e.target.value;
    updateTransactionsList();
}

function handleSearch(e) {
    currentFilter.search = e.target.value.toLowerCase();
    updateTransactionsList();
}

function getFilteredTransactions() {
    return transactions.filter(t => {
        const matchesType = currentFilter.type === 'all' || t.type === currentFilter.type;
        const matchesCategory = currentFilter.category === 'all' || t.category === currentFilter.category;
        const matchesSearch = !currentFilter.search || 
            t.description.toLowerCase().includes(currentFilter.search) ||
            t.category.toLowerCase().includes(currentFilter.search);
        
        return matchesType && matchesCategory && matchesSearch;
    });
}

// ===== RECURRING TRANSACTIONS =====
function processRecurringTransactions() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    recurringTransactions.forEach(recurring => {
        const lastProcessed = new Date(recurring.lastProcessed);
        const daysSince = Math.floor((today - lastProcessed) / (1000 * 60 * 60 * 24));
        
        // Check if a month has passed (approximately 30 days)
        if (daysSince >= 30) {
            const newTransaction = {
                id: Date.now() + Math.random(),
                type: recurring.type,
                description: recurring.description,
                amount: recurring.amount,
                category: recurring.category,
                date: todayStr,
                isRecurring: true,
                createdAt: new Date().toISOString()
            };
            
            transactions.unshift(newTransaction);
            recurring.lastProcessed = todayStr;
            
            showToast(`Recurring transaction added: ${recurring.description}`, 'info');
        }
    });
    
    saveToLocalStorage();
}

function updateRecurringList() {
    const container = document.getElementById('recurringList');
    
    if (recurringTransactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔄</span>
                <p>No recurring transactions</p>
                <small>Add bills and subscriptions that repeat monthly</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recurringTransactions.map(recurring => `
        <div class="recurring-item">
            <div class="recurring-icon">${getCategoryEmoji(recurring.category)}</div>
            <div class="recurring-details">
                <h4>${recurring.description}</h4>
                <p>${recurring.category} • Last processed: ${formatDate(recurring.lastProcessed)}</p>
            </div>
            <div class="recurring-amount ${recurring.type}">${formatCurrency(recurring.amount)}</div>
            <button class="btn-icon" onclick="deleteRecurring(${recurring.id})" title="Delete">
                <span>🗑️</span>
            </button>
        </div>
    `).join('');
}

function deleteRecurring(id) {
    if (confirm('Delete this recurring transaction?')) {
        recurringTransactions = recurringTransactions.filter(r => r.id !== id);
        saveToLocalStorage();
        updateRecurringList();
        showToast('Recurring transaction deleted', 'success');
    }
}

// ===== BUDGETS =====
function handleBudgetSubmit(e) {
    e.preventDefault();
    
    const category = document.getElementById('budgetCategory').value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);
    
    if (!category || amount <= 0) {
        showError('Please fill in all fields correctly');
        return;
    }
    
    // Check if budget already exists for this category
    const existingIndex = budgets.findIndex(b => b.category === category);
    
    if (existingIndex !== -1) {
        budgets[existingIndex].amount = amount;
    } else {
        budgets.push({
            id: Date.now(),
            category,
            amount,
            createdAt: new Date().toISOString()
        });
    }
    
    saveToLocalStorage();
    updateBudgets();
    closeModal('budgetModal');
    showToast('Budget saved successfully!', 'success');
    
    document.getElementById('budgetForm').reset();
}

function updateBudgets() {
    const container = document.getElementById('budgetsGrid');
    
    if (budgets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🎯</span>
                <p>No budgets set yet</p>
                <small>Create budgets to track your spending limits</small>
            </div>
        `;
        return;
    }
    
    const thisMonth = new Date().toISOString().slice(0, 7);
    
    container.innerHTML = budgets.map(budget => {
        const spent = transactions
            .filter(t => t.type === 'expense' && 
                        t.category === budget.category && 
                        t.date.startsWith(thisMonth))
            .reduce((sum, t) => sum + t.amount, 0);
        
        const percentage = Math.min((spent / budget.amount) * 100, 100);
        const remaining = budget.amount - spent;
        
        let status = 'safe';
        if (percentage >= 100) status = 'exceeded';
        else if (percentage >= 80) status = 'warning';
        
        return `
            <div class="budget-card ${status}">
                <div class="budget-header">
                    <div>
                        <span class="budget-icon">${getCategoryEmoji(budget.category)}</span>
                        <h4>${budget.category}</h4>
                    </div>
                    <button class="btn-icon" onclick="deleteBudget(${budget.id})" title="Delete">
                        <span>🗑️</span>
                    </button>
                </div>
                <div class="budget-amounts">
                    <div class="budget-spent">
                        <span>Spent</span>
                        <strong>${formatCurrency(spent)}</strong>
                    </div>
                    <div class="budget-limit">
                        <span>Budget</span>
                        <strong>${formatCurrency(budget.amount)}</strong>
                    </div>
                </div>
                <div class="budget-progress">
                    <div class="progress-bar">
                        <div class="progress-fill ${status}" style="width: ${percentage}%"></div>
                    </div>
                    <span class="progress-text">${percentage.toFixed(0)}% used</span>
                </div>
                <div class="budget-remaining ${remaining < 0 ? 'negative' : ''}">
                    ${remaining >= 0 ? 
                        `${formatCurrency(remaining)} remaining` : 
                        `${formatCurrency(Math.abs(remaining))} over budget`
                    }
                </div>
            </div>
        `;
    }).join('');
    
    // Update badge
    const overBudget = budgets.filter(b => {
        const spent = transactions
            .filter(t => t.type === 'expense' && 
                        t.category === b.category && 
                        t.date.startsWith(thisMonth))
            .reduce((sum, t) => sum + t.amount, 0);
        return spent >= b.amount * 0.8;
    }).length;
    
    const badge = document.getElementById('budgetsBadge');
    if (badge) {
        if (overBudget > 0) {
            badge.textContent = overBudget;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function deleteBudget(id) {
    if (confirm('Delete this budget?')) {
        budgets = budgets.filter(b => b.id !== id);
        saveToLocalStorage();
        updateBudgets();
        showToast('Budget deleted', 'success');
    }
}

// ===== SAVINGS GOALS =====
function handleGoalSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('goalName').value.trim();
    const target = parseFloat(document.getElementById('goalTarget').value);
    const current = parseFloat(document.getElementById('goalCurrent').value) || 0;
    const emoji = document.getElementById('goalEmoji').value.trim() || '🎯';
    
    if (!name || target <= 0) {
        showError('Please fill in all required fields');
        return;
    }
    
    goals.push({
        id: Date.now(),
        name,
        target,
        current,
        emoji,
        createdAt: new Date().toISOString()
    });
    
    saveToLocalStorage();
    updateGoals();
    closeModal('goalModal');
    showToast('Goal created successfully!', 'success');
    
    document.getElementById('goalForm').reset();
}

function updateGoals() {
    const container = document.getElementById('goalsGrid');
    
    if (goals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🏆</span>
                <p>No savings goals yet</p>
                <small>Set goals to track your financial targets</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = goals.map(goal => {
        const percentage = Math.min((goal.current / goal.target) * 100, 100);
        const remaining = goal.target - goal.current;
        
        return `
            <div class="goal-card ${percentage >= 100 ? 'completed' : ''}">
                <div class="goal-header">
                    <span class="goal-emoji">${goal.emoji}</span>
                    <button class="btn-icon" onclick="deleteGoal(${goal.id})" title="Delete">
                        <span>🗑️</span>
                    </button>
                </div>
                <h4 class="goal-name">${goal.name}</h4>
                <div class="goal-amounts">
                    <div>
                        <span>Current</span>
                        <strong>${formatCurrency(goal.current)}</strong>
                    </div>
                    <div>
                        <span>Target</span>
                        <strong>${formatCurrency(goal.target)}</strong>
                    </div>
                </div>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="progress-percentage">${percentage.toFixed(0)}%</span>
                </div>
                <div class="goal-remaining">
                    ${percentage >= 100 ? 
                        '🎉 Goal achieved!' : 
                        `${formatCurrency(remaining)} to go`
                    }
                </div>
                <button class="btn-goal-update" onclick="updateGoalProgress(${goal.id})">
                    Add Progress
                </button>
            </div>
        `;
    }).join('');
    
    // Update badge
    const activeGoalsCount = goals.filter(g => g.current < g.target).length;
    const badge = document.getElementById('activeGoals');
    if (badge) badge.textContent = activeGoalsCount;
}

function updateGoalProgress(id) {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    
    const amount = prompt(`Add to "${goal.name}" (${formatCurrency(goal.current)} of ${formatCurrency(goal.target)}):`);
    if (amount === null) return;
    
    const addAmount = parseFloat(amount);
    if (isNaN(addAmount) || addAmount <= 0) {
        showToast('Invalid amount', 'error');
        return;
    }
    
    goal.current = Math.min(goal.current + addAmount, goal.target);
    saveToLocalStorage();
    updateGoals();
    
    if (goal.current >= goal.target) {
        showToast(`🎉 Congratulations! You've achieved your "${goal.name}" goal!`, 'success');
    } else {
        showToast('Progress updated!', 'success');
    }
}

function deleteGoal(id) {
    if (confirm('Delete this goal?')) {
        goals = goals.filter(g => g.id !== id);
        saveToLocalStorage();
        updateGoals();
        showToast('Goal deleted', 'success');
    }
}

// ===== CATEGORY MANAGEMENT =====
function handleCategorySubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('categoryName').value.trim();
    const emoji = document.getElementById('categoryEmoji').value.trim();
    const type = document.getElementById('categoryType').value;
    
    if (!name || !emoji || !type) {
        showError('Please fill in all fields');
        return;
    }
    
    // Check if category already exists
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        showError('Category already exists');
        return;
    }
    
    categories.push({
        name,
        emoji,
        type,
        isDefault: false
    });
    
    saveToLocalStorage();
    updateCategoriesGrid();
    updateCategoryDropdown();
    closeModal('categoryModal');
    showToast('Category created successfully!', 'success');
    
    document.getElementById('categoryForm').reset();
}

function updateCategoriesGrid() {
    const container = document.getElementById('categoriesGrid');
    
    const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');
    const incomeCategories = categories.filter(c => c.type === 'income' || c.type === 'both');
    
    container.innerHTML = `
        <div class="category-section">
            <h4>Expense Categories</h4>
            <div class="category-items">
                ${expenseCategories.map(cat => `
                    <div class="category-chip">
                        <span class="category-emoji">${cat.emoji}</span>
                        <span class="category-name">${cat.name}</span>
                        ${!cat.isDefault ? `
                            <button class="btn-remove" onclick="deleteCategory('${cat.name}')" title="Delete">
                                ×
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="category-section">
            <h4>Income Categories</h4>
            <div class="category-items">
                ${incomeCategories.map(cat => `
                    <div class="category-chip">
                        <span class="category-emoji">${cat.emoji}</span>
                        <span class="category-name">${cat.name}</span>
                        ${!cat.isDefault ? `
                            <button class="btn-remove" onclick="deleteCategory('${cat.name}')" title="Delete">
                                ×
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function deleteCategory(name) {
    const category = categories.find(c => c.name === name);
    if (!category) return;
    
    if (category.isDefault) {
        showToast('Cannot delete default categories', 'error');
        return;
    }
    
    // Check if category is in use
    const inUse = transactions.some(t => t.category === name);
    if (inUse) {
        if (!confirm('This category is in use. Delete anyway?')) return;
    }
    
    categories = categories.filter(c => c.name !== name);
    saveToLocalStorage();
    updateCategoriesGrid();
    showToast('Category deleted', 'success');
}

function getCategoryEmoji(categoryName) {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.emoji : '📌';
}

// ===== SYSTEM HEALTH CHECK =====
function systemHealthCheck() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const calculatedBalance = income - expenses;
    const displayedBalance = parseFloat(
        document.getElementById('netBalance')
            ?.textContent.replace(/[^0-9.-]+/g, '') || '0'
    );
    
    const healthElement = document.getElementById('systemHealth');
    const isHealthy = Math.abs(calculatedBalance - displayedBalance) < 0.01;
    
    if (isHealthy) {
        healthElement.className = 'system-health verified';
        healthElement.innerHTML = `
            <span class="health-icon">✓</span>
            <span class="health-text">Verified</span>
        `;
    } else {
        healthElement.className = 'system-health error';
        healthElement.innerHTML = `
            <span class="health-icon">⚠</span>
            <span class="health-text">Check Required</span>
        `;
    }
}

// ===== PREDICTIVE SPENDING =====
function updatePredictiveSpending() {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const today = new Date();
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    const monthExpenses = transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(thisMonth))
        .reduce((sum, t) => sum + t.amount, 0);
    
    const avgDaily = monthExpenses / dayOfMonth;
    const projectedTotal = avgDaily * daysInMonth;
    const projectedRemaining = projectedTotal - monthExpenses;
    
    if (dayOfMonth >= 3 && projectedTotal > 0) {
        const alert = document.getElementById('predictionAlert');
        const text = document.getElementById('predictionText');
        
        text.textContent = `Based on your spending pattern, you're projected to spend ${formatCurrency(projectedTotal)} this month. Approximately ${formatCurrency(projectedRemaining)} more to go.`;
        alert.style.display = 'flex';
    }
}

// ===== UI UPDATE FUNCTIONS =====
function updateUI() {
    updateSummaryCards();
    updateQuickStats();
    updateRecentTransactions();
    updateTransactionsList();
    updateCategoryChart();
    updateTrendChart();
    updateCategoryFilter();
    updateBulkCategorySelect();
    updateBudgetCategorySelect();
    updatePredictiveSpending();
    updateBadges();
}

function updateSummaryCards() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;
    
    document.getElementById('totalIncome').textContent = formatCurrency(income);
    document.getElementById('totalExpenses').textContent = formatCurrency(expenses);
    document.getElementById('netBalance').textContent = formatCurrency(balance);
    document.getElementById('savingsRate').textContent = `${savingsRate}%`;
    
    // Update balance change indicator
    const balanceChange = document.getElementById('balanceChange');
    if (balance > 0) {
        balanceChange.textContent = 'Positive balance';
        balanceChange.className = 'card-change positive';
    } else if (balance < 0) {
        balanceChange.textContent = 'Negative balance';
        balanceChange.className = 'card-change negative';
    } else {
        balanceChange.textContent = 'Break even';
        balanceChange.className = 'card-change';
    }
}

function updateQuickStats() {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthExpenses = transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(thisMonth))
        .reduce((sum, t) => sum + t.amount, 0);
    
    const daysInMonth = new Date().getDate();
    const avgDaily = daysInMonth > 0 ? monthExpenses / daysInMonth : 0;
    
    document.getElementById('totalTransactions').textContent = transactions.length;
    document.getElementById('avgDailySpend').textContent = formatCurrency(avgDaily);
    document.getElementById('recurringCount').textContent = recurringTransactions.length;
    document.getElementById('activeGoals').textContent = goals.filter(g => g.current < g.target).length;
}

function updateBadges() {
    const transactionsBadge = document.getElementById('transactionsBadge');
    if (transactionsBadge && transactions.length > 0) {
        transactionsBadge.textContent = transactions.length;
        transactionsBadge.style.display = 'flex';
    }
}

function updateRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    const recent = transactions.slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📝</span>
                <p>No transactions yet</p>
                <small>Add your first transaction to get started</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recent.map(t => `
        <div class="transaction-item recent">
            <div class="transaction-icon">${getCategoryEmoji(t.category)}</div>
            <div class="transaction-details">
                <h4>${t.description}</h4>
                <p>${t.category} • ${formatDate(t.date)}</p>
            </div>
            <div class="transaction-amount ${t.type}">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </div>
        </div>
    `).join('');
}

function updateTransactionsList() {
    const container = document.getElementById('transactionsList');
    const filtered = getFilteredTransactions();
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📝</span>
                <p>No transactions found</p>
                <small>Try adjusting your filters or add a new transaction</small>
            </div>
        `;
        return;
    }
    
    // Group by date
    const grouped = {};
    filtered.forEach(t => {
        if (!grouped[t.date]) grouped[t.date] = [];
        grouped[t.date].push(t);
    });
    
    const sorted = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
    
    container.innerHTML = sorted.map(date => `
        <div class="transaction-group">
            <div class="transaction-date-header">
                <h3>${formatDateFull(date)}</h3>
                <span class="date-total">
                    ${formatCurrency(grouped[date].reduce((sum, t) => 
                        sum + (t.type === 'income' ? t.amount : -t.amount), 0
                    ))}
                </span>
            </div>
            <div class="transaction-items">
                ${grouped[date].map(t => `
                    <div class="transaction-item">
                        <input type="checkbox" class="transaction-checkbox" 
                               data-id="${t.id}" 
                               onchange="toggleTransactionSelection(${t.id}, this.checked)">
                        <div class="transaction-icon">${getCategoryEmoji(t.category)}</div>
                        <div class="transaction-details">
                            <h4>${t.description}</h4>
                            <p>${t.category}${t.isRecurring ? ' • 🔄 Recurring' : ''}</p>
                        </div>
                        <div class="transaction-amount ${t.type}">
                            ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                        </div>
                        <div class="transaction-actions">
                            <button class="btn-icon" onclick="editTransaction(${t.id})" title="Edit">
                                <span>✏️</span>
                            </button>
                            <button class="btn-icon" onclick="deleteTransaction(${t.id})" title="Delete">
                                <span>🗑️</span>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function updateCategoryFilter() {
    const select = document.getElementById('categoryFilter');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '<option value="all">All Categories</option>';
    
    const uniqueCategories = [...new Set(transactions.map(t => t.category))];
    uniqueCategories.sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = `${getCategoryEmoji(category)} ${category}`;
        select.appendChild(option);
    });
    
    if (currentValue) select.value = currentValue;
}

function updateBulkCategorySelect() {
    const select = document.getElementById('bulkCategory');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select category</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = `${cat.emoji} ${cat.name}`;
        select.appendChild(option);
    });
}

function updateBudgetCategorySelect() {
    const select = document.getElementById('budgetCategory');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select category</option>';
    
    const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');
    expenseCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = `${cat.emoji} ${cat.name}`;
        select.appendChild(option);
    });
}

// ===== CHARTS =====
function updateCategoryChart() {
    const period = document.getElementById('categoryPeriod')?.value || 'month';
    const canvas = document.getElementById('categoryChart');
    const emptyChart = document.getElementById('emptyCategoryChart');
    
    if (!canvas) return;
    
    let filtered = transactions.filter(t => t.type === 'expense');
    
    // Apply period filter
    const now = new Date();
    if (period === 'month') {
        const thisMonth = now.toISOString().slice(0, 7);
        filtered = filtered.filter(t => t.date.startsWith(thisMonth));
    } else if (period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
    }
    
    if (filtered.length === 0) {
        canvas.style.display = 'none';
        emptyChart.style.display = 'flex';
        return;
    }
    
    canvas.style.display = 'block';
    emptyChart.style.display = 'none';
    
    // Aggregate by category
    const categoryTotals = {};
    filtered.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = generateColors(labels.length);
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map(l => `${getCategoryEmoji(l)} ${l}`),
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: getComputedStyle(document.body)
                    .getPropertyValue('--bg-secondary')
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 },
                        color: getComputedStyle(document.body)
                            .getPropertyValue('--text-primary')
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function updateTrendChart() {
    const canvas = document.getElementById('trendChart');
    const emptyChart = document.getElementById('emptyTrendChart');
    
    if (!canvas) return;
    
    if (transactions.length === 0) {
        canvas.style.display = 'none';
        emptyChart.style.display = 'flex';
        return;
    }
    
    canvas.style.display = 'block';
    emptyChart.style.display = 'none';
    
    // Get last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(d.toISOString().slice(0, 7));
    }
    
    const incomeData = months.map(month => {
        return transactions
            .filter(t => t.type === 'income' && t.date.startsWith(month))
            .reduce((sum, t) => sum + t.amount, 0);
    });
    
    const expenseData = months.map(month => {
        return transactions
            .filter(t => t.type === 'expense' && t.date.startsWith(month))
            .reduce((sum, t) => sum + t.amount, 0);
    });
    
    const labels = months.map(m => {
        const d = new Date(m + '-01');
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    if (trendChart) {
        trendChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 12 },
                        color: getComputedStyle(document.body)
                            .getPropertyValue('--text-primary')
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => formatCurrency(value),
                        color: getComputedStyle(document.body)
                            .getPropertyValue('--text-secondary')
                    },
                    grid: {
                        color: getComputedStyle(document.body)
                            .getPropertyValue('--border-color')
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.body)
                            .getPropertyValue('--text-secondary')
                    },
                    grid: {
                        color: getComputedStyle(document.body)
                            .getPropertyValue('--border-color')
                    }
                }
            }
        }
    });
}

function generateColors(count) {
    const colors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
        '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'
    ];
    return Array(count).fill(null).map((_, i) => colors[i % colors.length]);
}

// ===== ANALYTICS =====
function updateAnalytics() {
    updateTopCategories();
    updateInsights();
    updateTrendChart();
}

function updateTopCategories() {
    const container = document.getElementById('topCategories');
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state-small">
                <p>No spending data yet</p>
            </div>
        `;
        return;
    }
    
    const categoryTotals = {};
    expenses.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    const sorted = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    container.innerHTML = `
        <div class="category-list">
            ${sorted.map(([category, amount], index) => {
                const percentage = (amount / totalExpenses * 100).toFixed(1);
                return `
                    <div class="category-rank-item">
                        <span class="rank">${index + 1}</span>
                        <div class="category-icon">${getCategoryEmoji(category)}</div>
                        <div class="category-details">
                            <div class="category-name">${category}</div>
                            <div class="category-bar">
                                <div class="category-bar-fill" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                        <div class="category-stats">
                            <div class="category-amount">${formatCurrency(amount)}</div>
                            <div class="category-percentage">${percentage}%</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function updateInsights() {
    const container = document.getElementById('insightsList');
    const insights = generateInsights();
    
    if (insights.length === 0) {
        container.innerHTML = `
            <div class="insight-item">
                <span class="insight-icon">💡</span>
                <p>Add more transactions to get personalized insights</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <span class="insight-icon">${insight.icon}</span>
            <p>${insight.text}</p>
        </div>
    `).join('');
}

function generateInsights() {
    const insights = [];
    
    if (transactions.length === 0) return insights;
    
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    
    // Insight 1: Balance status
    if (balance > 0) {
        const savingsRate = (balance / income * 100).toFixed(1);
        insights.push({
            icon: '🎉',
            text: `Great job! You're saving ${savingsRate}% of your income. Keep up the good work!`
        });
    } else if (balance < 0) {
        insights.push({
            icon: '⚠️',
            text: `Your expenses exceed your income by ${formatCurrency(Math.abs(balance))}. Consider reviewing your spending.`
        });
    }
    
    // Insight 2: Top expense category
    const expensesByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });
    
    const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
        const percentage = (topCategory[1] / expenses * 100).toFixed(1);
        insights.push({
            icon: '📊',
            text: `${topCategory[0]} is your biggest expense at ${formatCurrency(topCategory[1])} (${percentage}% of spending).`
        });
    }
    
    // Insight 3: Budget warnings
    const overBudget = budgets.filter(b => {
        const thisMonth = new Date().toISOString().slice(0, 7);
        const spent = transactions
            .filter(t => t.type === 'expense' && t.category === b.category && t.date.startsWith(thisMonth))
            .reduce((sum, t) => sum + t.amount, 0);
        return spent >= b.amount;
    });
    
    if (overBudget.length > 0) {
        insights.push({
            icon: '🚨',
            text: `You've exceeded ${overBudget.length} budget${overBudget.length > 1 ? 's' : ''} this month.`
        });
    }
    
    // Insight 4: Goals progress
    const nearGoals = goals.filter(g => {
        const percentage = (g.current / g.target) * 100;
        return percentage >= 80 && percentage < 100;
    });
    
    if (nearGoals.length > 0) {
        insights.push({
            icon: '🎯',
            text: `You're close to achieving ${nearGoals.length} goal${nearGoals.length > 1 ? 's' : ''}!`
        });
    }
    
    return insights;
}

// ===== EXPORT FUNCTIONS =====
function exportJSON() {
    if (transactions.length === 0) {
        showToast('No data to export!', 'error');
        return;
    }
    
    const data = {
        transactions,
        categories,
        budgets,
        goals,
        recurringTransactions,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    downloadFile(dataBlob, `financeflow-${getDateString()}.json`);
    
    closeModal('exportModal');
    showToast('Data exported successfully!', 'success');
}

function exportCSV() {
    if (transactions.length === 0) {
        showToast('No data to export!', 'error');
        return;
    }
    
    const headers = ['Date', 'Type', 'Description', 'Category', 'Amount', 'Recurring'];
    const rows = transactions.map(t => [
        t.date,
        t.type,
        t.description,
        t.category,
        t.amount,
        t.isRecurring ? 'Yes' : 'No'
    ]);
    
    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => 
            typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, `financeflow-transactions-${getDateString()}.csv`);
    
    closeModal('exportModal');
    showToast('CSV exported successfully!', 'success');
}

async function exportPDF() {
    if (transactions.length === 0) {
        showToast('No data to export!', 'error');
        return;
    }
    
    showLoading(true);
    closeModal('exportModal');
    
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;
        
        // Header
        pdf.setFontSize(20);
        pdf.setTextColor(99, 102, 241);
        pdf.text('FinanceFlow Monthly Statement', 20, 20);
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 28);
        
        // Summary
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Financial Summary', 20, 45);
        
        pdf.setFontSize(11);
        pdf.text(`Total Income: ${formatCurrency(income)}`, 25, 55);
        pdf.text(`Total Expenses: ${formatCurrency(expenses)}`, 25, 62);
        pdf.text(`Net Balance: ${formatCurrency(balance)}`, 25, 69);
        
        // Top Categories
        const categoryTotals = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        });
        
        const topCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        pdf.setFontSize(14);
        pdf.text('Top Spending Categories', 20, 85);
        
        pdf.setFontSize(10);
        let y = 95;
        topCategories.forEach(([category, amount], index) => {
            const percentage = ((amount / expenses) * 100).toFixed(1);
            pdf.text(`${index + 1}. ${category}: ${formatCurrency(amount)} (${percentage}%)`, 25, y);
            y += 7;
        });
        
        // Recent Transactions
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Recent Transactions', 20, 20);
        
        pdf.setFontSize(9);
        y = 30;
        const recentTransactions = transactions.slice(0, 30);
        
        recentTransactions.forEach(t => {
            if (y > 270) {
                pdf.addPage();
                y = 20;
            }
            
            const type = t.type === 'income' ? '+' : '-';
            const text = `${formatDate(t.date)} | ${t.description} | ${t.category} | ${type}${formatCurrency(t.amount)}`;
            pdf.text(text, 20, y);
            y += 7;
        });
        
        pdf.save(`financeflow-report-${getDateString()}.pdf`);
        showToast('PDF report generated successfully!', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('Error generating PDF', 'error');
    } finally {
        showLoading(false);
    }
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// ===== IMPORT =====
function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const content = event.target.result;
            let importedData;
            
            if (file.name.endsWith('.json')) {
                importedData = JSON.parse(content);
                
                if (importedData.transactions) {
                    // Full export format
                    if (confirm(`Import ${importedData.transactions.length} transactions and all data?`)) {
                        transactions = importedData.transactions || [];
                        categories = [...defaultCategories, ...(importedData.categories || []).filter(c => !c.isDefault)];
                        budgets = importedData.budgets || [];
                        goals = importedData.goals || [];
                        recurringTransactions = importedData.recurringTransactions || [];
                    }
                } else if (Array.isArray(importedData)) {
                    // Just transactions array
                    if (confirm(`Import ${importedData.length} transactions?`)) {
                        transactions = importedData;
                    }
                }
            } else if (file.name.endsWith('.csv')) {
                const lines = content.split('\n').filter(l => l.trim());
                const headers = lines[0].split(',');
                
                const imported = lines.slice(1).map(line => {
                    const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
                    const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
                    
                    return {
                        id: Date.now() + Math.random(),
                        date: cleanValues[0],
                        type: cleanValues[1],
                        description: cleanValues[2],
                        category: cleanValues[3],
                        amount: parseFloat(cleanValues[4]) || 0,
                        isRecurring: cleanValues[5] === 'Yes',
                        createdAt: new Date().toISOString()
                    };
                });
                
                if (confirm(`Import ${imported.length} transactions from CSV?`)) {
                    transactions = [...transactions, ...imported];
                }
            }
            
            saveToLocalStorage();
            updateUI();
            systemHealthCheck();
            showToast('Data imported successfully!', 'success');
        } catch (error) {
            console.error('Import error:', error);
            showToast('Error importing data!', 'error');
        }
    };
    
    reader.readAsText(file);
    e.target.value = '';
}

// ===== MODAL MANAGEMENT =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDateFull(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
}

function getDateString() {
    return new Date().toISOString().split('T')[0];
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 4000);
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toastIcon.textContent = icons[type] || icons.success;
    toastMessage.textContent = message;
    toast.className = `toast ${type} active`;
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

// ===== LOCAL STORAGE =====
function saveToLocalStorage() {
    try {
        localStorage.setItem('financeflow_transactions', JSON.stringify(transactions));
        localStorage.setItem('financeflow_categories', JSON.stringify(categories));
        localStorage.setItem('financeflow_budgets', JSON.stringify(budgets));
        localStorage.setItem('financeflow_goals', JSON.stringify(goals));
        localStorage.setItem('financeflow_recurring', JSON.stringify(recurringTransactions));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showToast('Error saving data', 'error');
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('financeflow_transactions');
        if (saved) transactions = JSON.parse(saved);
        
        const savedCategories = localStorage.getItem('financeflow_categories');
        if (savedCategories) categories = JSON.parse(savedCategories);
        
        const savedBudgets = localStorage.getItem('financeflow_budgets');
        if (savedBudgets) budgets = JSON.parse(savedBudgets);
        
        const savedGoals = localStorage.getItem('financeflow_goals');
        if (savedGoals) goals = JSON.parse(savedGoals);
        
        const savedRecurring = localStorage.getItem('financeflow_recurring');
        if (savedRecurring) recurringTransactions = JSON.parse(savedRecurring);
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// ===== GLOBAL FUNCTION EXPOSURE =====
window.deleteTransaction = deleteTransaction;
window.editTransaction = editTransaction;
window.toggleTransactionSelection = toggleTransactionSelection;
window.selectSuggestion = selectSuggestion;
window.closeModal = closeModal;
window.deleteRecurring = deleteRecurring;
window.deleteBudget = deleteBudget;
window.deleteGoal = deleteGoal;
window.updateGoalProgress = updateGoalProgress;
window.deleteCategory = deleteCategory;