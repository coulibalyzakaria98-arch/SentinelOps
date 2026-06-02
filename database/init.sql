-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version INTEGER DEFAULT 1,
    title TEXT,
    description TEXT,
    damage_level TEXT NOT NULL,
    infrastructure_type TEXT NOT NULL,
    crisis_type TEXT NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    image_path TEXT,
    image_hash TEXT,
    confidence_score FLOAT DEFAULT 0.0,
    signature TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index
CREATE INDEX IF NOT EXISTS idx_reports_location ON reports USING GIST (location);

-- Index for duplicate detection
CREATE INDEX IF NOT EXISTS idx_reports_image_hash ON reports (image_hash);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports (created_at);
CREATE INDEX IF NOT EXISTS idx_reports_damage_level ON reports (damage_level);
