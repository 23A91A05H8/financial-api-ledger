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

## Conclusion
This system demonstrates safe financial transaction handling with
strong consistency and auditability guarantees.
