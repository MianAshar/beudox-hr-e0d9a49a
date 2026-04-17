import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon } from 'lucide-react';
import { formatRole } from '@/lib/format-role';

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const UserMenu = () => {
  const { employee, signOut } = useAuth();
  const navigate = useNavigate();

  if (!employee) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          aria-label="User menu"
        >
          <Avatar className="h-9 w-9">
            {employee.avatar_url && <AvatarImage src={employee.avatar_url} alt={employee.full_name} />}
            <AvatarFallback className="bg-primary/10 text-primary text-[12px] font-semibold">
              {getInitials(employee.full_name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-foreground truncate">{employee.full_name}</span>
            <span className="text-[11px] text-muted-foreground truncate">
              {employee.role_name ? formatRole(employee.role_name) : employee.designation || 'Employee'}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/my-profile')} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
