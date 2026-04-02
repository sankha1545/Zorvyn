import { useMemo, useEffect } from 'react';
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
  const analytics = useStore((s) => s.analytics);
  const analyticsLoading = useStore((s) => s.analyticsLoading);
  const analyticsError = useStore((s) => s.analyticsError);
  const fetchAnalytics = useStore((s) => s.fetchAnalytics);

  // Fetch analytics on component mount and on demand
  useEffect(() => {
    const loadAnalytics = async () => {
      console.log('Dashboard: Fetching analytics...', { analytics, analyticsLoading, analyticsError });
      if (!analytics || analyticsError) {
        try {
          await fetchAnalytics();
        } catch (error) {
          console.error('Failed to fetch analytics:', error);
        }
      }
    };

    loadAnalytics();
  }, []); // Run once on mount

  // Extract analytics data safely
  const analyticsData = useMemo(() => {
    console.log('Computing analytics data:', { analytics, analyticsLoading, analyticsError });
    
    if (!analytics) {
      console.log('No analytics data available yet');
      return {
        currentTotals: { income: 0, expenses: 0, balance: 0 },
        balanceTrend: [],
        spendingBreakdown: [],
        insights: {
          topCategory: 'N/A',
          topCategoryAmount: 0,
          topMerchant: 'N/A',
          topMerchantAmount: 0,
          expenseChange: 0,
          savingsRate: 0,
        },
      };
    }

    // analytics is stored directly as the data payload from response.data
    const { currentMonth, balanceTrend, spendingBreakdown, insights } = analytics;

    console.log('Analytics extracted:', {
      currentMonth,
      balanceTrendCount: balanceTrend?.length,
      spendingBreakdownCount: spendingBreakdown?.length,
      insights,
    });

    return {
      currentTotals: currentMonth || { income: 0, expenses: 0, balance: 0 },
      balanceTrend: balanceTrend || [],
      spendingBreakdown: spendingBreakdown || [],
      insights: insights || {},
    };
  }, [analytics]);

  const isLoaded = !isLoading && !analyticsLoading && analytics;

  if (isLoading || (analyticsLoading && !analytics)) {
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

  if (analyticsError) {
    return (
      <div className="p-4 lg:p-6">
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p style={{ color: 'var(--text-primary)' }} className="font-semibold">
            Error Loading Dashboard
          </p>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-1">
            {analyticsError}
          </p>
          <button
            onClick={() => fetchAnalytics()}
            className="mt-3 px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: '#6366f1',
              color: 'white',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add colors to spending breakdown for pie chart
  const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ef4444', '#14b8a6'];
  const spendingWithColors = (analyticsData.spendingBreakdown || []).map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
  }));

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
          value={formatCurrency(analyticsData.currentTotals.balance)}
          icon={Wallet}
          trend={analyticsData.insights.expenseChange || 0}
          trendLabel="vs last month"
          color="primary"
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(analyticsData.currentTotals.income)}
          icon={TrendingUp}
          trend={15.3}
          trendLabel="vs last month"
          color="success"
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(analyticsData.currentTotals.expenses)}
          icon={TrendingDown}
          trend={analyticsData.insights.expenseChange || 0}
          trendLabel="vs last month"
          color="danger"
        />
        <StatCard
          title="Savings Rate"
          value={`${analyticsData.insights.savingsRate || 0}%`}
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
          <AreaChart data={analyticsData.balanceTrend} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
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
          {spendingWithColors.length > 0 ? (
            <PieChart>
              <Pie
                data={spendingWithColors}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {spendingWithColors.map((entry, index) => (
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
          ) : (
            <div className="flex items-center justify-center h-64">
              <p style={{ color: 'var(--text-muted)' }}>No expense data available</p>
            </div>
          )}
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
            value={analyticsData.insights.topCategory || 'N/A'}
            subtitle={`$${formatCurrencyFull(analyticsData.insights.topCategoryAmount || 0)}`}
            icon={ShoppingBag}
            color="warning"
          />
          <StatCard
            title="Monthly Change"
            value={`${analyticsData.insights.expenseChange >= 0 ? '+' : ''}${analyticsData.insights.expenseChange || 0}%`}
            icon={BarChart3}
            color={analyticsData.insights.expenseChange >= 0 ? 'danger' : 'success'}
          />
          <StatCard
            title="Top Merchant"
            value={analyticsData.insights.topMerchant || 'N/A'}
            subtitle={`$${formatCurrencyFull(analyticsData.insights.topMerchantAmount || 0)}`}
            icon={Store}
            color="secondary"
          />
        </div>
      </div>
    </div>
  );
}
