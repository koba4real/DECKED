// Presentational only: callers narrow their error and pass a ready message.
export function toastError(title: string, description: string) {
  useToast().add({
    title,
    description,
    color: "error",
    icon: "tabler:alert-triangle",
  });
}
