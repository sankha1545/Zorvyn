import { Search } from 'lucide-react';
import Input from '../ui/Input';

export default function TransactionSearch({ value, onChange, placeholder = 'Search transactions...' }) {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      icon={Search}
    />
  );
}
