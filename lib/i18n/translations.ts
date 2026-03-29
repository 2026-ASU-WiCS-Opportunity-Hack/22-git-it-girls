export type Locale = 'en' | 'es'

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇲🇽' },
]

export const translations = {
  en: {
    // Nav
    nav_dashboard: 'Dashboard',
    nav_clients: 'Clients',
    nav_services: 'Services',
    nav_schedule: 'Schedule',
    nav_reports: 'Reports',
    nav_admin: 'Admin',
    nav_custom_fields: 'Custom Fields',
    nav_users: 'Users',
    nav_audit: 'Audit Log',
    nav_sign_out: 'Sign out',

    // Clients page
    clients_title: 'Clients',
    clients_add: 'Add Client',
    clients_import: 'Import CSV',
    clients_export: 'Export CSV',
    clients_search_placeholder: 'Search by name, phone, email…',
    clients_ai_search_placeholder: 'e.g. "clients needing housing help in Spanish"',
    clients_table_name: 'Name',
    clients_table_dob: 'Date of Birth',
    clients_table_language: 'Language',
    clients_table_household: 'Household',
    clients_table_status: 'Status',
    clients_table_action: 'Action',
    clients_view: 'View →',
    status_active: 'Active',
    status_inactive: 'Inactive',

    // Client form
    form_first_name: 'First Name',
    form_last_name: 'Last Name',
    form_phone: 'Phone',
    form_email: 'Email',
    form_dob: 'Date of Birth',
    form_gender: 'Gender',
    form_household: 'Household Size',
    form_language: 'Preferred Language',
    form_address: 'Address',
    form_notes: 'Internal Notes',
    form_save: 'Save Client',
    form_register: 'Register Client',
    form_saving: 'Saving…',
    form_required: 'Fields marked * are required.',

    // Services
    services_title: 'Services',
    services_log: 'Log Service',

    // Dashboard
    dashboard_title: 'Dashboard',
    dashboard_subtitle: 'Overview of your clients and services',
    dashboard_active_clients: 'Active Clients',
    dashboard_services_week: 'Services This Week',
    dashboard_upcoming: 'Upcoming Appointments',
    dashboard_followups: 'Pending Follow-ups',
    dashboard_recent: 'Recent Services',

    // Reports
    reports_title: 'Reports',
    reports_subtitle: 'Program outcomes and service analytics',

    // AI
    ai_summary: 'AI Summary',
    ai_generating: 'Generating summary…',
    ai_search_label: 'AI',
    ai_filters_active: 'AI filters active:',
    ai_service_filter: 'Service:',
    ai_language_filter: 'Language:',
    ai_clear: 'Clear',

    // Photo intake
    photo_scan_title: 'Scan Document with AI',
    photo_scan_desc: 'Upload a photo of an ID, referral letter, or intake form — Claude will extract the fields for you.',
    photo_upload: 'Upload photo',
    photo_extracting: 'Extracting fields…',
    photo_prefilled: 'Fields pre-filled from document scan — please review and correct as needed.',
  },
  es: {
    // Nav
    nav_dashboard: 'Panel',
    nav_clients: 'Clientes',
    nav_services: 'Servicios',
    nav_schedule: 'Agenda',
    nav_reports: 'Reportes',
    nav_admin: 'Admin',
    nav_custom_fields: 'Campos Personalizados',
    nav_users: 'Usuarios',
    nav_audit: 'Registro de Auditoría',
    nav_sign_out: 'Cerrar sesión',

    // Clients page
    clients_title: 'Clientes',
    clients_add: 'Agregar Cliente',
    clients_import: 'Importar CSV',
    clients_export: 'Exportar CSV',
    clients_search_placeholder: 'Buscar por nombre, teléfono, correo…',
    clients_ai_search_placeholder: 'p. ej. "clientes que necesitan ayuda con vivienda en español"',
    clients_table_name: 'Nombre',
    clients_table_dob: 'Fecha de Nacimiento',
    clients_table_language: 'Idioma',
    clients_table_household: 'Hogar',
    clients_table_status: 'Estado',
    clients_table_action: 'Acción',
    clients_view: 'Ver →',
    status_active: 'Activo',
    status_inactive: 'Inactivo',

    // Client form
    form_first_name: 'Nombre',
    form_last_name: 'Apellido',
    form_phone: 'Teléfono',
    form_email: 'Correo electrónico',
    form_dob: 'Fecha de nacimiento',
    form_gender: 'Género',
    form_household: 'Tamaño del hogar',
    form_language: 'Idioma preferido',
    form_address: 'Dirección',
    form_notes: 'Notas internas',
    form_save: 'Guardar cliente',
    form_register: 'Registrar cliente',
    form_saving: 'Guardando…',
    form_required: 'Los campos marcados con * son obligatorios.',

    // Services
    services_title: 'Servicios',
    services_log: 'Registrar servicio',

    // Dashboard
    dashboard_title: 'Panel',
    dashboard_subtitle: 'Resumen de sus clientes y servicios',
    dashboard_active_clients: 'Clientes activos',
    dashboard_services_week: 'Servicios esta semana',
    dashboard_upcoming: 'Citas próximas',
    dashboard_followups: 'Seguimientos pendientes',
    dashboard_recent: 'Servicios recientes',

    // Reports
    reports_title: 'Reportes',
    reports_subtitle: 'Resultados del programa y análisis de servicios',

    // AI
    ai_summary: 'Resumen IA',
    ai_generating: 'Generando resumen…',
    ai_search_label: 'IA',
    ai_filters_active: 'Filtros de IA activos:',
    ai_service_filter: 'Servicio:',
    ai_language_filter: 'Idioma:',
    ai_clear: 'Limpiar',

    // Photo intake
    photo_scan_title: 'Escanear documento con IA',
    photo_scan_desc: 'Suba una foto de una identificación, carta de referencia o formulario — Claude extraerá los campos por usted.',
    photo_upload: 'Subir foto',
    photo_extracting: 'Extrayendo campos…',
    photo_prefilled: 'Campos pre-completados desde el escaneo — por favor revise y corrija según sea necesario.',
  },
} satisfies Record<Locale, Record<string, string>>

export type TranslationKey = keyof (typeof translations)['en']
