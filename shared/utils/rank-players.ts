export type PlayerStats = {
  id: number;
  name: string;
  image: string | null;
  gamesPlayed: number;
  wins: number;
  totalScore: number;
};

export type RankedPlayer = {
  rank: number;
  losses: number;
  winRate: number;
} & PlayerStats;

/**
 * THE ranking formula — the only place leaderboard order is decided:
 * total score DESC → wins DESC → win rate DESC (name ASC last, purely to keep
 * ties deterministic). Players equal on all three keys share a rank
 * (competition ranking: 1, 2, 2, 4). `winRate` is a rounded 0–100 percentage,
 * 0 for players with no games.
 */
export function rankPlayers(rows: PlayerStats[]): RankedPlayer[] {
  const players = rows
    .map(row => ({
      ...row,
      losses: row.gamesPlayed - row.wins,
      winRate: row.gamesPlayed ? Math.round((row.wins / row.gamesPlayed) * 100) : 0,
    }))
    .sort((a, b) =>
      b.totalScore - a.totalScore
      || b.wins - a.wins
      || b.winRate - a.winRate
      || a.name.localeCompare(b.name));

  let rank = 0;
  return players.map((player, i) => {
    const prev = players[i - 1];
    if (!prev || player.totalScore !== prev.totalScore || player.wins !== prev.wins || player.winRate !== prev.winRate)
      rank = i + 1;
    return { rank, ...player };
  });
}
