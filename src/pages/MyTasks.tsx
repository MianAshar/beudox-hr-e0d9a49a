import { useAuth } from '@/hooks/useAuth';
import TaskBoard from '@/components/tasks/TaskBoard';

const MyTasks = () => {
  const { employee } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <TaskBoard scopeEmployeeId={employee?.employee_id} />
    </div>
  );
};

export default MyTasks;
