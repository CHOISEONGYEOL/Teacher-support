/**
 * Firebase Realtime Database API
 */
import {
  ref,
  set,
  get,
  push,
  update,
  onValue,
  off,
} from 'firebase/database';
import { database } from './firebase';
import { generateNickname } from './nickname';
import { generateRoomQR } from './qrcode';
import { IRVCalculator, type RoundResult } from './irv';

// ============ 타입 정의 ============

export interface Candidate {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_eliminated?: boolean;
  eliminated_round?: number | null;
}

interface RoomInfo {
  title: string;
  description: string | null;
  status: 'waiting' | 'active' | 'closed';
  adminKey: string;
  createdAt: number;
  maxRank: number | null;
}

interface RoomData {
  info: RoomInfo;
  candidates: Record<string, Candidate>;
  voters?: Record<string, VoterData>;
  votes?: Record<string, VoteData>;
}

interface VoterData {
  oderId: string;
  nickname: string;
  hasVoted: boolean;
  joinedAt: number;
}

interface VoteData {
  rankings: Record<string, number>;
  votedAt: number;
}

export interface VotingRoom {
  id: number;
  room_code: string;
  title: string;
  description: string | null;
  status: 'waiting' | 'active' | 'closed';
  created_at: string;
  closed_at: string | null;
  max_rank: number | null;
  candidates: Candidate[];
  voter_count: number;
  vote_count: number;
}

export interface VotingRoomAdmin extends VotingRoom {
  admin_token: string;
}

export interface Voter {
  id: number;
  animal_nickname: string;
  has_voted: boolean;
  joined_at: string;
}

export interface VoteReceipt {
  voter_nickname: string;
  rankings: Record<string, number>;
  candidate_names: Record<number, string>;
  candidate_images: Record<number, string | null>;
  voted_at: string;
}

export interface IRVRound {
  round_number: number;
  vote_counts: Record<string, number>;
  eliminated_candidate_id: number | null;
  eliminated_candidate_name: string | null;
  vote_transfers: Record<string, Record<string, number>> | null;
  is_final: boolean;
  winner_id: number | null;
  winner_name: string | null;
  total_votes: number;
  threshold: number;
}

export interface BallotDetailRanking {
  name: string;
  image_url: string | null;
}

export interface BallotDetail {
  voter_nickname: string;
  rankings: BallotDetailRanking[];
}

export interface IRVResult {
  room_id: number;
  room_title: string;
  total_voters: number;
  total_votes: number;
  rounds: IRVRound[];
  winner_id: number | null;
  winner_name: string | null;
  ballot_details: BallotDetail[];
  candidates: Candidate[];
}

export interface QRCodeData {
  room_code: string;
  qr_image_base64: string;
  join_url: string;
}

// ============ 유틸리티 함수 ============

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generateAdminKey(): string {
  return crypto.randomUUID();
}

function convertRoomDataToVotingRoom(roomCode: string, data: RoomData): VotingRoom {
  const candidates = Object.values(data.candidates).sort((a, b) => a.display_order - b.display_order);
  return {
    id: 0,
    room_code: roomCode,
    title: data.info.title,
    description: data.info.description,
    status: data.info.status,
    created_at: new Date(data.info.createdAt).toISOString(),
    closed_at: null,
    max_rank: data.info.maxRank,
    candidates,
    voter_count: data.voters ? Object.keys(data.voters).length : 0,
    vote_count: data.votes ? Object.keys(data.votes).length : 0,
  };
}

// ============ 투표방 API ============

export const createRoom = async (data: {
  title: string;
  description?: string;
  candidates: { name: string; description?: string; image_url?: string }[];
}): Promise<VotingRoomAdmin> => {
  let roomCode = generateRoomCode();
  let attempts = 0;
  while (attempts < 10) {
    const snapshot = await get(ref(database, `rooms/${roomCode}`));
    if (!snapshot.exists()) break;
    roomCode = generateRoomCode();
    attempts++;
  }

  const adminKey = generateAdminKey();

  const roomData: RoomData = {
    info: {
      title: data.title,
      description: data.description || null,
      status: 'waiting',
      adminKey,
      createdAt: Date.now(),
      maxRank: data.candidates.length,
    },
    candidates: {},
  };

  data.candidates.forEach((candidate, index) => {
    const id = index + 1;
    roomData.candidates[id] = {
      id,
      name: candidate.name,
      description: candidate.description || null,
      image_url: candidate.image_url || null,
      display_order: index,
    };
  });

  await set(ref(database, `rooms/${roomCode}`), roomData);

  const votingRoom = convertRoomDataToVotingRoom(roomCode, roomData);
  return {
    ...votingRoom,
    admin_token: adminKey,
  };
};

export const getRoom = async (roomCode: string): Promise<VotingRoom> => {
  const snapshot = await get(ref(database, `rooms/${roomCode}`));
  if (!snapshot.exists()) {
    throw new Error('투표방을 찾을 수 없습니다');
  }
  return convertRoomDataToVotingRoom(roomCode, snapshot.val());
};

export const getQRCode = async (roomCode: string): Promise<QRCodeData> => {
  const qrData = await generateRoomQR(roomCode);
  return {
    room_code: roomCode,
    qr_image_base64: qrData.qrDataURL.replace('data:image/png;base64,', ''),
    join_url: qrData.joinURL,
  };
};

export const startVoting = async (roomCode: string, adminToken: string): Promise<void> => {
  const snapshot = await get(ref(database, `rooms/${roomCode}`));
  if (!snapshot.exists()) throw new Error('투표방을 찾을 수 없습니다');

  const data = snapshot.val() as RoomData;
  if (data.info.adminKey !== adminToken) throw new Error('권한이 없습니다');
  if (data.info.status !== 'waiting') throw new Error('이미 시작되었거나 종료된 투표입니다');

  await update(ref(database, `rooms/${roomCode}/info`), { status: 'active' });
};

export const closeVoting = async (roomCode: string, adminToken: string): Promise<void> => {
  const snapshot = await get(ref(database, `rooms/${roomCode}`));
  if (!snapshot.exists()) throw new Error('투표방을 찾을 수 없습니다');

  const data = snapshot.val() as RoomData;
  if (data.info.adminKey !== adminToken) throw new Error('권한이 없습니다');
  if (data.info.status === 'closed') throw new Error('이미 종료된 투표입니다');

  await update(ref(database, `rooms/${roomCode}/info`), { status: 'closed' });
};

// ============ 유권자 API ============

export const joinRoom = async (roomCode: string, sessionId: string): Promise<Voter> => {
  const snapshot = await get(ref(database, `rooms/${roomCode}`));
  if (!snapshot.exists()) throw new Error('투표방을 찾을 수 없습니다');

  const data = snapshot.val() as RoomData;
  if (data.info.status === 'closed') throw new Error('종료된 투표입니다');

  const voters = data.voters || {};

  // 이미 참가한 유권자인지 확인
  for (const [id, voter] of Object.entries(voters)) {
    if (voter.oderId === sessionId) {
      return {
        id: parseInt(id) || 0,
        animal_nickname: voter.nickname,
        has_voted: voter.hasVoted,
        joined_at: new Date(voter.joinedAt).toISOString(),
      };
    }
  }

  // 기존 닉네임 목록
  const existingNicknames = new Set(Object.values(voters).map(v => v.nickname));
  const nickname = generateNickname(existingNicknames);

  const newVoter: VoterData = {
    oderId: sessionId,
    nickname,
    hasVoted: false,
    joinedAt: Date.now(),
  };

  const voterRef = push(ref(database, `rooms/${roomCode}/voters`));
  await set(voterRef, newVoter);

  return {
    id: 0,
    animal_nickname: nickname,
    has_voted: false,
    joined_at: new Date(newVoter.joinedAt).toISOString(),
  };
};

export const getVoter = async (roomCode: string, sessionId: string): Promise<Voter> => {
  const snapshot = await get(ref(database, `rooms/${roomCode}`));
  if (!snapshot.exists()) throw new Error('투표방을 찾을 수 없습니다');

  const data = snapshot.val() as RoomData;
  const voters = data.voters || {};

  for (const [id, voter] of Object.entries(voters)) {
    if (voter.oderId === sessionId) {
      return {
        id: parseInt(id) || 0,
        animal_nickname: voter.nickname,
        has_voted: voter.hasVoted,
        joined_at: new Date(voter.joinedAt).toISOString(),
      };
    }
  }

  throw new Error('참가 정보를 찾을 수 없습니다');
};

export const submitVote = async (
  roomCode: string,
  sessionId: string,
  rankings: Record<string, number>
): Promise<VoteReceipt> => {
  const snapshot = await get(ref(database, `rooms/${roomCode}`));
  if (!snapshot.exists()) throw new Error('투표방을 찾을 수 없습니다');

  const data = snapshot.val() as RoomData;
  if (data.info.status !== 'active') throw new Error('투표가 진행 중이 아닙니다');

  const voters = data.voters || {};
  let voterId: string | null = null;
  let voter: VoterData | null = null;

  for (const [id, v] of Object.entries(voters)) {
    if (v.oderId === sessionId) {
      voterId = id;
      voter = v;
      break;
    }
  }

  if (!voter || !voterId) throw new Error('참가 정보를 찾을 수 없습니다');
  if (voter.hasVoted) throw new Error('이미 투표하셨습니다');

  const votedAt = Date.now();
  await set(ref(database, `rooms/${roomCode}/votes/${voterId}`), {
    rankings,
    votedAt,
  });
  await update(ref(database, `rooms/${roomCode}/voters/${voterId}`), { hasVoted: true });

  const candidate_names: Record<number, string> = {};
  const candidate_images: Record<number, string | null> = {};
  Object.values(data.candidates).forEach(c => {
    candidate_names[c.id] = c.name;
    candidate_images[c.id] = c.image_url || null;
  });

  return {
    voter_nickname: voter.nickname,
    rankings,
    candidate_names,
    candidate_images,
    voted_at: new Date(votedAt).toISOString(),
  };
};

// ============ 결과 API ============

export const getResults = async (roomCode: string, adminToken?: string): Promise<IRVResult> => {
  const snapshot = await get(ref(database, `rooms/${roomCode}`));
  if (!snapshot.exists()) throw new Error('투표방을 찾을 수 없습니다');

  const data = snapshot.val() as RoomData;

  if (data.info.status !== 'closed') {
    if (!adminToken || data.info.adminKey !== adminToken) {
      throw new Error('투표가 종료되지 않았습니다');
    }
  }

  const voters = data.voters || {};
  const votes = data.votes || {};
  const candidates = Object.values(data.candidates);
  const candidateIds = candidates.map(c => c.id);

  const calculator = new IRVCalculator(candidateIds);

  for (const [voterId, voteData] of Object.entries(votes)) {
    const voter = voters[voterId];
    if (!voter) continue;

    const rankingsArray: number[] = [];
    const sortedRanks = Object.keys(voteData.rankings).sort((a, b) => Number(a) - Number(b));
    for (const rank of sortedRanks) {
      rankingsArray.push(voteData.rankings[rank]);
    }

    calculator.addBallot(voter.oderId, voter.nickname, rankingsArray);
  }

  const result = calculator.runElection();

  const candidateMap: Record<number, Candidate> = {};
  candidates.forEach(c => {
    candidateMap[c.id] = c;
  });

  // RoundResult를 IRVRound로 변환
  const rounds: IRVRound[] = result.rounds.map(r => ({
    round_number: r.roundNumber,
    vote_counts: Object.fromEntries(
      Object.entries(r.voteCounts).map(([k, v]) => [String(k), v])
    ),
    eliminated_candidate_id: r.eliminatedCandidateId,
    eliminated_candidate_name: r.eliminatedCandidateId
      ? candidateMap[r.eliminatedCandidateId]?.name || null
      : null,
    vote_transfers: r.voteTransfers
      ? Object.fromEntries(
          Object.entries(r.voteTransfers).map(([fromId, transfers]) => [
            String(fromId),
            Object.fromEntries(
              Object.entries(transfers).map(([toId, count]) => [String(toId), count])
            ),
          ])
        )
      : null,
    is_final: r.isFinal,
    winner_id: r.winnerId,
    winner_name: r.winnerId ? candidateMap[r.winnerId]?.name || null : null,
    total_votes: r.totalVotes,
    threshold: r.threshold,
  }));

  const ballot_details: BallotDetail[] = result.ballots.map(ballot => ({
    voter_nickname: ballot.voterNickname,
    rankings: ballot.rankings.map(id => ({
      name: candidateMap[id]?.name || `후보 ${id}`,
      image_url: candidateMap[id]?.image_url || null,
    })),
  }));

  return {
    room_id: 0,
    room_title: data.info.title,
    total_voters: Object.keys(voters).length,
    total_votes: Object.keys(votes).length,
    rounds,
    winner_id: result.winnerId,
    winner_name: result.winnerId ? candidateMap[result.winnerId]?.name || null : null,
    ballot_details,
    candidates,
  };
};

export const verifyVote = async (roomCode: string, nickname: string) => {
  const snapshot = await get(ref(database, `rooms/${roomCode}`));
  if (!snapshot.exists()) throw new Error('투표방을 찾을 수 없습니다');

  const data = snapshot.val() as RoomData;
  const voters = data.voters || {};
  const votes = data.votes || {};

  let voterId: string | null = null;
  let voter: VoterData | null = null;

  for (const [id, v] of Object.entries(voters)) {
    if (v.nickname === nickname) {
      voterId = id;
      voter = v;
      break;
    }
  }

  if (!voter || !voterId) {
    return { nickname, has_voted: false, message: '해당 닉네임을 찾을 수 없습니다' };
  }

  const voteData = votes[voterId];
  if (!voteData) {
    return { nickname, has_voted: false, message: '투표하지 않았습니다' };
  }

  const candidateMap: Record<number, string> = {};
  Object.values(data.candidates).forEach(c => {
    candidateMap[c.id] = c.name;
  });

  const rankings: Record<string, { candidate_id: number; candidate_name: string }> = {};
  for (const [rank, candidateId] of Object.entries(voteData.rankings)) {
    rankings[rank] = {
      candidate_id: candidateId,
      candidate_name: candidateMap[candidateId] || `후보 ${candidateId}`,
    };
  }

  return {
    nickname,
    has_voted: true,
    rankings,
    voted_at: new Date(voteData.votedAt).toISOString(),
    message: '투표 내역이 정상적으로 기록되어 있습니다',
  };
};

export const getRoomStatus = async (roomCode: string): Promise<{
  room_code: string;
  status: string;
  voter_count: number;
  vote_count: number;
  candidates: Candidate[];
}> => {
  const snapshot = await get(ref(database, `rooms/${roomCode}`));
  if (!snapshot.exists()) throw new Error('투표방을 찾을 수 없습니다');

  const data = snapshot.val() as RoomData;
  return {
    room_code: roomCode,
    status: data.info.status,
    voter_count: data.voters ? Object.keys(data.voters).length : 0,
    vote_count: data.votes ? Object.keys(data.votes).length : 0,
    candidates: Object.values(data.candidates).sort((a, b) => a.display_order - b.display_order),
  };
};

// ============ 실시간 구독 ============

export function subscribeToRoom(
  roomCode: string,
  callback: (room: VotingRoom | null) => void
): () => void {
  const roomRef = ref(database, `rooms/${roomCode}`);

  const unsubscribe = onValue(roomRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback(convertRoomDataToVotingRoom(roomCode, snapshot.val()));
  });

  return () => off(roomRef);
}
