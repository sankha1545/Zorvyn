import useStore from '../store/useStore';

export default function RoleGuard({ requiredRole = 'admin', children, fallback = null }) {
  const role = useStore((s) => s.role);
  
  if (role === requiredRole || requiredRole === 'any') {
    return children;
  }
  
  return fallback;
}
