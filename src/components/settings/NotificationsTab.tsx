import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const NotificationsTab = () => {
  const { employee } = useAuth();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employee?.employee_id) return;
    (async () => {
      const { data } = await supabase
        .from('employees')
        .select('notifications_enabled')
        .eq('id', employee.employee_id)
        .single();
      if (data) setEnabled((data as any).notifications_enabled ?? true);
      setLoading(false);
    })();
  }, [employee?.employee_id]);

  const handleToggle = async (value: boolean) => {
    setEnabled(value);
    const { error } = await supabase
      .from('employees')
      .update({ notifications_enabled: value } as any)
      .eq('id', employee!.employee_id);
    if (error) {
      setEnabled(!value);
      toast.error('Failed to update notification preference');
    } else {
      toast.success(value ? 'Notifications enabled' : 'Notifications disabled');
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--ff-body)' }}>Loading…</div>;

  return (
    <div className="space-y-6" style={{ fontFamily: 'var(--ff-body)' }}>
      <div className="flex items-center justify-between max-w-lg rounded-lg border p-4" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="space-y-0.5">
          <Label className="text-sm font-medium" style={{ fontFamily: 'var(--ff-body)' }}>
            Enable Notifications
          </Label>
          <p className="text-xs text-muted-foreground">
            Turn off to stop receiving all in-app and email notifications
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>
    </div>
  );
};

export default NotificationsTab;
