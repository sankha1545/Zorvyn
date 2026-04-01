// FinTrack Mock Data - All transaction and chart data

export const categories = [
  'Food & Dining',
  'Rent & Housing',
  'Entertainment',
  'Transportation',
  'Shopping',
  'Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Salary',
  'Freelance',
  'Investment',
];

export const merchants = [
  'Amazon', 'Whole Foods', 'Netflix', 'Spotify', 'Uber',
  'Starbucks', 'Apple Store', 'Electric Co.', 'Water Works',
  'City Fitness', 'Airbnb', 'Delta Airlines', 'CVS Pharmacy',
  'Target', 'Trader Joe\'s', 'Google Workspace', 'Acme Corp',
  'Freelance Client A', 'Freelance Client B', 'Stock Dividend',
  'T-Mobile', 'Chipotle', 'Home Depot', 'Costco',
];

const statuses = ['Completed', 'Pending'];

function generateTransactions() {
  const transactions = [];
  const now = new Date(2026, 2, 31); // March 31, 2026

  // Current month transactions (March 2026)
  const currentMonthTx = [
    { date: '2026-03-01', desc: 'Monthly Salary', amount: 8500, cat: 'Salary', type: 'Income', merchant: 'Acme Corp', status: 'Completed' },
    { date: '2026-03-02', desc: 'Rent Payment', amount: 2200, cat: 'Rent & Housing', type: 'Expense', merchant: 'Landlord', status: 'Completed' },
    { date: '2026-03-03', desc: 'Grocery Shopping', amount: 156.43, cat: 'Food & Dining', type: 'Expense', merchant: 'Whole Foods', status: 'Completed' },
    { date: '2026-03-04', desc: 'Netflix Subscription', amount: 15.99, cat: 'Entertainment', type: 'Expense', merchant: 'Netflix', status: 'Completed' },
    { date: '2026-03-05', desc: 'Uber Ride', amount: 24.50, cat: 'Transportation', type: 'Expense', merchant: 'Uber', status: 'Completed' },
    { date: '2026-03-06', desc: 'Freelance Project', amount: 2500, cat: 'Freelance', type: 'Income', merchant: 'Freelance Client A', status: 'Completed' },
    { date: '2026-03-07', desc: 'Coffee & Snacks', amount: 18.75, cat: 'Food & Dining', type: 'Expense', merchant: 'Starbucks', status: 'Completed' },
    { date: '2026-03-08', desc: 'Electric Bill', amount: 142.30, cat: 'Utilities', type: 'Expense', merchant: 'Electric Co.', status: 'Completed' },
    { date: '2026-03-09', desc: 'Online Shopping', amount: 89.99, cat: 'Shopping', type: 'Expense', merchant: 'Amazon', status: 'Completed' },
    { date: '2026-03-10', desc: 'Gym Membership', amount: 49.99, cat: 'Healthcare', type: 'Expense', merchant: 'City Fitness', status: 'Completed' },
    { date: '2026-03-11', desc: 'Spotify Premium', amount: 9.99, cat: 'Entertainment', type: 'Expense', merchant: 'Spotify', status: 'Completed' },
    { date: '2026-03-12', desc: 'Gas Station', amount: 52.00, cat: 'Transportation', type: 'Expense', merchant: 'Shell', status: 'Completed' },
    { date: '2026-03-13', desc: 'Dinner Out', amount: 78.50, cat: 'Food & Dining', type: 'Expense', merchant: 'Chipotle', status: 'Completed' },
    { date: '2026-03-14', desc: 'Stock Dividend', amount: 125.00, cat: 'Investment', type: 'Income', merchant: 'Stock Dividend', status: 'Completed' },
    { date: '2026-03-15', desc: 'Freelance Project B', amount: 1800, cat: 'Freelance', type: 'Income', merchant: 'Freelance Client B', status: 'Completed' },
    { date: '2026-03-16', desc: 'Phone Bill', amount: 85.00, cat: 'Utilities', type: 'Expense', merchant: 'T-Mobile', status: 'Completed' },
    { date: '2026-03-17', desc: 'Home Supplies', amount: 134.25, cat: 'Shopping', type: 'Expense', merchant: 'Home Depot', status: 'Completed' },
    { date: '2026-03-18', desc: 'Water Bill', amount: 45.00, cat: 'Utilities', type: 'Expense', merchant: 'Water Works', status: 'Completed' },
    { date: '2026-03-19', desc: 'Costco Bulk Buy', amount: 267.80, cat: 'Food & Dining', type: 'Expense', merchant: 'Costco', status: 'Completed' },
    { date: '2026-03-20', desc: 'Online Course', amount: 199.99, cat: 'Education', type: 'Expense', merchant: 'Udemy', status: 'Completed' },
    { date: '2026-03-21', desc: 'Target Shopping', amount: 95.40, cat: 'Shopping', type: 'Expense', merchant: 'Target', status: 'Completed' },
    { date: '2026-03-22', desc: 'Doctor Visit', amount: 150.00, cat: 'Healthcare', type: 'Expense', merchant: 'CVS Pharmacy', status: 'Pending' },
    { date: '2026-03-23', desc: 'Google Workspace', amount: 12.00, cat: 'Utilities', type: 'Expense', merchant: 'Google Workspace', status: 'Completed' },
    { date: '2026-03-24', desc: 'Weekend Groceries', amount: 98.60, cat: 'Food & Dining', type: 'Expense', merchant: 'Trader Joe\'s', status: 'Completed' },
    { date: '2026-03-25', desc: 'Movie Tickets', amount: 32.00, cat: 'Entertainment', type: 'Expense', merchant: 'AMC Theaters', status: 'Completed' },
    { date: '2026-03-26', desc: 'Uber Ride', amount: 18.75, cat: 'Transportation', type: 'Expense', merchant: 'Uber', status: 'Completed' },
    { date: '2026-03-27', desc: 'Apple Store Purchase', amount: 249.00, cat: 'Shopping', type: 'Expense', merchant: 'Apple Store', status: 'Pending' },
    { date: '2026-03-28', desc: 'Lunch Meeting', amount: 45.00, cat: 'Food & Dining', type: 'Expense', merchant: 'Starbucks', status: 'Completed' },
    { date: '2026-03-29', desc: 'Flight Booking', amount: 385.00, cat: 'Travel', type: 'Expense', merchant: 'Delta Airlines', status: 'Pending' },
    { date: '2026-03-30', desc: 'Airbnb Reservation', amount: 420.00, cat: 'Travel', type: 'Expense', merchant: 'Airbnb', status: 'Pending' },
    { date: '2026-03-31', desc: 'Grocery Run', amount: 67.25, cat: 'Food & Dining', type: 'Expense', merchant: 'Whole Foods', status: 'Completed' },
  ];

  // Previous month transactions (February 2026)
  const prevMonthTx = [
    { date: '2026-02-01', desc: 'Monthly Salary', amount: 8500, cat: 'Salary', type: 'Income', merchant: 'Acme Corp', status: 'Completed' },
    { date: '2026-02-02', desc: 'Rent Payment', amount: 2200, cat: 'Rent & Housing', type: 'Expense', merchant: 'Landlord', status: 'Completed' },
    { date: '2026-02-04', desc: 'Grocery Shopping', amount: 189.30, cat: 'Food & Dining', type: 'Expense', merchant: 'Whole Foods', status: 'Completed' },
    { date: '2026-02-05', desc: 'Netflix Subscription', amount: 15.99, cat: 'Entertainment', type: 'Expense', merchant: 'Netflix', status: 'Completed' },
    { date: '2026-02-06', desc: 'Gas Station', amount: 48.00, cat: 'Transportation', type: 'Expense', merchant: 'Shell', status: 'Completed' },
    { date: '2026-02-08', desc: 'Electric Bill', amount: 158.45, cat: 'Utilities', type: 'Expense', merchant: 'Electric Co.', status: 'Completed' },
    { date: '2026-02-10', desc: 'Freelance Project', amount: 1500, cat: 'Freelance', type: 'Income', merchant: 'Freelance Client A', status: 'Completed' },
    { date: '2026-02-12', desc: 'Online Shopping', amount: 210.50, cat: 'Shopping', type: 'Expense', merchant: 'Amazon', status: 'Completed' },
    { date: '2026-02-14', desc: "Valentine's Dinner", amount: 145.00, cat: 'Food & Dining', type: 'Expense', merchant: 'Fancy Restaurant', status: 'Completed' },
    { date: '2026-02-15', desc: 'Stock Dividend', amount: 110.00, cat: 'Investment', type: 'Income', merchant: 'Stock Dividend', status: 'Completed' },
    { date: '2026-02-16', desc: 'Phone Bill', amount: 85.00, cat: 'Utilities', type: 'Expense', merchant: 'T-Mobile', status: 'Completed' },
    { date: '2026-02-18', desc: 'Gym Membership', amount: 49.99, cat: 'Healthcare', type: 'Expense', merchant: 'City Fitness', status: 'Completed' },
    { date: '2026-02-19', desc: 'Spotify Premium', amount: 9.99, cat: 'Entertainment', type: 'Expense', merchant: 'Spotify', status: 'Completed' },
    { date: '2026-02-20', desc: 'Target Shopping', amount: 76.20, cat: 'Shopping', type: 'Expense', merchant: 'Target', status: 'Completed' },
    { date: '2026-02-22', desc: 'Uber Rides', amount: 35.50, cat: 'Transportation', type: 'Expense', merchant: 'Uber', status: 'Completed' },
    { date: '2026-02-24', desc: 'Water Bill', amount: 42.00, cat: 'Utilities', type: 'Expense', merchant: 'Water Works', status: 'Completed' },
    { date: '2026-02-25', desc: 'Costco Shopping', amount: 234.15, cat: 'Food & Dining', type: 'Expense', merchant: 'Costco', status: 'Completed' },
    { date: '2026-02-27', desc: 'Google Workspace', amount: 12.00, cat: 'Utilities', type: 'Expense', merchant: 'Google Workspace', status: 'Completed' },
    { date: '2026-02-28', desc: 'Movie Night', amount: 28.00, cat: 'Entertainment', type: 'Expense', merchant: 'AMC Theaters', status: 'Completed' },
  ];

  let id = 1;
  for (const tx of [...currentMonthTx, ...prevMonthTx]) {
    transactions.push({
      id: id++,
      date: tx.date,
      description: tx.desc,
      amount: tx.amount,
      category: tx.cat,
      type: tx.type,
      merchant: tx.merchant,
      status: tx.status,
    });
  }

  return transactions;
}

export const transactions = generateTransactions();

// Generate 30-day balance trend data
export function generateBalanceTrend() {
  const data = [];
  let balance = 24500; // Starting balance

  for (let i = 30; i >= 0; i--) {
    const date = new Date(2026, 2, 31);
    date.setDate(date.getDate() - i);

    const dayStr = date.toISOString().split('T')[0];
    const dayTx = transactions.filter(t => t.date === dayStr);

    for (const tx of dayTx) {
      if (tx.type === 'Income') balance += tx.amount;
      else balance -= tx.amount;
    }

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: dayStr,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return data;
}

// Generate spending breakdown by category (current month expenses only)
export function generateSpendingBreakdown() {
  const currentMonthExpenses = transactions.filter(
    t => t.type === 'Expense' && t.date.startsWith('2026-03')
  );

  const categoryMap = {};
  for (const tx of currentMonthExpenses) {
    categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
  }

  const colors = [
    '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd',
    '#818cf8', '#6d28d9', '#5b21b6', '#4c1d95',
    '#7c3aed', '#4f46e5', '#e879f9', '#f472b6',
  ];

  return Object.entries(categoryMap)
    .map(([name, value], i) => ({
      name,
      value: Math.round(value * 100) / 100,
      color: colors[i % colors.length],
    }))
    .sort((a, b) => b.value - a.value);
}

// Calculate monthly totals
export function getMonthlyTotals(monthPrefix) {
  const monthTx = transactions.filter(t => t.date.startsWith(monthPrefix));
  const income = monthTx.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
  return { income, expenses, net: income - expenses };
}

// Get insights
export function getInsights() {
  const currentMonth = getMonthlyTotals('2026-03');
  const prevMonth = getMonthlyTotals('2026-02');

  // Highest spending category
  const breakdown = generateSpendingBreakdown();
  const highestCategory = breakdown[0] || { name: 'N/A', value: 0 };

  // Monthly comparison
  const expenseChange = prevMonth.expenses > 0
    ? ((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses * 100)
    : 0;

  // Top merchant
  const currentExpenses = transactions.filter(
    t => t.type === 'Expense' && t.date.startsWith('2026-03')
  );
  const merchantCount = {};
  for (const tx of currentExpenses) {
    merchantCount[tx.merchant] = (merchantCount[tx.merchant] || 0) + 1;
  }
  const topMerchant = Object.entries(merchantCount)
    .sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

  return {
    highestCategory,
    expenseChange: Math.round(expenseChange * 10) / 10,
    topMerchant: { name: topMerchant[0], count: topMerchant[1] },
    currentMonth,
    prevMonth,
  };
}

export const balanceTrend = generateBalanceTrend();
export const spendingBreakdown = generateSpendingBreakdown();
export const insights = getInsights();
