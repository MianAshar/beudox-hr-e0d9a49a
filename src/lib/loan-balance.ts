export interface LoanForAllocation {
  id: string;
  employee_id: string;
  total_amount: number | string;
  monthly_deduction: number | string;
  granted_date: string;
}

export interface PaidPayrollForAllocation {
  employee_id: string;
  month_year: string; // 'YYYY-MM'
  loan_deduction: number | string;
}

export interface LoanAllocation {
  paid: number;
  remaining: number;
}

/**
 * Derives how much of each loan has actually been repaid, based on salary
 * records that have been marked as paid. Deductions for a month are applied to
 * the employee's loans in granted-date order, each loan taking at most its own
 * monthly deduction and never more than its outstanding balance.
 */
export function computeLoanAllocations(
  loans: LoanForAllocation[],
  payrolls: PaidPayrollForAllocation[],
): Record<string, LoanAllocation> {
  const result: Record<string, LoanAllocation> = {};

  const byEmployee = new Map<string, LoanForAllocation[]>();
  for (const loan of loans) {
    result[loan.id] = { paid: 0, remaining: Number(loan.total_amount) || 0 };
    const list = byEmployee.get(loan.employee_id) ?? [];
    list.push(loan);
    byEmployee.set(loan.employee_id, list);
  }

  const payrollsByEmployee = new Map<string, PaidPayrollForAllocation[]>();
  for (const p of payrolls) {
    const amount = Number(p.loan_deduction) || 0;
    if (amount <= 0) continue;
    const list = payrollsByEmployee.get(p.employee_id) ?? [];
    list.push(p);
    payrollsByEmployee.set(p.employee_id, list);
  }

  for (const [employeeId, empLoans] of byEmployee) {
    const months = (payrollsByEmployee.get(employeeId) ?? [])
      .slice()
      .sort((a, b) => a.month_year.localeCompare(b.month_year));
    if (months.length === 0) continue;

    const ordered = empLoans.slice().sort((a, b) => a.granted_date.localeCompare(b.granted_date));

    for (const month of months) {
      let budget = Number(month.loan_deduction) || 0;
      for (const loan of ordered) {
        if (budget <= 0) break;
        // Only loans granted on or before the end of that payroll month count.
        if (loan.granted_date.slice(0, 7) > month.month_year) continue;
        const entry = result[loan.id];
        if (entry.remaining <= 0) continue;
        const take = Math.min(Number(loan.monthly_deduction) || 0, entry.remaining, budget);
        if (take <= 0) continue;
        entry.paid += take;
        entry.remaining -= take;
        budget -= take;
      }
    }
  }

  return result;
}
