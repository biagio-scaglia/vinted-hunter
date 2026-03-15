"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  Layout,
  Input,
  Button,
  Card,
  Avatar,
  Typography,
  Space,
  Badge,
  Drawer,
  Empty,
  Spin,
  ConfigProvider,
  theme,
  notification as antdNotification,
  Tooltip,
} from 'antd';
import Link from 'next/link';
import {
  SendOutlined,
  SearchOutlined,
  HistoryOutlined,
  DeleteOutlined,
  MenuOutlined,
  ThunderboltOutlined,
  ShoppingOutlined,
  NotificationOutlined,
  CameraOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Product {
  id: string;
  title: string;
  price: string;
  link: string;
  image?: string;
  condition?: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  results?: Product[];
}

interface Alert {
  id: number;
  query: string;
  keyword: string;
}

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'ai', text: 'Radar Pro attivo. Pronto per una nuova scansione.' }
  ]);
  const [showChat, setShowChat] = useState(false);
  const [filters, setFilters] = useState({ min_price: '', max_price: '' });
  const [input, setInput] = useState('');
  const [honey, setHoney] = useState('');
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAlerts();
    if (typeof window !== 'undefined' && "Notification" in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const requestNotifications = () => {
    if (typeof window !== 'undefined' && "Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          antdNotification.success({
            message: 'Radar Notifiche Attivato',
            description: 'Riceverai un allerta non appena il radar intercetta un affare!'
          });
        }
      });
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE}/alerts`);
      if (!response.ok) return;
      const data = await response.json();
      setAlerts(data);
    } catch (_) {}
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading || honey) return;

    const userMessage: Message = { id: Date.now().toString(), type: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    if (text === input) setInput('');
    setLoading(true);

    const body: Record<string, unknown> = { query: text };
    if (filters.min_price) body.min_price = parseFloat(filters.min_price);
    if (filters.max_price) body.max_price = parseFloat(filters.max_price);

    try {
      const response = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Radar-Integrity': 'secure-radar-v2'
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: data.results?.length > 0
          ? `Ho trovato ${data.results.length} articoli per te.`
          : 'Purtroppo non ho trovato nulla per questa ricerca.',
        results: data.results
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        text: "Spiacente, c'è stato un errore nel caricamento dei dati."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleOcrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/ocr`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.text) {
        setInput(data.text);
        antdNotification.success({
          message: 'OCR completato',
          description: `Testo estratto: "${data.text.slice(0, 60)}${data.text.length > 60 ? '...' : ''}"`,
        });
      } else {
        antdNotification.warning({ message: 'Nessun testo trovato nell\'immagine' });
      }
    } catch {
      antdNotification.error({ message: 'Errore OCR', description: 'Impossibile elaborare l\'immagine.' });
    } finally {
      setOcrLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveAlert = async (query: string) => {
    try {
      await fetch(`${API_BASE}/save-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Radar-Integrity': 'secure-radar-v2'
        },
        body: JSON.stringify({ query }),
      });
      fetchAlerts();
    } catch (error) { console.error(error); }
  };

  const deleteAlert = async (id: number) => {
    try {
      await fetch(`${API_BASE}/alerts/${id}`, { method: 'DELETE' });
      fetchAlerts();
    } catch (error) { console.error(error); }
  };

  const SidebarContent = () => (
    <div style={{ padding: '24px', background: '#0a0a1f', minHeight: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <Badge color="#8b5cf6" /> Filtri Avanzati
          </Title>
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
            <Input
              placeholder="Min €"
              variant="filled"
              type="number"
              min={0}
              style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}
              value={filters.min_price}
              onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
            />
            <Input
              placeholder="Max €"
              variant="filled"
              type="number"
              min={0}
              style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}
              value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <Badge color="#8b5cf6" /> Radar Attivi
          </Title>
          <div style={{ marginTop: '24px' }}>
            {alerts.length === 0 ? (
              <Empty
                description={<Text style={{ color: 'rgba(255,255,255,0.4)' }}>Nessun monitoraggio attivo</Text>}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              alerts.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'rgba(139, 92, 246, 0.05)',
                    borderRadius: '16px',
                    marginBottom: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  className="radar-item-hover"
                  onClick={() => { handleSend(item.query); setSidebarOpen(false); }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{item.keyword}</div>
                    <div style={{ color: '#8b5cf6', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '4px' }}>{item.query}</div>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined style={{ color: '#ef4444' }} />}
                    onClick={(e) => { e.stopPropagation(); deleteAlert(item.id); }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <Button
          block
          size="large"
          icon={<HistoryOutlined style={{ color: '#fff' }} />}
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#fff',
            borderRadius: '16px',
            height: '50px',
            fontWeight: 700
          }}
          onClick={() => setMessages([{ id: 'reset', type: 'ai', text: 'Ciao! Pronto per una nuova ricerca.' }])}
        >
          PULISCI CHAT
        </Button>
      </div>
    </div>
  );

  if (!showChat) {
    return (
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#8b5cf6' } }}>
        <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e1b4b 0%, #020212 100%)' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', padding: '0 24px' }}>
            <div style={{ marginBottom: '40px' }}>
              <ThunderboltOutlined style={{ fontSize: '80px', color: '#8b5cf6', filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))' }} />
            </div>
            <Title style={{ color: '#fff', letterSpacing: '8px', fontSize: '42px', fontWeight: 900 }}>VINTED HUNTER</Title>
            <Title level={4} style={{ color: '#a78bfa', fontWeight: 300, letterSpacing: '2px', marginBottom: '40px' }}>PRO RESEARCH CENTER</Title>
            <Paragraph style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.8', marginBottom: '48px' }}>
              Benvenuto nel sistema di ricerca e monitoraggio industriale.
              Analizza il mercato in tempo reale con precisione millimetrica.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              block
              style={{ height: '70px', borderRadius: '35px', fontWeight: 900, fontSize: '18px', letterSpacing: '2px', boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)' }}
              onClick={() => setShowChat(true)}
            >
              ENTRA NEL RADAR
            </Button>
            <div style={{ marginTop: '60px' }}>
              <Text style={{ fontSize: '11px', color: 'rgba(167, 139, 250, 0.4)', letterSpacing: '3px' }}>MADE BY BIAGIO</Text>
            </div>
          </div>
        </Layout>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#8b5cf6',
          borderRadius: 20,
          colorLink: '#8b5cf6',
          colorBgBase: '#020212',
          colorBgContainer: '#0a0a1f',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        <Drawer
          title={<Text strong style={{ color: '#fff', letterSpacing: '2px', fontSize: '12px' }}><ThunderboltOutlined style={{ color: '#8b5cf6' }} /> HUNTER RADAR</Text>}
          placement="left"
          onClose={() => setSidebarOpen(false)}
          open={sidebarOpen}
          size="default"
          styles={{
            body: { padding: 0, background: '#0a0a1f' },
            header: { background: '#0a0a1f', borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }
          }}
          closeIcon={<MenuOutlined style={{ color: '#fff' }} />}
        >
          <SidebarContent />
        </Drawer>

        <Layout>
          <Header style={{ background: 'rgba(10, 10, 31, 0.7)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(139, 92, 246, 0.1)', backdropFilter: 'blur(15px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: '20px', color: '#8b5cf6' }} />}
                onClick={() => setSidebarOpen(true)}
              />
              <Title level={5} style={{ margin: 0, color: '#fff', letterSpacing: '2px', fontWeight: 900, fontSize: '12px' }}>RESEARCH CENTER</Title>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!notificationsEnabled && (
                <Button
                  type="text"
                  icon={<NotificationOutlined style={{ color: '#8b5cf6' }} />}
                  onClick={requestNotifications}
                />
              )}
              <Avatar style={{ backgroundColor: '#8b5cf6', boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }} icon={<ShoppingOutlined style={{ color: '#fff' }} />} />
            </div>
          </Header>

          <Content style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div
              ref={scrollRef}
              className="custom-scrollbar"
              style={{ flex: 1, overflowY: 'auto', paddingBottom: '24px' }}
            >
              <div className="chat-container">
                {messages.map((m) => (
                  <div key={m.id} style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: m.type === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '85%',
                      padding: '24px 30px',
                      borderRadius: '28px',
                      backgroundColor: m.type === 'user' ? '#7c3aed' : '#1e1b4b',
                      color: m.type === 'user' ? '#fff' : '#e2e8f0',
                      boxShadow: m.type === 'user' ? '0 10px 40px rgba(124, 58, 237, 0.3)' : '0 10px 30px rgba(0,0,0,0.3)',
                      border: m.type === 'user' ? 'none' : '1px solid rgba(139, 92, 246, 0.1)',
                      fontWeight: 500
                    }}>
                      <Paragraph style={{ margin: 0, color: 'inherit', fontSize: '15.5px', lineHeight: '1.7' }}>{m.text}</Paragraph>

                      {m.results && m.results.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                          <Card style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                              <Text style={{ color: '#a78bfa', fontWeight: 900, letterSpacing: '2px', fontSize: '11px' }}><ThunderboltOutlined /> MARKET ANALYTICS</Text>
                            </div>
                            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                              <div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase' }}>Prezzo Min</div>
                                <div style={{ color: '#fff', fontSize: '24px', fontWeight: 900 }}>{m.results[0].price}</div>
                              </div>
                              <div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase' }}>Tot. Risultati</div>
                                <div style={{ color: '#fff', fontSize: '24px', fontWeight: 900 }}>{m.results.length}</div>
                              </div>
                              <div style={{ flex: 1, minWidth: '200px' }}>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px' }}>Distribuzione Prezzo</div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', position: 'relative' }}>
                                  <div style={{ position: 'absolute', left: '0', width: '30%', height: '100%', background: '#7c3aed', borderRadius: '4px', boxShadow: '0 0 10px #7c3aed' }} />
                                </div>
                              </div>
                            </div>
                          </Card>

                          <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                            {m.results.map((p) => (
                              <Card
                                key={p.id}
                                hoverable
                                className="product-card-hover"
                                styles={{ body: { padding: '16px' } }}
                                cover={
                                  p.image
                                    ? <img alt={p.title} src={p.image} style={{ height: '180px', objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
                                    : <div style={{ height: '180px', background: '#312e81', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Img</div>
                                }
                                onClick={() => window.open(p.link, '_blank')}
                                style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.1)', background: '#1e1b4b' }}
                              >
                                <Card.Meta
                                  title={<Text style={{ fontSize: '14px', color: '#f8fafc' }} strong ellipsis>{p.title}</Text>}
                                  description={
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: '#8b5cf6', fontWeight: 900, fontSize: '16px', textShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}>{p.price}</Text>
                                        {p.condition && (
                                          <Badge
                                            count={p.condition.toUpperCase()}
                                            style={{
                                              backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                              color: '#a78bfa',
                                              fontSize: '9px',
                                              boxShadow: 'none',
                                              border: '1px solid rgba(139, 92, 246, 0.2)'
                                            }}
                                          />
                                        )}
                                      </div>
                                      <Text style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>
                                        VINTED
                                      </Text>
                                    </div>
                                  }
                                />
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {m.type === 'user' && (
                        <Button
                          size="small"
                          type="primary"
                          style={{ background: '#020212', border: 'none', color: '#a78bfa', marginTop: '16px', fontSize: '11px', borderRadius: '10px', fontWeight: 700, boxShadow: '0 0 15px rgba(139,92,246,0.3)' }}
                          onClick={() => saveAlert(m.text)}
                        >
                          MONITORA QUESTA RICERCA
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', gap: '14px', padding: '12px', alignItems: 'center' }}>
                    <Spin size="small" style={{ color: '#8b5cf6' }} />
                    <Text italic style={{ color: '#94a3b8', fontSize: '13px' }}>Neural radar activated... searching nebula.</Text>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '24px 0' }}>
              <div className="chat-container">
                {/* honeypot anti-bot */}
                <div style={{ display: 'none' }}>
                  <input type="text" value={honey} onChange={(e) => setHoney(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                {/* hidden file input for OCR */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleOcrUpload}
                />

                <Space.Compact style={{ width: '100%', boxShadow: '0 15px 50px rgba(139,92,246,0.2)' }}>
                  <Tooltip title="Carica immagine per OCR">
                    <Button
                      size="large"
                      icon={ocrLoading ? <LoadingOutlined /> : <CameraOutlined />}
                      disabled={ocrLoading}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        height: '60px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRight: 'none',
                        color: '#8b5cf6',
                        borderRadius: '20px 0 0 20px',
                      }}
                    />
                  </Tooltip>
                  <Input
                    size="large"
                    placeholder="Sintonizza il radar..."
                    style={{ border: '1px solid rgba(139, 92, 246, 0.2)', height: '60px', fontSize: '16px', color: '#fff', borderRadius: '0' }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={() => handleSend()}
                    prefix={<SearchOutlined style={{ color: '#8b5cf6' }} />}
                  />
                  <Button
                    size="large"
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => handleSend()}
                    loading={loading}
                    style={{ width: '130px', borderRadius: '0 20px 20px 0', height: '60px', fontWeight: 900, fontSize: '14px', background: '#7c3aed' }}
                  >
                    CERCA
                  </Button>
                </Space.Compact>
              </div>
            </div>
          </Content>

          <Footer style={{ textAlign: 'center', padding: '20px 24px', background: 'transparent' }}>
            <Space size="middle" style={{ marginBottom: '16px' }}>
              <Link href="/privacy"><Text style={{ color: 'rgba(167, 139, 250, 0.4)', fontSize: '10px', cursor: 'pointer' }}>PRIVACY POLICY</Text></Link>
              <Link href="/terms"><Text style={{ color: 'rgba(167, 139, 250, 0.4)', fontSize: '10px', cursor: 'pointer' }}>TERMS OF SERVICE</Text></Link>
            </Space>
            <div className="made-by">MADE WITH ❤️ BY BIAGIO</div>
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
