import { useMemo, useState, type ReactNode } from 'react';
import { BookCheck, FileCheck2, ShieldAlert, TimerReset } from 'lucide-react';
import { editorialMarkets } from '../../mocks/editorial';
import type { EditorialWorkflowStatus } from '../../types';
import { editorialStatusLabels, editorialStatusStyles, formatAdminDate } from './editorialUi';

export function AdminResolution() {
  const queue = editorialMarkets.filter(market => market.status === 'travado' || market.status === 'em_resolucao');
  const [selectedMarketId, setSelectedMarketId] = useState(queue[0]?.id || '');
  const [outcome, setOutcome] = useState('Sim');
  const [sourceReference, setSourceReference] = useState('Federal Reserve - Minutes release, secao de forward guidance.');
  const [evidenceNote, setEvidenceNote] = useState('Confirmar trecho exato no PDF oficial e anexar screenshot para auditoria.');
  const [statusOverrides, setStatusOverrides] = useState<Record<string, EditorialWorkflowStatus>>({});
  const [feedback, setFeedback] = useState('');

  const selectedMarket = useMemo(
    () => queue.find(market => market.id === selectedMarketId) || queue[0],
    [queue, selectedMarketId]
  );

  const resolveMarket = () => {
    if (!selectedMarket) return;

    setStatusOverrides(current => ({ ...current, [selectedMarket.id]: 'resolvido' }));
    setFeedback(`Mercado resolvido como ${outcome}. O historico operacional agora deve anexar a fonte e a justificativa final.`);
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-300">Painel de resolucao</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Mercados travados aguardando veredito</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Central de conferencias finais para fechar mercado, registrar a fonte e reduzir contestacao pos-resultado.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <MiniMetric label="Em resolucao" value={String(queue.filter(item => (statusOverrides[item.id] || item.status) === 'em_resolucao').length)} />
          <MiniMetric label="Travados" value={String(queue.filter(item => (statusOverrides[item.id] || item.status) === 'travado').length)} />
          <MiniMetric label="SLA alvo" value="< 30 min" />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-3xl border border-[#2a2a2a] bg-[#141414] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">Fila imediata</h3>
          <div className="mt-5 space-y-3">
            {queue.map(market => {
              const status = statusOverrides[market.id] || market.status;

              return (
                <button
                  key={market.id}
                  type="button"
                  onClick={() => setSelectedMarketId(market.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors ${selectedMarket?.id === market.id ? 'border-fuchsia-500/30 bg-fuchsia-500/10' : 'border-[#2a2a2a] bg-[#101010] hover:bg-[#161616]'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-white">{market.question}</p>
                      <p className="mt-1 text-xs text-gray-500">{market.eventTitle}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${editorialStatusStyles[status]}`}>
                      {editorialStatusLabels[status]}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{market.resolver || 'Desk Resolucao'}</span>
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
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${editorialStatusStyles[statusOverrides[selectedMarket.id] || selectedMarket.status]}`}>
                      {editorialStatusLabels[statusOverrides[selectedMarket.id] || selectedMarket.status]}
                    </span>
                    <span className="rounded-full border border-[#2a2a2a] bg-[#101010] px-2.5 py-1 text-xs font-medium text-gray-400">{selectedMarket.category}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-white">{selectedMarket.question}</h3>
                  <p className="mt-2 text-sm text-gray-400">Mercado travado em {formatAdminDate(selectedMarket.closeAt)}</p>
                </div>

                <div className="rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-gray-400">
                  <div>Resolver {selectedMarket.resolver || 'Desk Resolucao'}</div>
                  <div>Risco {selectedMarket.riskLevel}</div>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-5">
                  <ResolutionPanel title="Fonte e evidencia" icon={<BookCheck size={17} className="text-lime-400" />}>
                    <label className="block space-y-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Referencia da fonte</span>
                      <textarea
                        value={sourceReference}
                        onChange={event => setSourceReference(event.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                      />
                    </label>

                    <label className="mt-4 block space-y-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Nota operacional</span>
                      <textarea
                        value={evidenceNote}
                        onChange={event => setEvidenceNote(event.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                      />
                    </label>
                  </ResolutionPanel>

                  <ResolutionPanel title="Regra de resolucao" icon={<FileCheck2 size={17} className="text-sky-300" />}>
                    <p className="text-sm leading-6 text-gray-300">{selectedMarket.resolutionRule}</p>
                  </ResolutionPanel>
                </div>

                <div className="space-y-5">
                  <ResolutionPanel title="Escolha do resultado" icon={<ShieldAlert size={17} className="text-fuchsia-300" />}>
                    <div className="space-y-3">
                      {selectedMarket.options.map(option => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setOutcome(option.label)}
                          className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${outcome === option.label ? 'border-lime-500/30 bg-lime-500/10 text-lime-300' : 'border-[#2a2a2a] bg-[#101010] text-white hover:bg-[#161616]'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <button type="button" onClick={resolveMarket} className="mt-4 w-full rounded-xl bg-lime-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-lime-400">
                      Resolver mercado
                    </button>
                  </ResolutionPanel>

                  <ResolutionPanel title="Checklist final" icon={<TimerReset size={17} className="text-amber-300" />}>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="rounded-xl border border-[#2a2a2a] bg-[#101010] px-3 py-2">Fonte primaria confirmada</div>
                      <div className="rounded-xl border border-[#2a2a2a] bg-[#101010] px-3 py-2">Horario de fechamento respeitado</div>
                      <div className="rounded-xl border border-[#2a2a2a] bg-[#101010] px-3 py-2">Justificativa pronta para auditoria</div>
                    </div>
                  </ResolutionPanel>
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-[#2a2a2a] bg-[#101010] text-sm text-gray-500">
              Nenhum mercado aguardando resolucao.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function ResolutionPanel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
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
