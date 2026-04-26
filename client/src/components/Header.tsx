import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Search, X, User, LogOut, ChevronDown, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, type Variants } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { SearchOverlay } from '@/components/SearchOverlay';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import polenLogo from '@assets/Polen-Sticker-1.pdf_1777239312980.png';

interface MenuItemData {
  id: string;
  title: string;
  type: 'category' | 'link' | 'submenu';
  categoryId: string | null;
  url: string | null;
  parentId: string | null;
  displayOrder: number;
  isActive: boolean;
  openInNewTab: boolean;
  category?: { id: string; name: string; slug: string } | null;
  children?: MenuItemData[];
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  image?: string | null;
}

const stagger: { container: Variants; item: Variants } = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
    exit: { y: -40, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as [number, number, number, number] } },
  },
};

export function Header() {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 48));

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const { data: categoriesData = [] } = useQuery<CategoryData[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  // Hide legacy fitness categories (display_order >= 100); show only stone categories
  const visibleCategories = categoriesData
    .filter(c => (c.displayOrder ?? 0) < 100)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  // Static nav links (always visible)
  const staticLinks = [
    { href: '/magaza', label: 'Mağaza', testId: 'link-nav-magaza' },
    { href: '/hakkimizda', label: 'Hakkımızda', testId: 'link-nav-hakkimizda' },
  ];

  const navLinkCls = (active: boolean) =>
    `relative inline-flex items-center gap-1 text-[11px] font-medium tracking-[0.18em] uppercase transition-colors nav-link-hover ${active ? 'text-black' : 'text-black/70 hover:text-black'}`;

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="hidden lg:flex bg-[hsl(var(--polen-stone))] h-9 items-center justify-center gap-0">
        <div className="flex items-center gap-8 px-10">
          <div className="flex items-center gap-2.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-polen-orange shrink-0">
              <path d="M12 2 4 7v10l8 5 8-5V7l-8-5z"/><path d="M4 7l8 5 8-5"/><path d="M12 12v10"/>
            </svg>
            <span className="text-[10px] tracking-[0.28em] uppercase text-white/75 font-medium">Türkiye Geneli Kargo</span>
          </div>
          <span className="w-px h-3 bg-white/15" />
          <div className="flex items-center gap-2.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-polen-orange shrink-0">
              <circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>
            </svg>
            <span className="text-[10px] tracking-[0.28em] uppercase text-white/75 font-medium">2.500 TL Üzeri Ücretsiz Kargo</span>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <motion.header
        initial={false}
        animate={{ height: scrolled ? 80 : 110 }}
        transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
        className="fixed lg:static top-0 left-0 right-0 z-40 bg-white border-b border-black/8 flex items-center"
        style={{ willChange: 'height' }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between gap-6">

            {/* Left: Logo + mobile hamburger */}
            <div className="flex items-center gap-4 min-w-0">
              <button
                data-testid="button-mobile-menu"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex flex-col gap-[5px] p-1 -ml-1 group"
                aria-label="Menü"
              >
                <span className="block h-px w-5 bg-black transition-all group-hover:w-6" />
                <span className="block h-px w-4 bg-black transition-all group-hover:w-6" />
                <span className="block h-px w-6 bg-black" />
              </button>

              <Link href="/" data-testid="link-logo" className="shrink-0 block">
                <motion.img
                  src={polenLogo}
                  alt="Polen Stone — Doğal Taş & Mermer"
                  whileHover={{ opacity: 0.85 }}
                  transition={{ duration: 0.2 }}
                  animate={{ height: scrolled ? 60 : 88 }}
                  className="w-auto object-contain"
                  data-testid="img-logo"
                  style={{ willChange: 'height' }}
                />
              </Link>
            </div>

            {/* Center: Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Categories mega-dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={navLinkCls(location.startsWith('/kategori/'))}
                    data-testid="button-nav-kategoriler"
                  >
                    Kategoriler
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={20}
                  className="bg-white border-black/8 shadow-xl rounded-none p-3"
                  style={{ minWidth: visibleCategories.length > 6 ? 520 : 240 }}
                >
                  {visibleCategories.length === 0 ? (
                    <DropdownMenuItem
                      onClick={() => navigate('/magaza')}
                      className="text-[11px] tracking-wider uppercase text-black hover:bg-black/5 cursor-pointer py-2.5"
                    >
                      Tüm Ürünler
                    </DropdownMenuItem>
                  ) : (
                    <div
                      className="grid gap-x-2 gap-y-0.5"
                      style={{ gridTemplateColumns: visibleCategories.length > 6 ? 'repeat(2, minmax(0, 1fr))' : '1fr' }}
                    >
                      {visibleCategories.map((c) => {
                        const href = `/kategori/${c.slug}`;
                        return (
                          <DropdownMenuItem
                            key={c.id}
                            onClick={() => navigate(href)}
                            className="text-[11px] tracking-[0.16em] uppercase text-black hover:bg-[hsl(var(--polen-cream))] hover:text-polen-orange cursor-pointer py-2.5 px-3 rounded-none transition-colors"
                            data-testid={`link-cat-${c.slug}`}
                          >
                            {c.name}
                          </DropdownMenuItem>
                        );
                      })}
                      <div
                        className="border-t border-black/10 mt-2 pt-2"
                        style={{ gridColumn: visibleCategories.length > 6 ? '1 / -1' : 'auto' }}
                      >
                        <DropdownMenuItem
                          onClick={() => navigate('/magaza')}
                          className="text-[11px] tracking-[0.16em] uppercase text-polen-orange font-semibold hover:bg-[hsl(var(--polen-cream))] cursor-pointer py-2.5 px-3 rounded-none"
                          data-testid="link-cat-tum-urunler"
                        >
                          Tüm Ürünler →
                        </DropdownMenuItem>
                      </div>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {staticLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkCls(location === link.href)}
                  data-testid={link.testId}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Icons */}
            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(true)}
                className="p-3 text-black/65 hover:text-polen-orange transition-colors"
                data-testid="button-search"
                aria-label="Ara"
              >
                <Search className="w-[22px] h-[22px]" strokeWidth={1.75} />
              </motion.button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button whileTap={{ scale: 0.9 }} className="p-3 text-black/65 hover:text-polen-orange transition-colors" data-testid="button-account" aria-label="Hesabım">
                      <User className="w-[22px] h-[22px]" strokeWidth={1.75} />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-black/8 shadow-lg rounded-none min-w-[180px]">
                    <DropdownMenuItem disabled className="text-[10px] tracking-widest text-black/30 uppercase">{user.firstName || user.email}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/hesabim')} className="text-[11px] tracking-wider uppercase text-black hover:bg-black/5 cursor-pointer py-2.5">
                      <User className="w-4 h-4 mr-2" />Hesabım
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} className="text-[11px] tracking-wider uppercase text-black hover:bg-black/5 cursor-pointer py-2.5">
                      <LogOut className="w-4 h-4 mr-2" />Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/giris">
                  <motion.button whileTap={{ scale: 0.9 }} className="p-3 text-black/65 hover:text-polen-orange transition-colors" data-testid="button-account" aria-label="Giriş Yap">
                    <User className="w-[22px] h-[22px]" strokeWidth={1.75} />
                  </motion.button>
                </Link>
              )}

              <Link href="/sepet">
                <motion.button whileTap={{ scale: 0.9 }} className="p-3 text-black/65 hover:text-polen-orange transition-colors relative" data-testid="button-cart" aria-label="Sepet">
                  <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={1.75} />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        key="badge"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-polen-orange text-white text-[10px] font-bold flex items-center justify-center rounded-full leading-none"
                      >
                        {totalItems > 9 ? '9+' : totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile drawer menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
              data-testid="overlay-mobile-menu"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[88%] max-w-[400px] bg-white flex flex-col overflow-hidden shadow-2xl"
              data-testid="drawer-mobile-menu"
            >
              {/* Top bar — orange */}
              <div className="relative bg-polen-orange flex items-center justify-between px-5 py-4">
                <Link href="/" onClick={() => setMobileOpen(false)} className="block bg-white rounded-full p-1.5">
                  <img
                    src={polenLogo}
                    alt="Polen Stone"
                    className="h-12 w-12 object-contain"
                    data-testid="img-logo-mobile"
                  />
                </Link>
                <div className="flex flex-col items-end">
                  <span className="font-display text-white text-[11px] tracking-[0.32em] uppercase opacity-95">
                    Polen Stone
                  </span>
                  <span className="text-white/75 text-[9px] tracking-[0.28em] uppercase mt-0.5">
                    Doğal Taş & Mermer
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-3 right-3 p-2 bg-white/15 hover:bg-white/25 rounded-full text-white transition-colors"
                  data-testid="button-close-menu"
                  aria-label="Menüyü Kapat"
                >
                  <X className="w-4 h-4" strokeWidth={2.25} />
                </motion.button>
              </div>

              {/* Promo strip */}
              <div className="bg-[hsl(var(--polen-cream))] px-5 py-3 border-b border-black/5 flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-polen-orange shrink-0">
                  <circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>
                </svg>
                <span className="text-[10px] tracking-[0.22em] uppercase text-black/75 font-semibold">
                  2.500 TL Üzeri Ücretsiz Kargo
                </span>
              </div>

              {/* Nav links — white bg */}
              <nav className="flex-1 overflow-y-auto bg-white">
                <motion.div
                  variants={stagger.container}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  className="flex flex-col"
                >
                  {[
                    { href: '/', label: 'Ana Sayfa', testId: 'link-mobile-home' },
                    { href: '/magaza', label: 'Mağaza', testId: 'link-mobile-magaza' },
                  ].map(link => (
                    <motion.div key={link.href} variants={stagger.item}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-center justify-between px-5 py-4 border-b border-black/[0.06] transition-colors hover:bg-[hsl(var(--polen-cream))]"
                        data-testid={link.testId}
                      >
                        <span className="flex items-center gap-3">
                          <span className="block w-1 h-7 bg-transparent group-hover:bg-polen-orange transition-colors rounded-full" />
                          <span className="font-display text-[18px] tracking-[0.18em] uppercase text-black group-hover:text-polen-orange transition-colors">
                            {link.label}
                          </span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-black/25 -rotate-90 group-hover:text-polen-orange transition-colors" />
                      </Link>
                    </motion.div>
                  ))}

                  {/* Categories accordion */}
                  <motion.div variants={stagger.item}>
                    <button
                      onClick={() => setMobileCatOpen(v => !v)}
                      className={`group w-full flex items-center justify-between px-5 py-4 border-b border-black/[0.06] transition-colors ${mobileCatOpen ? 'bg-polen-orange' : 'hover:bg-[hsl(var(--polen-cream))]'}`}
                      data-testid="button-mobile-kategoriler"
                      aria-expanded={mobileCatOpen}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`block w-1 h-7 rounded-full transition-colors ${mobileCatOpen ? 'bg-white' : 'bg-transparent group-hover:bg-polen-orange'}`} />
                        <span className={`font-display text-[18px] tracking-[0.18em] uppercase transition-colors ${mobileCatOpen ? 'text-white' : 'text-black group-hover:text-polen-orange'}`}>
                          Kategoriler
                        </span>
                      </span>
                      <motion.span
                        animate={{ rotate: mobileCatOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className={`${mobileCatOpen ? 'text-white' : 'text-black/35 group-hover:text-polen-orange'} transition-colors`}
                      >
                        <ChevronDown className="w-4 h-4" strokeWidth={2.25} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {mobileCatOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden bg-[hsl(var(--polen-cream))] border-b border-black/[0.06]"
                        >
                          <div className="py-2">
                            {visibleCategories.length === 0 ? (
                              <Link
                                href="/magaza"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 px-8 py-3 text-[12px] tracking-[0.16em] uppercase font-semibold text-polen-orange hover:bg-white/60 transition-colors"
                                data-testid="link-mobile-cat-tum-urunler"
                              >
                                <span className="w-1 h-1 rounded-full bg-polen-orange" />
                                Tüm Ürünler →
                              </Link>
                            ) : (
                              <>
                                {visibleCategories.map(c => (
                                  <Link
                                    key={c.id}
                                    href={`/kategori/${c.slug}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-8 py-3 text-[12px] tracking-[0.16em] uppercase text-black/75 hover:text-polen-orange hover:bg-white/60 transition-colors"
                                    data-testid={`link-mobile-cat-${c.slug}`}
                                  >
                                    <span className="w-1 h-1 rounded-full bg-polen-orange/60" />
                                    {c.name}
                                  </Link>
                                ))}
                                <Link
                                  href="/magaza"
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-3 px-8 py-3 mt-1 text-[12px] tracking-[0.16em] uppercase font-semibold text-polen-orange border-t border-black/5 hover:bg-white/60 transition-colors"
                                  data-testid="link-mobile-cat-tum-urunler"
                                >
                                  <span className="w-1 h-1 rounded-full bg-polen-orange" />
                                  Tüm Ürünler →
                                </Link>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={stagger.item}>
                    <Link
                      href="/hakkimizda"
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between px-5 py-4 border-b border-black/[0.06] transition-colors hover:bg-[hsl(var(--polen-cream))]"
                      data-testid="link-mobile-hakkimizda"
                    >
                      <span className="flex items-center gap-3">
                        <span className="block w-1 h-7 bg-transparent group-hover:bg-polen-orange transition-colors rounded-full" />
                        <span className="font-display text-[18px] tracking-[0.18em] uppercase text-black group-hover:text-polen-orange transition-colors">
                          Hakkımızda
                        </span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-black/25 -rotate-90 group-hover:text-polen-orange transition-colors" />
                    </Link>
                  </motion.div>

                  {/* Account */}
                  <motion.div variants={stagger.item}>
                    {user ? (
                      <>
                        <Link
                          href="/hesabim"
                          onClick={() => setMobileOpen(false)}
                          className="group flex items-center justify-between px-5 py-4 border-b border-black/[0.06] transition-colors hover:bg-[hsl(var(--polen-cream))]"
                          data-testid="link-mobile-hesabim"
                        >
                          <span className="flex items-center gap-3">
                            <User className="w-4 h-4 text-polen-orange" strokeWidth={1.75} />
                            <span className="text-[13px] tracking-[0.16em] uppercase text-black/80 group-hover:text-polen-orange font-medium transition-colors">
                              Hesabım
                            </span>
                          </span>
                        </Link>
                        <button
                          onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
                          className="group w-full flex items-center justify-between px-5 py-4 border-b border-black/[0.06] transition-colors hover:bg-[hsl(var(--polen-cream))]"
                          data-testid="button-mobile-logout"
                        >
                          <span className="flex items-center gap-3">
                            <LogOut className="w-4 h-4 text-black/45" strokeWidth={1.75} />
                            <span className="text-[13px] tracking-[0.16em] uppercase text-black/80 group-hover:text-polen-orange font-medium transition-colors">
                              Çıkış Yap
                            </span>
                          </span>
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/giris"
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-center justify-between px-5 py-4 border-b border-black/[0.06] transition-colors hover:bg-[hsl(var(--polen-cream))]"
                        data-testid="link-mobile-giris"
                      >
                        <span className="flex items-center gap-3">
                          <User className="w-4 h-4 text-polen-orange" strokeWidth={1.75} />
                          <span className="text-[13px] tracking-[0.16em] uppercase text-black/80 group-hover:text-polen-orange font-medium transition-colors">
                            Giriş Yap
                          </span>
                        </span>
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
              </nav>

              {/* Bottom: solid orange CTA */}
              <Link
                href="/sepet"
                onClick={() => setMobileOpen(false)}
                className="relative bg-polen-orange hover:brightness-110 transition-all px-5 py-5 flex items-center justify-between text-white"
                data-testid="link-mobile-sepet"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
                  <span className="font-display text-[14px] tracking-[0.2em] uppercase font-semibold">
                    Sepete Git
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {totalItems > 0 && (
                    <span className="min-w-[24px] h-6 px-2 bg-white text-polen-orange text-[11px] font-bold flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4 -rotate-90" strokeWidth={2.25} />
                </span>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
