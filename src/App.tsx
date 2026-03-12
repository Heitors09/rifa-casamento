import { useState, useEffect, useMemo } from 'react';
import { supabase } from './lib/supabase';
import { Calendar, Heart, ShieldAlert, Clock, MessageCircle, Eye, EyeOff } from 'lucide-react';
import './index.css';

const TOTAL = 650;
const WA = '5511999999999';

export default function App() {
  const [admin, setAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [taken, setTaken] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('rifa') || '[]'); } catch { return []; }
  });
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => { localStorage.setItem('rifa', JSON.stringify(taken)); }, [taken]);

  useEffect(() => {
    const target = new Date('2026-07-18T20:00:00').getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setTime({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff / 36e5) % 24),
        m: Math.floor((diff / 6e4) % 60),
        s: Math.floor((diff / 1e3) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const click = (n: number) => {
    if (admin) {
      setTaken(t => t.includes(n) ? t.filter(x => x !== n) : [...t, n]);
    } else if (!taken.includes(n)) {
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(`Olá! Eu quero o número ${n} da rifa do casamento de Natanael e Beatriz.`)}`, '_blank');
    }
  };

  const available = useMemo(() => TOTAL - taken.length, [taken]);
  const progress = useMemo(() => Math.round((taken.length / TOTAL) * 100), [taken]);

  const handleAdminClick = () => {
    if (admin) {
      setAdmin(false);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('username', loginUser)
        .eq('password', loginPass)
        .single();

      if (error || !data) {
        setLoginError('Usuário ou senha inválidos.');
        return;
      }

      setAdmin(true);
      setShowLogin(false);
      setLoginUser('');
      setLoginPass('');
    } catch (err) {
      setLoginError('Erro ao conectar ao banco de dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans text-stone-800 transition-colors duration-300 ${admin ? 'bg-stone-950' : 'bg-cream-50'}`}>

      {admin && (
        <div className="sticky top-0 z-50 bg-stone-900 text-white text-center py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 border-b border-stone-800">
          <ShieldAlert size={14} /> Modo Administrador
        </div>
      )}

      {/* ─── Hero ─── */}
      <header className={`relative overflow-hidden ${admin ? 'bg-stone-900' : 'bg-cream-100'}`}>
        <div className="max-w-5xl mx-auto px-6 py-12 sm:py-20 text-center relative z-10">

          {/* Main Hero Image */}
          <div className="flex justify-center mb-6">
            <img
              src="/heart-hero.png"
              alt="Coração decorativo com flores"
              className="w-48 sm:w-64 md:w-80 h-auto object-contain drop-shadow-sm animate-in fade-in zoom-in duration-700"
            />
          </div>

          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-gold-500 mb-4">
            Ação Rumo ao Altar
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-stone-800 leading-tight">
            Natanael <span className="italic text-gold-500 font-normal">&</span> Beatriz
          </h1>

          <p className="mt-4 text-sm sm:text-base text-stone-500 font-light max-w-md mx-auto leading-relaxed">
            Celebrando o amor e construindo um futuro juntos.
            <br />
            <span className="font-medium text-stone-600">26 de Julho de 2026</span>
          </p>

          <div className="mt-8 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-cream-300 rounded-full px-5 py-2.5 text-sm text-stone-600 shadow-sm">
            <Clock size={14} className="text-gold-500" />
            Sorteio: 18 de Julho às 20h
          </div>
        </div>

        {/* Background ornament */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c9a96e 1px, transparent 1px), radial-gradient(circle at 80% 50%, #c9a96e 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">

        {/* ─── Countdown ─── */}
        <section className="-mt-6 relative z-20">
          <div className="bg-white rounded-2xl shadow-lg shadow-stone-200/50 border border-cream-200 p-6 sm:p-8">
            <div className="grid grid-cols-4 gap-3 sm:gap-6">
              {[
                { v: time.d, l: 'Dias' },
                { v: time.h, l: 'Horas' },
                { v: time.m, l: 'Minutos' },
                { v: time.s, l: 'Segundos' },
              ].map((t, i) => (
                <div key={i} className="text-center">
                  <div className="font-serif text-3xl sm:text-5xl font-medium text-stone-800 tabular-nums leading-none">
                    {String(t.v).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-stone-400 uppercase tracking-widest mt-2">{t.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Prizes ─── */}
        <section className="mt-12">
          <div className="text-center mb-8">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-gold-500 mb-2">Concorra a</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-800">Prêmios Exclusivos</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {[
              {
                pos: '1º Lugar',
                title: 'Rodízio para Dois',
                sub: 'JP Steak House',
                icon: '🥩',
              },
              {
                pos: '2º Lugar',
                title: 'Fone Bluetooth',
                sub: 'Experiência sonora premium',
                icon: '🎧',
              },
              {
                pos: '3º Lugar',
                title: 'R$ 50,00',
                sub: 'Prêmio em dinheiro',
                icon: '💰',
              },
            ].map((p, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border border-cream-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cream-50 rounded-full opacity-50 transition-transform group-hover:scale-150 duration-500" />

                <div className="relative z-10 w-14 h-14 bg-cream-50 rounded-full flex items-center justify-center text-2xl mb-4 text-gold-500 border border-cream-200">
                  {p.icon}
                </div>

                <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500 mb-2">
                  {p.pos}
                </span>

                <h3 className="relative z-10 font-serif text-lg font-medium text-stone-800 mb-1 leading-tight">{p.title}</h3>
                <p className="relative z-10 text-xs text-stone-500">{p.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Numbers ─── */}
        <section className="mt-12">
          <div className="text-center mb-2">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-gold-500 mb-2">Garanta o seu</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-800">Escolha seu Número</h2>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 mb-6 text-sm">
            <div className="flex items-center gap-2 text-stone-500">
              <span className="font-semibold text-stone-800">{TOTAL}</span> números
            </div>
            <div className="text-cream-300">|</div>
            <div className="flex items-center gap-2 text-stone-500">
              <span className="font-semibold text-sage-600">{available}</span> disponíveis
            </div>
            <div className="text-cream-300">|</div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-terracotta-500">R$ 15,00</span>
              <span className="text-stone-400">cada</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between text-[11px] text-stone-400 mb-1.5 font-medium">
              <span>{taken.length} vendidos</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-500 relative" style={{ width: `${progress}%` }}>
                {/* 80% Marker */}
                <div className="absolute top-0 right-0 h-full w-px bg-white/50" />
              </div>
            </div>
            <p className="text-center text-[11px] text-terracotta-400 opacity-90">
              <span className="text-gold-600 font-semibold mr-1">Aviso:</span>
              O sorteio ocorrerá somente após atingirmos <span className="font-semibold text-terracotta-600">80% da meta</span>.
            </p>
          </div>

          {!admin && (
            <div className="flex items-start gap-3 bg-cream-100 border border-cream-200 rounded-xl p-4 mb-6 max-w-lg mx-auto">
              <MessageCircle size={16} className="text-sage-500 mt-0.5 shrink-0" />
              <p className="text-xs text-stone-500 leading-relaxed">
                Ao clicar em um número disponível, você será redirecionado ao <strong className="text-stone-700">WhatsApp</strong> para confirmar sua escolha.
              </p>
            </div>
          )}

          {/* Grid */}
          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-4 sm:p-6">
            <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-13 gap-1.5 max-h-[55vh] overflow-y-auto scrollbar-thin pr-1">
              {Array.from({ length: TOTAL }, (_, i) => i + 1).map(n => {
                const sold = taken.includes(n);
                return (
                  <button
                    key={n}
                    onClick={() => click(n)}
                    disabled={!admin && sold}
                    className={`
                      aspect-square rounded-lg text-xs font-medium transition-all duration-150 border
                      ${sold
                        ? admin
                          ? 'bg-red-500/90 border-red-500 text-white hover:bg-red-600 cursor-pointer'
                          : 'bg-cream-100 border-cream-200 text-stone-300 cursor-default'
                        : 'bg-white border-cream-200 text-stone-600 hover:border-gold-400 hover:bg-gold-400/5 hover:text-gold-600 cursor-pointer active:scale-95'
                      }
                    `}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border border-cream-200 bg-white" /> Disponível
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cream-100 border border-cream-200" /> Reservado
            </span>
          </div>
        </section>

        {/* ─── Info ─── */}
        <section className="mt-12 text-center">
          <div className="bg-cream-100 border border-cream-200 rounded-2xl p-8 max-w-lg mx-auto">
            <Calendar size={20} className="text-gold-500 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-stone-800 mb-2">Sobre a Ação</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Esta é uma ação beneficente para o casamento de <strong className="text-stone-700">Natanael Sousa</strong> e <strong className="text-stone-700">Beatriz Guimarães</strong>, que será celebrado no dia 26 de Julho de 2026. O sorteio acontecerá ao vivo no dia 18 de Julho às 20h.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center border-t border-cream-200 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-8 bg-cream-300" />
            <Heart size={12} className="text-gold-400" />
            <span className="h-px w-8 bg-cream-300" />
          </div>
          <p className="text-xs text-stone-400">
            Feito com amor · Natanael & Beatriz © 2026
          </p>
        </footer>
      </main>

      {/* Admin FAB */}
      <button
        onClick={handleAdminClick}
        title={admin ? 'Sair do admin' : 'Admin'}
        className={`fixed bottom-5 right-5 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50
          ${admin ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-stone-800 text-white shadow-stone-800/30'}`}
      >
        <ShieldAlert size={18} />
      </button>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <ShieldAlert size={32} className="text-gold-500 mx-auto mb-3" />
              <h3 className="font-serif text-xl sm:text-2xl text-stone-800">Acesso Restrito</h3>
              <p className="text-sm text-stone-500 mt-1">Insira suas credenciais de administrador</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Usuário</label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full bg-cream-50 border border-cream-200 rounded-lg px-4 py-2.5 text-stone-800 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-cream-50 border border-cream-200 rounded-lg pl-4 pr-11 py-2.5 text-stone-800 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-red-500 text-xs text-center">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-800 text-white rounded-lg py-3 text-sm font-medium hover:bg-stone-900 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verificando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
