import { useMemo, useState, type ReactNode } from 'react';
import { AlertTriangle, ArrowRight, CheckCheck, CircleCheckBig, Search, SendToBack, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { editorialMarkets, editorialTemplates } from '../../mocks/editorial';
import type { EditorialWorkflowStatus } from '../../types';
import { editorialStatusLabels, editorialStatusStyles, formatAdminDate } from './editorialUi';

export function AdminReviewQueue() {
  const queue = editorialMarkets.filter(market => market.status === 'em_revisao' || market.status === 'aprovado');
  const [search, setSearch] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState(queue[0]?.id || '');
  const [overrideStatus, setOverrideStatus] = useState<Record<string, EditorialWorkflowStatus>>({});
  const [feedback, setFeedback] = useState('');

  const visibleMarkets = useMemo(() => {
    return queue.filter(market => {
      const status = overrideStatus[market.id] || market.status;

      return (
        market.question.toLowerCase().includes(search.toLowerCase()) ||
        market.category.toLowerCase().includes(search.toLowerCase()) ||
        status.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [overrideStatus, queue, search]);

  const selectedMarket = visibleMarkets.find(market => market.id === selectedMarketId) || visibleMarkets[0];
  const selectedTemplate = editorialTemplates.find(template => template.label === selectedMarket?.template);

  const takeAction = (nextStatus: EditorialWorkflowStatus, message: string) => {
    if (!selectedMarket) return;
    setOverrideStatus(current => ({ ...current, [selectedMarket.id]: nextStatus }));
    setFeedback(message);
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-amber-400">Fila de revisao</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Validacao editorial antes da publicacao</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Revise mercados, aplique checklist por template e devolva itens ambiguos antes que a operacao coloque volume em risco.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/admin/markets/new" className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#161616] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1d1d1d]">
            Novo mercado <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <TopCard label="Na fila agora" value={String(queue.filter(market => (overrideStatus[market.id] || market.status) === 'em_revisao').length)} detail="Mercados que exigem leitura e sinal verde" />
        <TopCard label="Pre-aprovados" value={String(queue.filter(market => (overrideStatus[market.id] || market.status) === 'aprovado').length)} detail="Itens prontos para publicar quando houver janela" />
        <TopCard label="Checklist medio" value="3.8/4" detail="Cobertura do ritual minimo por template editorial" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-3xl border border-[#2a2a2a] bg-[#141414] p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Filtrar por pergunta, categoria ou status..."
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#101010] py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-lime-500"
            />
          </div>

          <div className="mt-5 space-y-3">
            {visibleMarkets.map(market => {
              const status = overrideStatus[market.id] || market.status;

              return (
                <button
                  key={market.id}
                  type="button"
                  onClick={() => setSelectedMarketId(market.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors ${selectedMarket?.id === market.id ? 'border-lime-500/30 bg-lime-500/10' : 'border-[#2a2a2a] bg-[#101010] hover:bg-[#161616]'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-white">{market.question}</p>
                      <p className="mt-1 text-xs text-gray-500">{market.category} • {market.template}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${editorialStatusStyles[status]}`}>
                      {editorialStatusLabels[status]}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Owner {market.owner}</span>
                    <span>{market.lastUpdated}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-5 rounded-3xl border border-[#2a2a2a] bg-[#141414] p-6">
          {selectedMarket ? (
            <>
              {feedback ? <div className="rounded-2xl border border-lime-500/20 bg-lime-500/10 px-4 py-3 text-sm text-lime-300">{feedback}</div> : null}

              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${editorialStatusStyles[overrideStatus[selectedMarket.id] || selectedMarket.status]}`}>
                      {editorialStatusLabels[overrideStatus[selectedMarket.id] || selectedMarket.status]}
                    </span>
                    <span className="rounded-full border border-[#2a2a2a] bg-[#101010] px-2.5 py-1 text-xs font-medium text-gray-400">
                      {selectedMarket.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{selectedMarket.question}</h3>
                  <p className="text-sm text-gray-400">Evento {selectedMarket.eventTitle} • Fecha em {formatAdminDate(selectedMarket.closeAt)}</p>
                </div>

                <div className="rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-gray-400">
                  <div>Owner {selectedMarket.owner}</div>
                  <div>Revisor {selectedMarket.reviewer || 'Nao atribuido'}</div>
                  <div>Risco {selectedMarket.riskLevel}</div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_320px]">
                <div className="space-y-5">
                  <Panel title="Regra de resolucao" icon={<ShieldCheck size={17} className="text-lime-400" />}>
                    <p className="text-sm leading-6 text-gray-300">{selectedMarket.resolutionRule}</p>
                  </Panel>

                  <Panel title="Checklist do template" icon={<CircleCheckBig size={17} className="text-sky-400" />}>
                    <div className="space-y-3">
                      {selectedTemplate?.checklist.map(item => (
                        <div key={item} className="flex items-start gap-3 rounded-xl border border-[#2a2a2a] bg-[#101010] p-3 text-sm text-gray-300">
                          <CheckCheck size={16} className="mt-0.5 text-lime-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </Panel>

                  <Panel title="Notas da operacao" icon={<AlertTriangle size={17} className="text-amber-300" />}>
                    <p className="text-sm leading-6 text-gray-300">{selectedMarket.notes}</p>
                  </Panel>
                </div>

                <div className="space-y-5">
                  <Panel title="Fontes aceitas" icon={<ShieldCheck size={17} className="text-lime-400" />}>
                    <div className="space-y-2">
                      {selectedMarket.officialSources.map(source => (
                        <div key={source} className="rounded-xl border border-[#2a2a2a] bg-[#101010] px-3 py-2 text-sm text-gray-300">
                          {source}
                        </div>
                      ))}
                    </div>
                  </Panel>

                  <Panel title="Acoes rapidas" icon={<SendToBack size={17} className="text-fuchsia-300" />}>
                    <div className="space-y-3">
                      <button type="button" onClick={() => takeAction('aprovado', 'Mercado marcado como aprovado. Agora ele ja pode entrar na janela de publicacao.')} className="w-full rounded-xl bg-lime-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-lime-400">
                        Aprovar mercado
                      </button>
                      <button type="button" onClick={() => takeAction('rascunho', 'Mercado devolvido para rascunho com ajustes editoriais pendentes.')} className="w-full rounded-xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a1a1a]">
                        Devolver para rascunho
                      </button>
                      <button type="button" onClick={() => takeAction('cancelado', 'Mercado sinalizado como cancelado para evitar publicacao de pergunta ambigua.')} className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20">
                        Cancelar item
                      </button>
                    </div>
                  </Panel>
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-[#2a2a2a] bg-[#101010] text-sm text-gray-500">
              Nenhum mercado encontrado para esta busca.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TopCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-gray-500">{detail}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#161616] p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
