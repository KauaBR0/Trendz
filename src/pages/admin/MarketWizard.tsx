import { useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, FileText, LayoutTemplate, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { editorialEvents, editorialTemplates } from '../../mocks/editorial';

const wizardSteps = ['Evento', 'Estrutura', 'Regras', 'Revisao'] as const;

export function AdminMarketWizard() {
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState(editorialTemplates[0].id);
  const [eventId, setEventId] = useState(editorialEvents[0].id);
  const [question, setQuestion] = useState(editorialTemplates[0].questionExample);
  const [marketType, setMarketType] = useState(editorialTemplates[0].marketType);
  const [closeAt, setCloseAt] = useState('2026-09-18T20:30');
  const [sources, setSources] = useState(editorialTemplates[0].defaultSources.join('\n'));
  const [resolutionRule, setResolutionRule] = useState('Resolve pela fonte oficial definida no cadastro, sem inferencia editorial.');
  const [cancellationRule, setCancellationRule] = useState('Cancela se o evento perder objetividade ou se a fonte oficial nao publicar resultado verificavel.');
  const [notes, setNotes] = useState('Priorizar publicacao apos revisao juridica e validar timezone do fechamento.');
  const [options, setOptions] = useState(['Sim', 'Nao']);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'info'; message: string } | null>(null);

  const selectedTemplate = useMemo(
    () => editorialTemplates.find(template => template.id === templateId) || editorialTemplates[0],
    [templateId]
  );
  const selectedEvent = useMemo(
    () => editorialEvents.find(event => event.id === eventId) || editorialEvents[0],
    [eventId]
  );

  const reviewChecklist = useMemo(() => {
    const checklist = [...selectedTemplate.checklist];

    if (question.trim().length >= 20) {
      checklist.push('Pergunta com contexto minimo de clareza atendido');
    }

    if (sources.split('\n').filter(Boolean).length >= 2) {
      checklist.push('Ao menos duas fontes cadastradas para validacao operacional');
    }

    return checklist;
  }, [question, selectedTemplate.checklist, sources]);

  const canAdvance = step < wizardSteps.length - 1;
  const canGoBack = step > 0;

  const handleTemplateChange = (nextTemplateId: string) => {
    const template = editorialTemplates.find(entry => entry.id === nextTemplateId);
    if (!template) return;

    setTemplateId(nextTemplateId);
    setQuestion(template.questionExample);
    setMarketType(template.marketType);
    setSources(template.defaultSources.join('\n'));
    setOptions(template.marketType === 'binario' ? ['Sim', 'Nao'] : ['Opcao 1', 'Opcao 2', 'Opcao 3']);
  };

  const updateOption = (index: number, value: string) => {
    setOptions(current => current.map((option, optionIndex) => (optionIndex === index ? value : option)));
  };

  const submitDraft = (mode: 'draft' | 'review') => {
    setFeedback({
      tone: mode === 'review' ? 'success' : 'info',
      message:
        mode === 'review'
          ? 'Mercado preparado e enviado para a fila de revisao. O proximo passo e validar fontes e horario de fechamento.'
          : 'Rascunho salvo como referencia visual. Falta integrar persistencia para publicar de fato.',
    });
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-lime-400">Wizard editorial</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Criar novo mercado</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Use templates da operacao para montar um mercado com evento de origem, regra de resolucao, fontes e checklist antes da publicacao.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/admin/events" className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#161616] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1e1e1e]">
            <ChevronLeft size={16} /> Voltar aos eventos
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-[#2a2a2a] bg-[#141414] p-5 lg:p-6">
        <div className="grid gap-3 md:grid-cols-4">
          {wizardSteps.map((wizardStep, index) => {
            const isActive = index === step;
            const isDone = index < step;

            return (
              <div key={wizardStep} className={`rounded-2xl border p-4 transition-colors ${isActive ? 'border-lime-500/30 bg-lime-500/10' : 'border-[#2a2a2a] bg-[#101010]'}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${isDone ? 'bg-lime-500 text-black' : isActive ? 'bg-lime-400/20 text-lime-300' : 'bg-[#1d1d1d] text-gray-500'}`}>
                    {isDone ? <CheckCircle2 size={18} /> : index + 1}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Etapa</p>
                    <p className="text-sm font-semibold text-white">{wizardStep}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <section className="space-y-6 rounded-3xl border border-[#2a2a2a] bg-[#141414] p-6">
          {feedback ? (
            <div className={`rounded-2xl border px-4 py-3 text-sm ${feedback.tone === 'success' ? 'border-lime-500/20 bg-lime-500/10 text-lime-300' : 'border-sky-500/20 bg-sky-500/10 text-sky-300'}`}>
              {feedback.message}
            </div>
          ) : null}

          {step === 0 ? (
            <div className="space-y-6">
              <SectionTitle icon={<LayoutTemplate size={18} />} title="Base do evento" description="Escolha o pacote editorial e o template que vai orientar a estrutura do mercado." />

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Evento">
                  <select
                    value={eventId}
                    onChange={event => setEventId(event.target.value)}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                  >
                    {editorialEvents.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Template editorial">
                  <select
                    value={templateId}
                    onChange={event => handleTemplateChange(event.target.value)}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                  >
                    {editorialTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="rounded-2xl border border-[#2a2a2a] bg-[#101010] p-5">
                <p className="text-sm font-semibold text-white">{selectedTemplate.label}</p>
                <p className="mt-2 text-sm leading-6 text-gray-400">{selectedTemplate.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#2a2a2a] bg-[#161616] px-3 py-1 text-xs text-gray-400">Categoria {selectedTemplate.category}</span>
                  <span className="rounded-full border border-[#2a2a2a] bg-[#161616] px-3 py-1 text-xs text-gray-400">Tipo {selectedTemplate.marketType === 'binario' ? 'Binario' : 'Multipla escolha'}</span>
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-6">
              <SectionTitle icon={<Sparkles size={18} />} title="Estrutura do mercado" description="Defina pergunta, tipo e opcoes operacionais antes de mandar para revisao." />

              <Field label="Pergunta do mercado">
                <textarea
                  value={question}
                  onChange={event => setQuestion(event.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Tipo do mercado">
                  <select
                    value={marketType}
                    onChange={event => setMarketType(event.target.value as 'binario' | 'multipla_escolha')}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                  >
                    <option value="binario">Binario</option>
                    <option value="multipla_escolha">Multipla escolha</option>
                  </select>
                </Field>

                <Field label="Fechamento do mercado">
                  <input
                    type="datetime-local"
                    value={closeAt}
                    onChange={event => setCloseAt(event.target.value)}
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                  />
                </Field>
              </div>

              <div className="rounded-2xl border border-[#2a2a2a] bg-[#101010] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Opcoes do mercado</p>
                    <p className="mt-1 text-xs text-gray-500">Para mercados binarios, mantenha Sim e Nao. Para multipla escolha, liste os participantes validos.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOptions(current => [...current, `Opcao ${current.length + 1}`])}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#161616] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1e1e1e]"
                  >
                    <Plus size={14} /> Adicionar
                  </button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {options.map((option, index) => (
                    <input
                      key={`${option}-${index}`}
                      type="text"
                      value={option}
                      onChange={event => updateOption(index, event.target.value)}
                      className="rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <SectionTitle icon={<ClipboardList size={18} />} title="Regras, fontes e cancelamento" description="Preencha o texto operacional que vai sustentar revisao, travamento e resolucao." />

              <Field label="Regra de resolucao">
                <textarea
                  value={resolutionRule}
                  onChange={event => setResolutionRule(event.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                />
              </Field>

              <Field label="Regra de cancelamento">
                <textarea
                  value={cancellationRule}
                  onChange={event => setCancellationRule(event.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                />
              </Field>

              <Field label="Fontes oficiais (uma por linha)">
                <textarea
                  value={sources}
                  onChange={event => setSources(event.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                />
              </Field>

              <Field label="Observacoes operacionais">
                <textarea
                  value={notes}
                  onChange={event => setNotes(event.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm text-white outline-none focus:border-lime-500"
                />
              </Field>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <SectionTitle icon={<FileText size={18} />} title="Revisao final" description="Confirme se o mercado esta pronto para virar rascunho forte ou entrar na fila de revisao." />

              <div className="grid gap-4 md:grid-cols-2">
                <ReviewCard label="Evento" value={selectedEvent.title} />
                <ReviewCard label="Template" value={selectedTemplate.label} />
                <ReviewCard label="Tipo" value={marketType === 'binario' ? 'Binario' : 'Multipla escolha'} />
                <ReviewCard label="Fechamento" value={closeAt} />
              </div>

              <div className="rounded-2xl border border-[#2a2a2a] bg-[#101010] p-5">
                <p className="text-sm font-semibold text-white">Pergunta final</p>
                <p className="mt-3 text-base leading-7 text-gray-200">{question}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {options.filter(Boolean).map(option => (
                    <span key={option} className="rounded-full border border-[#2a2a2a] bg-[#151515] px-3 py-1 text-xs text-gray-300">
                      {option}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => submitDraft('draft')} className="rounded-xl border border-[#2a2a2a] bg-[#161616] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1e1e1e]">
                  Salvar rascunho
                </button>
                <button type="button" onClick={() => submitDraft('review')} className="rounded-xl bg-lime-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-lime-400">
                  Enviar para revisao
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-4">
            <button
              type="button"
              disabled={!canGoBack}
              onClick={() => setStep(current => current - 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#101010] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Etapa anterior
            </button>

            <button
              type="button"
              disabled={!canAdvance}
              onClick={() => setStep(current => current + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-lime-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Proxima etapa <ChevronRight size={16} />
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#141414] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Preview editorial</p>
            <h3 className="mt-3 text-xl font-bold text-white">{question}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">Evento {selectedEvent.title}</p>
            <div className="mt-4 grid gap-3 text-sm text-gray-300">
              <InfoRow label="Categoria" value={selectedTemplate.category} />
              <InfoRow label="Tipo" value={marketType === 'binario' ? 'Binario' : 'Multipla escolha'} />
              <InfoRow label="Fechamento" value={closeAt} />
              <InfoRow label="Owner sugerido" value={selectedEvent.owner} />
            </div>
          </div>

          <div className="rounded-3xl border border-[#2a2a2a] bg-[#141414] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Checklist</p>
            <div className="mt-4 space-y-3">
              {reviewChecklist.map(item => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#2a2a2a] bg-[#101010] p-3 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="mt-0.5 text-lime-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#2a2a2a] bg-[#141414] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Fontes previstas</p>
            <div className="mt-4 space-y-2">
              {sources.split('\n').filter(Boolean).map(source => (
                <div key={source} className="rounded-xl border border-[#2a2a2a] bg-[#101010] px-3 py-2 text-sm text-gray-300">
                  {source}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-2xl border border-lime-500/20 bg-lime-500/10 p-3 text-lime-300">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{label}</span>
      {children}
    </label>
  );
}

function ReviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#101010] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}
