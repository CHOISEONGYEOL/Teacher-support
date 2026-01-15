/**
 * IRV (Instant-Runoff Voting) 알고리즘 구현
 *
 * 알고리즘:
 * 1. 모든 유권자의 1순위 표 집계
 * 2. 과반수(50% + 1) 득표자가 있으면 당선 확정
 * 3. 없으면 최하위 득표자 탈락, 해당 표를 다음 순위 후보에게 이양
 * 4. 과반수 득표자 나올 때까지 반복
 */

export interface Ballot {
  oderId: string;
  voterNickname: string;
  rankings: number[]; // 후보자 ID 순서 리스트 (인덱스 0 = 1순위)
}

export interface RoundResult {
  roundNumber: number;
  voteCounts: Record<number, number>; // {candidateId: count}
  eliminatedCandidateId: number | null;
  voteTransfers: Record<number, Record<number | 'exhausted', number>> | null;
  isFinal: boolean;
  winnerId: number | null;
  totalVotes: number;
  threshold: number;
}

export interface IRVResult {
  rounds: RoundResult[];
  winnerId: number | null;
  ballots: Ballot[];
}

export class IRVCalculator {
  private candidates: Set<number>;
  private ballots: Ballot[] = [];
  private eliminated: Set<number> = new Set();
  private rounds: RoundResult[] = [];

  constructor(candidateIds: number[]) {
    this.candidates = new Set(candidateIds);
  }

  /**
   * 투표용지 추가
   */
  addBallot(oderId: string, voterNickname: string, rankings: number[]): void {
    // 유효한 후보자만 필터링
    const validRankings = rankings.filter(id => this.candidates.has(id));
    this.ballots.push({ oderId, voterNickname, rankings: validRankings });
  }

  /**
   * 현재 유효한 최고 순위 후보 반환
   */
  private getCurrentChoice(ballot: Ballot): number | null {
    for (const candidateId of ballot.rankings) {
      if (!this.eliminated.has(candidateId)) {
        return candidateId;
      }
    }
    return null; // 모든 선호 후보가 탈락 (소진된 표)
  }

  /**
   * 1순위 표 집계
   */
  private countFirstPreferences(): Record<number, number> {
    const counts: Record<number, number> = {};

    // 모든 활성 후보자 0표로 초기화
    for (const candidateId of this.candidates) {
      if (!this.eliminated.has(candidateId)) {
        counts[candidateId] = 0;
      }
    }

    // 각 투표용지의 현재 최우선 선택 집계
    for (const ballot of this.ballots) {
      const choice = this.getCurrentChoice(ballot);
      if (choice !== null) {
        counts[choice] = (counts[choice] || 0) + 1;
      }
    }

    return counts;
  }

  /**
   * 과반수 득표자 확인
   */
  private findWinner(counts: Record<number, number>, totalVotes: number): number | null {
    const threshold = Math.floor(totalVotes / 2) + 1;

    for (const [candidateId, voteCount] of Object.entries(counts)) {
      if (voteCount >= threshold) {
        return Number(candidateId);
      }
    }
    return null;
  }

  /**
   * 최하위 득표자 찾기
   */
  private findLoser(counts: Record<number, number>): number {
    const minVotes = Math.min(...Object.values(counts));
    const losers = Object.entries(counts)
      .filter(([_, v]) => v === minVotes)
      .map(([k, _]) => Number(k));

    // 동률 시 ID가 작은 후보 탈락 (일관성 유지)
    return Math.min(...losers);
  }

  /**
   * 표 이동 계산
   */
  private calculateTransfers(eliminatedId: number): Record<number | 'exhausted', number> {
    const transfers: Record<number | 'exhausted', number> = {};

    for (const ballot of this.ballots) {
      // 현재 선택이 탈락 후보인 경우
      const currentWithoutEliminated = (() => {
        for (const candidateId of ballot.rankings) {
          if (!this.eliminated.has(candidateId) || candidateId === eliminatedId) {
            if (candidateId !== eliminatedId && !this.eliminated.has(candidateId)) {
              return candidateId;
            }
            if (candidateId === eliminatedId) {
              continue;
            }
          }
        }
        return null;
      })();

      const current = this.getCurrentChoice(ballot);

      // 탈락 전 현재 선택이 탈락 후보였는지 확인
      let wasVotingForEliminated = false;
      for (const candidateId of ballot.rankings) {
        if (this.eliminated.has(candidateId)) continue;
        if (candidateId === eliminatedId) {
          wasVotingForEliminated = true;
        }
        break;
      }

      if (wasVotingForEliminated) {
        // 다음 선택 찾기
        const tempEliminated = new Set([...this.eliminated, eliminatedId]);
        let nextChoice: number | null = null;
        for (const candidateId of ballot.rankings) {
          if (!tempEliminated.has(candidateId)) {
            nextChoice = candidateId;
            break;
          }
        }

        if (nextChoice !== null) {
          transfers[nextChoice] = (transfers[nextChoice] || 0) + 1;
        } else {
          transfers['exhausted'] = (transfers['exhausted'] || 0) + 1;
        }
      }
    }

    return transfers;
  }

  /**
   * IRV 선거 실행
   */
  runElection(): IRVResult {
    this.eliminated = new Set();
    this.rounds = [];
    let roundNumber = 0;

    while (true) {
      roundNumber++;
      const counts = this.countFirstPreferences();
      const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);

      if (totalVotes === 0) break;

      const threshold = Math.floor(totalVotes / 2) + 1;

      const result: RoundResult = {
        roundNumber,
        voteCounts: { ...counts },
        eliminatedCandidateId: null,
        voteTransfers: null,
        isFinal: false,
        winnerId: null,
        totalVotes,
        threshold,
      };

      // 과반수 득표자 확인
      const winner = this.findWinner(counts, totalVotes);
      if (winner !== null) {
        result.isFinal = true;
        result.winnerId = winner;
        this.rounds.push(result);
        break;
      }

      // 남은 후보가 2명 이하
      const activeCandidates = [...this.candidates].filter(c => !this.eliminated.has(c));
      if (activeCandidates.length <= 2) {
        const winnerId = Object.entries(counts).reduce((a, b) =>
          counts[Number(a[0])] > counts[Number(b[0])] ? a : b
        )[0];
        result.isFinal = true;
        result.winnerId = Number(winnerId);
        this.rounds.push(result);
        break;
      }

      // 최하위 후보 탈락
      const loser = this.findLoser(counts);
      const transfers = this.calculateTransfers(loser);

      result.eliminatedCandidateId = loser;
      result.voteTransfers = { [loser]: transfers };

      this.eliminated.add(loser);
      this.rounds.push(result);

      // 후보가 1명만 남은 경우
      if (this.eliminated.size >= this.candidates.size - 1) {
        const remaining = [...this.candidates].filter(c => !this.eliminated.has(c));
        if (remaining.length > 0) {
          this.rounds.push({
            roundNumber: roundNumber + 1,
            voteCounts: { [remaining[0]]: totalVotes },
            eliminatedCandidateId: null,
            voteTransfers: null,
            isFinal: true,
            winnerId: remaining[0],
            totalVotes,
            threshold,
          });
        }
        break;
      }
    }

    const winnerId = this.rounds.length > 0 && this.rounds[this.rounds.length - 1].isFinal
      ? this.rounds[this.rounds.length - 1].winnerId
      : null;

    return {
      rounds: this.rounds,
      winnerId,
      ballots: this.ballots,
    };
  }
}
