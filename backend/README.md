# ZKMatch Server

 Express TypeScript server for the ZKMatch platform.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build for production
pnpm build

# Run in production mode
pnpm start
```

## API Endpoints

- `GET /`: Welcome message

- `GET /health`: Health check endpoint

- All other endpoints are under `/api` handled by your main router:
  - `/profiles`
  - `/proofs`
  - `/matches`
  - `/access`


## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
ORIGIN=http://localhost:3000

```

PORT: The port your server runs on (default is 3000)

ORIGIN: The allowed CORS origin for your frontend app

# ZKmatch API Documentation

This document describes the Express.js API for **ZKmatch**, a privacy-preserving matchmaking platform built on Move contracts with encrypted profiles, zero-knowledge proof submissions, matchmaking, and access control features.

---

## API Endpoints

###  Encrypted Profiles

- `POST /profiles`

  Create or update an encrypted profile.

- `GET /profiles/:address`

  Retrieve the encrypted profile for a given user address.

- `PUT /profiles/:address`

  Update the encrypted data URI for a user's profile.

---

###  ZK Proof Submissions

- `POST /proofs`

  Submit a zero-knowledge proof for validation.

- `GET /proofs/user/:address`

  Retrieve all proofs submitted by a specific user.

- `GET /proofs/group/:groupId`

  Retrieve all proofs submitted for a specific group.

---

###  Matchmaking

- `POST /matches`

  Create a new matchmaking record between two users.

- `GET /matches/:id`

  Retrieve a matchmaking record by its ID.

- `GET /matches/user/:address`

  Retrieve all matches involving a specific user.

---

###  Access Permissions

- `POST /access`

  Grant access permission from one user to another.

- `GET /access/granter/:address`

  Retrieve all access grants issued by a specific user.

- `GET /access/grantee/:address`

  Retrieve all access grants received by a specific user.

---

###  Health Check

- `GET /health`

  Returns the health status of the API server.

---

## Usage Examples

### Creating an Encrypted Profile

```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x123...",
    "encrypted_data_uri": "ipfs://encrypted-profile-data"
  }'
  ```

  ### Submitting a ZK Proof

```bash
curl -X POST http://localhost:3000/api/proofs \
  -H "Content-Type: application/json" \
  -d '{
    "user": "0x123...",
    "group_id": 1,
    "proof": {...},
    "public_signals": {...}
  }'
  ```

  ### Creating a Match

```bash
curl -X POST http://localhost:3000/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "user1": "0x123...",
    "user2": "0x456...",
    "vrf_output": "vrf-hash-value"
  }'
  ```
