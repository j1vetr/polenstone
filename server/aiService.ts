import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. AI description generation will not work.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export type DescriptionStyle = 'professional' | 'energetic' | 'minimal' | 'luxury' | 'natural';

const stylePrompts: Record<DescriptionStyle, string> = {
  professional: `Profesyonel ve kurumsal bir ton kullan. Taşın teknik özelliklerini (sertlik, gözeneklilik, dayanıklılık) ve kalitesini vurgula. Güvenilirlik ve uzmanlık hissi ver.`,
  energetic: `Canlı ve etkileyici bir ton kullan. Doğal taşın ihtişamını ve estetik gücünü yansıt. Şık ve etkileyici bir dil kullan.`,
  minimal: `Minimal ve özlü bir ton kullan. Kısa, net ve etkili cümleler kur. Gereksiz detaylardan kaçın, öze odaklan.`,
  luxury: `Lüks ve premium bir ton kullan. Üst düzey kalite ve ayrıcalık hissi ver. Sofistike ve zarif bir dil kullan.`,
  natural: `Doğal ve sıcak bir ton kullan. Taşın oluşum hikayesini, dokusunu ve organik karakterini öne çıkar. Anadolu mirası ve el işçiliği vurgusu yap.`,
};

const styleNames: Record<DescriptionStyle, string> = {
  professional: 'Profesyonel',
  energetic: 'Enerjik',
  minimal: 'Minimal',
  luxury: 'Lüks',
  natural: 'Doğal',
};

export { styleNames };

export async function generateProductDescription(
  productName: string,
  imageUrl: string | null,
  style: DescriptionStyle
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API anahtarı ayarlanmamış. Lütfen OPENAI_API_KEY secret ekleyin.');
  }
  const stylePrompt = stylePrompts[style];
  
  const systemPrompt = `Sen Polen Stone markası için çalışan profesyonel bir ürün açıklaması yazarısın. Polen Stone, Türkiye'nin premium doğal taş ve mermer markasıdır (mermer, granit, traverten, oniks).

Görevin:
1. Verilen ürün adını ve fotoğrafını analiz et
2. Fotoğraftan ürünün rengini tespit et ve açıklamada mutlaka belirt (örn: "siyah rengi ile şık", "beyaz tonuyla ferah")
3. Belirtilen stilde etkileyici bir ürün açıklaması yaz
4. Açıklama HTML formatında olmalı
5. Türkçe yaz
6. 150-250 kelime arası olsun
7. SEO dostu olsun

Stil: ${stylePrompt}

FORMAT KURALLARI (ÇOK ÖNEMLİ):
- Paragraflar arasında boş satır bırak (her <p> etiketi ayrı satırda olsun)
- SADECE şu emojileri kullan: 💪 🔥 ⚡ 🏆 ✨ 🎯 💯 ⭐ (KALBİ ❤️🖤💙 ASLA KULLANMA)
- Liste öğelerinde de emoji kullanabilirsin
- Her paragraf yeni satırda başlasın
- Önemli kelimeleri <strong> ile kalınlaştır (renk, özellik, avantaj gibi)
- Görsel olarak çekici ve okunabilir olsun

ÜRÜN DETAYLARI (FOTOĞRAFA DİKKATLİ BAK):
- Taşın baskın rengini ve ton geçişlerini belirt (beyaz, krem, gri, bej, antrasit vb.)
- Damar/desen yapısını anlat (damarlı, düz, bulutlu, dalgalı, noktasal)
- Yüzey işlemini belirt (cilalı/parlak, honlu/mat, fırçalı, eskitme, patine)
- Taş tipini doğru adlandır (mermer, granit, traverten, oniks, bazalt vb.)
- Önerilen kullanım alanlarını ekle (banyo, mutfak tezgahı, dış cephe, döşeme, dekoratif duvar)
- Sıcak/soğuk ton karakterini ve uyum sağladığı dekor stillerini belirt

NOKTALAMA İŞARETLERİ (ÇOK DİKKATLİ OL):
- Her cümle sonunda nokta (.) kullan
- Virgülleri doğru yerlere koy
- Ünlem işaretini abartma, sadece vurgu gereken yerlerde kullan
- Türkçe dil kurallarına uy

HTML KURALLARI:
- Sadece HTML içeriği döndür, başka açıklama ekleme
- <html>, <body>, <head> gibi etiketler KULLANMA
- Sadece içerik etiketleri kullan: <p>, <ul>, <li>, <strong>, <em>, <br>
- Ürünün özelliklerini, kullanım alanlarını ve avantajlarını vurgula

ÖRNEK FORMAT:
<p>🔥 <strong>Ürün Başlığı</strong> - Açıklama metni...</p>

<p>💪 İkinci paragraf metni...</p>

<ul>
<li>⚡ Özellik 1</li>
<li>🏆 Özellik 2</li>
</ul>

<p>✨ Son paragraf...</p>`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
  ];

  if (imageUrl) {
    messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Ürün Adı: ${productName}\n\nBu ürün için "${styleNames[style]}" tarzında bir açıklama yaz.`,
        },
        {
          type: 'image_url',
          image_url: {
            url: imageUrl,
            detail: 'low',
          },
        },
      ],
    });
  } else {
    messages.push({
      role: 'user',
      content: `Ürün Adı: ${productName}\n\nBu ürün için "${styleNames[style]}" tarzında bir açıklama yaz.`,
    });
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    max_tokens: 1000,
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('AI yanıt üretemedi');
  }

  return content.trim();
}
