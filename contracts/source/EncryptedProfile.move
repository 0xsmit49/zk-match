// Module: EncryptedProfile
// Purpose:
// This module manages users' encrypted profile data. 
// It allows users to create a new encrypted profile and update the stored encrypted data URI.
// Each profile is uniquely identified and associated with its owner’s address, 
// enabling secure and private profile management on-chain.


    module contracts::encrypted_profile ;
    use sui::object::UID;
    use sui::tx_context::{Self, TxContext};

    struct Profile has key {
        id: UID,
        owner: address,
        encrypted_data_uri: vector<u8>,
        timestamp: u64,
        is_active: bool,
    }

    public fun create_profile(
        ctx: &mut TxContext,
        encrypted_uri: vector<u8>
    ): Profile {
        Profile {
            id: UID::new(ctx),
            owner: TxContext::sender(ctx),
            encrypted_data_uri: encrypted_uri,
            timestamp: TxContext::clock(ctx),
            is_active: true,
        }
    }

    public fun update_profile_uri(profile: &mut Profile, new_uri: vector<u8>) {
        profile.encrypted_data_uri = new_uri;
        profile.timestamp = TxContext::clock(&mut TxContext::dummy());
    }

