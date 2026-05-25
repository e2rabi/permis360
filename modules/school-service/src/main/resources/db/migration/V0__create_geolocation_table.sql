CREATE TABLE IF NOT EXISTS geo_location (
                                            id BIGINT NOT NULL,
                                            created_date TIMESTAMP(6),
    last_modified_date TIMESTAMP(6),
    version BIGINT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    PRIMARY KEY (id)
    );