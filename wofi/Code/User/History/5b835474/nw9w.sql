-- Criação das tabelas para RBAC
CREATE TABLE IF NOT EXISTS permissions (
    name VARCHAR(100) PRIMARY KEY,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    UNIQUE KEY unique_permission (resource, action)
);

CREATE TABLE IF NOT EXISTS roles (
    name VARCHAR(100) PRIMARY KEY,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_name VARCHAR(100),
    permission_name VARCHAR(100),
    PRIMARY KEY (role_name, permission_name),
    FOREIGN KEY (role_name) REFERENCES roles(name) ON DELETE CASCADE,
    FOREIGN KEY (permission_name) REFERENCES permissions(name) ON DELETE CASCADE
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    last_login DATETIME,
    failed_login_attempts INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(100),
    role_name VARCHAR(100),
    PRIMARY KEY (user_id, role_name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_name) REFERENCES roles(name) ON DELETE CASCADE
);

-- Tabela de auditoria
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    action VARCHAR(50) NOT NULL,
    user_id VARCHAR(100),
    username VARCHAR(100),
    timestamp DATETIME NOT NULL,
    client_ip VARCHAR(45),
    user_agent VARCHAR(500),
    old_values TEXT,
    new_values TEXT,
    description VARCHAR(1000),
    result VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    error_message VARCHAR(1000),
    INDEX idx_user_id (user_id),
    INDEX idx_entity (entity_name, entity_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action),
    INDEX idx_result (result)
);

-- Tabelas de auditoria do Envers
CREATE TABLE IF NOT EXISTS permissions_aud (
    name VARCHAR(100) NOT NULL,
    rev INTEGER NOT NULL,
    revtype TINYINT,
    resource VARCHAR(100),
    action VARCHAR(50),
    description TEXT,
    PRIMARY KEY (name, rev)
);

CREATE TABLE IF NOT EXISTS roles_aud (
    name VARCHAR(100) NOT NULL,
    rev INTEGER NOT NULL,
    revtype TINYINT,
    description TEXT,
    PRIMARY KEY (name, rev)
);

CREATE TABLE IF NOT EXISTS users_aud (
    id VARCHAR(100) NOT NULL,
    rev INTEGER NOT NULL,
    revtype TINYINT,
    username VARCHAR(100),
    email VARCHAR(255),
    password VARCHAR(255),
    active BOOLEAN,
    locked BOOLEAN,
    created_at DATETIME,
    last_login DATETIME,
    failed_login_attempts INT,
    PRIMARY KEY (id, rev)
);

CREATE TABLE IF NOT EXISTS revinfo (
    rev INTEGER AUTO_INCREMENT PRIMARY KEY,
    revtstmp BIGINT
);

-- Inserção de permissões básicas
INSERT IGNORE INTO permissions (name, resource, action, description) VALUES
('system_read', 'system', 'read', 'Read system information'),
('system_write', 'system', 'write', 'Write system information'),
('user_read', 'user', 'read', 'Read user information'),
('user_write', 'user', 'write', 'Write user information'),
('user_create', 'user', 'create', 'Create new users'),
('user_delete', 'user', 'delete', 'Delete users'),
('role_read', 'role', 'read', 'Read role information'),
('role_create', 'role', 'create', 'Create new roles'),
('role_update', 'role', 'update', 'Update roles'),
('role_delete', 'role', 'delete', 'Delete roles'),
('permission_read', 'permission', 'read', 'Read permission information'),
('permission_create', 'permission', 'create', 'Create new permissions'),
('permission_update', 'permission', 'update', 'Update permissions'),
('permission_delete', 'permission', 'delete', 'Delete permissions'),
('audit_read', 'audit', 'read', 'Read audit logs');

-- Inserção de roles básicos
INSERT IGNORE INTO roles (name, description) VALUES
('ADMIN', 'System Administrator with full access'),
('MANAGER', 'Manager with limited administrative access'),
('USER', 'Regular user with basic access'),
('VIEWER', 'Read-only access');

-- Atribuição de permissões aos roles
INSERT IGNORE INTO role_permissions (role_name, permission_name) VALUES
-- ADMIN tem todas as permissões
('ADMIN', 'system_read'),
('ADMIN', 'system_write'),
('ADMIN', 'user_read'),
('ADMIN', 'user_write'),
('ADMIN', 'user_create'),
('ADMIN', 'user_delete'),
('ADMIN', 'role_read'),
('ADMIN', 'role_create'),
('ADMIN', 'role_update'),
('ADMIN', 'role_delete'),
('ADMIN', 'permission_read'),
('ADMIN', 'permission_create'),
('ADMIN', 'permission_update'),
('ADMIN', 'permission_delete'),
('ADMIN', 'audit_read'),

-- MANAGER tem permissões limitadas
('MANAGER', 'system_read'),
('MANAGER', 'user_read'),
('MANAGER', 'user_write'),
('MANAGER', 'user_create'),
('MANAGER', 'role_read'),
('MANAGER', 'permission_read'),
('MANAGER', 'audit_read'),

-- USER tem permissões básicas
('USER', 'system_read'),
('USER', 'user_read'),

-- VIEWER tem apenas leitura
('VIEWER', 'system_read'),
('VIEWER', 'user_read'),
('VIEWER', 'role_read'),
('VIEWER', 'permission_read');
