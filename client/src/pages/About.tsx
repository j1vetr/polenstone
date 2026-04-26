import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight, Instagram, Gem, Mountain, Hammer, Leaf, Award, Users, Truck, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

const values = [
  { icon: Mountain, label: 'Doğallık', tone: 'border-amber-500/30' },
  { icon: Gem, label: 'Zarafet', tone: 'border-orange-500/30' },
  { icon: Hammer, label: 'Ustalık', tone: 'border-stone-500/30' },
  { icon: Leaf, label: 'Sürdürülebilirlik', tone: 'border-emerald-500/30' },
];

const stats = [
  { number: '500+', label: 'Tamamlanan Proje' },
  { number: '%100', label: 'Türk Mermeri' },
  { number: '10+', label: 'Yıl Deneyim' },
  { number: '81', label: 'İl Teslimat' },
];

const features = [
  { icon: Award, title: 'Premium Kalite', desc: 'Her bir blok özenle seçilmiş, kusursuz işlenmiş doğal taş' },
  { icon: Users, title: 'Uzman Danışmanlık', desc: 'Mekânınıza en uygun taşı birlikte seçiyoruz' },
  { icon: Truck, title: 'Türkiye Geneli', desc: '81 ile özenli paketleme ve güvenli teslimat' },
  { icon: ShieldCheck, title: 'Garantili Ürün', desc: 'Her ürün test edilir, kalite belgesiyle gönderilir' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Hakkımızda"
        description="Polen Stone — Anadolu'nun zengin doğal taş mirasını modern mekânlara taşıyan premium mermer ve doğal taş markası."
      />
      <Header />

      <main className="pt-28 pb-20">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--polen-cream))] via-background to-[hsl(var(--polen-cream))]" />

          <div className="relative px-6 py-16 lg:py-24">
            <div className="max-w-6xl mx-auto">
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-xs text-muted-foreground mb-10"
              >
                <Link href="/" data-testid="link-home">Ana Sayfa</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground">Hakkımızda</span>
              </motion.nav>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-xs tracking-[0.3em] uppercase text-polen-orange mb-4 block font-semibold">
                    Türkiye'nin Doğal Taş Mirası
                  </span>
                  <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-wider mb-6 text-foreground leading-tight">
                    POLEN <span className="text-polen-orange">STONE</span><br />
                    <span className="text-muted-foreground text-3xl sm:text-4xl lg:text-5xl">Doğal Taş & Mermer</span>
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Anadolu'nun bin yıllık taş kültürünü modern mekânlara taşıyan
                    premium doğal taş markasıyız. Mermer, granit, traverten ve oniks
                    koleksiyonumuzla mekânlarınıza eşsiz bir karakter katıyoruz.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {values.map((value, index) => (
                      <motion.div
                        key={value.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-card border ${value.tone} rounded-xl px-4 py-3 flex items-center gap-2`}
                        data-testid={`value-${value.label}`}
                      >
                        <value.icon className="w-5 h-5 text-polen-orange" />
                        <span className="font-medium text-foreground">{value.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-card border border-border rounded-2xl p-6 text-center hover:border-polen-orange transition-colors"
                      data-testid={`stat-${stat.label}`}
                    >
                      <p className="font-display text-4xl lg:text-5xl tracking-wide text-foreground mb-2">{stat.number}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-polen-orange mb-4 block font-semibold">Neden Polen Stone?</span>
              <h2 className="font-display text-3xl sm:text-4xl tracking-wider text-foreground">FARK YARATAN ÖZELLİKLER</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-card border border-border rounded-2xl p-6 hover:border-polen-orange transition-all"
                  data-testid={`feature-${feature.title}`}
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-polen-orange/10 flex items-center justify-center mb-4 group-hover:bg-polen-orange/20 transition-colors">
                      <feature.icon className="w-7 h-7 text-polen-orange" />
                    </div>
                    <h3 className="font-display text-xl tracking-wide mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* VISION & MISSION */}
        <section className="py-16 lg:py-24 px-6 bg-[hsl(var(--polen-cream))]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-polen-orange mb-4 block font-semibold">Hikâyemiz</span>
              <h2 className="font-display text-3xl sm:text-4xl tracking-wider text-foreground mb-8">VİZYON & MİSYON</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-polen-orange/10 flex items-center justify-center mb-5">
                  <Mountain className="w-6 h-6 text-polen-orange" />
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-4 text-foreground">VİZYONUMUZ</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Anadolu'nun zengin doğal taş kaynaklarını, dünyanın dört bir yanındaki
                  prestijli projelere ulaştırmak. Her mekâna doğanın ihtişamını taşıyarak
                  Türk mermer ve doğal taş kültürünü uluslararası standartlarda temsil etmek.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-polen-orange/10 flex items-center justify-center mb-5">
                  <Hammer className="w-6 h-6 text-polen-orange" />
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-4 text-foreground">MİSYONUMUZ</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Doğanın milyonlarca yılda ürettiği eşsiz dokuları, ustalıkla işleyip
                  müşterilerimize sunmak. Her projeyi kişiye özel bir hikâye olarak ele
                  alıp, kalite ve estetikten ödün vermeden teslim etmek.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-polen-orange/15 via-polen-orange/5 to-transparent border border-polen-orange/30 rounded-3xl p-8 lg:p-10 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-polen-orange/15 flex items-center justify-center mx-auto mb-6">
                  <Instagram className="w-8 h-8 text-polen-orange" />
                </div>
                <h3 className="font-display text-2xl tracking-wider mb-4 text-foreground">BİZİ TAKİP EDİN</h3>
                <p className="text-muted-foreground mb-6">
                  Yeni gelen taşlar, tamamlanan projeler ve mekân ilhamları için
                  Instagram'da bizi takip edin.
                </p>
                <a
                  href="https://www.instagram.com/polenstone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-polen-orange text-white font-bold py-4 px-8 rounded-full hover:bg-[hsl(var(--polen-orange-deep))] transition-colors"
                  data-testid="link-instagram"
                >
                  <Instagram className="w-5 h-5" />
                  @polenstone
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-3xl p-8 lg:p-10"
              >
                <h3 className="font-display text-2xl tracking-wider mb-8 text-foreground">İLETİŞİM BİLGİLERİ</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-polen-orange/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-polen-orange" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Adres</p>
                      <p className="font-medium text-foreground">Polen Stone Doğal Taş & Mermer</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-polen-orange/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-polen-orange" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Telefon</p>
                      <a href="tel:+905000000000" className="font-medium text-foreground hover:text-polen-orange transition-colors" data-testid="link-phone">0500 000 00 00</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-polen-orange/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-polen-orange" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">E-posta</p>
                      <a href="mailto:info@polenstone.com.tr" className="font-medium text-foreground hover:text-polen-orange transition-colors" data-testid="link-email">info@polenstone.com.tr</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
