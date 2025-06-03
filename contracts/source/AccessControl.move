// Module: AccessControl
// Purpose:
// This module manages permission grants for accessing encrypted data between matched users.
// After a match, one user can grant access to their encrypted data (via encrypted key shares) to their match partner.
// Each access grant is timestamped and linked to a specific match pair.


    module contracts::access_control ;
    use sui::object::UID;
    use sui::tx_context::TxContext;
    use sui::event;

    struct AccessGrant has key {
        id: UID,
        granter: address,
        grantee: address,
        timestamp: u64,
        match_pair_id: UID,
        encrypted_key_share_uri: vector<u8>,
    }

    public fun grant_access(
        ctx: &mut TxContext,
        grantee: address,
        match_pair_id: UID,
        encrypted_key_uri: vector<u8>
    ): AccessGrant {
        let granter = TxContext::sender(ctx);
        let timestamp = TxContext::clock(ctx);
        let grant = AccessGrant {
            id: UID::new(ctx),
            granter,
            grantee,
            match_pair_id,
            timestamp,
            encrypted_key_share_uri: encrypted_key_uri,
        };
        event::emit("AccessGranted", (granter, grantee, match_pair_id));
        grant
    }

