import { FileText } from 'lucide-react';

const DocumentsTab = () => (
  <div className="bg-card rounded-[14px] border p-12 flex flex-col items-center justify-center text-center">
    <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" style={{ strokeWidth: 1.5 }} />
    <p className="text-[15px] font-medium text-foreground" style={{ fontFamily: 'var(--ff-display)' }}>
      No documents yet
    </p>
    <p className="text-[12px] text-muted-foreground mt-1" style={{ fontFamily: 'var(--ff-body)' }}>
      Document storage coming soon.
    </p>
  </div>
);

export default DocumentsTab;
