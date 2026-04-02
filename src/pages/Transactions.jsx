import { useState, useMemo, useEffect } from 'react';
import { Tooltip } from '@heroui/react';
import { Plus, Download, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import useStore from '../store/useStore';
import RoleGuard from '../components/RoleGuard';
import Toast from '../components/Toast';
import CreateModal from '../components/Modal/CreateModal';
import EditModal from '../components/Modal/EditModal';
import DeleteModal from '../components/Modal/DeleteModal';
import { Button } from '../components/ui';
import {
  TransactionSearch,
  TransactionFilter,
  TransactionTable,
  TransactionPagination,
} from '../components/Transactions';
import { categories } from '../data/mockData';
import { exportToCSV, formatDateForCSV, formatCurrencyForCSV } from '../utils/csvExport';

const typeOptions = ['All', 'Income', 'Expense'];
const statusOptions = ['All', 'Completed', 'Pending'];
const categoryOptions = ['All', ...categories];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);

const formatDate = (dateStr) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '',
  category: '',
  type: 'Expense',
  merchant: '',
  status: 'Completed',
};

export default function Transactions() {
  const transactions = useStore((s) => s.transactions);
  const addTransaction = useStore((s) => s.addTransaction);
  const updateTransaction = useStore((s) => s.updateTransaction);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const globalSearch = useStore((s) => s.globalSearch);
  const role = useStore((s) => s.role);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Advanced Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [merchantFilter, setMerchantFilter] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  // Show viewer mode toast on role change
  useEffect(() => {
    if (role === 'viewer') {
      setToast({ message: '👁️ You are in View-Only mode. Export only.', type: 'info' });
    }
  }, [role]);

  const activeSearch = globalSearch || search;

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    
    // Search filter  
    if (activeSearch) {
      const s = activeSearch.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(s) ||
        t.merchant.toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s)
      );
    }
    
    // Type filter
    if (typeFilter !== 'All') result = result.filter(t => t.type === typeFilter);
    
    // Category filter
    if (categoryFilter !== 'All') result = result.filter(t => t.category === categoryFilter);
    
    // Status filter
    if (statusFilter !== 'All') result = result.filter(t => t.status === statusFilter);
    
    // Date range filter
    if (dateFrom) result = result.filter(t => t.date >= dateFrom);
    if (dateTo) result = result.filter(t => t.date <= dateTo);
    
    // Amount range filter
    if (minAmount) result = result.filter(t => parseFloat(t.amount) >= parseFloat(minAmount));
    if (maxAmount) result = result.filter(t => parseFloat(t.amount) <= parseFloat(maxAmount));
    
    // Merchant filter
    if (merchantFilter) {
      const m = merchantFilter.toLowerCase();
      result = result.filter(t => t.merchant.toLowerCase().includes(m));
    }

    // Sorting
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'amount') cmp = a.amount - b.amount;
      else if (sortField === 'description') cmp = a.description.localeCompare(b.description);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [transactions, activeSearch, typeFilter, categoryFilter, statusFilter, dateFrom, dateTo, minAmount, maxAmount, merchantFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const paginatedTransactions = filteredTransactions.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('desc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} style={{ color: 'var(--text-muted)' }} />;
    return sortDirection === 'asc'
      ? <ArrowUp size={12} className="text-indigo-400" />
      : <ArrowDown size={12} className="text-indigo-400" />;
  };

  const handleOpenAdd = () => { setFormData(emptyForm); setEditingId(null); setIsModalOpen(true); };
  const handleOpenEdit = (tx) => {
    setFormData({ date: tx.date, description: tx.description, amount: String(tx.amount), category: tx.category, type: tx.type, merchant: tx.merchant, status: tx.status });
    setEditingId(tx.id);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const data = { ...formData, amount: parseFloat(formData.amount) || 0 };
    if (editingId) {
      updateTransaction(editingId, data);
      setToast({ message: '✏️ Transaction updated successfully', type: 'success' });
    } else {
      addTransaction(data);
      setToast({ message: '✅ Transaction added successfully', type: 'success' });
    }
    setIsModalOpen(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleDeleteConfirm = (id) => { setDeletingId(id); setIsDeleteModalOpen(true); };
  const handleDelete = () => {
    if (deletingId) deleteTransaction(deletingId);
    setToast({ message: '🗑️ Transaction deleted successfully', type: 'delete' });
    setIsDeleteModalOpen(false);
    setDeletingId(null);
  };

  const clearFilters = () => { 
    setSearch(''); 
    setTypeFilter('All'); 
    setCategoryFilter('All'); 
    setStatusFilter('All');
    setDateFrom('');
    setDateTo('');
    setMinAmount('');
    setMaxAmount('');
    setMerchantFilter('');
    setPage(1); 
  };
  const hasActiveFilters = search || typeFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'All' || dateFrom || dateTo || minAmount || maxAmount || merchantFilter;

  const handleExportCSV = () => {
    const dataToExport = filteredTransactions.map(tx => ({
      Date: formatDateForCSV(tx.date),
      Description: tx.description,
      Merchant: tx.merchant,
      Category: tx.category,
      Amount: formatCurrencyForCSV(tx.amount),
      Type: tx.type,
      Status: tx.status,
    }));

    const timestamp = new Date().toISOString().split('T')[0];
    exportToCSV(dataToExport, `transactions_${timestamp}.csv`);
    setToast({ message: '📥 CSV exported successfully', type: 'export' });
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Transactions</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </Button>
          <RoleGuard requiredRole="admin">
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Transaction
            </Button>
          </RoleGuard>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <TransactionSearch
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <TransactionFilter
          typeFilter={typeFilter}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          onTypeChange={(value) => {
            setTypeFilter(value);
            setPage(1);
          }}
          onCategoryChange={(value) => {
            setCategoryFilter(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          onClearFilters={clearFilters}
          typeOptions={typeOptions}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
          hasActiveFilters={hasActiveFilters}
        />
        
        {/* Advanced Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 rounded border text-sm"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 rounded border text-sm"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Min Amount</label>
            <input
              type="number"
              placeholder="0"
              value={minAmount}
              onChange={(e) => {
                setMinAmount(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 rounded border text-sm"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Max Amount</label>
            <input
              type="number"
              placeholder="∞"
              value={maxAmount}
              onChange={(e) => {
                setMaxAmount(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 rounded border text-sm"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Merchant</label>
            <input
              type="text"
              placeholder="Search..."
              value={merchantFilter}
              onChange={(e) => {
                setMerchantFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-1.5 rounded border text-sm"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                🔍 Active Filters:
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  color: '#ef4444',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bg-surface)'}
              >
                <X size={12} />
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {search && (
                <div className="px-2 py-1 text-xs rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  🔎 Search: "{search}"
                  <button onClick={() => setSearch('')} className="ml-1 hover:text-red-400"><X size={12} /></button>
                </div>
              )}
              {typeFilter !== 'All' && (
                <div className="px-2 py-1 text-xs rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  📁 Type: {typeFilter}
                  <button onClick={() => setTypeFilter('All')} className="ml-1 hover:text-red-400"><X size={12} /></button>
                </div>
              )}
              {categoryFilter !== 'All' && (
                <div className="px-2 py-1 text-xs rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  📂 Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter('All')} className="ml-1 hover:text-red-400"><X size={12} /></button>
                </div>
              )}
              {statusFilter !== 'All' && (
                <div className="px-2 py-1 text-xs rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  ✓ Status: {statusFilter}
                  <button onClick={() => setStatusFilter('All')} className="ml-1 hover:text-red-400"><X size={12} /></button>
                </div>
              )}
              {dateFrom && (
                <div className="px-2 py-1 text-xs rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  📅 From: {dateFrom}
                  <button onClick={() => setDateFrom('')} className="ml-1 hover:text-red-400"><X size={12} /></button>
                </div>
              )}
              {dateTo && (
                <div className="px-2 py-1 text-xs rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  📅 To: {dateTo}
                  <button onClick={() => setDateTo('')} className="ml-1 hover:text-red-400"><X size={12} /></button>
                </div>
              )}
              {minAmount && (
                <div className="px-2 py-1 text-xs rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  💰 Min: {formatCurrency(minAmount)}
                  <button onClick={() => setMinAmount('')} className="ml-1 hover:text-red-400"><X size={12} /></button>
                </div>
              )}
              {maxAmount && (
                <div className="px-2 py-1 text-xs rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  💰 Max: {formatCurrency(maxAmount)}
                  <button onClick={() => setMaxAmount('')} className="ml-1 hover:text-red-400"><X size={12} /></button>
                </div>
              )}
              {merchantFilter && (
                <div className="px-2 py-1 text-xs rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  🏪 Merchant: "{merchantFilter}"
                  <button onClick={() => setMerchantFilter('')} className="ml-1 hover:text-red-400"><X size={12} /></button>
                </div>
              )}
              {sortField !== 'date' && (
                <div className="px-2 py-1 text-xs rounded-full flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  🔤 Sort: {sortField} ({sortDirection})
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <TransactionTable
        transactions={paginatedTransactions}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteConfirm}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        showEmptyState={paginatedTransactions.length === 0}
        role={role}
      />

      {/* Pagination */}
      {totalPages > 1 && <TransactionPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

      {/* Modals */}
      <CreateModal
        isOpen={isModalOpen && !editingId}
        onOpenChange={setIsModalOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <EditModal
        isOpen={isModalOpen && !!editingId}
        onOpenChange={setIsModalOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
