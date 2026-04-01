import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight,
  ShoppingBag, BarChart3, Store,
} from 'lucide-react';
import { StatCard, ChartContainer } from '../components/Dashboard';
import { StatCardSkeleton, ChartSkeleton } from '../components/Dashboard/SkeletonLoader';
import useStore from '../store/useStore';
import {
  balanceTrend,
  spendingBreakdown,
  insights,
} from '../data/mockData';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const formatCurrencyFull = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="border rounded-xl px-3 py-2 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-input)',
        }}
      >
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrencyFull(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="border rounded-xl px-3 py-2 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-input)',
        }}
      >
        <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{payload[0].name}</p>
        <p className="text-sm font-bold text-indigo-400">{formatCurrencyFull(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const isLoading = useStore((s) => s.isLoading);
  const transactions = useStore((s) => s.transactions);

  const currentTotals = useMemo(() => {
    const currentMonth = transactions.filter(t => t.date.startsWith('2026-03'));
    const income = currentMonth.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
    const expenses = currentMonth.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2"><ChartSkeleton /></div>
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Your financial overview for March 2026</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(currentTotals.balance)}
          icon={Wallet}
          trend={8.2}
          trendLabel="vs last month"
          color="primary"
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(currentTotals.income)}
          icon={TrendingUp}
          trend={15.3}
          trendLabel="vs last month"
          color="success"
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(currentTotals.expenses)}
          icon={TrendingDown}
          trend={insights.expenseChange}
          trendLabel="vs last month"
          color="danger"
        />
        <StatCard
          title="Savings Rate"
          value={`${Math.round((currentTotals.balance / currentTotals.income) * 100)}%`}
          icon={ArrowUpRight}
          trend={3.1}
          trendLabel="improvement"
          color="secondary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Balance Trend Chart */}
        <ChartContainer
          title="Balance Trend"
          subtitle="30-day balance fluctuations"
          className="xl:col-span-2"
        >
          <AreaChart data={balanceTrend} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={50}
            />
            <RechartsTooltip content={<CustomAreaTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#6366f1', stroke: '#18181b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ChartContainer>

        {/* Spending Breakdown Pie Chart */}
        <ChartContainer
          title="Spending Breakdown"
          subtitle="By category this month"
        >
          <PieChart>
            <Pie
              data={spendingBreakdown}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {spendingBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomPieTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ChartContainer>
      </div>

      {/* Insights Row */}
      <div>
        <h3 
          className="text-sm font-semibold mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Highest Spending"
            value={insights.highestCategory.name}
            icon={ShoppingBag}
            color="warning"
          />
          <StatCard
            title="Monthly Change"
            value={`${insights.expenseChange >= 0 ? '+' : ''}${insights.expenseChange}%`}
            icon={BarChart3}
            color={insights.expenseChange >= 0 ? 'danger' : 'success'}
          />
          <StatCard
            title="Top Merchant"
            value={insights.topMerchant.name}
            icon={Store}
            color="secondary"
          />
        </div>
      </div>
    </div>
  );
}
