import { Modal } from '@heroui/react';

export default function DeleteModal({ isOpen, onOpenChange, onConfirm }) {
  const handleDelete = (close) => {
    onConfirm();
    close?.();
  };

  const handleCancel = (close) => {
    onOpenChange(false);
    close?.();
  };

  return (
    <Modal>
      <Modal.Backdrop variant="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="sm">
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
                    Confirm Delete
                  </Modal.Heading>
                </Modal.Header>

                <Modal.Body>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Are you sure you want to delete this transaction? This
                    action cannot be undone.
                  </p>
                </Modal.Body>

                <Modal.Footer className="flex justify-end gap-2">
                  <button
                    onClick={() => handleCancel(close)}
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
                    onClick={() => handleDelete(close)}
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
  );
}
