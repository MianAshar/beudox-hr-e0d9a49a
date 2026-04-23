import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ReviewScheduleSection from './ReviewScheduleSection';
import PendingIncrementCard from './PendingIncrementCard';
import ProposeIncrementModal from './ProposeIncrementModal';
import SalaryHistoryTab from './SalaryHistoryTab';

interface Props {
  employee: {
    id: string;
    full_name: string;
    company_id: string;
    basic_salary: number | null;
    allowance: number | null;
    first_review_date: string | null;
    review_frequency_months: number | null;
  };
  canEdit: boolean;
  isCeo: boolean;
  authEmployeeId: string;
}

const SalaryReviewTab = ({ employee, canEdit, isCeo, authEmployeeId }: Props) => {
  const [proposeOpen, setProposeOpen] = useState(false);

  // Detect a pending proposal so we can disable the Propose button
  const { data: hasPending } = useQuery({
    queryKey: ['pending-increment-exists', employee.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salary_history' as any)
        .select('id')
        .eq('employee_id', employee.id)
        .eq('status', 'pending')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  return (
    <div className="space-y-6">
      {/* Section 1: Review Schedule */}
      <div className="bg-card rounded-[14px] border p-6">
        <h3 className="font-display font-semibold text-[15px] text-foreground mb-4" style={{ fontFamily: 'var(--ff-display)' }}>
          Review Schedule
        </h3>
        <ReviewScheduleSection
          employeeId={employee.id}
          firstReviewDate={employee.first_review_date}
          reviewFrequencyMonths={employee.review_frequency_months}
          canEdit={canEdit}
        />
      </div>

      {/* Section 2: Pending Increment Card (HR sees read-only, CEO sees Approve/Reject) */}
      <PendingIncrementCard
        employee={{
          id: employee.id,
          full_name: employee.full_name,
          company_id: employee.company_id,
          first_review_date: employee.first_review_date,
          review_frequency_months: employee.review_frequency_months,
        }}
        approverEmployeeId={authEmployeeId}
        readOnly={!isCeo}
      />

      {/* Section 3: Propose Increment Button */}
      {canEdit && (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button
                    onClick={() => setProposeOpen(true)}
                    className="gap-2"
                    disabled={!!hasPending}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Propose Increment
                  </Button>
                </span>
              </TooltipTrigger>
              {hasPending && (
                <TooltipContent>A proposal is already pending CEO approval.</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <ProposeIncrementModal
            open={proposeOpen}
            onOpenChange={setProposeOpen}
            employee={{
              id: employee.id,
              full_name: employee.full_name,
              company_id: employee.company_id,
              basic_salary: employee.basic_salary,
              allowance: employee.allowance,
              first_review_date: employee.first_review_date,
              review_frequency_months: employee.review_frequency_months,
            }}
            proposerEmployeeId={authEmployeeId}
            isCeo={isCeo}
          />
        </div>
      )}

      {/* Section 4: Salary History Table */}
      <div>
        <h3 className="font-display font-semibold text-[15px] text-foreground mb-3" style={{ fontFamily: 'var(--ff-display)' }}>
          Salary History
        </h3>
        <SalaryHistoryTab employeeId={employee.id} />
      </div>
    </div>
  );
};

export default SalaryReviewTab;
