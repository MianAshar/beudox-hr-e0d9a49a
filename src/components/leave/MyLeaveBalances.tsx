import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ensureLeaveBalance } from '@/lib/leave-utils';

const YEAR = 2026;

interface BalanceRow {
  leave_type_id: string;
  leave_type_name: string;
  is_paid: boolean;
  annual_entitlement: number;
  system_days: number;
  adjustment_days: number;
  carried_over_days: number;
  used_days: number;
}

const MyLeaveBalances = () => {
  const { employee } = useAuth();
  const companyId = employee?.company_id;
  const employeeId = employee?.employee_id;
  const queryClient = useQueryClient();

  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['my-bal-types', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase
        .from('leave_types')
        .select('id, name, is_paid, annual_entitlement')
        .eq('company_id', companyId!)
        .eq('is_active', true)
        .order('name');
      return data || [];
    },
  });

  // Ensure balances exist for the logged-in employee
  useEffect(() => {
    if (!companyId || !employeeId || leaveTypes.length === 0) return;
    (async () => {
      for (const lt of leaveTypes as any[]) {
        await ensureLeaveBalance(companyId, employeeId, lt.id, YEAR);
      }
      queryClient.invalidateQueries({ queryKey: ['my-leave-balances', employeeId] });
    })();
  }, [companyId, employeeId, leaveTypes, queryClient]);

  const { data: balances = [], isLoading } = useQuery({
    queryKey: ['my-leave-balances', employeeId, YEAR],
    enabled: !!companyId && !!employeeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('leave_type_id, system_days, adjustment_days, carried_over_days, used_days')
        .eq('company_id', companyId!)
        .eq('employee_id', employeeId!)
        .eq('year', YEAR);
      if (error) throw error;
      return data || [];
    },
  });

  const rows: BalanceRow[] = (leaveTypes as any[]).filter((lt) => !!lt.is_paid).map((lt) => {
    const b: any = (balances as any[]).find((x) => x.leave_type_id === lt.id);
    return {
      leave_type_id: lt.id,
      leave_type_name: lt.name,
      is_paid: !!lt.is_paid,
      annual_entitlement: Number(lt.annual_entitlement || 0),
      system_days: Number(b?.system_days ?? lt.annual_entitlement ?? 0),
      adjustment_days: Number(b?.adjustment_days ?? 0),
      carried_over_days: Number(b?.carried_over_days ?? 0),
      used_days: Number(b?.used_days ?? 0),
    };
  });

  return (
    <section style={{ fontFamily: 'var(--ff-body)' }}>
      <div className="flex items-end justify-between mb-3">
        <h2 style={{ fontFamily: 'var(--ff-heading)', fontWeight: 700, fontSize: 16, color: '#120E36' }}>
          My Leave Balances
        </h2>
        <span style={{ fontSize: 13, color: '#9490B4' }}>{YEAR}</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[14px] bg-white animate-pulse" style={{ border: '1px solid rgba(91,63,248,0.15)', height: 168 }} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div
          className="rounded-[14px] bg-white text-sm text-center py-6"
          style={{ border: '1px solid rgba(91,63,248,0.15)', color: '#9490B4' }}
        >
          No leave balances configured. Contact your HR manager.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((r) => {
            const totalAvailable = r.system_days + r.adjustment_days + r.carried_over_days;
            const remaining = totalAvailable - r.used_days;
            const isUnlimited = totalAvailable === 0 && !r.is_paid;
            const overUsed = remaining < 0;
            const exhausted = remaining === 0 && totalAvailable > 0;

            const fillPct = totalAvailable > 0
              ? Math.min(100, Math.max(0, (r.used_days / totalAvailable) * 100))
              : 0;

            const remainingColor = overUsed ? '#E84545' : exhausted ? '#F5A623' : '#5B3FF8';
            const remainingLabel = overUsed
              ? `${Math.abs(remaining)} days overdrawn`
              : 'days remaining';

            return (
              <div
                key={r.leave_type_id}
                className="bg-white"
                style={{
                  border: '1px solid rgba(91,63,248,0.15)',
                  borderRadius: 14,
                  padding: '18px 20px',
                }}
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <span style={{ fontFamily: 'var(--ff-heading)', fontWeight: 600, fontSize: 14, color: '#120E36' }}>
                    {r.leave_type_name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {overUsed && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={{ background: '#FEE2E2', color: '#E84545' }}
                      >
                        Overdrawn
                      </span>
                    )}
                    <span
                      className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{
                        background: r.is_paid ? '#D1FAE5' : '#F3F4F6',
                        color: r.is_paid ? '#065F46' : '#374151',
                      }}
                    >
                      {r.is_paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>

                <div className="text-center my-2">
                  {isUnlimited ? (
                    <div style={{ fontFamily: 'var(--ff-heading)', fontWeight: 700, fontSize: 28, color: '#5B3FF8' }}>
                      Unlimited
                    </div>
                  ) : (
                    <>
                      <div style={{ fontFamily: 'var(--ff-heading)', fontWeight: 700, fontSize: 28, color: remainingColor, lineHeight: 1.1 }}>
                        {overUsed ? Math.abs(remaining) : remaining}
                      </div>
                      <div style={{ fontSize: 12, color: overUsed ? '#E84545' : '#9490B4', marginTop: 2 }}>
                        {remainingLabel}
                      </div>
                    </>
                  )}
                </div>


                <div className="flex items-center justify-center gap-3 mt-3 mb-2" style={{ fontSize: 13, color: '#4B4468' }}>
                  <span>{r.used_days} used</span>
                  <span style={{ width: 1, height: 12, background: 'rgba(91,63,248,0.2)' }} />
                  <span>{isUnlimited ? '∞' : totalAvailable} total</span>
                </div>

                {!isUnlimited && (
                  <div style={{ width: '100%', height: 4, background: '#EBE6FF', borderRadius: 9999, overflow: 'hidden', marginTop: 10 }}>
                    <div
                      style={{
                        width: `${fillPct}%`,
                        height: '100%',
                        background: overUsed ? '#E84545' : '#5B3FF8',
                        borderRadius: 9999,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyLeaveBalances;
