-- LocaConnecté — Script d'initialisation MySQL pour tests locaux.
-- Usage :
--   mysql -u root -p < scripts/init_mysql.sql
-- Puis :
--   export DATABASE_URL="mysql+aiomysql://locaconnecte:locaconnecte@127.0.0.1:3306/locaconnecte"
--   uvicorn backend.api.app:app --reload --port 8000

CREATE DATABASE IF NOT EXISTS locaconnecte
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'locaconnecte'@'localhost'
  IDENTIFIED BY 'locaconnecte';

GRANT ALL PRIVILEGES ON locaconnecte.* TO 'locaconnecte'@'localhost';
FLUSH PRIVILEGES;

USE locaconnecte;

-- La table est créée automatiquement par SQLAlchemy au démarrage de l'API.
-- Ce script est fourni pour référence ou si vous préférez créer la table manuellement.

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  commune VARCHAR(60) DEFAULT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'client',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
