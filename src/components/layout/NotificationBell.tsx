import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
}

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

const REFERENCE_ROUTES: Record<string, string> = {
  payroll: '/payroll',
  employee: '/employees',
  loan: '/loans',
  evaluation: '/evaluations',
  invoice: '/invoices',
  leave: '/leave',
};

const NotificationBell = () => {
  const { employee } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const companyId = employee?.company_id;
  const employeeId = employee?.employee_id;

  const fetchNotifications = useCallback(async () => {
    if (!companyId || !employeeId) return;
    const { data } = await supabase
      .from('notifications')
      .select('id, type, title, message, is_read, reference_type, reference_id, created_at')
      .eq('company_id', companyId)
      .eq('recipient_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    }
  }, [companyId, employeeId]);

  // Fetch on mount and when dropdown opens
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  const markAsRead = async (notif: Notification) => {
    if (!notif.is_read) {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    // Navigate if reference exists
    if (notif.reference_type && notif.reference_id) {
      const base = REFERENCE_ROUTES[notif.reference_type];
      if (base) {
        navigate(`${base}/${notif.reference_id}`);
        setOpen(false);
      }
    } else if (notif.reference_type) {
      const base = REFERENCE_ROUTES[notif.reference_type];
      if (base) {
        navigate(base);
        setOpen(false);
      }
    }
  };

  const markAllRead = async () => {
    if (!companyId || !employeeId) return;
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .in('id', unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-lg hover:bg-accent/50 transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          <span className="text-sm font-semibold text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary h-auto py-1 px-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                markAllRead();
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No notifications yet</div>
          ) : (
            <div>
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-accent/30 transition-colors border-b last:border-0"
                  style={{ borderColor: 'hsl(var(--border))' }}
                  onClick={() => markAsRead(notif)}
                >
                  {/* Unread dot */}
                  <div className="pt-1.5 shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${notif.is_read ? 'bg-transparent' : 'bg-primary'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{timeAgo(notif.created_at)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
