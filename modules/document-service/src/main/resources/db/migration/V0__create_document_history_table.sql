CREATE SEQUENCE IF NOT EXISTS document.document_history_sequence
    START WITH 1
    INCREMENT BY 1;

create table if not exists document.document_history (
                                           id BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('document_history_sequence'),
                                           created_date timestamp(6),
                                           last_modified_date timestamp(6),
                                           version bigint,
                                           document_name varchar(255),
                                           object_id varchar(255)
);