export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center rounded-[28px] border border-dashed border-red-200 bg-white p-10 text-center">
      <div className="max-w-md space-y-3">
        <h2 className="text-2xl font-bold text-red-700">{title}</h2>
        <p className="text-neutral-600">{description}</p>
      </div>
    </div>
  )
}