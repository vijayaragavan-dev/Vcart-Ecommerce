-- VCart Database Schema
-- Execute this script to manually set up the database

CREATE DATABASE IF NOT EXISTS vcart_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE vcart_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
