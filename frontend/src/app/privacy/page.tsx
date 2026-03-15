"use client";
import React from 'react';
import { Layout, Typography, ConfigProvider, theme, Button } from 'antd';
import { ArrowLeftOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const LAST_UPDATED = '15 Marzo 2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`} style={{ marginBottom: '40px' }}>
      <Title
        id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
        level={3}
        style={{ color: '#fff', borderBottom: '1px solid rgba(139,92,246,0.15)', paddingBottom: '12px' }}
      >
        {title}
      </Title>
      {children}
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#8b5cf6',
          borderRadius: 20,
          colorBgBase: '#020212',
          colorBgContainer: '#0a0a1f',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: 'radial-gradient(circle at top center, #1e1b4b 0%, #020617 100%)' }}>
        <Header
          style={{ background: 'rgba(10, 10, 31, 0.7)', padding: '0 24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(139, 92, 246, 0.1)', backdropFilter: 'blur(15px)' }}
          role="banner"
        >
          <Link href="/" aria-label="Torna alla home">
            <Button
              type="text"
              icon={<ArrowLeftOutlined style={{ color: '#8b5cf6' }} aria-hidden="true" />}
              aria-label="Torna indietro"
            />
          </Link>
          <Title level={5} style={{ margin: '0 0 0 16px', color: '#fff', letterSpacing: '2px', fontWeight: 900, fontSize: '12px' }}>
            PRIVACY POLICY
          </Title>
        </Header>

        <Content
          role="main"
          style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <LockOutlined style={{ fontSize: '48px', color: '#8b5cf6', marginBottom: '24px' }} aria-hidden="true" />
            <Title style={{ color: '#fff' }}>La tua Privacy è al centro.</Title>
            <Text style={{ color: '#a78bfa', fontSize: '16px' }}>
              Vinted Hunter Pro — Informativa sul Trattamento dei Dati Personali
            </Text>
            <br />
            <Text style={{ color: 'rgba(167,139,250,0.5)', fontSize: '13px' }}>
              Ultimo aggiornamento: {LAST_UPDATED}
            </Text>
          </div>

          <Section title="1. Titolare del Trattamento">
            <Paragraph style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8' }}>
              Vinted Hunter Pro è un&apos;applicazione sviluppata a uso personale e di ricerca da <strong style={{ color: '#e2e8f0' }}>Biagio</strong>.
              Non è un servizio commerciale e non raccoglie dati da terzi soggetti inconsapevoli.
            </Paragraph>
          </Section>

          <Section title="2. Dati Raccolti e Finalità">
            <Paragraph style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8' }}>
              L&apos;applicazione raccoglie e tratta esclusivamente i seguenti dati:
            </Paragraph>
            <ul style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '2', paddingLeft: '24px' }}>
              <li><strong style={{ color: '#e2e8f0' }}>Keyword di ricerca</strong> — salvate localmente nel database SQLite quando si attiva un Radar, al solo scopo di eseguire il monitoraggio periodico.</li>
              <li><strong style={{ color: '#e2e8f0' }}>Immagini caricate (OCR)</strong> — elaborate interamente in locale tramite EasyOCR. Non vengono inviate a servizi cloud esterni e vengono scartate immediatamente dopo l&apos;elaborazione.</li>
              <li><strong style={{ color: '#e2e8f0' }}>Risultati di ricerca</strong> — dati pubblici aggregati dai marketplace (Vinted, Subito.it). Non vengono associati a profili utente.</li>
            </ul>
          </Section>

          <Section title="3. Elaborazione Locale dei Dati (Privacy by Design)">
            <Paragraph style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8' }}>
              Il motore OCR basato su <strong style={{ color: '#e2e8f0' }}>EasyOCR / PyTorch</strong> gira interamente sul server locale del progetto.
              Nessuna immagine, testo estratto o query di ricerca viene trasmessa a API di terze parti per l&apos;elaborazione.
              Questo approccio è conforme al principio di <em>privacy by design</em> (art. 25 GDPR).
            </Paragraph>
          </Section>

          <Section title="4. Base Giuridica del Trattamento">
            <Paragraph style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8' }}>
              Il trattamento dei dati avviene sulla base del <strong style={{ color: '#e2e8f0' }}>legittimo interesse</strong> dell&apos;utente
              (art. 6, par. 1, lett. f GDPR) nell&apos;utilizzo dello strumento per finalità di ricerca e monitoraggio personale.
              Non vengono trattati dati sensibili o dati di soggetti terzi.
            </Paragraph>
          </Section>

          <Section title="5. Conservazione dei Dati">
            <Paragraph style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8' }}>
              I dati dei Radar (keyword e risultati trovati) vengono conservati nel database locale fino all&apos;eliminazione esplicita
              da parte dell&apos;utente tramite l&apos;interfaccia dell&apos;applicazione. Non è prevista una conservazione automatica a lungo termine.
            </Paragraph>
          </Section>

          <Section title="6. Condivisione con Terze Parti">
            <Paragraph style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8' }}>
              <strong style={{ color: '#e2e8f0' }}>Nessun dato personale viene condiviso, venduto o trasmesso a terze parti.</strong>{' '}
              Le ricerche vengono effettuate interrogando le API pubbliche dei marketplace, che operano secondo le proprie privacy policy indipendenti.
            </Paragraph>
          </Section>

          <Section title="7. Sicurezza">
            <Paragraph style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8' }}>
              L&apos;applicazione implementa le seguenti misure di sicurezza tecniche:
            </Paragraph>
            <ul style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '2', paddingLeft: '24px' }}>
              <li><strong style={{ color: '#e2e8f0' }}>Rate limiting</strong> — max 20 richieste/minuto per IP per prevenire abusi.</li>
              <li><strong style={{ color: '#e2e8f0' }}>Security Headers</strong> — HSTS, X-Content-Type-Options, X-Frame-Options, CSP.</li>
              <li><strong style={{ color: '#e2e8f0' }}>Sanitizzazione input</strong> — filtraggio di payload malevoli (XSS, SQL injection).</li>
              <li><strong style={{ color: '#e2e8f0' }}>Integrity check</strong> — header personalizzato per autenticare le richieste dal frontend.</li>
            </ul>
          </Section>

          <Section title="8. Diritti dell'Utente (GDPR)">
            <Paragraph style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8' }}>
              In quanto utente, hai il diritto di:
            </Paragraph>
            <ul style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '2', paddingLeft: '24px' }}>
              <li><strong style={{ color: '#e2e8f0' }}>Accesso</strong> — visualizzare tutti i Radar salvati direttamente nell&apos;interfaccia.</li>
              <li><strong style={{ color: '#e2e8f0' }}>Cancellazione</strong> — eliminare singoli Radar o l&apos;intero database locale.</li>
              <li><strong style={{ color: '#e2e8f0' }}>Portabilità</strong> — i dati sono in un file SQLite standard, accessibile e portabile.</li>
            </ul>
          </Section>

          <Section title="9. Cookie e Tracciamento">
            <Paragraph style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8' }}>
              L&apos;applicazione <strong style={{ color: '#e2e8f0' }}>non utilizza cookie di profilazione né sistemi di tracciamento</strong> (Google Analytics, Meta Pixel, ecc.).
              Nessun dato comportamentale viene raccolto o inviato a piattaforme pubblicitarie.
            </Paragraph>
          </Section>

          <div
            style={{ marginTop: '60px', padding: '30px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.1)' }}
            role="contentinfo"
          >
            <Text italic style={{ color: '#a78bfa' }}>
              Questa informativa è stata redatta in conformità al Regolamento UE 2016/679 (GDPR).
              Ultimo aggiornamento: {LAST_UPDATED}. Sviluppato da Biagio.
            </Text>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', padding: '40px', background: 'transparent' }} role="contentinfo">
          <div style={{ fontSize: '11px', color: '#a78bfa', letterSpacing: '3px', fontWeight: 900 }}>MADE BY BIAGIO</div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
