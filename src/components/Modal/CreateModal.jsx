import { Modal } from '@heroui/react';
import { categories } from '../../data/mockData';

export default function CreateModal({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
}) {
  const handleClose = (close) => {
    onOpenChange(false);
    close?.();
  };

  const handleSubmit = (close) => {
    onSubmit();
    close?.();
  };

  return (
    <Modal>
      <Modal.Backdrop variant="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="lg">
          <Modal.Dialog
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {({ close }) => (
              <>
                <Modal.Header>
                  <Modal.Heading
                    className="text-lg font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Add Transaction
                  </Modal.Heading>
                  <p
                    className="text-xs mt-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Fill in the details for the new transaction.
                  </p>
                </Modal.Header>

                <Modal.Body>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, date: e.target.value }))
                        }
                        className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-input)',
                          borderWidth: '1px',
                          color: 'var(--text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                        onBlur={(e) =>
                          (e.target.style.borderColor = 'var(--border-input)')
                        }
                      />
                    </div>

                    {/* Type */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, type: e.target.value }))
                        }
                        className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-input)',
                          borderWidth: '1px',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                        onBlur={(e) =>
                          (e.target.style.borderColor = 'var(--border-input)')
                        }
                      >
                        <option value="Income" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', padding: '8px' }}>Income</option>
                        <option value="Expense" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', padding: '8px' }}>Expense</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Description *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Grocery Shopping"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-input)',
                          borderWidth: '1px',
                          color: 'var(--text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                        onBlur={(e) =>
                          (e.target.style.borderColor = 'var(--border-input)')
                        }
                      />
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Amount *
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              amount: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl pl-7 pr-3 py-2 text-sm outline-none transition-all"
                          style={{
                            backgroundColor: 'var(--bg-input)',
                            borderColor: 'var(--border-input)',
                            borderWidth: '1px',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = '#6366f1')
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = 'var(--border-input)')
                          }
                        />
                      </div>
                    </div>

                    {/* Merchant */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Merchant
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Amazon"
                        value={formData.merchant}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            merchant: e.target.value,
                          }))
                        }
                        className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-input)',
                          borderWidth: '1px',
                          color: 'var(--text-primary)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                        onBlur={(e) =>
                          (e.target.style.borderColor = 'var(--border-input)')
                        }
                      />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                        className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-input)',
                          borderWidth: '1px',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                        onBlur={(e) =>
                          (e.target.style.borderColor = 'var(--border-input)')
                        }
                      >
                        <option value="" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', padding: '8px' }}>Select category...</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat} style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', padding: '8px' }}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            status: e.target.value,
                          }))
                        }
                        className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-input)',
                          borderWidth: '1px',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                        onBlur={(e) =>
                          (e.target.style.borderColor = 'var(--border-input)')
                        }
                      >
                        <option value="Completed" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', padding: '8px' }}>Completed</option>
                        <option value="Pending" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', padding: '8px' }}>Pending</option>
                      </select>
                    </div>
                  </div>
                </Modal.Body>

                <Modal.Footer className="flex justify-end gap-2">
                  <button
                    onClick={() => handleClose(close)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
                    style={{
                      color: 'var(--text-secondary)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmit(close)}
                    disabled={
                      !formData.description ||
                      !formData.amount ||
                      !formData.category
                    }
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Add Transaction
                  </button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
