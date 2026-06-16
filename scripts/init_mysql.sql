-- LocaConnecté — Script d'initialisation MySQL pour tests locaux.
-- Usage :
--   mysql -u root -p < scripts/init_mysql.sql
-- Puis :
--   export DATABASE_URL="mysql+aiomysql://locaconnecte:locaconnecte@127.0.0.1:3306/locaconnecte"
--   export JWT_SECRET="votre-secret-aleatoire-min-32-chars"
--   uvicorn backend.api.app:app --reload --port 8000

CREATE DATABASE IF NOT EXISTS locaconnecte
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'locaconnecte'@'localhost'
  IDENTIFIED BY 'locaconnecte';

GRANT ALL PRIVILEGES ON locaconnecte.* TO 'locaconnecte'@'localhost';
FLUSH PRIVILEGES;

USE locaconnecte;

-- Les tables sont créées automatiquement par SQLAlchemy au démarrage de l'API.
-- Ce script est fourni pour référence ou si vous préférez créer manuellement.

-- Users
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

-- Providers (entreprise/personne, pas lié à un secteur unique)
CREATE TABLE IF NOT EXISTS providers (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  name VARCHAR(200) NOT NULL,
  commune VARCHAR(60) NOT NULL,
  description TEXT DEFAULT NULL,
  latitude DOUBLE DEFAULT NULL,
  longitude DOUBLE DEFAULT NULL,
  average_rating DOUBLE NOT NULL DEFAULT 0.0,
  review_count INT NOT NULL DEFAULT 0,
  response_time_min DOUBLE NOT NULL DEFAULT 60.0,
  acceptance_rate DOUBLE NOT NULL DEFAULT 0.5,
  completed_jobs INT NOT NULL DEFAULT 0,
  cancellation_rate DOUBLE NOT NULL DEFAULT 0.0,
  availability_score DOUBLE NOT NULL DEFAULT 1.0,
  verification_level INT NOT NULL DEFAULT 0,
  premium_provider BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_prov_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ProviderServices (un provider peut servir plusieurs secteurs)
CREATE TABLE IF NOT EXISTS provider_services (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  provider_id VARCHAR(32) NOT NULL,
  sector VARCHAR(60) NOT NULL,
  business_model VARCHAR(20) NOT NULL,
  base_price DOUBLE DEFAULT NULL,
  price_min DOUBLE DEFAULT NULL,
  price_max DOUBLE DEFAULT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ps_provider (provider_id),
  INDEX idx_ps_sector (sector)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listings (offres concrètes pour BusinessModel.CATALOG)
CREATE TABLE IF NOT EXISTS listings (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  provider_service_id VARCHAR(32) NOT NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT DEFAULT NULL,
  commune VARCHAR(60) NOT NULL,
  latitude DOUBLE DEFAULT NULL,
  longitude DOUBLE DEFAULT NULL,
  price DOUBLE NOT NULL,
  price_unit VARCHAR(20) NOT NULL DEFAULT 'jour',
  attributes TEXT DEFAULT NULL,
  photos TEXT DEFAULT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_listing_ps (provider_service_id),
  INDEX idx_listing_commune (commune)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- MatchingResults (dataset pour futur XGBoost)
CREATE TABLE IF NOT EXISTS matching_results (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  request_id VARCHAR(32) DEFAULT NULL,
  sector VARCHAR(60) NOT NULL,
  provider_id VARCHAR(32) NOT NULL,
  listing_id VARCHAR(32) DEFAULT NULL,
  score DOUBLE NOT NULL,
  reason TEXT DEFAULT NULL,
  `rank` INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mr_request (request_id),
  INDEX idx_mr_provider (provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ServiceRequests ("Publier un besoin" — optionnel V1)
CREATE TABLE IF NOT EXISTS service_requests (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  client_id VARCHAR(32) NOT NULL,
  sector VARCHAR(60) NOT NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT DEFAULT NULL,
  budget DOUBLE DEFAULT NULL,
  commune VARCHAR(60) DEFAULT NULL,
  urgency VARCHAR(20) NOT NULL DEFAULT 'normale',
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  payload TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sr_client (client_id),
  INDEX idx_sr_sector (sector)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Proposals (réponses prestataires à un besoin)
CREATE TABLE IF NOT EXISTS proposals (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  request_id VARCHAR(32) NOT NULL,
  provider_id VARCHAR(32) NOT NULL,
  price DOUBLE NOT NULL,
  message TEXT DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_prop_request (request_id),
  INDEX idx_prop_provider (provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Escrow Payments
CREATE TABLE IF NOT EXISTS escrow_payments (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  request_id VARCHAR(32) DEFAULT NULL,
  client_id VARCHAR(32) NOT NULL,
  provider_id VARCHAR(32) NOT NULL,
  amount DOUBLE NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'FCFA',
  status VARCHAR(20) NOT NULL DEFAULT 'held',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  released_at DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
