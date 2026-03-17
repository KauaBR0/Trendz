import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { MarketCard } from '../components/MarketCard';
import { useApp } from '../context/AppContext';

export function Home() {
  const { markets, searchQuery } = useApp();

  const filteredMarkets = markets.filter(market => 
    market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingMarkets = filteredMarkets.slice(0, 3);
  const celebrityMarkets = filteredMarkets.filter(m => m.category === 'Celebridades');

  return (
    <div className="space-y-8">
      {/* Banners Section */}
      <section className="flex gap-4 overflow-x-auto pb-4 snap-x">
        <div className="min-w-[300px] md:min-w-[400px] h-48 bg-gradient-to-r from-lime-500 to-lime-600 rounded-2xl p-6 relative overflow-hidden snap-center flex-shrink-0">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="bg-black text-lime-500 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">MercadoTRENDZ</span>
              <h2 className="text-3xl font-black text-black mt-2 leading-none">Eleições 2026</h2>
            </div>
            <button className="bg-black/20 hover:bg-black/30 text-black font-semibold px-4 py-2 rounded-lg w-fit transition-colors flex items-center gap-2 backdrop-blur-sm">
              Acessar Mercado &rarr;
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full bg-black/10 rounded-tl-full"></div>
        </div>

        <div className="min-w-[300px] md:min-w-[400px] h-48 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 relative overflow-hidden snap-center flex-shrink-0">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="bg-black text-lime-500 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Categoria Classic</span>
              <h2 className="text-3xl font-black text-white mt-2 leading-none">Mr Olympia<br/>2026</h2>
            </div>
            <button className="bg-black/20 hover:bg-black/30 text-white font-semibold px-4 py-2 rounded-lg w-fit transition-colors flex items-center gap-2 backdrop-blur-sm">
              Acessar Mercado &rarr;
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full bg-black/20 rounded-tl-full"></div>
        </div>

        <div className="min-w-[300px] md:min-w-[400px] h-48 bg-gradient-to-r from-lime-400 to-green-500 rounded-2xl p-6 relative overflow-hidden snap-center flex-shrink-0">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="bg-black text-lime-500 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Novo Mercado</span>
              <h2 className="text-3xl font-black text-black mt-2 leading-none">Aprovação<br/>Anvisa</h2>
            </div>
            <button className="bg-black/20 hover:bg-black/30 text-black font-semibold px-4 py-2 rounded-lg w-fit transition-colors flex items-center gap-2 backdrop-blur-sm">
              Acessar Mercado &rarr;
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full bg-black/10 rounded-tl-full"></div>
        </div>
      </section>

      {/* Tendências Section */}
      {trendingMarkets.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-lime-500/20 p-1.5 rounded-lg">
              <Sparkles className="text-lime-500" size={20} />
            </div>
            <h2 className="text-xl font-bold">Tendências</h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {trendingMarkets.map(market => (
              <React.Fragment key={market.id}>
                <MarketCard
                  id={market.id}
                  title={market.title}
                  image={market.image}
                  type={market.type}
                  options={market.options}
                  binaryData={market.binaryData}
                />
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {/* Celebridades Section */}
      {celebrityMarkets.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-lime-500/20 p-1.5 rounded-lg">
              <Star className="text-lime-500" size={20} />
            </div>
            <h2 className="text-xl font-bold">Celebridades &gt;</h2>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button className="bg-[#2a2a2a] text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div> Todos
            </button>
            <button className="text-gray-400 hover:text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
              Brasil
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {celebrityMarkets.map(market => (
              <React.Fragment key={market.id}>
                <MarketCard
                  id={market.id}
                  title={market.title}
                  image={market.image}
                  type={market.type}
                  options={market.options}
                  binaryData={market.binaryData}
                />
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {filteredMarkets.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum mercado encontrado para "{searchQuery}"
        </div>
      )}
    </div>
  );
}
