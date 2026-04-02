/**
 * FinTrack Mock Backend Server
 * Serves API endpoints and manages JSON file persistence
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'server', 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read database
const readDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { transactions: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return { transactions: [] };
  }
};

// Helper function to write database
const writeDb = (data) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing DB:', error);
  }
};

// ==================== TRANSACTION ENDPOINTS ====================

/**
 * GET /api/transactions
 * Fetch all transactions
 */
app.get('/api/transactions', (req, res) => {
  try {
    const db = readDb();
    res.json({
      success: true,
      data: {
        transactions: db.transactions || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch transactions' },
    });
  }
});

/**
 * POST /api/transactions
 * Create a new transaction
 */
app.post('/api/transactions', (req, res) => {
  try {
    const db = readDb();
    const { date, description, amount, category, type, merchant, status } = req.body;

    // Validation
    if (!date || !description || !amount || !category || !type || !merchant) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' },
      });
    }

    // Generate new ID
    const maxId = Math.max(
      0,
      ...db.transactions.map(t => t.id || 0)
    );
    const newId = maxId + 1;

    // Create new transaction
    const newTransaction = {
      id: newId,
      date,
      description,
      amount: parseFloat(amount),
      category,
      type,
      merchant,
      status: status || 'Completed',
      createdAt: new Date().toISOString(),
    };

    // Add to database
    db.transactions.push(newTransaction);
    writeDb(db);

    res.status(201).json({
      success: true,
      data: {
        transaction: newTransaction,
      },
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create transaction' },
    });
  }
});

/**
 * PUT /api/transactions/:id
 * Update a transaction
 */
app.put('/api/transactions/:id', (req, res) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const { date, description, amount, category, type, merchant, status } = req.body;

    // Find transaction
    const transactionIndex = db.transactions.findIndex(t => t.id === parseInt(id));
    if (transactionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { message: 'Transaction not found' },
      });
    }

    // Update transaction
    const updatedTransaction = {
      ...db.transactions[transactionIndex],
      date: date || db.transactions[transactionIndex].date,
      description: description || db.transactions[transactionIndex].description,
      amount: amount !== undefined ? parseFloat(amount) : db.transactions[transactionIndex].amount,
      category: category || db.transactions[transactionIndex].category,
      type: type || db.transactions[transactionIndex].type,
      merchant: merchant || db.transactions[transactionIndex].merchant,
      status: status || db.transactions[transactionIndex].status,
      updatedAt: new Date().toISOString(),
    };

    db.transactions[transactionIndex] = updatedTransaction;
    writeDb(db);

    res.json({
      success: true,
      data: {
        transaction: updatedTransaction,
      },
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update transaction' },
    });
  }
});

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
app.delete('/api/transactions/:id', (req, res) => {
  try {
    const db = readDb();
    const { id } = req.params;

    // Find transaction
    const transactionIndex = db.transactions.findIndex(t => t.id === parseInt(id));
    if (transactionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { message: 'Transaction not found' },
      });
    }

    // Delete transaction
    const deletedTransaction = db.transactions[transactionIndex];
    db.transactions.splice(transactionIndex, 1);
    writeDb(db);

    res.json({
      success: true,
      data: {
        transaction: deletedTransaction,
      },
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete transaction' },
    });
  }
});

/**
 * GET /api/analytics
 * Get comprehensive analytics data
 */
app.get('/api/analytics', (req, res) => {
  try {
    console.log('[Analytics] Request received');
    const db = readDb();
    const transactions = db.transactions || [];
    console.log('[Analytics] Total transactions:', transactions.length);

    // Get current month (March 2026)
    const currentMonth = transactions.filter(t => t.date.startsWith('2026-03'));
    const currentIncome = currentMonth
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const currentExpenses = currentMonth
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Get previous month for comparison (February 2026)
    const previousMonth = transactions.filter(t => t.date.startsWith('2026-02'));
    const previousExpenses = previousMonth
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Calculate daily balance trend
    const dailyBalance = {};
    transactions.forEach(t => {
      const amount = parseFloat(t.amount);
      const type = t.type;
      
      if (!dailyBalance[t.date]) {
        dailyBalance[t.date] = 0;
      }
      
      dailyBalance[t.date] += type === 'Income' ? amount : -amount;
    });

    // Convert to cumulative balance
    let cumulativeBalance = 0;
    const balanceTrend = Object.entries(dailyBalance)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, dailyChange]) => {
        cumulativeBalance += dailyChange;
        return {
          date: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          balance: cumulativeBalance,
          fullDate: date,
        };
      });

    // Spending breakdown by category
    const spendingByCategory = {};
    currentMonth
      .filter(t => t.type === 'Expense')
      .forEach(t => {
        const category = t.category || 'Other';
        if (!spendingByCategory[category]) {
          spendingByCategory[category] = 0;
        }
        spendingByCategory[category] += parseFloat(t.amount);
      });

    const spendingBreakdown = Object.entries(spendingByCategory)
      .map(([category, amount]) => ({
        name: category,
        value: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);

    // Calculate insights
    const topCategory = spendingBreakdown.length > 0 ? spendingBreakdown[0] : { name: 'N/A', value: 0 };
    
    // Find top merchant
    const merchantSpending = {};
    currentMonth.forEach(t => {
      const merchant = t.merchant || 'Unknown';
      if (!merchantSpending[merchant]) {
        merchantSpending[merchant] = 0;
      }
      merchantSpending[merchant] += parseFloat(t.amount);
    });

    const topMerchant = Object.entries(merchantSpending)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }))[0] || { name: 'N/A', value: 0 };

    // Calculate expense change percentage
    const expenseChange = previousExpenses > 0
      ? (((currentExpenses - previousExpenses) / previousExpenses) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        currentMonth: {
          income: parseFloat(currentIncome.toFixed(2)),
          expenses: parseFloat(currentExpenses.toFixed(2)),
          balance: parseFloat((currentIncome - currentExpenses).toFixed(2)),
        },
        previousMonth: {
          expenses: parseFloat(previousExpenses.toFixed(2)),
        },
        balanceTrend,
        spendingBreakdown,
        insights: {
          topCategory: topCategory.name,
          topCategoryAmount: topCategory.value,
          topMerchant: topMerchant.name,
          topMerchantAmount: topMerchant.value,
          expenseChange: parseFloat(expenseChange),
          savingsRate: currentIncome > 0 
            ? Math.round(((currentIncome - currentExpenses) / currentIncome) * 100)
            : 0,
        },
        transactionCount: transactions.length,
        currentMonthCount: currentMonth.length,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch analytics' },
    });
  }
});

/**
 * POST /api/reset
 * Reset database to initial state
 */
app.post('/api/reset', (req, res) => {
  try {
    // Read initial data from seed file if it exists
    const seedFile = path.join(__dirname, 'server', 'seed.json');
    let initialData = { transactions: [] };

    if (fs.existsSync(seedFile)) {
      const seedContent = fs.readFileSync(seedFile, 'utf8');
      initialData = JSON.parse(seedContent);
    }

    writeDb(initialData);

    res.json({
      success: true,
      data: {
        message: 'Database reset successfully',
        transactions: initialData.transactions,
      },
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to reset database' },
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: { message: 'Internal server error' },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FinTrack Backend Server running on http://localhost:${PORT}`);
  console.log(`📁 Database file: ${DB_FILE}`);
  console.log(`✅ Ready for API requests`);
});
