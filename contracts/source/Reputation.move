// Module: Reputation
// Purpose:
// This optional module tracks user reputation scores based on their participation and behavior.
// It allows initialization and incremental updates to reputation scores, providing a mechanism for incentives or trust-building in the matchmaking ecosystem.



    module contracts::reputation ;
    use sui::object::UID;
    use sui::tx_context::TxContext;

    struct Reputation has key {
        id: UID,
        user: address,
        score: u64,
        last_updated: u64,
    }

    public fun init(ctx: &mut TxContext): Reputation {
        Reputation {
            id: UID::new(ctx),
            user: TxContext::sender(ctx),
            score: 0,
            last_updated: TxContext::clock(ctx),
        }
    }

    public fun update(rep: &mut Reputation, delta: u64) {
        rep.score = rep.score + delta;
        rep.last_updated = TxContext::clock(&mut TxContext::dummy());
    }

