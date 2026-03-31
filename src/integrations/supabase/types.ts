export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance_imports: {
        Row: {
          company_id: string
          created_at: string | null
          file_name: string | null
          id: string
          month_year: string
          records_imported: number
          records_skipped: number
          status: string
          updated_at: string | null
          uploaded_by: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          file_name?: string | null
          id?: string
          month_year: string
          records_imported?: number
          records_skipped?: number
          status?: string
          updated_at?: string | null
          uploaded_by: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          file_name?: string | null
          id?: string
          month_year?: string
          records_imported?: number
          records_skipped?: number
          status?: string
          updated_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_imports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_imports_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          check_in: string | null
          check_out: string | null
          company_id: string
          created_at: string | null
          date: string
          employee_code: string | null
          employee_id: string
          holiday_ot_hours: number | null
          id: string
          import_batch_id: string | null
          is_absent: boolean | null
          is_early_departure: boolean | null
          is_holiday: boolean | null
          is_late: boolean | null
          is_weekend: boolean | null
          notes: string | null
          regular_ot_hours: number | null
          source: string | null
          status: string | null
          updated_at: string | null
          working_hours: number | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          company_id: string
          created_at?: string | null
          date: string
          employee_code?: string | null
          employee_id: string
          holiday_ot_hours?: number | null
          id?: string
          import_batch_id?: string | null
          is_absent?: boolean | null
          is_early_departure?: boolean | null
          is_holiday?: boolean | null
          is_late?: boolean | null
          is_weekend?: boolean | null
          notes?: string | null
          regular_ot_hours?: number | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          working_hours?: number | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          company_id?: string
          created_at?: string | null
          date?: string
          employee_code?: string | null
          employee_id?: string
          holiday_ot_hours?: number | null
          id?: string
          import_batch_id?: string | null
          is_absent?: boolean | null
          is_early_departure?: boolean | null
          is_holiday?: boolean | null
          is_late?: boolean | null
          is_weekend?: boolean | null
          notes?: string | null
          regular_ot_hours?: number | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          working_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_import_batch_id_fkey"
            columns: ["import_batch_id"]
            isOneToOne: false
            referencedRelation: "attendance_imports"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          billing_currency: string
          company_id: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          billing_currency?: string
          company_id: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_currency?: string
          company_id?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          owner_email: string
          plan: string
          slug: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_email: string
          plan?: string
          slug: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_email?: string
          plan?: string
          slug?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_features: {
        Row: {
          company_id: string
          created_at: string | null
          enabled_by: string | null
          feature_key: string
          id: string
          is_enabled: boolean
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          enabled_by?: string | null
          feature_key: string
          id?: string
          is_enabled?: boolean
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          enabled_by?: string | null
          feature_key?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_features_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          company_id: string
          created_at: string | null
          expense_approval_required: boolean
          id: string
          late_threshold: number
          ot_divisor: number
          shift_end_time: string
          shift_start_time: string
          timezone: string
          updated_at: string | null
          working_days: number[]
        }
        Insert: {
          company_id: string
          created_at?: string | null
          expense_approval_required?: boolean
          id?: string
          late_threshold?: number
          ot_divisor?: number
          shift_end_time?: string
          shift_start_time?: string
          timezone?: string
          updated_at?: string | null
          working_days?: number[]
        }
        Update: {
          company_id?: string
          created_at?: string | null
          expense_approval_required?: boolean
          id?: string
          late_threshold?: number
          ot_divisor?: number
          shift_end_time?: string
          shift_start_time?: string
          timezone?: string
          updated_at?: string | null
          working_days?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_evaluation_scores: {
        Row: {
          company_id: string
          created_at: string | null
          daily_evaluation_id: string
          id: string
          parameter_id: string
          score: number
        }
        Insert: {
          company_id: string
          created_at?: string | null
          daily_evaluation_id: string
          id?: string
          parameter_id: string
          score: number
        }
        Update: {
          company_id?: string
          created_at?: string | null
          daily_evaluation_id?: string
          id?: string
          parameter_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_evaluation_scores_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_evaluation_scores_daily_evaluation_id_fkey"
            columns: ["daily_evaluation_id"]
            isOneToOne: false
            referencedRelation: "daily_evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_evaluation_scores_parameter_id_fkey"
            columns: ["parameter_id"]
            isOneToOne: false
            referencedRelation: "evaluation_parameters"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_evaluations: {
        Row: {
          company_id: string
          created_at: string | null
          date: string
          direction: string
          id: string
          overall_score: number | null
          project_id: string
          remarks: string | null
          reviewee_id: string
          reviewer_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          date: string
          direction: string
          id?: string
          overall_score?: number | null
          project_id: string
          remarks?: string | null
          reviewee_id: string
          reviewer_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          date?: string
          direction?: string
          id?: string
          overall_score?: number | null
          project_id?: string
          remarks?: string | null
          reviewee_id?: string
          reviewer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_evaluations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_evaluations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_evaluations_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_evaluations_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_roles: {
        Row: {
          created_at: string | null
          employee_id: string
          id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          id?: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_roles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          allowance: number | null
          auth_user_id: string | null
          avatar_url: string | null
          basic_salary: number | null
          cnic: string | null
          company_id: string
          created_at: string | null
          date_of_birth: string | null
          department: string | null
          designation: string | null
          email: string | null
          employee_code: string | null
          employment_type: string | null
          full_name: string
          id: string
          increment_rule: string | null
          joining_date: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          allowance?: number | null
          auth_user_id?: string | null
          avatar_url?: string | null
          basic_salary?: number | null
          cnic?: string | null
          company_id: string
          created_at?: string | null
          date_of_birth?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          employee_code?: string | null
          employment_type?: string | null
          full_name: string
          id?: string
          increment_rule?: string | null
          joining_date?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          allowance?: number | null
          auth_user_id?: string | null
          avatar_url?: string | null
          basic_salary?: number | null
          cnic?: string | null
          company_id?: string
          created_at?: string | null
          date_of_birth?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          employee_code?: string | null
          employment_type?: string | null
          full_name?: string
          id?: string
          increment_rule?: string | null
          joining_date?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_parameters: {
        Row: {
          company_id: string
          created_at: string | null
          direction: string | null
          display_order: number
          evaluation_type: string
          id: string
          is_active: boolean
          max_score: number
          min_score: number
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          direction?: string | null
          display_order?: number
          evaluation_type: string
          id?: string
          is_active?: boolean
          max_score?: number
          min_score?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          direction?: string | null
          display_order?: number
          evaluation_type?: string
          id?: string
          is_active?: boolean
          max_score?: number
          min_score?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_parameters_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_scores: {
        Row: {
          company_id: string
          created_at: string | null
          evaluation_id: string
          id: string
          parameter_id: string
          score: number
        }
        Insert: {
          company_id: string
          created_at?: string | null
          evaluation_id: string
          id?: string
          parameter_id: string
          score: number
        }
        Update: {
          company_id?: string
          created_at?: string | null
          evaluation_id?: string
          id?: string
          parameter_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_scores_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_scores_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: false
            referencedRelation: "evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_scores_parameter_id_fkey"
            columns: ["parameter_id"]
            isOneToOne: false
            referencedRelation: "evaluation_parameters"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          comments: string | null
          company_id: string
          created_at: string | null
          employee_id: string
          evaluated_by: string
          id: string
          overall_score: number | null
          period: string
          recommendation: string | null
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          company_id: string
          created_at?: string | null
          employee_id: string
          evaluated_by: string
          id?: string
          overall_score?: number | null
          period: string
          recommendation?: string | null
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          company_id?: string
          created_at?: string | null
          employee_id?: string
          evaluated_by?: string
          id?: string
          overall_score?: number | null
          period?: string
          recommendation?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_documents: {
        Row: {
          company_id: string
          content: string
          created_at: string | null
          created_by: string | null
          designation: string | null
          document_type: string
          id: string
          is_current: boolean
          published_at: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
          version_number: number
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string | null
          created_by?: string | null
          designation?: string | null
          document_type: string
          id?: string
          is_current?: boolean
          published_at?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          version_number?: number
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          designation?: string | null
          document_type?: string
          id?: string
          is_current?: boolean
          published_at?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "hr_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_documents_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          amount: number
          company_id: string
          created_at: string | null
          description: string
          display_order: number
          id: string
          invoice_id: string
          project_id: string | null
          quantity: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          amount?: number
          company_id: string
          created_at?: string | null
          description: string
          display_order?: number
          id?: string
          invoice_id: string
          project_id?: string | null
          quantity?: number
          unit_price?: number
          updated_at?: string | null
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string | null
          description?: string
          display_order?: number
          id?: string
          invoice_id?: string
          project_id?: string | null
          quantity?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          company_id: string
          created_at: string | null
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          recorded_by: string | null
          reference_number: string | null
        }
        Insert: {
          amount?: number
          company_id: string
          created_at?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date: string
          payment_method: string
          recorded_by?: string | null
          reference_number?: string | null
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          recorded_by?: string | null
          reference_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number
          amount_paid: number
          client_id: string
          company_id: string
          created_at: string | null
          currency: string
          discount_amount: number
          due_date: string | null
          generated_by: string | null
          id: string
          invoice_number: string
          notes: string | null
          pdf_url: string | null
          sent_at: string | null
          status: string
          subtotal: number
          title: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount_due?: number
          amount_paid?: number
          client_id: string
          company_id: string
          created_at?: string | null
          currency?: string
          discount_amount?: number
          due_date?: string | null
          generated_by?: string | null
          id?: string
          invoice_number: string
          notes?: string | null
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          title: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          client_id?: string
          company_id?: string
          created_at?: string | null
          currency?: string
          discount_amount?: number
          due_date?: string | null
          generated_by?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          title?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balance_history: {
        Row: {
          adjusted_by: string
          adjustment_days: number
          company_id: string
          created_at: string | null
          id: string
          leave_balance_id: string
          new_balance: number
          previous_balance: number
          reason: string | null
        }
        Insert: {
          adjusted_by: string
          adjustment_days: number
          company_id: string
          created_at?: string | null
          id?: string
          leave_balance_id: string
          new_balance: number
          previous_balance: number
          reason?: string | null
        }
        Update: {
          adjusted_by?: string
          adjustment_days?: number
          company_id?: string
          created_at?: string | null
          id?: string
          leave_balance_id?: string
          new_balance?: number
          previous_balance?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_balance_history_adjusted_by_fkey"
            columns: ["adjusted_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balance_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balance_history_leave_balance_id_fkey"
            columns: ["leave_balance_id"]
            isOneToOne: false
            referencedRelation: "leave_balances"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          adjustment_days: number
          carried_over_days: number
          company_id: string
          created_at: string | null
          employee_id: string
          id: string
          leave_type_id: string
          system_days: number
          updated_at: string | null
          used_days: number
          year: number
        }
        Insert: {
          adjustment_days?: number
          carried_over_days?: number
          company_id: string
          created_at?: string | null
          employee_id: string
          id?: string
          leave_type_id: string
          system_days?: number
          updated_at?: string | null
          used_days?: number
          year: number
        }
        Update: {
          adjustment_days?: number
          carried_over_days?: number
          company_id?: string
          created_at?: string | null
          employee_id?: string
          id?: string
          leave_type_id?: string
          system_days?: number
          updated_at?: string | null
          used_days?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          actioned_at: string | null
          actioned_by: string | null
          company_id: string
          created_at: string | null
          days_requested: number
          employee_id: string
          end_date: string
          id: string
          leave_type_id: string
          reason: string | null
          rejection_reason: string | null
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          actioned_at?: string | null
          actioned_by?: string | null
          company_id: string
          created_at?: string | null
          days_requested?: number
          employee_id: string
          end_date: string
          id?: string
          leave_type_id: string
          reason?: string | null
          rejection_reason?: string | null
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          actioned_at?: string | null
          actioned_by?: string | null
          company_id?: string
          created_at?: string | null
          days_requested?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type_id?: string
          reason?: string | null
          rejection_reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_actioned_by_fkey"
            columns: ["actioned_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          allow_carry_over: boolean
          annual_entitlement: number
          apply_proration: boolean
          company_id: string
          created_at: string | null
          id: string
          is_active: boolean
          is_paid: boolean
          max_carry_over: number
          name: string
          updated_at: string | null
        }
        Insert: {
          allow_carry_over?: boolean
          annual_entitlement?: number
          apply_proration?: boolean
          company_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_paid?: boolean
          max_carry_over?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          allow_carry_over?: boolean
          annual_entitlement?: number
          apply_proration?: boolean
          company_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_paid?: boolean
          max_carry_over?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_types_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_monthly_overrides: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          id: string
          loan_id: string
          month_year: string
          override_amount: number
          reason: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          loan_id: string
          month_year: string
          override_amount?: number
          reason?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          loan_id?: string
          month_year?: string
          override_amount?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_monthly_overrides_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_monthly_overrides_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_monthly_overrides_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          company_id: string
          created_at: string | null
          employee_id: string
          granted_by: string | null
          granted_date: string
          id: string
          monthly_deduction: number
          notes: string | null
          reason: string | null
          remaining_balance: number
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          employee_id: string
          granted_by?: string | null
          granted_date: string
          id?: string
          monthly_deduction?: number
          notes?: string | null
          reason?: string | null
          remaining_balance?: number
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          employee_id?: string
          granted_by?: string | null
          granted_date?: string
          id?: string
          monthly_deduction?: number
          notes?: string | null
          reason?: string | null
          remaining_balance?: number
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          company_id: string
          created_at: string | null
          email_sent: boolean
          email_sent_at: string | null
          id: string
          is_read: boolean
          message: string
          read_at: string | null
          recipient_id: string
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          email_sent?: boolean
          email_sent_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          read_at?: string | null
          recipient_id: string
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          email_sent?: boolean
          email_sent_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          read_at?: string | null
          recipient_id?: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      office_expenses: {
        Row: {
          added_by: string | null
          amount: number
          approved_at: string | null
          approved_by: string | null
          category: string
          company_id: string
          created_at: string | null
          description: string
          id: string
          month_year: string
          receipt_url: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          added_by?: string | null
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          category: string
          company_id: string
          created_at?: string | null
          description: string
          id?: string
          month_year: string
          receipt_url?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          added_by?: string | null
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          company_id?: string
          created_at?: string | null
          description?: string
          id?: string
          month_year?: string
          receipt_url?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "office_expenses_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "office_expenses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "office_expenses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      outsourcing_records: {
        Row: {
          added_by: string | null
          company_id: string
          created_at: string | null
          description: string | null
          fee: number
          id: string
          month_year: string
          name: string
          notes: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          added_by?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          fee?: number
          id?: string
          month_year: string
          name: string
          notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          added_by?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          fee?: number
          id?: string
          month_year?: string
          name?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outsourcing_records_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outsourcing_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          allowance: number
          approved_at: string | null
          approved_by: string | null
          basic_salary: number
          bonus: number
          company_id: string
          created_at: string | null
          dinner_expense: number
          employee_id: string
          final_payment: number
          holiday_ot_amount: number
          holiday_ot_hours: number
          id: string
          loan_deduction: number
          month_year: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_notes: string | null
          payment_processed_by: string | null
          payment_reference: string | null
          regular_ot_amount: number
          regular_ot_hours: number
          status: string
          superseded: boolean
          total_salary: number
          updated_at: string | null
        }
        Insert: {
          allowance?: number
          approved_at?: string | null
          approved_by?: string | null
          basic_salary?: number
          bonus?: number
          company_id: string
          created_at?: string | null
          dinner_expense?: number
          employee_id: string
          final_payment?: number
          holiday_ot_amount?: number
          holiday_ot_hours?: number
          id?: string
          loan_deduction?: number
          month_year: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_notes?: string | null
          payment_processed_by?: string | null
          payment_reference?: string | null
          regular_ot_amount?: number
          regular_ot_hours?: number
          status?: string
          superseded?: boolean
          total_salary?: number
          updated_at?: string | null
        }
        Update: {
          allowance?: number
          approved_at?: string | null
          approved_by?: string | null
          basic_salary?: number
          bonus?: number
          company_id?: string
          created_at?: string | null
          dinner_expense?: number
          employee_id?: string
          final_payment?: number
          holiday_ot_amount?: number
          holiday_ot_hours?: number
          id?: string
          loan_deduction?: number
          month_year?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_notes?: string | null
          payment_processed_by?: string | null
          payment_reference?: string | null
          regular_ot_amount?: number
          regular_ot_hours?: number
          status?: string
          superseded?: boolean
          total_salary?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_payment_processed_by_fkey"
            columns: ["payment_processed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      project_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          company_id: string
          created_at: string | null
          employee_id: string
          id: string
          is_active: boolean
          project_id: string
          removed_at: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          company_id: string
          created_at?: string | null
          employee_id: string
          id?: string
          is_active?: boolean
          project_id: string
          removed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          company_id?: string
          created_at?: string | null
          employee_id?: string
          id?: string
          is_active?: boolean
          project_id?: string
          removed_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_categories: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category_id: string | null
          client_deadline: string | null
          client_id: string
          company_id: string
          created_at: string | null
          fee: number | null
          id: string
          internal_deadline: string | null
          is_active: boolean
          notes: string | null
          priority: string | null
          project_code: string
          project_lead_id: string | null
          project_name: string
          scope_of_work: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          client_deadline?: string | null
          client_id: string
          company_id: string
          created_at?: string | null
          fee?: number | null
          id?: string
          internal_deadline?: string | null
          is_active?: boolean
          notes?: string | null
          priority?: string | null
          project_code: string
          project_lead_id?: string | null
          project_name: string
          scope_of_work?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          client_deadline?: string | null
          client_id?: string
          company_id?: string
          created_at?: string | null
          fee?: number | null
          id?: string
          internal_deadline?: string | null
          is_active?: boolean
          notes?: string | null
          priority?: string | null
          project_code?: string
          project_lead_id?: string | null
          project_name?: string
          scope_of_work?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "project_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_lead_id_fkey"
            columns: ["project_lead_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      public_holidays: {
        Row: {
          company_id: string
          created_at: string | null
          date: string
          id: string
          is_recurring: boolean
          name: string
          year: number
        }
        Insert: {
          company_id: string
          created_at?: string | null
          date: string
          id?: string
          is_recurring?: boolean
          name: string
          year: number
        }
        Update: {
          company_id?: string
          created_at?: string | null
          date?: string
          id?: string
          is_recurring?: boolean
          name?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_holidays_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      role_feature_flags: {
        Row: {
          company_id: string
          created_at: string | null
          feature_key: string
          id: string
          is_enabled: boolean
          role_name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          feature_key: string
          id?: string
          is_enabled?: boolean
          role_name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          feature_key?: string
          id?: string
          is_enabled?: boolean
          role_name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_feature_flags_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_history: {
        Row: {
          approved_by: string | null
          change_type: string
          company_id: string
          created_at: string | null
          effective_date: string
          employee_id: string
          id: string
          new_allowance: number
          new_salary: number
          previous_allowance: number
          previous_salary: number
          reason: string | null
        }
        Insert: {
          approved_by?: string | null
          change_type: string
          company_id: string
          created_at?: string | null
          effective_date: string
          employee_id: string
          id?: string
          new_allowance?: number
          new_salary?: number
          previous_allowance?: number
          previous_salary?: number
          reason?: string | null
        }
        Update: {
          approved_by?: string | null
          change_type?: string
          company_id?: string
          created_at?: string | null
          effective_date?: string
          employee_id?: string
          id?: string
          new_allowance?: number
          new_salary?: number
          previous_allowance?: number
          previous_salary?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_history_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_company_id_for_auth: { Args: { _auth_id: string }; Returns: string }
      get_employee_by_auth_id: {
        Args: { _auth_id: string }
        Returns: {
          avatar_url: string
          company_id: string
          company_name: string
          company_slug: string
          department: string
          designation: string
          email: string
          employee_code: string
          employee_id: string
          full_name: string
          role_name: string
        }[]
      }
      get_employee_id_for_auth: { Args: { _auth_id: string }; Returns: string }
      get_employee_role_for_auth: {
        Args: { _auth_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
