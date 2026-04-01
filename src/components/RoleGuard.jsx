/**
 * RoleGuard Component
 * Conditionally renders content based on user role
 * 
 * Usage:
 * <RoleGuard requiredRole="admin">
 *   Only admins see this
 * </RoleGuard>
 */

import useStore from '../store/useStore';

export default function RoleGuard({ requiredRole, children }) {
  const role = useStore((s) => s.role);

  // If requiredRole is not specified, render children
  if (!requiredRole) {
    return children;
  }

  // If user role matches required role, render children
  if (role === requiredRole) {
    return children;
  }

  // Otherwise, render nothing
  return null;
}
