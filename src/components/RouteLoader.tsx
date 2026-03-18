export function RouteLoader() {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-[#2a2a2a] bg-[#121212]">
      <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime-500 border-t-transparent" />
        <div>
          <p className="text-sm font-semibold text-white">Carregando modulo</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">Lazy route</p>
        </div>
      </div>
    </div>
  );
}
