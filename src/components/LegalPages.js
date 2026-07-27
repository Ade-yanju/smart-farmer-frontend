import React, { useEffect } from "react";

/* ────────────────────────────────────────────────────────────
   Shared legal-page layout
   NOTE FOR OPERATOR: Replace the bracketed placeholders
   ([Company legal name], [RC number], [address]) with your real
   registered details before going live. Do NOT state that you are
   licensed or regulated unless you actually hold that licence.
──────────────────────────────────────────────────────────── */
const SUPPORT_EMAIL = "support@smartfarmer.ng";
const LAST_UPDATED = "July 2026";

function LegalLayout({ title, subtitle, children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} · SmartFarmer`;
  }, [title]);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", fontFamily: "'DM Sans',system-ui,sans-serif", lineHeight: 1.7 }}>
      <style>{`
        .legal-wrap{max-width:820px;margin:0 auto;padding:0 1.5rem}
        .legal-body h2{font-family:'Syne',sans-serif;font-size:1.25rem;font-weight:800;margin:2.25rem 0 .75rem;color:#fff}
        .legal-body h3{font-size:1rem;font-weight:700;margin:1.5rem 0 .5rem;color:#fff}
        .legal-body p,.legal-body li{color:#B5B5B5;font-size:.95rem;margin-bottom:.85rem}
        .legal-body ul{padding-left:1.25rem;margin-bottom:1rem}
        .legal-body li{margin-bottom:.5rem}
        .legal-body a{color:#10B981;text-decoration:underline}
        .legal-body strong{color:#fff}
        .legal-callout{background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.25);border-radius:12px;padding:1.1rem 1.25rem;margin:1.5rem 0}
        .legal-callout p{color:#F5D08B;margin:0}
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,.07)", padding: "1.1rem 0", position: "sticky", top: 0, background: "rgba(5,5,5,.9)", backdropFilter: "blur(16px)", zIndex: 10 }}>
        <div className="legal-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: ".55rem", color: "#fff", textDecoration: "none" }}>
            <img src="/logo-dark-theme.png" alt="SmartFarmer" style={{ height: 30, width: 30, objectFit: "contain", borderRadius: 6 }} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.02rem" }}>SmartFarmer</span>
          </a>
          <a href="/" style={{ color: "#10B981", textDecoration: "none", fontSize: ".85rem", fontWeight: 600 }}>← Back to home</a>
        </div>
      </header>

      {/* Title */}
      <div className="legal-wrap" style={{ paddingTop: "3rem", paddingBottom: "1rem" }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: ".5rem" }}>{title}</h1>
        {subtitle && <p style={{ color: "#888", fontSize: "1rem", marginBottom: ".5rem" }}>{subtitle}</p>}
        <p style={{ color: "#555", fontSize: ".8rem" }}>Last updated: {LAST_UPDATED}</p>
      </div>

      {/* Body */}
      <div className="legal-wrap legal-body" style={{ paddingBottom: "5rem" }}>
        {children}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.07)", padding: "2rem 0", textAlign: "center" }}>
        <div className="legal-wrap" style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", justifyContent: "center", fontSize: ".8rem", marginBottom: "1rem" }}>
          {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Risk Disclosure", "/risk"], ["About", "/about"], ["Contact", "/contact"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "rgba(255,255,255,.45)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,.25)", fontSize: ".75rem" }}>© {new Date().getFullYear()} SmartFarmer. Lagos, Nigeria.</p>
      </footer>
    </div>
  );
}

/* ──────────────── RISK DISCLOSURE ──────────────── */
export function RiskDisclosure() {
  return (
    <LegalLayout title="Risk Disclosure" subtitle="Please read this carefully before investing.">
      <div className="legal-callout">
        <p><strong style={{ color: "#F59E0B" }}>Important:</strong> Investing through SmartFarmer is high-risk. Returns are not guaranteed and you may lose some or all of the money you invest. Only invest funds you can afford to lose.</p>
      </div>

      <h2>1. Nature of the investment</h2>
      <p>SmartFarmer offers the opportunity to fund agricultural crop cycles. Your money is used to purchase farm inputs (such as seeds, fertiliser, and equipment) for a specific cycle. This is <strong>not</strong> a savings account, a fixed deposit, or a guaranteed-income product.</p>

      <h2>2. No guaranteed returns</h2>
      <p>Any figures, target rates, or projections shown on this platform — including in calculators or examples — are illustrations only. They are not promises, forecasts, or a reliable indicator of future results. Actual returns depend on real harvest and market outcomes and may be lower than shown, zero, or negative.</p>

      <h2>3. Risks you accept</h2>
      <ul>
        <li><strong>Weather and climate:</strong> drought, flooding, and extreme weather can reduce or destroy a harvest.</li>
        <li><strong>Pests and disease:</strong> crop loss can occur despite best efforts.</li>
        <li><strong>Market prices:</strong> the sale price of produce can fall, reducing or eliminating profit.</li>
        <li><strong>Operational risk:</strong> delays, partner default, or logistics problems can affect outcomes.</li>
        <li><strong>Loss of capital:</strong> you may not get back the amount you invested.</li>
        <li><strong>Liquidity:</strong> funds are committed for the full cycle (3–9 months) and cannot be withdrawn early.</li>
      </ul>

      <h2>4. No deposit protection</h2>
      <p>SmartFarmer is not a licensed bank and your funds are not covered by any government deposit-protection or insurance scheme. Unless a specific insurance policy is expressly named and evidenced for a given cycle, you should assume there is no insurance covering your capital.</p>

      <h2>5. Not financial advice</h2>
      <p>Nothing on this platform constitutes financial, investment, tax, or legal advice. You are responsible for your own decisions. We strongly recommend obtaining independent professional advice before investing.</p>

      <h2>6. Questions</h2>
      <p>If anything here is unclear, contact us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> before you invest.</p>
    </LegalLayout>
  );
}

/* ──────────────── PRIVACY POLICY ──────────────── */
export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" subtitle="How we collect, use, and protect your information.">
      <p>This Privacy Policy explains how SmartFarmer ("we", "us") handles personal information you provide when you use our website and services. By using SmartFarmer you agree to this policy.</p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><strong>Account information:</strong> name, email address, phone number, and login credentials.</li>
        <li><strong>Identity/KYC information:</strong> government-issued identification and related details you submit to verify your identity.</li>
        <li><strong>Financial information:</strong> bank account details you provide for deposits and payouts, and a record of your transactions on the platform.</li>
        <li><strong>Technical information:</strong> device, browser, and usage data collected automatically when you visit the site.</li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To create and operate your account and process transactions.</li>
        <li>To verify your identity and meet legal and anti-fraud obligations.</li>
        <li>To communicate with you about your account and provide support.</li>
        <li>To improve and secure our services.</li>
      </ul>

      <h2>3. Sharing your information</h2>
      <p>We do not sell your personal information. We share it only with service providers who help us operate the platform (for example, payment and identity-verification providers), and where required by law or to prevent fraud.</p>

      <h2>4. Data storage and security</h2>
      <p>We use reasonable technical and organisational measures to protect your information. Some services we rely on (such as authentication and database hosting) are operated by third parties on our behalf. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>

      <h2>5. Your rights</h2>
      <p>You may request access to, correction of, or deletion of your personal information by contacting us. You can also delete your account from within the app, subject to any records we are legally required to retain.</p>

      <h2>6. Cookies and analytics</h2>
      <p>We may use cookies and similar technologies to keep you signed in and to understand how the site is used. You can control cookies through your browser settings.</p>

      <h2>7. Changes and contact</h2>
      <p>We may update this policy from time to time. For any privacy questions or requests, contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
    </LegalLayout>
  );
}

/* ──────────────── TERMS OF SERVICE ──────────────── */
export function Terms() {
  return (
    <LegalLayout title="Terms of Service" subtitle="The agreement between you and SmartFarmer.">
      <p>These Terms govern your use of SmartFarmer. By creating an account or investing, you agree to them. If you do not agree, please do not use the service.</p>

      <h2>1. Eligibility</h2>
      <p>You must be at least 18 years old and legally able to enter into a contract. You agree to provide accurate information and to complete identity verification (KYC) where required.</p>

      <h2>2. The service</h2>
      <p>SmartFarmer provides a platform to fund agricultural crop cycles. When you invest, your funds are allocated to a chosen cycle. Returns, if any, depend entirely on the outcome of that cycle and are <strong>not guaranteed</strong>. Please read our <a href="/risk">Risk Disclosure</a>, which forms part of these Terms.</p>

      <h2>3. Deposits, cycles, and withdrawals</h2>
      <ul>
        <li>The minimum investment is ₦100,000.</li>
        <li>Funds committed to a cycle are locked for the duration of that cycle (typically 3–9 months) and cannot be withdrawn early.</li>
        <li>Any payout is made to the bank account you provide, after the cycle concludes, based on the actual outcome.</li>
      </ul>

      <h2>4. No guarantees</h2>
      <p>We do not guarantee any profit, return, or the preservation of your capital. You may lose money. Figures shown in calculators or examples are illustrative only.</p>

      <h2>5. Referral / affiliate programme</h2>
      <p>Where offered, referral commissions are paid only on genuine, completed investments by users you refer, subject to programme rules. We may change or end the programme at any time. Misuse (including self-referral or misleading promotion) may result in forfeiture of commissions and account closure.</p>

      <h2>6. Prohibited conduct</h2>
      <p>You agree not to use the platform for unlawful purposes, to provide false information, or to misrepresent SmartFarmer to others.</p>

      <h2>7. Limitation of liability</h2>
      <p>To the maximum extent permitted by law, SmartFarmer is not liable for investment losses arising from the ordinary risks of agricultural investing described in our Risk Disclosure, or for events beyond our reasonable control.</p>

      <h2>8. Changes and governing law</h2>
      <p>We may update these Terms; continued use means you accept the changes. These Terms are governed by the laws of the Federal Republic of Nigeria. Questions: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
    </LegalLayout>
  );
}

/* ──────────────── ABOUT ──────────────── */
export function About() {
  return (
    <LegalLayout title="About SmartFarmer" subtitle="Connecting capital with real Nigerian agriculture.">
      <p>SmartFarmer is a Nigerian platform that lets individuals fund real agricultural crop cycles — such as maize, cassava, soybean, and rice — and share in the outcome when a cycle is successful.</p>

      <h2>What we do</h2>
      <p>When you invest, your capital is used to purchase farm inputs for a specific cycle run in partnership with vetted farming cooperatives. If the cycle is profitable, the proceeds are shared with investors after harvest and sale. Because this involves real farming, outcomes vary and are never guaranteed.</p>

      <h2>What we are — and aren't</h2>
      <ul>
        <li>We are an agricultural investment platform.</li>
        <li>We are <strong>not</strong> a bank, and we do not offer guaranteed or government-insured returns.</li>
        <li>We are <strong>not</strong> a cryptocurrency platform.</li>
      </ul>
      <p>We believe the honest way to build trust is to be clear about the risks. Please read our <a href="/risk">Risk Disclosure</a> before investing.</p>

      <h2>Get in touch</h2>
      <p>Questions or partnership enquiries? Visit our <a href="/contact">Contact page</a> or email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
    </LegalLayout>
  );
}

/* ──────────────── CONTACT ──────────────── */
export function Contact() {
  return (
    <LegalLayout title="Contact Us" subtitle="We're here to help.">
      <p>Have a question about your account, an investment cycle, or the platform? Reach us through any of the channels below.</p>

      <h2>Support</h2>
      <ul>
        <li><strong>Email:</strong> <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
        <li><strong>Telegram:</strong> <a href="https://t.me/smartfarmerng" target="_blank" rel="noopener noreferrer">@smartfarmerng</a></li>
        <li><strong>Instagram:</strong> <a href="https://www.instagram.com/smartfarmer_ng" target="_blank" rel="noopener noreferrer">@smartfarmer_ng</a></li>
        <li><strong>X / Twitter:</strong> <a href="https://x.com/smartfarmer_ng" target="_blank" rel="noopener noreferrer">@smartfarmer_ng</a></li>
      </ul>

      <h2>Partnerships</h2>
      <p>For affiliate or partnership enquiries, email <a href="mailto:partners@smartfarmer.ng">partners@smartfarmer.ng</a>.</p>

      <h2>Location</h2>
      <p>SmartFarmer is based in Lagos, Nigeria. We aim to respond to all enquiries within 24 hours on business days.</p>

      <div className="legal-callout">
        <p><strong style={{ color: "#F59E0B" }}>Before investing:</strong> please read our <a href="/risk" style={{ color: "#F59E0B" }}>Risk Disclosure</a> and <a href="/terms" style={{ color: "#F59E0B" }}>Terms of Service</a>.</p>
      </div>
    </LegalLayout>
  );
}
