// Module: MatchPair
// Purpose:
// This module stores verified match pairings generated using a Verifiable Random Function (VRF).
// It records matched user pairs, associated VRF hashes, related group IDs, and match status (e.g., matched, pending).
// The module emits events to signal successful matches on-chain.


    module contracts::match_pair ;
    use sui::object::UID;
    use sui::tx_context::TxContext;
    use sui::event;

    struct MatchPair has key {
        id: UID,
        user1: address,
        user2: address,
        vrf_hash: vector<u8>,
        group_id: u64,
        timestamp: u64,
        status: vector<u8>, // pending, matched, rejected
    }

    public fun create_pair(
        ctx: &mut TxContext,
        user1: address,
        user2: address,
        vrf_hash: vector<u8>,
        group_id: u64
    ): MatchPair {
        let pair = MatchPair {
            id: UID::new(ctx),
            user1,
            user2,
            vrf_hash,
            group_id,
            timestamp: TxContext::clock(ctx),
            status: b"matched",
        };
        event::emit("MatchMade", (user1, user2, group_id));
        pair
    }

