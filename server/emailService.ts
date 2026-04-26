import nodemailer from 'nodemailer';
import { storage } from './storage';
import type { Order, OrderItem, User } from '@shared/schema';

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

async function getSmtpConfig(): Promise<SmtpConfig | null> {
  const settings = await storage.getSiteSettings();
  
  if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) {
    console.log('[Email] SMTP settings not configured');
    return null;
  }
  
  return {
    host: settings.smtp_host,
    port: parseInt(settings.smtp_port || '587'),
    secure: settings.smtp_secure === 'true',
    user: settings.smtp_user,
    pass: settings.smtp_pass,
  };
}

async function createTransporter() {
  const config = await getSmtpConfig();
  if (!config) return null;
  
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

const baseStyles = `
  body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; }
  .container { max-width: 600px; margin: 0 auto; background-color: #171717; border-radius: 16px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid #262626; }
  .logo { font-size: 32px; font-weight: 800; letter-spacing: 4px; color: #ffffff; margin: 0; }
  .content { padding: 40px 30px; }
  .footer { background-color: #0d0d0d; padding: 30px; text-align: center; border-top: 1px solid #262626; }
  .footer p { color: #71717a; font-size: 12px; margin: 5px 0; }
  h1 { color: #ffffff; font-size: 24px; margin: 0 0 20px 0; font-weight: 600; }
  h2 { color: #ffffff; font-size: 18px; margin: 20px 0 10px 0; font-weight: 600; }
  p { color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 15px 0; }
  .highlight { color: #ffffff; font-weight: 600; }
  .btn { display: inline-block; background-color: #ffffff; color: #000000 !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 20px 0; }
  .btn:hover { background-color: #e5e5e5; }
  .info-box { background-color: #1f1f1f; border: 1px solid #262626; border-radius: 12px; padding: 20px; margin: 20px 0; }
  .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #262626; }
  .info-row:last-child { border-bottom: none; }
  .info-label { color: #71717a; font-size: 13px; }
  .info-value { color: #ffffff; font-size: 14px; font-weight: 500; }
  .product-item { display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #262626; }
  .product-item:last-child { border-bottom: none; }
  .product-info { flex: 1; }
  .product-name { color: #ffffff; font-weight: 500; margin: 0 0 5px 0; }
  .product-details { color: #71717a; font-size: 13px; margin: 0; }
  .product-price { color: #ffffff; font-weight: 600; }
  .total-row { display: flex; justify-content: space-between; padding: 15px 0; }
  .total-label { color: #a1a1aa; }
  .total-value { color: #ffffff; font-weight: 600; }
  .grand-total { font-size: 18px; border-top: 1px solid #262626; padding-top: 15px; margin-top: 10px; }
  .tracking-box { background: linear-gradient(135deg, #262626 0%, #1f1f1f 100%); border-radius: 12px; padding: 25px; text-align: center; margin: 20px 0; }
  .tracking-number { font-size: 20px; color: #ffffff; font-weight: 700; letter-spacing: 2px; margin: 10px 0; }
  .divider { height: 1px; background-color: #262626; margin: 25px 0; }
`;

function wrapTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>POLEN STONE</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div style="padding: 20px; background-color: #0a0a0a;">
    <div class="container">
      <div class="header">
        <h1 class="logo">POLEN STONE</h1>
      </div>
      ${content}
      <div class="footer">
        <p>Polen Stone — Doğal Taş & Mermer</p>
        <p>Bu e-posta Polen Stone tarafından gönderilmiştir.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Welcome Email Template
function welcomeEmailTemplate(userName: string): string {
  return wrapTemplate(`
    <div class="content">
      <h1>Hoş Geldin, ${userName}!</h1>
      <p>Polen Stone ailesine katıldığın için çok mutluyuz. Artık premium doğal taş koleksiyonumuza tam erişimin var.</p>
      
      <div class="info-box">
        <h2 style="margin-top: 0;">Seni Neler Bekliyor?</h2>
        <p style="margin-bottom: 0;">
          <span class="highlight">Premium Kalite</span> - En iyi malzemelerle üretilmiş ürünler<br><br>
          <span class="highlight">Hızlı Teslimat</span> - Siparişleriniz özenle paketlenir<br><br>
          <span class="highlight">Özel Kampanyalar</span> - Üyelere özel indirimler
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="https://polenstone.com.tr" class="btn">Alışverişe Başla</a>
      </div>
      
      <p style="text-align: center; color: #71717a; font-size: 13px;">
        Sorularınız için bize ulaşabilirsiniz.
      </p>
    </div>
  `);
}

// Order Confirmation Template
function orderConfirmationTemplate(order: Order, items: OrderItem[], siteUrl: string = 'https://polenstone.com.tr'): string {
  const itemsHtml = items.map(item => `
    <div class="product-item">
      <div class="product-info">
        <p class="product-name">${item.productName}</p>
        <p class="product-details">${item.variantDetails || ''} x ${item.quantity}</p>
      </div>
      <div class="product-price">${item.subtotal}₺</div>
    </div>
  `).join('');
  
  const shippingAddress = order.shippingAddress as { address: string; city: string; district: string; postalCode: string; country?: string };
  const trackingUrl = `${siteUrl}/siparis-takip?no=${order.orderNumber}`;
  
  return wrapTemplate(`
    <div class="content">
      <h1>Siparişiniz Alındı!</h1>
      <p>Siparişiniz başarıyla oluşturuldu. Hazırlanmaya başlandığında size bilgi vereceğiz.</p>
      
      <div class="info-box">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <div>
            <p class="info-label">Sipariş No</p>
            <p class="info-value">#${order.orderNumber}</p>
          </div>
          <div style="text-align: right;">
            <p class="info-label">Tarih</p>
            <p class="info-value">${new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 10px;">
          <a href="${trackingUrl}" class="btn" style="display: inline-block;">Siparişimi Takip Et</a>
        </div>
      </div>
      
      <h2>Sipariş Detayları</h2>
      <div class="info-box">
        ${itemsHtml}
        <div class="divider"></div>
        <div class="total-row">
          <span class="total-label">Ara Toplam</span>
          <span class="total-value">${order.subtotal}₺</span>
        </div>
        <div class="total-row">
          <span class="total-label">Kargo</span>
          <span class="total-value">${parseFloat(order.shippingCost) === 0 ? 'Ücretsiz' : order.shippingCost + '₺'}</span>
        </div>
        ${order.discountAmount && parseFloat(order.discountAmount) > 0 ? `
        <div class="total-row">
          <span class="total-label">İndirim</span>
          <span class="total-value" style="color: #22c55e;">-${order.discountAmount}₺</span>
        </div>
        ` : ''}
        <div class="total-row grand-total">
          <span class="total-label">Toplam</span>
          <span class="total-value">${order.total}₺</span>
        </div>
      </div>
      
      <h2>Teslimat Adresi</h2>
      <div class="info-box">
        <p style="margin: 0; color: #ffffff;">${order.customerName}</p>
        <p style="margin: 5px 0 0 0;">${shippingAddress.address}</p>
        <p style="margin: 5px 0 0 0;">${shippingAddress.district}, ${shippingAddress.city} ${shippingAddress.postalCode}</p>
        <p style="margin: 10px 0 0 0;">${order.customerPhone}</p>
      </div>
      
      <p style="text-align: center; color: #71717a; font-size: 13px; margin-top: 20px;">
        Sorularınız için <a href="mailto:destek@polenstone.com.tr" style="color: #ffffff;">destek@polenstone.com.tr</a> adresinden bize ulaşabilirsiniz.
      </p>
    </div>
  `);
}

// Preparing Notification Template
function preparingNotificationTemplate(order: Order): string {
  return wrapTemplate(`
    <div class="content">
      <h1>Siparişiniz Hazırlanıyor!</h1>
      <p>Güzel haberler! Siparişiniz şu anda depomuzda özenle hazırlanıyor.</p>
      
      <div class="info-box">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p class="info-label">Sipariş No</p>
            <p class="info-value">#${order.orderNumber}</p>
          </div>
          <div style="text-align: right;">
            <p class="info-label">Toplam</p>
            <p class="info-value">${order.total}₺</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #18181b, #27272a); border-radius: 12px; margin: 20px 0;">
        <p style="margin: 0; color: #a1a1aa; font-size: 14px;">Tahmini Kargo Süresi</p>
        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 24px; font-weight: bold;">1-2 İş Günü</p>
      </div>
      
      <p style="text-align: center; color: #71717a; font-size: 13px;">
        Siparişiniz kargoya verildiğinde size tekrar bilgi vereceğiz.
      </p>
    </div>
  `);
}

// Shipping Notification Template
function shippingNotificationTemplate(order: Order): string {
  const dhlTrackingUrl = order.trackingNumber 
    ? `https://www.dhl.com/tr-tr/home/tracking.html?tracking-id=${order.trackingNumber}&submit=1`
    : null;
  const trackingUrl = order.trackingUrl || dhlTrackingUrl;
  
  return wrapTemplate(`
    <div class="content">
      <h1>Siparişiniz Kargoya Verildi!</h1>
      <p>Harika haberlerimiz var! Siparişiniz paketlendi ve kargoya teslim edildi.</p>
      
      <div class="tracking-box" style="text-align: center; padding: 25px; background: linear-gradient(135deg, #18181b, #27272a); border-radius: 12px; border: 1px solid #3f3f46;">
        <img src="https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg" alt="DHL" style="height: 40px; margin-bottom: 15px;" />
        <p style="margin: 0; color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">KARGO TAKİP NUMARASI</p>
        <p class="tracking-number" style="font-size: 28px; font-weight: bold; color: #ffffff; margin: 10px 0; letter-spacing: 2px;">${order.trackingNumber || 'Henüz belirlenmedi'}</p>
        ${order.shippingCarrier ? `<p style="margin: 5px 0 0 0; color: #a1a1aa;">${order.shippingCarrier}</p>` : '<p style="margin: 5px 0 0 0; color: #fbbf24;">DHL Express</p>'}
        ${trackingUrl ? `
          <a href="${trackingUrl}" class="btn" style="display: inline-block; margin-top: 20px; padding: 14px 32px; background: #fbbf24; color: #000000; text-decoration: none; border-radius: 8px; font-weight: bold;">KARGOMU TAKİP ET</a>
        ` : ''}
      </div>
      
      <div class="info-box">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p class="info-label">Sipariş No</p>
            <p class="info-value">#${order.orderNumber}</p>
          </div>
          <div style="text-align: right;">
            <p class="info-label">Toplam</p>
            <p class="info-value">${order.total}₺</p>
          </div>
        </div>
      </div>
      
      <p style="text-align: center; color: #71717a; font-size: 13px;">
        Kargo takip numaranızı kullanarak siparişinizi DHL üzerinden takip edebilirsiniz.
      </p>
    </div>
  `);
}

// Admin New Order Notification Template
function adminOrderNotificationTemplate(order: Order, items: OrderItem[]): string {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #262626; color: #ffffff;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #262626; color: #a1a1aa;">${item.variantDetails || '-'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #262626; color: #a1a1aa; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #262626; color: #ffffff; text-align: right;">${item.subtotal}₺</td>
    </tr>
  `).join('');
  
  const shippingAddress = order.shippingAddress as { address: string; city: string; district: string; postalCode: string; country?: string };
  
  return wrapTemplate(`
    <div class="content">
      <h1>Yeni Sipariş Alındı!</h1>
      <p>Yeni bir sipariş oluşturuldu. Detaylar aşağıda.</p>
      
      <div class="info-box">
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
          <div>
            <p class="info-label">Sipariş No</p>
            <p class="info-value">#${order.orderNumber}</p>
          </div>
          <div>
            <p class="info-label">Tarih</p>
            <p class="info-value">${new Date(order.createdAt).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div>
            <p class="info-label">Toplam</p>
            <p class="info-value" style="font-size: 18px;">${order.total}₺</p>
          </div>
        </div>
      </div>
      
      <h2>Müşteri Bilgileri</h2>
      <div class="info-box">
        <p style="margin: 0; color: #ffffff; font-weight: 500;">${order.customerName}</p>
        <p style="margin: 5px 0;">${order.customerEmail}</p>
        <p style="margin: 0;">${order.customerPhone}</p>
        <div class="divider"></div>
        <p style="margin: 0; color: #71717a; font-size: 13px;">TESLİMAT ADRESİ</p>
        <p style="margin: 5px 0 0 0;">${shippingAddress.address}</p>
        <p style="margin: 5px 0 0 0;">${shippingAddress.district}, ${shippingAddress.city} ${shippingAddress.postalCode}</p>
      </div>
      
      <h2>Sipariş Ürünleri</h2>
      <div class="info-box" style="padding: 0; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #262626;">
              <th style="padding: 12px; text-align: left; color: #71717a; font-size: 12px;">ÜRÜN</th>
              <th style="padding: 12px; text-align: left; color: #71717a; font-size: 12px;">VARYANT</th>
              <th style="padding: 12px; text-align: center; color: #71717a; font-size: 12px;">ADET</th>
              <th style="padding: 12px; text-align: right; color: #71717a; font-size: 12px;">TUTAR</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>
      
      <div style="text-align: center; margin-top: 25px;">
        <a href="https://polenstone.com.tr/toov-admin" class="btn">Siparişi Görüntüle</a>
      </div>
    </div>
  `);
}

// Password Reset Template
function passwordResetTemplate(userName: string, resetLink: string): string {
  return wrapTemplate(`
    <div class="content">
      <h1>Şifre Sıfırlama Talebi</h1>
      <p>Merhaba ${userName},</p>
      <p>Hesabınız için bir şifre sıfırlama talebi aldık. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" class="btn">Şifremi Sıfırla</a>
      </div>
      
      <div class="info-box">
        <p style="margin: 0; color: #71717a; font-size: 13px;">
          <strong style="color: #ffffff;">Önemli:</strong> Bu link 1 saat içinde geçerliliğini yitirecektir.
        </p>
      </div>
      
      <p style="color: #71717a; font-size: 13px;">
        Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Hesabınız güvende.
      </p>
      
      <p style="color: #71717a; font-size: 13px;">
        Butona tıklayamıyorsanız, aşağıdaki linki tarayıcınıza kopyalayın:<br>
        <span style="color: #a1a1aa; word-break: break-all;">${resetLink}</span>
      </p>
    </div>
  `);
}

// Review Request Template
function reviewRequestTemplate(userName: string, orderNumber: string, products: string[]): string {
  const productsList = products.map(p => `<li style="color: #a1a1aa; margin: 8px 0;">${p}</li>`).join('');
  
  return wrapTemplate(`
    <div class="content">
      <h1>Ürünlerimizi Değerlendirir misiniz?</h1>
      <p>Merhaba ${userName},</p>
      <p>#${orderNumber} numaralı siparişiniz teslim edildi. Deneyiminizi paylaşmanızı çok isteriz!</p>
      
      <div class="info-box">
        <p style="margin: 0 0 10px 0; color: #71717a; font-size: 13px;">SİPARİŞİNİZDEKİ ÜRÜNLER</p>
        <ul style="margin: 0; padding-left: 20px;">
          ${productsList}
        </ul>
      </div>
      
      <p>Değerlendirmeleriniz, hem bize gelişmemiz için yardımcı oluyor hem de diğer müşterilerimize doğru seçim yapmalarında rehberlik ediyor.</p>
      
      <div style="text-align: center;">
        <a href="https://polenstone.com.tr/profilim" class="btn">Değerlendirme Yap</a>
      </div>
      
      <p style="text-align: center; color: #71717a; font-size: 13px;">
        Geri bildiriminiz bizim için çok değerli!
      </p>
    </div>
  `);
}

// Abandoned Cart Reminder Template
interface CartItem {
  productName: string;
  variantDetails?: string;
  price: string;
  quantity: number;
  imageUrl?: string;
}

function abandonedCartTemplate(userName: string, cartItems: CartItem[], cartTotal: number, siteUrl: string = 'https://polenstone.com.tr'): string {
  const itemsHtml = cartItems.map(item => `
    <div class="product-item">
      <div class="product-info">
        <p class="product-name">${item.productName}</p>
        <p class="product-details">${item.variantDetails || ''} x ${item.quantity}</p>
      </div>
      <div class="product-price">${item.price}₺</div>
    </div>
  `).join('');
  
  return wrapTemplate(`
    <div class="content">
      <h1>Sepetiniz Sizi Bekliyor!</h1>
      <p>Merhaba ${userName},</p>
      <p>Sepetinizde harika ürünler var! Siparişinizi tamamlamayı mı unuttunuz?</p>
      
      <div class="info-box">
        <p style="margin: 0 0 15px 0; color: #71717a; font-size: 13px; text-transform: uppercase;">SEPETİNİZDEKİ ÜRÜNLER</p>
        ${itemsHtml}
        <div class="divider"></div>
        <div class="total-row grand-total">
          <span class="total-label">Toplam</span>
          <span class="total-value">${cartTotal.toFixed(2)}₺</span>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${siteUrl}/sepet" class="btn">Sepetime Git</a>
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #262626 0%, #1f1f1f 100%);">
        <p style="margin: 0; text-align: center;">
          <span style="color: #22c55e; font-weight: 600;">2500₺ ve üzeri</span>
          <span style="color: #a1a1aa;"> siparişlerde </span>
          <span style="color: #22c55e; font-weight: 600;">kargo ücretsiz!</span>
        </p>
      </div>
      
      <p style="text-align: center; color: #71717a; font-size: 13px; margin-top: 20px;">
        Stoklar sınırlı! Favori ürünlerinizi kaçırmayın.
      </p>
    </div>
  `);
}

// Email sending functions
export async function sendWelcomeEmail(user: User): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP yapılandırması eksik' };
    }
    
    const settings = await storage.getSiteSettings();
    const fromEmail = settings.smtp_user || 'no-reply@polenstone.com.tr';
    
    const userName = user.firstName || 'Değerli Müşterimiz';
    
    await transporter.sendMail({
      from: `"Polen Stone" <${fromEmail}>`,
      to: user.email,
      subject: 'Polen Stone\'a Hoş Geldiniz!',
      html: welcomeEmailTemplate(userName),
    });
    
    console.log(`[Email] Welcome email sent to ${user.email}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email] Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendOrderConfirmationEmail(order: Order, items: OrderItem[]): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP yapılandırması eksik' };
    }
    
    const settings = await storage.getSiteSettings();
    const fromEmail = settings.smtp_user || 'no-reply@polenstone.com.tr';
    
    await transporter.sendMail({
      from: `"Polen Stone" <${fromEmail}>`,
      to: order.customerEmail,
      subject: `Siparişiniz Alındı - #${order.orderNumber}`,
      html: orderConfirmationTemplate(order, items),
    });
    
    console.log(`[Email] Order confirmation sent to ${order.customerEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email] Failed to send order confirmation:', error);
    return { success: false, error: error.message };
  }
}

export async function sendPreparingNotificationEmail(order: Order): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP yapılandırması eksik' };
    }
    
    const settings = await storage.getSiteSettings();
    const fromEmail = settings.smtp_user || 'no-reply@polenstone.com.tr';
    
    await transporter.sendMail({
      from: `"Polen Stone" <${fromEmail}>`,
      to: order.customerEmail,
      subject: `Siparişiniz Hazırlanıyor - #${order.orderNumber}`,
      html: preparingNotificationTemplate(order),
    });
    
    console.log(`[Email] Preparing notification sent to ${order.customerEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email] Failed to send preparing notification:', error);
    return { success: false, error: error.message };
  }
}

export async function sendShippingNotificationEmail(order: Order): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP yapılandırması eksik' };
    }
    
    const settings = await storage.getSiteSettings();
    const fromEmail = settings.smtp_user || 'no-reply@polenstone.com.tr';
    
    await transporter.sendMail({
      from: `"Polen Stone" <${fromEmail}>`,
      to: order.customerEmail,
      subject: `Siparişiniz Kargoya Verildi - #${order.orderNumber}`,
      html: shippingNotificationTemplate(order),
    });
    
    console.log(`[Email] Shipping notification sent to ${order.customerEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email] Failed to send shipping notification:', error);
    return { success: false, error: error.message };
  }
}

export async function sendAdminOrderNotificationEmail(order: Order, items: OrderItem[]): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP yapılandırması eksik' };
    }
    
    const settings = await storage.getSiteSettings();
    const fromEmail = settings.smtp_user || 'no-reply@polenstone.com.tr';
    const adminEmail = settings.admin_email;
    
    if (!adminEmail) {
      console.log('[Email] Admin email not configured');
      return { success: false, error: 'Admin e-posta adresi ayarlanmamış' };
    }
    
    await transporter.sendMail({
      from: `"Polen Stone Sistem" <${fromEmail}>`,
      to: adminEmail,
      subject: `Yeni Sipariş - #${order.orderNumber} - ${order.total}₺`,
      html: adminOrderNotificationTemplate(order, items),
    });
    
    console.log(`[Email] Admin notification sent to ${adminEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email] Failed to send admin notification:', error);
    return { success: false, error: error.message };
  }
}

export async function sendPasswordResetEmail(user: User, resetToken: string): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP yapılandırması eksik' };
    }
    
    const settings = await storage.getSiteSettings();
    const fromEmail = settings.smtp_user || 'no-reply@polenstone.com.tr';
    const siteUrl = settings.site_url || 'https://polenstone.com.tr';
    
    const resetLink = `${siteUrl}/sifre-sifirla?token=${resetToken}`;
    const userName = user.firstName || 'Değerli Müşterimiz';
    
    await transporter.sendMail({
      from: `"Polen Stone" <${fromEmail}>`,
      to: user.email,
      subject: 'Şifre Sıfırlama Talebi',
      html: passwordResetTemplate(userName, resetLink),
    });
    
    console.log(`[Email] Password reset email sent to ${user.email}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email] Failed to send password reset email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendReviewRequestEmail(
  userEmail: string,
  userName: string,
  orderNumber: string,
  products: string[]
): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP yapılandırması eksik' };
    }
    
    const settings = await storage.getSiteSettings();
    const fromEmail = settings.smtp_user || 'no-reply@polenstone.com.tr';
    
    await transporter.sendMail({
      from: `"Polen Stone" <${fromEmail}>`,
      to: userEmail,
      subject: 'Deneyiminizi Paylaşın',
      html: reviewRequestTemplate(userName, orderNumber, products),
    });
    
    console.log(`[Email] Review request sent to ${userEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email] Failed to send review request:', error);
    return { success: false, error: error.message };
  }
}

export async function sendTestEmail(toEmail: string): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP yapılandırması eksik' };
    }
    
    const settings = await storage.getSiteSettings();
    const fromEmail = settings.smtp_user || 'no-reply@polenstone.com.tr';
    
    await transporter.sendMail({
      from: `"Polen Stone" <${fromEmail}>`,
      to: toEmail,
      subject: 'Polen Stone - Test E-postası',
      html: wrapTemplate(`
        <div class="content">
          <h1>Test E-postası</h1>
          <p>Bu bir test e-postasıdır. SMTP ayarlarınız başarıyla yapılandırıldı!</p>
          <div class="info-box">
            <p style="margin: 0; color: #22c55e;">E-posta sistemi çalışıyor.</p>
          </div>
        </div>
      `),
    });
    
    console.log(`[Email] Test email sent to ${toEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email] Failed to send test email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendAbandonedCartEmail(
  userEmail: string,
  userName: string,
  cartItems: CartItem[],
  cartTotal: number
): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP yapılandırması eksik' };
    }
    
    const settings = await storage.getSiteSettings();
    const fromEmail = settings.smtp_user || 'no-reply@polenstone.com.tr';
    const siteUrl = settings.site_url || 'https://polenstone.com.tr';
    
    await transporter.sendMail({
      from: `"Polen Stone" <${fromEmail}>`,
      to: userEmail,
      subject: 'Sepetiniz Sizi Bekliyor! 🛒',
      html: abandonedCartTemplate(userName, cartItems, cartTotal, siteUrl),
    });
    
    console.log(`[Email] Abandoned cart reminder sent to ${userEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email] Failed to send abandoned cart email:', error);
    return { success: false, error: error.message };
  }
}

// Quote Email Template
interface QuoteEmailData {
  quoteNumber: string;
  dealerName: string;
  contactPerson: string | null;
  validUntil: Date | null;
  grandTotal: string;
  itemCount: number;
}

function quoteEmailTemplate(data: QuoteEmailData): string {
  const validUntilText = data.validUntil 
    ? new Date(data.validUntil).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Belirtilmemiş';
  
  return wrapTemplate(`
    <div class="content">
      <h1>Teklif Gönderildi</h1>
      <p>Sayın ${data.contactPerson || data.dealerName},</p>
      <p>Size özel hazırladığımız teklifi ekte bulabilirsiniz. Teklif detaylarını incelemeniz için PDF dosyası e-postaya eklenmiştir.</p>
      
      <div class="info-box">
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
          <div>
            <p class="info-label">Teklif No</p>
            <p class="info-value">${data.quoteNumber}</p>
          </div>
          <div>
            <p class="info-label">Geçerlilik Tarihi</p>
            <p class="info-value">${validUntilText}</p>
          </div>
          <div>
            <p class="info-label">Toplam Tutar</p>
            <p class="info-value" style="font-size: 18px; color: #22c55e;">${parseFloat(data.grandTotal).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</p>
          </div>
        </div>
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #262626 0%, #1f1f1f 100%); text-align: center;">
        <p style="margin: 0; color: #a1a1aa;">Bu teklifte</p>
        <p style="margin: 10px 0; font-size: 24px; color: #ffffff; font-weight: bold;">${data.itemCount} ürün</p>
        <p style="margin: 0; color: #a1a1aa;">bulunmaktadır</p>
      </div>
      
      <p>Teklif hakkında herhangi bir sorunuz varsa veya değişiklik talep etmek isterseniz, lütfen bizimle iletişime geçmekten çekinmeyin.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://polenstone.com.tr" class="btn">Web Sitemizi Ziyaret Edin</a>
      </div>
      
      <p style="text-align: center; color: #71717a; font-size: 13px;">
        Bizi tercih ettiğiniz için teşekkür ederiz.<br>
        Polen Stone Ekibi
      </p>
    </div>
  `);
}

export async function sendQuoteEmail(
  dealerEmail: string,
  quoteData: QuoteEmailData,
  pdfBuffer: Buffer
): Promise<EmailResult> {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP yapılandırması eksik' };
    }
    
    const settings = await storage.getSiteSettings();
    const fromEmail = settings.smtp_user || 'no-reply@polenstone.com.tr';
    
    await transporter.sendMail({
      from: `"Polen Stone B2B" <${fromEmail}>`,
      to: dealerEmail,
      subject: `Polen Stone Teklif - ${quoteData.quoteNumber}`,
      html: quoteEmailTemplate(quoteData),
      attachments: [
        {
          filename: `Teklif-${quoteData.quoteNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });
    
    console.log(`[Email] Quote sent to ${dealerEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email] Failed to send quote email:', error);
    return { success: false, error: error.message };
  }
}
