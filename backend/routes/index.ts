import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Types
interface Profile {
  address: string;
  encrypted_data_uri: string;
}

interface Proof {
  id: string;
  user: string;
  group_id: number;
  proof: any;
  public_signals: any;
}

interface Match {
  id: string;
  user1: string;
  user2: string;
  vrf_hash: string;
}

interface AccessGrant {
  id: string;
  granter: string;
  grantee: string;
  timestamp: number;
}

// Data helpers
const dataPath = (file: string) => path.join(__dirname, '..', 'data', file);
const loadJSON = async <T>(file: string): Promise<T> => JSON.parse(await fs.readFile(dataPath(file), 'utf-8'));
const saveJSON = async <T>(file: string, data: T) => fs.writeFile(dataPath(file), JSON.stringify(data, null, 2), 'utf-8');

// Profiles
router.post('/profiles', async (req: Request, res: Response) => {
  try {
    const { address, encrypted_data_uri } = req.body;
    const profiles: Record<string, Profile> = await loadJSON('profiles.json');
    profiles[address] = { address, encrypted_data_uri };
    await saveJSON('profiles.json', profiles);
    res.status(201).json(profiles[address]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

router.get('/profiles/:address', async (req: Request, res: Response) => {
  try {
    const profiles: Record<string, Profile> = await loadJSON('profiles.json');
    const profile = profiles[req.params.address];
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

router.put('/profiles/:address', async (req: Request, res: Response) => {
  try {
    const profiles: Record<string, Profile> = await loadJSON('profiles.json');
    const profile = profiles[req.params.address];
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    profile.encrypted_data_uri = req.body.new_uri;
    await saveJSON('profiles.json', profiles);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ZK Proofs
router.post('/proofs', async (req: Request, res: Response) => {
  try {
    const { user, group_id, proof, public_signals } = req.body;
    const proofs: Proof[] = await loadJSON('proofs.json');
    const submission: Proof = { id: uuidv4(), user, group_id, proof, public_signals };
    proofs.push(submission);
    await saveJSON('proofs.json', proofs);
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit proof' });
  }
});

router.get('/proofs/user/:address', async (req: Request, res: Response) => {
  try {
    const proofs: Proof[] = await loadJSON('proofs.json');
    const userProofs = proofs.filter(p => p.user === req.params.address);
    res.json(userProofs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user proofs' });
  }
});

router.get('/proofs/group/:groupId', async (req: Request, res: Response) => {
  try {
    const proofs: Proof[] = await loadJSON('proofs.json');
    const groupProofs = proofs.filter(p => p.group_id === Number(req.params.groupId));
    res.json(groupProofs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get group proofs' });
  }
});

// Matches
router.post('/matches', async (req: Request, res: Response) => {
  try {
    const { user1, user2, vrf_output } = req.body;
    const matches: Match[] = await loadJSON('matches.json');
    const match: Match = { id: uuidv4(), user1, user2, vrf_hash: vrf_output };
    matches.push(match);
    await saveJSON('matches.json', matches);
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create match' });
  }
});

router.get('/matches/:id', async (req: Request, res: Response) => {
  try {
    const matches: Match[] = await loadJSON('matches.json');
    const match = matches.find(m => m.id === req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get match' });
  }
});

router.get('/matches/user/:address', async (req: Request, res: Response) => {
  try {
    const matches: Match[] = await loadJSON('matches.json');
    const userMatches = matches.filter(m => m.user1 === req.params.address || m.user2 === req.params.address);
    res.json(userMatches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user matches' });
  }
});

// Access Grants
router.post('/access', async (req: Request, res: Response) => {
  try {
    const { granter, grantee } = req.body;
    const accessGrants: AccessGrant[] = await loadJSON('access_grants.json');
    const grant: AccessGrant = { id: uuidv4(), granter, grantee, timestamp: Date.now() };
    accessGrants.push(grant);
    await saveJSON('access_grants.json', accessGrants);
    res.status(201).json(grant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to grant access' });
  }
});

router.get('/access/granter/:address', async (req: Request, res: Response) => {
  try {
    const accessGrants: AccessGrant[] = await loadJSON('access_grants.json');
    const grants = accessGrants.filter(g => g.granter === req.params.address);
    res.json(grants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get grants by granter' });
  }
});

router.get('/access/grantee/:address', async (req: Request, res: Response) => {
  try {
    const accessGrants: AccessGrant[] = await loadJSON('access_grants.json');
    const grants = accessGrants.filter(g => g.grantee === req.params.address);
    res.json(grants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get grants by grantee' });
  }
});

// Health Check
router.get('/health', async (_req: Request, res: Response) => {
  try {
    res.json({ status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

export default router;