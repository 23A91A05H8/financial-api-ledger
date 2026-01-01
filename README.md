# Financial Ledger API

## Overview
This project implements a robust financial ledger system based on
double-entry bookkeeping principles. It ensures data integrity,
auditability, and ACID-compliant transactions.

## Tech Stack
- Node.js
- Express.js
- PostgreSQL

## Core Concepts
### Double-Entry Bookkeeping
Every transfer generates:
- One debit entry from the source account
- One credit entry to the destination account  
The net sum of each transaction is zero.

### ACID Transactions
All operations related to a transfer (transaction record + ledger entries)
are wrapped in a single database transaction to ensure atomicity.

### Immutability
Ledger entries are append-only and cannot be updated or deleted,
providing a permanent audit trail.

### Balance Calculation
Account balances are not stored.
They are calculated dynamically by summing ledger entries.

## API Endpoints

### Create Account
POST /api/accounts

### Get Account Balance
GET /api/accounts/:accountId

### Get Ledger Entries
GET /api/accounts/:accountId/ledger

### Transfer Money
POST /api/transfer

### Deposit Money
POST /api/deposits

### Withdraw Money
POST /api/withdrawals


## Database Schema
- accounts
- transactions
- ledger_entries

Foreign key constraints enforce data integrity.

## How to Run
1. Install dependencies  
   `npm install`
2. Configure `.env`
3. Start server  
   `npm run dev`

## Design Decisions

### Double-Entry Bookkeeping
The system follows double-entry bookkeeping principles.  
Every financial operation creates corresponding ledger entries:
- Transfers create one debit entry from the source account and one credit entry to the destination account.
- Deposits create a credit entry.
- Withdrawals create a debit entry.
This ensures that every transaction is balanced and auditable.

### ACID Transactions
All database operations related to a financial transaction are executed within a single database transaction using BEGIN and COMMIT.  
If any step fails, the entire transaction is rolled back to maintain atomicity and consistency.

### Transaction Isolation Level
The application relies on PostgreSQL’s default READ COMMITTED isolation level.  
This prevents dirty reads while maintaining good performance and is sufficient for ensuring consistency in concurrent financial operations.

### Balance Calculation and Negative Balance Prevention
Account balances are not stored in the database.  
They are calculated dynamically by summing all ledger entries associated with an account.
Before processing withdrawals, the system checks the calculated balance and rejects any operation that would result in a negative balance.

## API Testing
All APIs were tested using Postman and Thunder Client. A Postman collection is included in the repository.



## Conclusion
This system demonstrates safe financial transaction handling with
strong consistency and auditability guarantees.
