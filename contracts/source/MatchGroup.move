// Module: MatchGroup
// Purpose:
// This module handles creation and management of matchmaking groups.
// Groups act as containers or categories for match submissions, allowing users to join or participate in specific match pools.
// It tracks metadata such as group creator, creation timestamp, and open/closed status.


    module contracts::match_group ;
    use sui::object::UID;
    use sui::tx_context::TxContext;

    struct MatchGroup has key {
        id: UID,
        name: vector<u8>,
        created_by: address,
        created_at: u64,
        is_open: bool,
    }

    public fun create_group(ctx: &mut TxContext, name: vector<u8>): MatchGroup {
        MatchGroup {
            id: UID::new(ctx),
            name,
            created_by: TxContext::sender(ctx),
            created_at: TxContext::clock(ctx),
            is_open: true,
        }
    }
