export type Role = 'admin' | 'staff'

export type FieldType = 'text' | 'number' | 'date' | 'boolean'

export interface FieldDefinition {
  id: string
  label: string
  field_key: string
  field_type: FieldType
  is_required: boolean
  sort_order: number
  created_at: string
}

export interface Profile {
  id: string
  role: Role
  full_name: string | null
  email: string | null
  created_at: string
}

export interface Client {
  id: string
  org_id: string | null
  first_name: string
  last_name: string
  date_of_birth: string | null
  phone: string | null
  email: string | null
  gender: string | null
  language: string | null
  household_size: number | null
  custom_fields: Record<string, unknown>
  is_active: boolean
  created_by: string | null
  created_at: string
}

export interface ServiceEntry {
  id: string
  client_id: string
  service_type: string
  service_date: string
  staff_id: string | null
  notes: string | null
  ai_summary: string | null
  follow_up_date: string | null
  created_at: string
  // joined
  staff?: Pick<Profile, 'full_name'>
}

export interface Appointment {
  id: string
  client_id: string
  staff_id: string | null
  scheduled_at: string
  notes: string | null
  created_at: string
  client?: Pick<Client, 'first_name' | 'last_name'>
  staff?: Pick<Profile, 'full_name'>
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: 'create' | 'update' | 'delete'
  table_name: string
  record_id: string | null
  created_at: string
  user?: Pick<Profile, 'full_name'>
}

export const SERVICE_TYPES = [
  'Therapy Session',
  'Food Assistance',
  'Housing Support',
  'Crisis Counseling',
  'Medical Referral',
  'Employment Services',
  'Child Services',
  'Transportation',
  'Financial Assistance',
  'Legal Aid',
  'Other',
] as const

export type ServiceType = (typeof SERVICE_TYPES)[number]
