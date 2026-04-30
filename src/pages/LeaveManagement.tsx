import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MyRequestsTab from '@/components/leave/MyRequestsTab';
import AllRequestsTab from '@/components/leave/AllRequestsTab';
import LeaveBalancesTab from '@/components/leave/LeaveBalancesTab';
import ApplyLeaveModal from '@/components/leave/ApplyLeaveModal';
import MyLeaveBalances from '@/components/leave/MyLeaveBalances';
// TODO: Remove before production
import ClearLeaveDataButton from '@/components/leave/ClearLeaveDataButton';

const defaultLeaveTypes = [
  { name: 'Annual Leave', annual_entitlement: 15, is_paid: true, allow_carry_over: true, max_carry_over: 5, apply_proration: false },
  { name: 'Sick Leave', annual_entitlement: 10, is_paid: true, allow_carry_over: false, max_carry_over: 0, apply_proration: false },
  { name: 'Casual Leave', annual_entitlement: 10, is_paid: true, allow_carry_over: false, max_carry_over: 0, apply_proration: false },
  { name: 'Unpaid Leave', annual_entitlement: 0, is_paid: false, allow_carry_over: false, max_carry_over: 0, apply_proration: false },
];

const LeaveManagement = () => {
  const { employee } = useAuth();
  const roles = employee?.roles ?? [];
  const companyId = employee?.company_id;
  const isHrOrCeo = ['hr_manager', 'ceo'].some(r => roles.includes(r));
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(isHrOrCeo ? 'all-requests' : 'my-requests');
    }
  }, [isHrOrCeo, activeTab]);

  // Seed leave types on first load
  useEffect(() => {
    if (!companyId) return;
    (async () => {
      const { data } = await supabase
        .from('leave_types')
        .select('id')
        .eq('company_id', companyId)
        .limit(1);
      if (!data || data.length === 0) {
        const rows = defaultLeaveTypes.map(lt => ({
          ...lt,
          company_id: companyId,
          is_active: true,
        }));
        await supabase.from('leave_types').insert(rows as any);
      }
    })();
  }, [companyId]);

  const tabs = [
    ...(isHrOrCeo ? [{ value: 'all-requests', label: 'All Requests' }] : []),
    { value: 'my-requests', label: 'My Requests' },
    ...(isHrOrCeo ? [{ value: 'balances', label: 'Leave Balances' }] : []),
  ];

  const handleApplySuccess = () => {
    setApplyModalOpen(false);
    setActiveTab('my-requests');
  };

  return (
    <div className="space-y-6">
      <MyLeaveBalances />

      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-2">
          {/* TODO: Remove before production */}
          <ClearLeaveDataButton onCleared={() => window.location.reload()} />
          <Button onClick={() => setApplyModalOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Apply for Leave
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-0 w-full justify-start" style={{ borderColor: 'hsl(var(--border))' }}>
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 text-[13px] font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: 'var(--ff-body)' }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {isHrOrCeo && (
          <TabsContent value="all-requests" className="mt-6"><AllRequestsTab /></TabsContent>
        )}
        <TabsContent value="my-requests" className="mt-6"><MyRequestsTab /></TabsContent>
        {isHrOrCeo && (
          <TabsContent value="balances" className="mt-6"><LeaveBalancesTab /></TabsContent>
        )}
      </Tabs>

      <ApplyLeaveModal
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
};

export default LeaveManagement;
