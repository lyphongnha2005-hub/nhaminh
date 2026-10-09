-- Safe, additive migration. Run in the project's database if the application
-- login does not have CREATE TABLE permission. Never drops existing messages.
IF OBJECT_ID(N'dbo.community_messages', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.community_messages (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        text NVARCHAR(500) NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'VISIBLE'
            CHECK (status IN ('VISIBLE', 'HIDDEN')),
        created_at VARCHAR(30) NOT NULL
    );
END;
