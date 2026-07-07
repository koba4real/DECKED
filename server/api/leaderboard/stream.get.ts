import type { LeaderboardObserver } from "~~/server/utils/leaderboard-subject";

export default defineAuthenticatedEventHandler((event) => {
  const stream = createEventStream(event);

  // This connection is one Observer of the leaderboard Subject.
  const observer: LeaderboardObserver = {
    update: () => stream.push("leaderboard-changed"),
  };

  leaderboardSubject.attach(observer);
  stream.onClosed(() => leaderboardSubject.detach(observer));

  return stream.send();
});
