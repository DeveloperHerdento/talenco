export default function AdminLoading() {
  return (
    <main className="min-h-screen w-full bg-[#f6f7f9] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-300 flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-40 animate-pulse rounded bg-[#e5e7eb]" />
            <div className="h-4 w-72 animate-pulse rounded bg-[#ececec]" />
          </div>
          <div className="h-9 w-24 animate-pulse rounded-lg bg-[#ececec]" />
        </div>

        <div className="h-10 w-64 animate-pulse rounded-xl bg-[#ececec]" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-[#ececec] bg-white p-5 shadow-sm">
              <div className="size-11 shrink-0 animate-pulse rounded-xl bg-[#ececec]" />
              <div className="flex flex-col gap-2">
                <div className="h-6 w-16 animate-pulse rounded bg-[#e5e7eb]" />
                <div className="h-3 w-32 animate-pulse rounded bg-[#f0f0f0]" />
              </div>
            </div>
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl border border-[#ececec] bg-white shadow-sm" />
      </div>
    </main>
  );
}
