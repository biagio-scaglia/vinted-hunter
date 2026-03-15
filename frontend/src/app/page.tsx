"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  App,
  Layout,
  Input,
  Button,
  Avatar,
  Typography,
  Spin,
  Drawer,
  ConfigProvider,
  theme,
  Tooltip,
  Tag,
  Empty,
} from 'antd';
import Link from 'next/link';
import {
  SearchOutlined,
  MenuOutlined,
  ThunderboltOutlined,
  ShoppingOutlined,
  NotificationOutlined,
  CameraOutlined,
  LoadingOutlined,
  RadarChartOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import ProductCard from './components/ProductCard';
import Sidebar from './components/Sidebar';
import * as api from '@/lib/api';
import type { Product, Alert, Filters, SearchResult } from '@/lib/types';

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

// ─── Colour palette ───────────────────────────────────────────────────────────
const C = {
  bg: '#020212',
  surface: '#0a0a1f',
  surfaceAlt: '#0f0f2d',
  border: 'rgba(139,92,246,0.12)',
  primary: '#8b5cf6',
  primaryDark: '#7c3aed',
  text: '#e2e8f0',
  muted: 'rgba(255,255,255,0.35)',
} as const;

// ─── OCR image preview banner ─────────────────────────────────────────────────
function OcrBanner({ imageUrl, query }: { imageUrl: string; query: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'rgba(139,92,246,0.07)', border: `1px solid ${C.border}`, borderRadius: '16px', marginBottom: '24px' }}>
      <img src={imageUrl} alt="OCR" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
      <div>
        <Text style={{ color: C.primary, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Testo estratto via OCR</Text>
        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, color: C.text, fontSize: '13px', marginTop: '4px' }}>{query}</Paragraph>
      </div>
    </div>
  );
}

// ─── Stats strip ──────────────────────────────────────────────────────────────
function StatsBar({ results, query, onSaveAlert }: { results: Product[]; query: string; onSaveAlert: () => void }) {
  const min = results[0]?.price ?? '—';
  const max = results[results.length - 1]?.price ?? '—';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '14px 20px', background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: '32px', flex: 1 }}>
        <Stat label="Risultati" value={String(results.length)} />
        <Stat label="Prezzo min" value={min} />
        <Stat label="Prezzo max" value={max} />
      </div>
      <Tooltip title="Attiva monitoraggio automatico per questa ricerca">
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={onSaveAlert}
          style={{ background: 'rgba(139,92,246,0.12)', border: `1px solid rgba(139,92,246,0.3)`, color: C.primary, borderRadius: '8px', fontWeight: 700, fontSize: '11px' }}
        >
          MONITORA
        </Button>
      </Tooltip>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: C.muted, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
      <div style={{ color: '#fff', fontWeight: 900, fontSize: '18px', lineHeight: 1.2 }}>{value}</div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', gap: '16px' }}>
      <RadarChartOutlined style={{ fontSize: '64px', color: 'rgba(139,92,246,0.25)' }} />
      <Text style={{ color: C.muted, fontSize: '15px' }}>Inserisci un termine di ricerca o carica un&apos;immagine</Text>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
        {['Nintendo DS', 'Lego Technic', 'Air Jordan', 'PS5'].map(q => (
          <Tag key={q} style={{ background: 'rgba(139,92,246,0.08)', border: `1px solid ${C.border}`, color: C.primary, cursor: 'pointer', borderRadius: '20px', padding: '2px 12px' }}>
            {q}
          </Tag>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard (main state holder) ───────────────────────────────────────────
function Dashboard() {
  const { notification } = App.useApp();

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [query, setQuery] = useState('');
  const [honey, setHoney] = useState('');
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filters, setFilters] = useState<Filters>({ min_price: '', max_price: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAlerts = useCallback(async () => {
    try { setAlerts(await api.getAlerts()); } catch (_) {}
  }, []);

  useEffect(() => {
    fetchAlerts();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, [fetchAlerts]);

  const handleSearch = useCallback(async (text: string = query, ocrImage?: string) => {
    if (!text.trim() || loading || honey) return;
    setQuery(text);
    setLoading(true);
    try {
      const parsed = filters.min_price || filters.max_price
        ? { min_price: filters.min_price ? parseFloat(filters.min_price) : undefined, max_price: filters.max_price ? parseFloat(filters.max_price) : undefined }
        : {};
      const data = await api.search(text, parsed);
      setSearchResult({ query: text, ocrImage, results: data.results ?? [] });
    } catch {
      notification.error({ title: 'Errore', description: 'Impossibile completare la ricerca.' });
    } finally {
      setLoading(false);
    }
  }, [query, filters, honey, loading, notification]);

  const handleOcrUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = '';

    setOcrLoading(true);
    const imageDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.readAsDataURL(file);
    });

    try {
      const text = await api.ocr(file);
      if (text) {
        setQuery(text);
        notification.success({
          title: 'OCR completato',
          description: `"${text.slice(0, 70)}${text.length > 70 ? '...' : ''}"`,
        });
        await handleSearch(text, imageDataUrl);
      } else {
        notification.warning({ title: "Nessun testo trovato nell'immagine" });
      }
    } catch {
      notification.error({ title: 'Errore OCR', description: "Impossibile elaborare l'immagine." });
    } finally {
      setOcrLoading(false);
    }
  }, [handleSearch, notification]);

  const handleSaveAlert = useCallback(async () => {
    if (!searchResult?.query) return;
    try {
      await api.saveAlert(searchResult.query);
      await fetchAlerts();
      notification.success({ title: 'Radar attivato', description: `Monitoraggio attivo per "${searchResult.query}"` });
    } catch {
      notification.error({ title: 'Errore', description: 'Impossibile salvare il monitoraggio.' });
    }
  }, [searchResult, fetchAlerts, notification]);

  const handleAlertClick = useCallback((alertQuery: string) => {
    setDrawerOpen(false);
    handleSearch(alertQuery);
  }, [handleSearch]);

  const handleAlertDelete = useCallback(async (id: number) => {
    try {
      await api.deleteAlert(id);
      await fetchAlerts();
    } catch (_) {}
  }, [fetchAlerts]);

  const requestNotifications = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(p => {
        if (p === 'granted') {
          setNotificationsEnabled(true);
          notification.success({ title: 'Notifiche attivate' });
        }
      });
    }
  };

  const sidebarContent = (
    <Sidebar
      alerts={alerts}
      filters={filters}
      onFilterChange={setFilters}
      onAlertClick={handleAlertClick}
      onAlertDelete={handleAlertDelete}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <Sider
        width={260}
        style={{ background: C.surface, borderRight: `1px solid ${C.border}`, overflow: 'hidden', position: 'sticky', top: 0, height: '100vh' }}
        breakpoint="lg"
        collapsedWidth={0}
        trigger={null}
      >
        <div style={{ padding: '20px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ThunderboltOutlined style={{ color: C.primary, fontSize: '18px' }} />
            <Title level={5} style={{ margin: 0, color: '#fff', fontSize: '13px', letterSpacing: '2px', fontWeight: 900 }}>VINTED HUNTER</Title>
          </div>
        </div>
        {sidebarContent}
      </Sider>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
        width={280}
        styles={{ body: { padding: 0, background: C.surface }, header: { background: C.surface, borderBottom: `1px solid ${C.border}` } }}
        title={<Text style={{ color: '#fff', fontSize: '12px', letterSpacing: '2px' }}><ThunderboltOutlined style={{ color: C.primary }} /> HUNTER RADAR</Text>}
      >
        {sidebarContent}
      </Drawer>

      <Layout>
        {/* Sticky header */}
        <Header style={{
          background: 'rgba(10,10,31,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${C.border}`,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: '64px',
        }}>
          {/* Burger (mobile) */}
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: C.primary }} />}
            onClick={() => setDrawerOpen(true)}
            style={{ display: 'none' }}
            className="mobile-burger"
          />

          {/* Search bar — centre */}
          <div style={{ flex: 1, display: 'flex', gap: '0' }}>
            {/* hidden honeypot */}
            <div style={{ display: 'none' }}>
              <input type="text" value={honey} onChange={e => setHoney(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleOcrUpload} />

            <Input
              size="large"
              placeholder="Cerca su Vinted..."
              prefix={<SearchOutlined style={{ color: C.primary }} />}
              suffix={
                <Tooltip title={ocrLoading ? 'OCR in corso...' : 'Carica immagine (OCR)'}>
                  <Button
                    type="text"
                    size="small"
                    icon={ocrLoading ? <LoadingOutlined style={{ color: C.primary }} /> : <CameraOutlined style={{ color: C.primary }} />}
                    disabled={ocrLoading}
                    onClick={() => fileInputRef.current?.click()}
                  />
                </Tooltip>
              }
              value={query}
              onChange={e => setQuery(e.target.value)}
              onPressEnter={() => handleSearch()}
              style={{ borderRadius: '12px 0 0 12px', height: '44px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: '#fff' }}
            />
            <Button
              type="primary"
              size="large"
              loading={loading}
              icon={!loading && <SearchOutlined />}
              onClick={() => handleSearch()}
              style={{ height: '44px', borderRadius: '0 12px 12px 0', background: C.primaryDark, fontWeight: 900, paddingInline: '20px' }}
            >
              CERCA
            </Button>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {!notificationsEnabled && (
              <Tooltip title="Attiva notifiche push">
                <Button type="text" icon={<NotificationOutlined style={{ color: C.primary }} />} onClick={requestNotifications} />
              </Tooltip>
            )}
            <Avatar style={{ background: C.primaryDark, boxShadow: `0 0 16px rgba(139,92,246,0.4)`, cursor: 'default' }} icon={<ShoppingOutlined />} />
          </div>
        </Header>

        {/* Main content */}
        <Content className="custom-scrollbar" style={{ padding: '28px 32px', overflowY: 'auto', minHeight: 0 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* OCR preview */}
            {searchResult?.ocrImage && (
              <OcrBanner imageUrl={searchResult.ocrImage} query={searchResult.query} />
            )}

            {/* Stats bar */}
            {searchResult && searchResult.results.length > 0 && (
              <StatsBar results={searchResult.results} query={searchResult.query} onSaveAlert={handleSaveAlert} />
            )}

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '80px 0' }}>
                <Spin size="large" />
                <Text style={{ color: C.muted }}>Scansione in corso...</Text>
              </div>
            )}

            {/* No results */}
            {!loading && searchResult && searchResult.results.length === 0 && (
              <Empty
                description={<Text style={{ color: C.muted }}>Nessun risultato per &ldquo;{searchResult.query}&rdquo;</Text>}
                style={{ padding: '80px 0' }}
              />
            )}

            {/* Empty initial state */}
            {!loading && !searchResult && <EmptyState />}

            {/* Results grid */}
            {!loading && searchResult && searchResult.results.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {searchResult.results.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>

          <footer style={{ textAlign: 'center', padding: '40px 0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px' }}>
              <Link href="/privacy"><Text style={{ color: C.muted, fontSize: '10px', letterSpacing: '1px' }}>PRIVACY POLICY</Text></Link>
              <Link href="/terms"><Text style={{ color: C.muted, fontSize: '10px', letterSpacing: '1px' }}>TERMS OF SERVICE</Text></Link>
            </div>
            <div className="made-by">MADE WITH ❤️ BY BIAGIO</div>
          </footer>
        </Content>
      </Layout>
    </Layout>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────
function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e1b4b 0%, #020212 100%)' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '0 24px' }}>
        <ThunderboltOutlined style={{ fontSize: '80px', color: C.primary, filter: 'drop-shadow(0 0 24px rgba(139,92,246,0.5))', marginBottom: '32px', display: 'block' }} />
        <Title style={{ color: '#fff', letterSpacing: '8px', fontSize: '40px', fontWeight: 900, margin: 0 }}>VINTED HUNTER</Title>
        <Title level={4} style={{ color: '#a78bfa', fontWeight: 300, letterSpacing: '2px', margin: '12px 0 40px' }}>PRO RESEARCH CENTER</Title>
        <Paragraph style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8', marginBottom: '48px' }}>
          Ricerca intelligente su Vinted con monitoraggio in tempo reale.
          Carica un&apos;immagine e lascia che l&apos;OCR faccia il lavoro per te.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          block
          style={{ height: '64px', borderRadius: '32px', fontWeight: 900, fontSize: '16px', letterSpacing: '2px', boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}
          onClick={onEnter}
        >
          ENTRA NEL RADAR
        </Button>
        <Text style={{ display: 'block', marginTop: '48px', fontSize: '11px', color: 'rgba(167,139,250,0.4)', letterSpacing: '3px' }}>MADE BY BIAGIO</Text>
      </div>
    </Layout>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const C_PRIMARY = '#8b5cf6';

export default function Home() {
  const [ready, setReady] = useState(false);
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: C_PRIMARY, borderRadius: 12, colorLink: C_PRIMARY, colorBgBase: '#020212', colorBgContainer: '#0a0a1f' },
      }}
    >
      <App>
        {ready ? <Dashboard /> : <Landing onEnter={() => setReady(true)} />}
      </App>
    </ConfigProvider>
  );
}
