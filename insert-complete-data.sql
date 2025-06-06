-- ==========================================
-- SCRIPT COMPLETO DE DATOS PARA BANQUITO
-- ==========================================
-- Este script inserta datos completos de ejemplo incluyendo:
-- 1. Configuraciones del sistema
-- 2. Miembros con diferentes perfiles
-- 3. Usuarios del sistema
-- 4. Planes de ahorro
-- 5. Solicitudes de préstamo
-- 6. Préstamos activos
-- 7. Historial de pagos

-- ==========================================
-- 1. CONFIGURACIONES DEL SISTEMA
-- ==========================================

INSERT INTO settings (key, value, description, category, created_at, updated_at) VALUES
-- Configuraciones financieras
('shareValue', '500', 'Valor por acción en pesos', 'financial', NOW(), NOW()),
('loanLimits', '{"individual": 8000, "guaranteePercentage": 80}', 'Límites de préstamos', 'financial', NOW(), NOW()),
('monthlyInterestRates', '{"high": 3, "medium": 5, "low": 10}', 'Tasas de interés mensual por tramo', 'financial', NOW(), NOW()),
('delinquencyRate', '5.0', 'Tasa de recargo por mora (%)', 'financial', NOW(), NOW()),

-- Configuraciones del sistema
('operationDay', 'wednesday', 'Día de operaciones de la semana', 'system', NOW(), NOW()),
('systemName', 'Sistema Banquito', 'Nombre del sistema', 'system', NOW(), NOW()),
('companyInfo', '{"name": "Cooperativa Banquito", "address": "Av. Principal 123", "phone": "555-0123", "email": "info@banquito.com"}', 'Información de la empresa', 'system', NOW(), NOW())

ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- ==========================================
-- 2. MIEMBROS (SOCIOS)
-- ==========================================

INSERT INTO members (id, name, dni, shares, guarantee, credit_score, credit_rating, phone, email, address, is_active, created_at, updated_at) VALUES
-- Socios con buen historial
(1, 'Juan Pérez García', '12345678', 10, 5000.00, 85, 'green', '555-0101', 'juan.perez@email.com', 'Calle Principal 123, Arteaga', true, NOW(), NOW()),
(2, 'María Elena Rodríguez', '23456789', 6, 3000.00, 75, 'green', '555-0102', 'maria.rodriguez@email.com', 'Av. Libertad 456, Arteaga', true, NOW(), NOW()),
(3, 'Carlos Alberto López', '34567890', 15, 7500.00, 80, 'green', '555-0103', 'carlos.lopez@email.com', 'Calle Hidalgo 789, Arteaga', true, NOW(), NOW()),

-- Socios con historial regular
(4, 'Ana Lucía Martínez', '45678901', 4, 2000.00, 60, 'yellow', '555-0104', 'ana.martinez@email.com', 'Calle Morelos 321, Arteaga', true, NOW(), NOW()),
(5, 'Roberto Sánchez', '56789012', 8, 4000.00, 65, 'yellow', '555-0105', 'roberto.sanchez@email.com', 'Av. Juárez 654, Arteaga', true, NOW(), NOW()),

-- Socio con historial malo
(6, 'Patricia Gómez', '67890123', 2, 1000.00, 30, 'red', '555-0106', 'patricia.gomez@email.com', 'Calle Allende 987, Arteaga', true, NOW(), NOW()),

-- Socio nuevo
(7, 'Luis Fernando Castro', '78901234', 5, 2500.00, 50, 'yellow', '555-0107', 'luis.castro@email.com', 'Av. Revolución 147, Arteaga', true, NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    shares = EXCLUDED.shares,
    guarantee = EXCLUDED.guarantee,
    credit_score = EXCLUDED.credit_score,
    credit_rating = EXCLUDED.credit_rating,
    updated_at = NOW();

-- ==========================================
-- 3. USUARIOS DEL SISTEMA
-- ==========================================

INSERT INTO users (id, username, password_hash, role, name, member_id, is_active, last_login, created_at, updated_at) VALUES
-- Usuario administrador (sin member_id)
(1, 'admin', '$2b$10$rOZhQQJxAWP5UhXEKG5T3.Y8K8j9LQZg6KfQJ8X9v8H5G8K5L8N2O', 'admin', 'Administrador Sistema', NULL, true, NOW(), NOW(), NOW()),

-- Usuarios miembros
(2, 'juan.perez', '$2b$10$rOZhQQJxAWP5UhXEKG5T3.Y8K8j9LQZg6KfQJ8X9v8H5G8K5L8N2O', 'member', 'Juan Pérez García', 1, true, NOW(), NOW(), NOW()),
(3, 'maria.rodriguez', '$2b$10$rOZhQQJxAWP5UhXEKG5T3.Y8K8j9LQZg6KfQJ8X9v8H5G8K5L8N2O', 'member', 'María Elena Rodríguez', 2, true, NOW(), NOW(), NOW()),
(4, 'carlos.lopez', '$2b$10$rOZhQQJxAWP5UhXEKG5T3.Y8K8j9LQZg6KfQJ8X9v8H5G8K5L8N2O', 'member', 'Carlos Alberto López', 3, true, NULL, NOW(), NOW()),
(5, 'ana.martinez', '$2b$10$rOZhQQJxAWP5UhXEKG5T3.Y8K8j9LQZg6KfQJ8X9v8H5G8K5L8N2O', 'member', 'Ana Lucía Martínez', 4, true, NULL, NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET 
    username = EXCLUDED.username,
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    member_id = EXCLUDED.member_id,
    updated_at = NOW();

-- ==========================================
-- 4. PLANES DE AHORRO
-- ==========================================

INSERT INTO savings_plans (id, member_id, current_shares, target_shares, monthly_contribution, is_active, created_at, updated_at) VALUES
-- Planes activos
(1, 1, 10, 20, 250.00, true, NOW(), NOW()),  -- Juan quiere duplicar sus acciones
(2, 2, 6, 12, 300.00, true, NOW(), NOW()),   -- María quiere duplicar sus acciones
(3, 3, 15, 25, 500.00, true, NOW(), NOW()),  -- Carlos quiere crecer moderadamente
(4, 4, 4, 10, 300.00, true, NOW(), NOW()),   -- Ana quiere crecer significativamente
(5, 5, 8, 15, 350.00, true, NOW(), NOW()),   -- Roberto crecimiento moderado
(6, 6, 2, 5, 150.00, true, NOW(), NOW()),    -- Patricia crecimiento lento
(7, 7, 5, 8, 150.00, true, NOW(), NOW())     -- Luis crecimiento inicial

ON CONFLICT (id) DO UPDATE SET 
    current_shares = EXCLUDED.current_shares,
    target_shares = EXCLUDED.target_shares,
    monthly_contribution = EXCLUDED.monthly_contribution,
    updated_at = NOW();

-- ==========================================
-- 5. SOLICITUDES DE PRÉSTAMO
-- ==========================================

INSERT INTO loan_requests (id, member_id, requested_amount, purpose, status, request_date, reviewed_by, review_date, notes, created_at, updated_at) VALUES
-- Solicitudes aprobadas (que se convertirán en préstamos)
(1, 1, 3000.00, 'Expansión de negocio familiar', 'approved', '2025-05-15', 'Administrador Sistema', '2025-05-16', 'Socio con excelente historial crediticio', NOW(), NOW()),
(2, 2, 2500.00, 'Reparación de vivienda', 'approved', '2025-05-20', 'Administrador Sistema', '2025-05-21', 'Aprobado por buen historial', NOW(), NOW()),
(3, 3, 5000.00, 'Compra de equipo de trabajo', 'approved', '2025-06-01', 'Administrador Sistema', '2025-06-02', 'Préstamo de alto monto aprobado', NOW(), NOW()),

-- Solicitudes pendientes
(4, 4, 1500.00, 'Gastos médicos', 'pending', '2025-06-05', NULL, NULL, NULL, NOW(), NOW()),
(5, 5, 2000.00, 'Inversión en negocio', 'pending', '2025-06-06', NULL, NULL, NULL, NOW(), NOW()),

-- Solicitud rechazada
(6, 6, 3000.00, 'Gastos personales', 'rejected', '2025-05-10', 'Administrador Sistema', '2025-05-11', 'Rechazado por historial crediticio deficiente', NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET 
    status = EXCLUDED.status,
    reviewed_by = EXCLUDED.reviewed_by,
    review_date = EXCLUDED.review_date,
    notes = EXCLUDED.notes,
    updated_at = NOW();

-- ==========================================
-- 6. PRÉSTAMOS ACTIVOS
-- ==========================================

INSERT INTO loans (id, member_id, loan_request_id, original_amount, remaining_amount, monthly_interest_rate, weekly_payment, total_weeks, current_week, status, start_date, due_date, approved_by, notes, created_at, updated_at) VALUES
-- Préstamo de Juan (en curso, al día)
(1, 1, 1, 3000.00, 2100.00, 5.00, 168.75, 24, 8, 'current', '2025-05-16', '2025-06-13', 'Administrador Sistema', 'Préstamo para expansión de negocio', NOW(), NOW()),

-- Préstamo de María (en curso, con algunos pagos)
(2, 2, 2, 2500.00, 2000.00, 5.00, 140.62, 24, 4, 'current', '2025-05-21', '2025-06-11', 'Administrador Sistema', 'Préstamo para reparación de vivienda', NOW(), NOW()),

-- Préstamo de Carlos (recién iniciado)
(3, 3, 3, 5000.00, 5000.00, 3.00, 234.37, 32, 0, 'current', '2025-06-02', '2025-06-09', 'Administrador Sistema', 'Préstamo de alto monto para equipo', NOW(), NOW()),

-- Préstamo antiguo completamente pagado
(4, 1, NULL, 1500.00, 0.00, 10.00, 81.25, 20, 20, 'paid', '2024-12-01', '2025-04-20', 'Administrador Sistema', 'Préstamo anterior completado', NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET 
    remaining_amount = EXCLUDED.remaining_amount,
    current_week = EXCLUDED.current_week,
    status = EXCLUDED.status,
    due_date = EXCLUDED.due_date,
    updated_at = NOW();

-- ==========================================
-- 7. HISTORIAL DE PAGOS
-- ==========================================

INSERT INTO payments (id, loan_id, amount, payment_date, week_number, late_fee, notes, created_by, created_at, updated_at) VALUES
-- Pagos del préstamo de Juan (loan_id = 1)
(1, 1, 168.75, '2025-05-16', 1, 0.00, 'Primer pago puntual', 'Administrador Sistema', NOW(), NOW()),
(2, 1, 168.75, '2025-05-23', 2, 0.00, 'Segundo pago puntual', 'Administrador Sistema', NOW(), NOW()),
(3, 1, 168.75, '2025-05-30', 3, 0.00, 'Tercer pago puntual', 'Administrador Sistema', NOW(), NOW()),
(4, 1, 177.19, '2025-06-08', 4, 8.44, 'Pago con 2 días de retraso', 'Administrador Sistema', NOW(), NOW()),
(5, 1, 168.75, '2025-06-13', 5, 0.00, 'Pago recuperado a tiempo', 'Administrador Sistema', NOW(), NOW()),
(6, 1, 168.75, '2025-06-20', 6, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(7, 1, 168.75, '2025-06-27', 7, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(8, 1, 168.75, '2025-07-04', 8, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),

-- Pagos del préstamo de María (loan_id = 2)
(9, 2, 140.62, '2025-05-21', 1, 0.00, 'Primer pago puntual', 'Administrador Sistema', NOW(), NOW()),
(10, 2, 140.62, '2025-05-28', 2, 0.00, 'Segundo pago puntual', 'Administrador Sistema', NOW(), NOW()),
(11, 2, 140.62, '2025-06-04', 3, 0.00, 'Tercer pago puntual', 'Administrador Sistema', NOW(), NOW()),
(12, 2, 147.65, '2025-06-12', 4, 7.03, 'Pago con 1 día de retraso', 'Administrador Sistema', NOW(), NOW()),

-- Historial completo del préstamo pagado de Juan (loan_id = 4)
(13, 4, 81.25, '2024-12-01', 1, 0.00, 'Inicio de pagos', 'Administrador Sistema', NOW(), NOW()),
(14, 4, 81.25, '2024-12-08', 2, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(15, 4, 81.25, '2024-12-15', 3, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(16, 4, 81.25, '2024-12-22', 4, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(17, 4, 81.25, '2024-12-29', 5, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(18, 4, 81.25, '2025-01-05', 6, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(19, 4, 81.25, '2025-01-12', 7, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(20, 4, 81.25, '2025-01-19', 8, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(21, 4, 81.25, '2025-01-26', 9, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(22, 4, 81.25, '2025-02-02', 10, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(23, 4, 81.25, '2025-02-09', 11, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(24, 4, 81.25, '2025-02-16', 12, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(25, 4, 81.25, '2025-02-23', 13, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(26, 4, 81.25, '2025-03-02', 14, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(27, 4, 81.25, '2025-03-09', 15, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(28, 4, 81.25, '2025-03-16', 16, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(29, 4, 81.25, '2025-03-23', 17, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(30, 4, 81.25, '2025-03-30', 18, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(31, 4, 81.25, '2025-04-06', 19, 0.00, 'Pago puntual', 'Administrador Sistema', NOW(), NOW()),
(32, 4, 81.25, '2025-04-13', 20, 0.00, 'Pago final - Préstamo completado', 'Administrador Sistema', NOW(), NOW())

ON CONFLICT (id) DO UPDATE SET 
    amount = EXCLUDED.amount,
    payment_date = EXCLUDED.payment_date,
    late_fee = EXCLUDED.late_fee,
    notes = EXCLUDED.notes,
    updated_at = NOW();

-- ==========================================
-- 8. ACTUALIZAR SECUENCIAS
-- ==========================================

-- Actualizar las secuencias para que los próximos IDs sean correctos
SELECT setval('members_id_seq', (SELECT MAX(id) FROM members));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('savings_plans_id_seq', (SELECT MAX(id) FROM savings_plans));
SELECT setval('loan_requests_id_seq', (SELECT MAX(id) FROM loan_requests));
SELECT setval('loans_id_seq', (SELECT MAX(id) FROM loans));
SELECT setval('payments_id_seq', (SELECT MAX(id) FROM payments));
SELECT setval('settings_id_seq', (SELECT MAX(id) FROM settings));

-- ==========================================
-- 9. VERIFICACIÓN DE DATOS INSERTADOS
-- ==========================================

-- Mostrar resumen de datos insertados
SELECT 'CONFIGURACIONES' as tabla, COUNT(*) as total FROM settings
UNION ALL
SELECT 'MIEMBROS' as tabla, COUNT(*) as total FROM members
UNION ALL
SELECT 'USUARIOS' as tabla, COUNT(*) as total FROM users
UNION ALL
SELECT 'PLANES DE AHORRO' as tabla, COUNT(*) as total FROM savings_plans
UNION ALL
SELECT 'SOLICITUDES' as tabla, COUNT(*) as total FROM loan_requests
UNION ALL
SELECT 'PRÉSTAMOS' as tabla, COUNT(*) as total FROM loans
UNION ALL
SELECT 'PAGOS' as tabla, COUNT(*) as total FROM payments;

-- Mostrar estadísticas bancarias
SELECT 
    'CAPITAL BASE' as concepto,
    CONCAT('$', TO_CHAR(SUM(m.shares * 500), 'FM999,999,999.00')) as valor
FROM members m WHERE m.is_active = true
UNION ALL
SELECT 
    'PRÉSTAMOS ACTIVOS' as concepto,
    CONCAT('$', TO_CHAR(SUM(l.remaining_amount), 'FM999,999,999.00')) as valor
FROM loans l WHERE l.status IN ('current', 'overdue')
UNION ALL
SELECT 
    'TOTAL PAGADO' as concepto,
    CONCAT('$', TO_CHAR(SUM(p.amount), 'FM999,999,999.00')) as valor
FROM payments p
UNION ALL
SELECT 
    'MORA COBRADA' as concepto,
    CONCAT('$', TO_CHAR(SUM(p.late_fee), 'FM999,999,999.00')) as valor
FROM payments p;

-- ==========================================
-- COMPLETADO
-- ==========================================
-- El script ha insertado:
-- ✓ 7 configuraciones del sistema
-- ✓ 7 miembros con diferentes perfiles crediticios
-- ✓ 5 usuarios (1 admin + 4 miembros)
-- ✓ 7 planes de ahorro activos
-- ✓ 6 solicitudes de préstamo (3 aprobadas, 2 pendientes, 1 rechazada)
-- ✓ 4 préstamos (3 activos, 1 completado)
-- ✓ 32 pagos de ejemplo con historia realista
-- 
-- Credenciales de login (password: 123456 para todos):
-- - admin / 123456 (Administrador)
-- - juan.perez / 123456 (Miembro)
-- - maria.rodriguez / 123456 (Miembro)
-- - carlos.lopez / 123456 (Miembro)
-- - ana.martinez / 123456 (Miembro)