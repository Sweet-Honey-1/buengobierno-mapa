export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-yellow-300 border-t-red-600" />
        <p className="text-sm text-neutral-600">{label}</p>
      </div>
    </div>
  )
}