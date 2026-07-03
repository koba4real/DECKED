export const useGameStore = defineStore("useGameStore", () => {
  const {
    data: users,
    status: usersStatus,
    refresh: refreshUsers,
  } = useFetch("/api/users");

  return {
    users,
    usersStatus,
    refreshUsers,
  };
});
