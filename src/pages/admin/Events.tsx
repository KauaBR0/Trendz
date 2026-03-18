import { useMemo, useState } from 'react';
import { CalendarClock, ChevronRight, FilePlus2, FolderKanban, Search, Sparkles, Tags } from 'lucide-react';
import { Link } from 'react-router-dom';
import { editorialEvents, editorialMarkets } from '../../mocks/editorial';
import { editorialStatusLabels, editorialStatusStyles, formatAdminDate, isEditorialLive } from './editorialUi';

const eventFilters = ['todos', 'publicado', 'em_revisao', 'aprovado', 'travado'] as const;

export function AdminEvents() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<(typeof eventFilters)[number]>('todos');

  const filteredEvents = useMemo(() => {
    return editorialEvents.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.category.toLowerCase().includes(search.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = activeFilter === 'todos' || event.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, search]);

  const liveEvents = editorialEvents.filter(event => isEditorialLive(event.status)).length;
  const marketsInReview = editorialMarkets.filter(market => market.status === 'em_revisao').length;
  const avgMarkets = (editorialEvents.reduce((acc, event) => acc + event.marketCount, 0) / editorialEvents.length).toFixed(1);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#2a2a2a] bg-[radial-gradient(circle_at_top_left,_rgba(132,204,22,0.16),_transparent_40%),linear-gradient(180deg,_#1a1d14_0%,_#101010_70%)] p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-lime-300">
              <Sparkles size={14} /> Operacao editorial
            </span>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">Eventos e pacotes de mercado</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300">
                Centralize eventos, acompanhe o estado editorial de cada pacote e abra rapidamente a criacao de mercados com templates revisaveis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/admin/markets/new" className="inline-flex items-center gap-2 rounded-xl bg-lime-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-lime-400">
              <FilePlus2 size={18} /> Novo mercado
            </Link>
            <Link to="/admin/review" className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#181818] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#202020]">
              Ir para revisao <ChevronRight size={18} />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard label="Eventos ao vivo" value={String(liveEvents)} detail="Publicados, travados ou aguardando resolucao" />
          <MetricCard label="Mercados em revisao" value={String(marketsInReview)} detail="Fila que exige leitura editorial e aprovacoes" />
          <MetricCard label="Mercados por evento" value={avgMarkets} detail="Media atual de mercados planejados por evento" />
        </div>
      </section>

      <section className="rounded-2xl border border-[#2a2a2a] bg-[#161616] p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Pesquisar por evento, categoria ou tag..."
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#101010] py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-lime-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {eventFilters.map(filter => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter ? 'bg-lime-500 text-black' : 'bg-[#101010] text-gray-400 hover:text-white'
                }`}
              >
                {filter === 'todos' ? 'Todos' : editorialStatusLabels[filter]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredEvents.map(event => {
          const relatedMarkets = editorialMarkets.filter(market => market.eventId === event.id);

          return (
            <article key={event.id} className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#141414]">
              <div className="flex flex-col gap-5 border-b border-[#2a2a2a] p-6 md:flex-row">
                <img src={event.image} alt={event.title} className="h-20 w-20 rounded-2xl object-cover" />

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${editorialStatusStyles[event.status]}`}>
                          {editorialStatusLabels[event.status]}
                        </span>
                        <span className="rounded-full border border-[#2a2a2a] bg-[#101010] px-2.5 py-1 text-xs font-medium text-gray-400">
                          {event.category}
                        </span>
                        <span className="rounded-full border border-[#2a2a2a] bg-[#101010] px-2.5 py-1 text-xs font-medium text-gray-400">
                          {event.subtype}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold text-white">{event.title}</h3>
                    </div>

                    <div className="rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-right text-sm text-gray-400">
                      <div className="font-semibold text-white">{event.marketCount} mercados</div>
                      <div>{event.lastUpdated}</div>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-gray-400">{event.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-2"><CalendarClock size={14} /> {formatAdminDate(event.eventDate)}</span>
                    <span className="inline-flex items-center gap-2"><FolderKanban size={14} /> {event.region}</span>
                    <span className="inline-flex items-center gap-2"><Tags size={14} /> {event.tags.join(' • ')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Mercados vinculados</h4>
                  <span className="text-xs text-gray-500">Owner: {event.owner}</span>
                </div>

                <div className="space-y-3">
                  {relatedMarkets.slice(0, 3).map(market => (
                    <div key={market.id} className="flex flex-col gap-3 rounded-2xl border border-[#2a2a2a] bg-[#101010] p-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-white">{market.question}</p>
                        <p className="mt-1 text-xs text-gray-500">Template {market.template} • Fecha em {formatAdminDate(market.closeAt)}</p>
                      </div>
                      <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${editorialStatusStyles[market.status]}`}>
                        {editorialStatusLabels[market.status]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/admin/markets/new" className="inline-flex items-center gap-2 rounded-xl border border-lime-500/20 bg-lime-500/10 px-4 py-2.5 text-sm font-semibold text-lime-300 transition-colors hover:bg-lime-500/20">
                    Criar mercado derivado <ChevronRight size={16} />
                  </Link>
                  <Link to="/admin/review" className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#101010] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a1a1a]">
                    Abrir fila de revisao <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-black/20 p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-gray-500">{detail}</p>
    </div>
  );
}
