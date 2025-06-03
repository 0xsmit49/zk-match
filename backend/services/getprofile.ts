interface Profile {
    address: string;
    encrypted_data_uri: string;
  }
  
  const profiles: Record<string, Profile> = {};
  
  export class ProfileService {
    static async createProfile(address: string, encrypted_data_uri: string): Promise<Profile> {
      const profile = { address, encrypted_data_uri };
      profiles[address] = profile;
      return profile;
    }
  
    static async getProfile(address: string): Promise<Profile | null> {
      return profiles[address] || null;
    }
  
    static async updateProfile(address: string, newUri: string): Promise<Profile | null> {
      const profile = profiles[address];
      if (!profile) return null;
      profile.encrypted_data_uri = newUri;
      return profile;
    }
  }
  