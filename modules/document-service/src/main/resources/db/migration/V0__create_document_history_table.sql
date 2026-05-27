drop table if exists document.document_history cascade ;

create table document.document_history (
                                           created_date timestamp(6),
                                           last_modified_date timestamp(6),
                                           version bigint,
                                           id uuid not null,
                                           document_name varchar(255),
                                           object_id varchar(255),
                                           primary key (id)
);