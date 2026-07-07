/**
 * Observer pattern (https://refactoring.guru/design-patterns/observer):
 * the leaderboard standings are the Subject, every open SSE connection on
 * /api/leaderboard/stream is an Observer. Logging a game calls notify(),
 * which fans out to every attached observer.
 *
 * The subject carries no state on purpose: observers are only told *that*
 * the leaderboard changed, and clients refetch /api/leaderboard themselves —
 * so update() takes no arguments.
 */
export type LeaderboardObserver = {
  update: () => void;
};

class LeaderboardSubject {
  private observers = new Set<LeaderboardObserver>();

  attach(observer: LeaderboardObserver): void {
    this.observers.add(observer);
  }

  detach(observer: LeaderboardObserver): void {
    this.observers.delete(observer);
  }

  notify(): void {
    this.observers.forEach(observer => observer.update());
  }
}

// ponytail: one per-process singleton — plenty for one Nitro instance.
// Serverless with multiple instances won't fan out across them; upgrade to
// pg NOTIFY if that ever bites.
export const leaderboardSubject = new LeaderboardSubject();
