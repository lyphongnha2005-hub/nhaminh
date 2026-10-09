-- Additive migration; existing accounts and products are unchanged.
IF OBJECT_ID(N'dbo.account_collections', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.account_collections (
        account_type VARCHAR(10) NOT NULL,
        account_id BIGINT NOT NULL,
        kind VARCHAR(10) NOT NULL,
        payload NVARCHAR(MAX) NOT NULL,
        PRIMARY KEY (account_type, account_id, kind)
    );
END;
