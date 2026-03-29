-- ============================================================
-- CareTrack: Seed Data
-- Run AFTER 001_initial_schema.sql
-- Represents clients from multiple nonprofit types (food bank,
-- therapy, animal rescue, housing) to show adaptability.
-- ============================================================

-- ============================================================
-- CLIENTS (12 clients across nonprofit types)
-- ============================================================
insert into clients (id, first_name, last_name, date_of_birth, phone, email, gender, language, household_size, address, notes, custom_fields, is_active) values

-- Food bank clients
('10000000-0000-0000-0000-000000000001', 'Maria', 'Gonzalez', '1985-03-12', '(602) 555-0101', 'maria.g@email.com', 'Female', 'Spanish', 4, '1234 W Camelback Rd, Phoenix, AZ 85013', 'Family of four, primary earner recently laid off.', '{"dietary_restrictions": "Gluten-free", "pantry_visits_this_year": 6}', true),
('10000000-0000-0000-0000-000000000002', 'James', 'Williams', '1972-07-22', '(602) 555-0102', null, 'Male', 'English', 1, '456 N 7th Ave, Phoenix, AZ 85007', 'Single adult, veteran. Referred by VA.', '{"dietary_restrictions": "None", "pantry_visits_this_year": 12}', true),
('10000000-0000-0000-0000-000000000003', 'Aisha', 'Patel', '1990-11-05', '(480) 555-0103', 'aisha.p@email.com', 'Female', 'English', 3, '789 E Van Buren St, Chandler, AZ 85225', 'Single mother with two children.', '{"dietary_restrictions": "Halal", "pantry_visits_this_year": 8}', true),

-- Therapy / counseling clients (NMTSA / Chandler CARE)
('10000000-0000-0000-0000-000000000004', 'Carlos', 'Reyes', '2008-04-18', '(602) 555-0104', null, 'Male', 'Spanish', 5, '321 S Mill Ave, Tempe, AZ 85281', 'Teenager, referred for music therapy. Shows strong interest in percussion.', '{"instrument": "Drums", "session_frequency": "Weekly", "insurance": "AHCCCS"}', true),
('10000000-0000-0000-0000-000000000005', 'Sarah', 'Thompson', '1995-09-30', '(480) 555-0105', 'sarah.t@email.com', 'Female', 'English', 1, '654 N Scottsdale Rd, Scottsdale, AZ 85251', 'Anxiety and depression. In crisis stabilization program.', '{"instrument": "Piano", "session_frequency": "Bi-weekly", "insurance": "Blue Cross"}', true),
('10000000-0000-0000-0000-000000000006', 'Michael', 'Chen', '1988-01-14', '(623) 555-0106', 'mchen@email.com', 'Male', 'English', 2, '987 W Glendale Ave, Glendale, AZ 85301', 'Rehabilitation from spinal cord injury. Will2Walk program participant.', '{"injury_level": "T6", "mobility_aid": "Wheelchair", "program": "Will2Walk"}', true),

-- Animal rescue (Lost Our Home)
('10000000-0000-0000-0000-000000000007', 'Emily', 'Foster', '1978-06-25', '(602) 555-0107', 'emily.f@email.com', 'Female', 'English', 2, '147 E Indian School Rd, Phoenix, AZ 85016', 'Pet owner surrendering 2 dogs due to housing loss.', '{"pet_type": "Dog", "pet_count": 2, "surrender_reason": "Housing"}', false),
('10000000-0000-0000-0000-000000000008', 'Robert', 'Kim', '1965-12-03', '(602) 555-0108', null, 'Male', 'Korean', 1, '258 S Central Ave, Phoenix, AZ 85004', 'Senior adopter, approved for senior dog adoption.', '{"pet_type": "Dog", "adopter_status": "Approved", "home_type": "Apartment"}', true),

-- Housing / crisis services (Chandler CARE)
('10000000-0000-0000-0000-000000000009', 'Lisa', 'Martinez', '1982-08-17', '(480) 555-0109', 'lisa.m@email.com', 'Female', 'Spanish', 3, 'Shelter - 1200 N Arizona Ave, Chandler, AZ 85225', 'Fleeing domestic violence. Emergency placement.', '{"housing_status": "Emergency shelter", "safety_plan": true, "case_priority": "High"}', true),
('10000000-0000-0000-0000-000000000010', 'David', 'Johnson', '1958-02-28', '(602) 555-0110', null, 'Male', 'English', 1, '369 W Thomas Rd, Phoenix, AZ 85013', 'Chronic homelessness. Connected to housing voucher waitlist.', '{"housing_status": "Unhoused", "voucher_status": "Waitlist", "case_priority": "Medium"}', true),

-- Youth services (Sunshine Acres)
('10000000-0000-0000-0000-000000000011', 'Destiny', 'Brown', '2012-05-09', null, null, 'Female', 'English', null, 'Sunshine Acres, 1st Place, Mesa AZ', 'Child in residential care. Placement since Jan 2025.', '{"placement_type": "Residential", "health_status": "Good", "education": "6th grade"}', true),
('10000000-0000-0000-0000-000000000012', 'Noah', 'Davis', '2010-10-21', null, null, 'Male', 'English', null, 'Sunshine Acres, 1st Place, Mesa AZ', 'Child in residential care. Awaiting foster family match.', '{"placement_type": "Residential", "health_status": "Good", "education": "8th grade"}', true);

-- ============================================================
-- SERVICE ENTRIES (35 entries)
-- ============================================================
insert into service_entries (client_id, service_type, service_date, notes, follow_up_date) values

-- Maria Gonzalez - food bank
('10000000-0000-0000-0000-000000000001', 'Food Assistance', '2026-01-08', 'Family received 2-week supply. Requested info on ESL classes for mother. Provided community resource list.', '2026-01-22'),
('10000000-0000-0000-0000-000000000001', 'Food Assistance', '2026-01-22', 'Second visit. Household size confirmed at 4. Kids doing well in school. Father attending job training.', '2026-02-05'),
('10000000-0000-0000-0000-000000000001', 'Employment Services', '2026-02-01', 'Referred to Goodwill resume workshop. Father secured part-time work. Reducing visit frequency to monthly.', '2026-03-01'),
('10000000-0000-0000-0000-000000000001', 'Food Assistance', '2026-03-01', 'Monthly supply. Family stable. Father working full-time now. Still qualifying for assistance.', null),

-- James Williams - food bank
('10000000-0000-0000-0000-000000000002', 'Food Assistance', '2026-01-05', 'Veteran, weekly pickup. Mentioned knee pain making it hard to stand in line. Will arrange front-of-line access.', '2026-01-12'),
('10000000-0000-0000-0000-000000000002', 'Food Assistance', '2026-01-12', 'Weekly pickup. Connected to VA healthcare referral. Knee issue flagged for follow-up.', '2026-01-19'),
('10000000-0000-0000-0000-000000000002', 'Medical Referral', '2026-01-15', 'Referred to VA orthopedics for knee evaluation. Provided transportation voucher for appointment.', '2026-02-01'),
('10000000-0000-0000-0000-000000000002', 'Food Assistance', '2026-01-19', 'Confirmed VA appointment scheduled. Client in good spirits.', null),
('10000000-0000-0000-0000-000000000002', 'Food Assistance', '2026-02-02', 'Post-VA visit. Surgery scheduled for March. Ensuring continued food access during recovery.', '2026-03-15'),

-- Aisha Patel - food bank
('10000000-0000-0000-0000-000000000003', 'Food Assistance', '2026-01-10', 'First visit. Single mother, 2 children ages 4 and 7. Halal food provided. Also inquired about childcare.', '2026-01-24'),
('10000000-0000-0000-0000-000000000003', 'Child Services', '2026-01-20', 'Connected to Head Start program for 4-year-old. Enrollment confirmed for February.', '2026-02-01'),
('10000000-0000-0000-0000-000000000003', 'Food Assistance', '2026-02-07', 'Bi-weekly visit. Head Start going well. Child adjustment positive. Food supply adequate.', null),

-- Carlos Reyes - music therapy
('10000000-0000-0000-0000-000000000004', 'Therapy Session', '2026-01-06', 'Initial assessment. Strong rhythm sense, minimal verbal engagement. Set goals: self-expression through music.', '2026-01-13'),
('10000000-0000-0000-0000-000000000004', 'Therapy Session', '2026-01-13', 'Session 2. Worked on drum patterns. Noticeable increase in eye contact and participation. Parent report positive.', '2026-01-20'),
('10000000-0000-0000-0000-000000000004', 'Therapy Session', '2026-01-20', 'Session 3. Introduced improvisation. Carlos led a 5-min improvised piece. Milestone moment.', '2026-01-27'),
('10000000-0000-0000-0000-000000000004', 'Therapy Session', '2026-02-03', 'Session 4. Collaborative piece with therapist. Discussing family involvement in next session.', '2026-02-10'),

-- Sarah Thompson - crisis counseling
('10000000-0000-0000-0000-000000000005', 'Crisis Counseling', '2026-01-08', 'Crisis intake. Client in acute distress. Safety plan established. Referred to psychiatry for medication eval.', '2026-01-10'),
('10000000-0000-0000-0000-000000000005', 'Crisis Counseling', '2026-01-10', '48-hour follow-up. Client stabilized. Starting outpatient program Monday. Emergency contact confirmed.', '2026-01-15'),
('10000000-0000-0000-0000-000000000005', 'Therapy Session', '2026-01-15', 'First outpatient session. Mood 4/10, improved from 2/10 at intake. Coping strategies reviewed.', '2026-01-22'),
('10000000-0000-0000-0000-000000000005', 'Therapy Session', '2026-02-05', 'Session 4. Mood 6/10. Returned to part-time work. Medication adjusted by psychiatrist last week.', '2026-02-19'),

-- Michael Chen - rehab
('10000000-0000-0000-0000-000000000006', 'Therapy Session', '2026-01-07', 'Will2Walk intake. T6 complete injury, 2 years post. Motivated and goal-oriented. Began standing frame protocol.', '2026-01-14'),
('10000000-0000-0000-0000-000000000006', 'Therapy Session', '2026-01-14', 'Session 2. Achieved 10-minute standing frame session. No orthostatic hypotension. Excellent progress.', '2026-01-21'),
('10000000-0000-0000-0000-000000000006', 'Therapy Session', '2026-02-04', 'Session 5. Introduced exoskeleton trial. 3 steps assisted. Major milestone for client and family.', '2026-02-11'),

-- Lisa Martinez - crisis / housing
('10000000-0000-0000-0000-000000000009', 'Crisis Counseling', '2026-01-09', 'Emergency intake, DV situation. Placed in shelter. Children safe. Protective order filing in process.', '2026-01-11'),
('10000000-0000-0000-0000-000000000009', 'Crisis Counseling', '2026-01-11', 'Follow-up. Protective order granted. Legal aid referral made. Client and children adjusting to shelter.', '2026-01-16'),
('10000000-0000-0000-0000-000000000009', 'Housing Support', '2026-01-20', 'Began rapid rehousing assessment. Income verification in progress. 2 units identified in safe area.', '2026-02-01'),
('10000000-0000-0000-0000-000000000009', 'Housing Support', '2026-02-05', 'Unit secured. Move-in scheduled Feb 15. Provided furniture voucher and move-in assistance.', '2026-02-15'),

-- David Johnson - housing
('10000000-0000-0000-0000-000000000010', 'Housing Support', '2026-01-12', 'Intake, chronic homelessness 3+ years. Applied for HUD-VASH voucher. Documents collected.', '2026-02-01'),
('10000000-0000-0000-0000-000000000010', 'Housing Support', '2026-02-03', 'Voucher application submitted. Waitlist estimate 4-6 months. Connecting to day shelter services.', '2026-03-01'),
('10000000-0000-0000-0000-000000000010', 'Food Assistance', '2026-02-10', 'Weekly food box. Client stable. Mentioned wanting to volunteer at the food bank. Will connect to volunteer coordinator.', null),

-- Destiny Brown - youth
('10000000-0000-0000-0000-000000000011', 'Child Services', '2026-01-06', 'Monthly check-in. Adjustment to residential care going well. Excelling in school. 3rd-grade reading level above grade.', '2026-02-06'),
('10000000-0000-0000-0000-000000000011', 'Child Services', '2026-02-06', 'Monthly check-in. Participated in talent show. Foster family interest from Chandler couple - assessment scheduled.', '2026-03-06'),

-- Noah Davis - youth
('10000000-0000-0000-0000-000000000012', 'Child Services', '2026-01-07', 'Monthly check-in. Struggling with peer relationships. Referred to school counselor. Basketball interest noted.', '2026-02-07'),
('10000000-0000-0000-0000-000000000012', 'Child Services', '2026-02-07', 'Monthly check-in. School counseling helping. Joined basketball team. Mood notably improved.', '2026-03-07'),
('10000000-0000-0000-0000-000000000012', 'Child Services', '2026-03-07', 'Monthly check-in. Team made playoffs. Noah is thriving. Potential foster family match identified for April.', '2026-04-07');

-- ============================================================
-- APPOINTMENTS (upcoming)
-- ============================================================
insert into appointments (client_id, scheduled_at, notes, status) values
('10000000-0000-0000-0000-000000000004', '2026-04-01 10:00:00+00', 'Weekly music therapy session', 'scheduled'),
('10000000-0000-0000-0000-000000000005', '2026-04-01 14:00:00+00', 'Bi-weekly therapy check-in', 'scheduled'),
('10000000-0000-0000-0000-000000000006', '2026-04-02 09:00:00+00', 'Exoskeleton training session', 'scheduled'),
('10000000-0000-0000-0000-000000000001', '2026-04-03 11:00:00+00', 'Monthly food assistance pickup', 'scheduled'),
('10000000-0000-0000-0000-000000000009', '2026-04-02 13:00:00+00', 'Post-move-in follow-up check', 'scheduled'),
('10000000-0000-0000-0000-000000000011', '2026-04-06 10:00:00+00', 'Foster family assessment meeting', 'scheduled'),
('10000000-0000-0000-0000-000000000012', '2026-04-07 15:00:00+00', 'Monthly child services check-in', 'scheduled');
