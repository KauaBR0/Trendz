import type { ReactNode } from 'react';
import { ArrowRight, ClipboardList, FilePenLine, Gavel, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { editorialEvents, editorialMarkets } from '../../mocks/editorial';
import { editorialStatusLabels, editorialStatusStyles, isEditorialLive } from './editorialUi';

export function AdminDashboard() {
  const { markets, bets } = useApp();

  const totalVolume = markets.reduce((acc, m) => {
    const vol = parseFloat(m.volume?.replace('R$', '').replace(',', '').replace('M', '000000').replace('K', '000') || '0');
    return acc + vol;
  }, 0);

  const activeMarkets = markets.filter(m => m.status === 'active').length;
  const totalBets = bets.length;
  const liveEditorialEvents = editorialEvents.filter(event => isEditorialLive(event.status)).length;
  const reviewQueue = editorialMarkets.filter(market => market.status === 'em_revisao').length;
  const resolutionQueue = editorialMarkets.filter(market => market.status === 'travado' || market.status === 'em_resolucao').length;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Visão Geral</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Volume Total" 
          value={`R$ ${(totalVolume / 1000000).toFixed(2)}M`} 
          icon={<DollarSign size={24} className="text-lime-500" />} 
        />
        <StatCard 
          title="Mercados Ativos" 
          value={activeMarkets.toString()} 
          icon={<ShoppingCart size={24} className="text-blue-500" />} 
        />
        <StatCard 
          title="Total de Apostas" 
          value={totalBets.toString()} 
          icon={<Activity size={24} className="text-purple-500" />} 
        />
        <StatCard 
          title="Usuários Ativos" 
          value="1,245" 
          icon={<Users size={24} className="text-orange-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="rounded-3xl border border-[#2a2a2a] bg-[radial-gradient(circle_at_top_left,_rgba(132,204,22,0.15),_transparent_40%),linear-gradient(180deg,_#161b14_0%,_#101010_72%)] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Workflow editorial</p>
              <h3 className="mt-3 text-2xl font-black text-white">Da pauta ate a resolucao</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
                Novas telas do admin para organizar eventos, criar mercados por template, revisar copy e resolver com fonte auditavel.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <CompactMetric icon={<FilePenLine size={16} className="text-lime-300" />} label="Eventos ativos" value={String(liveEditorialEvents)} />
              <CompactMetric icon={<ClipboardList size={16} className="text-amber-300" />} label="Em revisao" value={String(reviewQueue)} />
              <CompactMetric icon={<Gavel size={16} className="text-fuchsia-300" />} label="Em resolucao" value={String(resolutionQueue)} />
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <QuickLinkCard to="/admin/events" title="Eventos" description="Pacotes editoriais, categorias, tags e volume planejado." />
            <QuickLinkCard to="/admin/markets/new" title="Novo mercado" description="Wizard com template, fontes e checklist operacional." />
            <QuickLinkCard to="/admin/review" title="Fila de revisao" description="Aprove ou devolva mercados antes de publicar." />
          </div>
        </div>

        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1a1613] p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Fila editorial</h3>
            <Link to="/admin/resolution" className="text-sm font-semibold text-lime-400 transition-colors hover:text-lime-300">
              Abrir painel
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {editorialMarkets.slice(0, 4).map(market => (
              <div key={market.id} className="rounded-2xl border border-[#2a2a2a] bg-[#101010] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="line-clamp-2 text-sm font-semibold text-white">{market.question}</p>
                    <p className="mt-1 text-xs text-gray-500">{market.eventTitle}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${editorialStatusStyles[market.status]}`}>
                    {editorialStatusLabels[market.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Mercados Recentes</h3>
          <div className="space-y-4">
            {markets.slice(0, 5).map(market => (
              <div key={market.id} className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                  <img src={market.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-bold text-white line-clamp-1">{market.title}</p>
                    <p className="text-xs text-gray-500">{market.category}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${market.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                  {market.status === 'active' ? 'Ativo' : 'Resolvido'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Últimas Apostas</h3>
          <div className="space-y-4">
            {bets.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma aposta registrada ainda.</p>
            ) : (
              bets.slice(0, 5).map(bet => (
                <div key={bet.id} className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#2a2a2a]">
                  <div>
                    <p className="text-sm font-bold text-white line-clamp-1">{bet.marketTitle}</p>
                    <p className="text-xs text-gray-500">{bet.choice} - {bet.odds}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-lime-500">R$ {bet.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{new Date(bet.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-black/20 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function QuickLinkCard({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link to={to} className="rounded-2xl border border-[#2a2a2a] bg-[#101010] p-4 transition-colors hover:bg-[#181818]">
      <p className="text-base font-bold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lime-400">
        Abrir <ArrowRight size={15} />
      </span>
    </Link>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: ReactNode }) {
  return (
    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 flex items-center gap-4">
      <div className="p-4 bg-[#121212] rounded-xl border border-[#2a2a2a]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
