    module contracts::test ;

    use contracts::encrypted_profile;
    use contracts::match_group;
    use contracts::match_submission;
    use contracts::match_pair;
    use contracts::access_control;
    use contracts::reputation;

    use sui::tx_context::{TxContext};
    use sui::object::UID;
    use sui::transfer;
    use sui::test;

    #[test_only]
    public fun test_zk_match_flow(ctx: &mut TxContext) {
    
        let encrypted_uri = b"ipfs://encrypted_profile_data";
        let mut profile = encrypted_profile::create_profile(ctx, encrypted_uri);
        assert!(encrypted_profile::get_profile_uri(&profile) == encrypted_uri, 1);

      
        let group_name = b"TestGroup";
        let mut group = match_group::create_group(ctx, group_name);
        assert!(match_group::group_name(&group) == group_name, 2);

    
        let proof = vector::empty<u8>();
        let public_signals = vector::empty<u64>();
        let submission = match_submission::submit_match_proof(ctx, match_group::id(&group), proof, public_signals);
        assert!(submission.group_id == match_group::id(&group), 3);

       
        let user1 = TxContext::sender(ctx);
        let user2 = address::from_u64(2);
        let vrf_hash = b"vrf_output_bytes";
        let pair = match_pair::create_match_pair(ctx, user1, user2, vrf_hash);
        assert!(pair.user1 == user1 && pair.user2 == user2, 4);

     
        let access = access_control::grant_access(ctx, user2);
        assert!(access.granter == user1 && access.grantee == user2, 5);

     
        let new_uri = b"ipfs://updated_encrypted_data";
        encrypted_profile::update_profile_uri(&mut profile, new_uri);
        assert!(encrypted_profile::get_profile_uri(&profile) == new_uri, 6);

      
        reputation::initialize_reputation(ctx, user1);
        reputation::increment_reputation(ctx, user1, 10);
        assert!(reputation::get_reputation(user1) == 10, 7);
    }

