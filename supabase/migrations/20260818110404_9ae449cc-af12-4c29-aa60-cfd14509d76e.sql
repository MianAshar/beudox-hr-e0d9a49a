-- RFI batches (one per submission)
CREATE TABLE project_rfis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON project_rfis TO authenticated;
GRANT ALL ON project_rfis TO service_role;

-- Individual Q&A pairs within an RFI
CREATE TABLE project_rfi_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  rfi_id UUID REFERENCES project_rfis(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  asked_by UUID REFERENCES employees(id),
  answered_by UUID REFERENCES employees(id),
  answered_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON project_rfi_questions TO authenticated;
GRANT ALL ON project_rfi_questions TO service_role;

-- RLS: project_rfis
ALTER TABLE project_rfis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rfi_company_scoped_read" ON project_rfis
  FOR SELECT USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "rfi_company_scoped_write" ON project_rfis
  FOR ALL USING (company_id = get_company_id_for_auth(auth.uid()));

-- RLS: project_rfi_questions
ALTER TABLE project_rfi_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rfi_questions_company_scoped_read" ON project_rfi_questions
  FOR SELECT USING (company_id = get_company_id_for_auth(auth.uid()));

CREATE POLICY "rfi_questions_company_scoped_write" ON project_rfi_questions
  FOR ALL USING (company_id = get_company_id_for_auth(auth.uid()));