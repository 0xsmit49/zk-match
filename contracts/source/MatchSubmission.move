// Module: MatchSubmission
// Purpose:
// This module records zero-knowledge proof submissions for matchmaking eligibility.
// Users submit cryptographic proofs tied to a specific group, along with relevant public signals.
// Each submission is timestamped and linked to the submitting user’s address.


    module contracts::match_submission; 
    use sui::object::UID;
    use sui::tx_context::TxContext;
    use sui::event;

    struct MatchSubmission has key {
        id: UID,
        user: address,
        group_id: u64,
        proof: vector<u8>,
        public_signals: vector<u64>,
        timestamp: u64,
    }

    public fun submit(
        ctx: &mut TxContext,
        group_id: u64,
        proof: vector<u8>,
        public_signals: vector<u64>
    ): MatchSubmission {
        let submission = MatchSubmission {
            id: UID::new(ctx),
            user: TxContext::sender(ctx),
            group_id,
            proof,
            public_signals,
            timestamp: TxContext::clock(ctx),
        };
        event::emit("MatchProofSubmitted", (submission.user, group_id));
        submission
    }

