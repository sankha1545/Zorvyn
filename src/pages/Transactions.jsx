import { useState, useMemo } from 'react';
import {
  Table, Modal, Dropdown, Chip, Tooltip, Button, ListBox, Input, Label, Select,
} from '@heroui/react';
import {
  Search, Plus, Trash2, Pencil, Filter, ArrowUpDown,
  ArrowUp, ArrowDown, X, FileText, ChevronDown,
} from 'lucide-react';
import useStore from '../store/useStore';
import RoleGuard from '../components/RoleGuard';
import { categories } from '../data/mockData';

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
  const role = useStore((s) => s.role);
  const globalSearch = useStore((s) => s.globalSearch);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const activeSearch = globalSearch || search;

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (activeSearch) {
      const s = activeSearch.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(s) ||
        t.merchant.toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s)
      );
    }
    if (typeFilter !== 'All') result = result.filter(t => t.type === typeFilter);
    if (categoryFilter !== 'All') result = result.filter(t => t.category === categoryFilter);
    if (statusFilter !== 'All') result = result.filter(t => t.status === statusFilter);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'amount') cmp = a.amount - b.amount;
      else if (sortField === 'description') cmp = a.description.localeCompare(b.description);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [transactions, activeSearch, typeFilter, categoryFilter, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const paginatedTransactions = filteredTransactions.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('desc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-zinc-600" />;
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
    if (editingId) updateTransaction(editingId, data);
    else addTransaction(data);
    setIsModalOpen(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleDeleteConfirm = (id) => { setDeletingId(id); setIsDeleteModalOpen(true); };
  const handleDelete = () => {
    if (deletingId) deleteTransaction(deletingId);
    setIsDeleteModalOpen(false);
    setDeletingId(null);
  };

  const clearFilters = () => { setSearch(''); setTypeFilter('All'); setCategoryFilter('All'); setStatusFilter('All'); setPage(1); };
  const hasActiveFilters = search || typeFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'All';

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Transactions</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        <RoleGuard requiredRole="admin">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </RoleGuard>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search descriptions, merchants..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-9 pr-8 py-2 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Type Filter */}
          <Dropdown>
            <Dropdown.Trigger>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-all cursor-pointer">
                <Filter size={13} /> Type: {typeFilter} <ChevronDown size={11} />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Popover className="bg-zinc-900 border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 p-1 min-w-[140px]">
              <Dropdown.Menu aria-label="Type filter">
                {typeOptions.map(opt => (
                  <Dropdown.Item
                    key={opt}
                    id={opt}
                    textValue={opt}
                    onAction={() => { setTypeFilter(opt); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                      typeFilter === opt ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                    }`}
                  >
                    {opt}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          {/* Category Filter */}
          <Dropdown>
            <Dropdown.Trigger>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-all cursor-pointer">
                <Filter size={13} /> Category: {categoryFilter === 'All' ? 'All' : categoryFilter.split(' ')[0] + '...'} <ChevronDown size={11} />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Popover className="bg-zinc-900 border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 p-1 min-w-[180px] max-h-64 overflow-auto">
              <Dropdown.Menu aria-label="Category filter">
                {categoryOptions.map(opt => (
                  <Dropdown.Item
                    key={opt}
                    id={opt}
                    textValue={opt}
                    onAction={() => { setCategoryFilter(opt); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                      categoryFilter === opt ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                    }`}
                  >
                    {opt}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          {/* Status Filter */}
          <Dropdown>
            <Dropdown.Trigger>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-all cursor-pointer">
                Status: {statusFilter} <ChevronDown size={11} />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Popover className="bg-zinc-900 border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 p-1 min-w-[140px]">
              <Dropdown.Menu aria-label="Status filter">
                {statusOptions.map(opt => (
                  <Dropdown.Item
                    key={opt}
                    id={opt}
                    textValue={opt}
                    onAction={() => { setStatusFilter(opt); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                      statusFilter === opt ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                    }`}
                  >
                    {opt}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-zinc-900/80">
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content aria-label="Transactions table">
              <Table.Header>
                <Table.Column id="date" isRowHeader>
                  <button onClick={() => handleSort('date')} className="flex items-center gap-1 outline-none cursor-pointer text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                    Date <SortIcon field="date" />
                  </button>
                </Table.Column>
                <Table.Column id="description">
                  <button onClick={() => handleSort('description')} className="flex items-center gap-1 outline-none cursor-pointer text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                    Description <SortIcon field="description" />
                  </button>
                </Table.Column>
                <Table.Column id="category">
                  <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Category</span>
                </Table.Column>
                <Table.Column id="amount">
                  <button onClick={() => handleSort('amount')} className="flex items-center gap-1 outline-none cursor-pointer text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                    Amount <SortIcon field="amount" />
                  </button>
                </Table.Column>
                <Table.Column id="type">
                  <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Type</span>
                </Table.Column>
                <Table.Column id="status">
                  <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Status</span>
                </Table.Column>
                {role === 'admin' && (
                  <Table.Column id="actions">
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Actions</span>
                  </Table.Column>
                )}
              </Table.Header>
              <Table.Body
                renderEmptyState={() => (
                  <div className="py-16 flex flex-col items-center gap-3">
                    <FileText size={40} className="text-zinc-700" />
                    <p className="text-sm text-zinc-500">No transactions found</p>
                    <p className="text-xs text-zinc-600">Try adjusting your filters or search terms</p>
                  </div>
                )}
              >
                {paginatedTransactions.map((tx) => (
                  <Table.Row key={tx.id} id={tx.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.04]">
                    <Table.Cell>
                      <span className="text-sm text-zinc-500 font-mono">{formatDate(tx.date)}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{tx.description}</p>
                        <p className="text-xs text-zinc-600">{tx.merchant}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                        {tx.category}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={`text-sm font-semibold tabular-nums ${tx.type === 'Income' ? 'text-emerald-400' : 'text-zinc-200'}`}>
                        {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${tx.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'Income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {tx.type}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
                        tx.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {tx.status}
                      </span>
                    </Table.Cell>
                    {role === 'admin' && (
                      <Table.Cell>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <Tooltip.Trigger>
                              <button
                                onClick={() => handleOpenEdit(tx)}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all cursor-pointer"
                              >
                                <Pencil size={14} />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Content className="bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded-lg border border-white/[0.06]">
                              Edit
                            </Tooltip.Content>
                          </Tooltip>
                          <Tooltip>
                            <Tooltip.Trigger>
                              <button
                                onClick={() => handleDeleteConfirm(tx.id)}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Content className="bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded-lg border border-white/[0.06]">
                              Delete
                            </Tooltip.Content>
                          </Tooltip>
                        </div>
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
          {totalPages > 1 && (
            <Table.Footer className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04]">
              <span className="text-xs text-zinc-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const pageNum = start + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        page === pageNum
                          ? 'bg-indigo-500 text-white'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </Table.Footer>
          )}
        </Table>
      </div>

      {/* Add/Edit Transaction Modal */}
      <Modal>
        <Modal.Backdrop variant="blur" isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <Modal.Container size="lg">
            <Modal.Dialog>
              {({ close }) => (
                <>
                  <Modal.Header>
                    <Modal.Heading className="text-lg font-semibold text-zinc-100">
                      {editingId ? 'Edit Transaction' : 'Add Transaction'}
                    </Modal.Heading>
                    <p className="text-xs text-zinc-500 mt-1">
                      {editingId ? 'Update the transaction details below.' : 'Fill in the details for the new transaction.'}
                    </p>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Type</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 transition-all"
                        >
                          <option value="Income">Income</option>
                          <option value="Expense">Expense</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-medium text-zinc-400">Description *</label>
                        <input
                          type="text"
                          placeholder="e.g., Grocery Shopping"
                          value={formData.description}
                          onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-indigo-500/50 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Amount *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-7 pr-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-indigo-500/50 transition-all"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Merchant</label>
                        <input
                          type="text"
                          placeholder="e.g., Amazon"
                          value={formData.merchant}
                          onChange={(e) => setFormData(p => ({ ...p, merchant: e.target.value }))}
                          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-indigo-500/50 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 transition-all"
                        >
                          <option value="">Select category...</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
                          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 transition-all"
                        >
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="flex justify-end gap-2">
                    <button
                      onClick={() => { setIsModalOpen(false); close(); }}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { handleSubmit(); close(); }}
                      disabled={!formData.description || !formData.amount || !formData.category}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {editingId ? 'Update' : 'Add Transaction'}
                    </button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal>
        <Modal.Backdrop variant="blur" isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <Modal.Container size="sm">
            <Modal.Dialog>
              {({ close }) => (
                <>
                  <Modal.Header>
                    <Modal.Heading className="text-lg font-semibold text-zinc-100">Confirm Delete</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <p className="text-sm text-zinc-400">
                      Are you sure you want to delete this transaction? This action cannot be undone.
                    </p>
                  </Modal.Body>
                  <Modal.Footer className="flex justify-end gap-2">
                    <button
                      onClick={() => { setIsDeleteModalOpen(false); close(); }}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { handleDelete(); close(); }}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
