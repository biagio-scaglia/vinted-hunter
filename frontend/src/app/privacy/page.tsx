"use client";
import React from 'react';
import { Layout, Typography, ConfigProvider, theme, Button } from 'antd';
import { ArrowLeftOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

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
        <Header style={{ background: 'rgba(10, 10, 31, 0.7)', padding: '0 24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(139, 92, 246, 0.1)', backdropFilter: 'blur(15px)' }}>
          <Link href="/">
            <Button type="text" icon={<ArrowLeftOutlined style={{ color: '#8b5cf6' }} />} />
          </Link>
          <Title level={5} style={{ margin: '0 0 0 16px', color: '#fff', letterSpacing: '2px', fontWeight: 900, fontSize: '12px' }}>PRIVACY POLICY</Title>
        </Header>
        
        <Content style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <LockOutlined style={{ fontSize: '48px', color: '#8b5cf6', marginBottom: '24px' }} />
            <Title style={{ color: '#fff' }}>La tua Privacy è al centro.</Title>
            <Text style={{ color: '#a78bfa', fontSize: '16px' }}>Hunters Research Center - Documentazione Legale</Text>
          </div>

          <Title level={3} style={{ color: '#fff' }}>1. Elaborazione Dati Locale</Title>
          <Paragraph style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.8' }}>
            Vinted Hunter Pro utilizza un motore di intelligenza artificiale locale (EasyOCR) per analizzare le immagini caricate. 
            Le tue foto non vengono inviate a servizi cloud esterni per il riconoscimento del testo, garantendo che i tuoi screenshot 
            rimangano privati e vengano elaborati esclusivamente sul server locale del progetto.
          </Paragraph>

          <Title level={3} style={{ color: '#fff' }}>2. Ricerca Marketplace</Title>
          <Paragraph style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.8' }}>
            L'applicazione funge da aggregatore di dati pubblici provenienti dai marketplace. Non memorizziamo dati personali 
            derivanti dalle tue ricerche, eccetto le keyword necessarie per il funzionamento dei "Radar" attivi, 
            che sono salvate localmente nel database del sistema.
          </Paragraph>

          <Title level={3} style={{ color: '#fff' }}>3. Sicurezza</Title>
          <Paragraph style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.8' }}>
            Essendo un'applicazione dedicata alla ricerca industriale e personale, la sicurezza è integrata nel design 
            (Privacy by Design). Non vendiamo né condividiamo mai i tuoi dati di ricerca con terze parti.
          </Paragraph>
          
          <div style={{ marginTop: '80px', padding: '30px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
            <Text italic style={{ color: '#a78bfa' }}>
              Ultimo aggiornamento: 14 Marzo 2026. Sviluppato per Biagio.
            </Text>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', padding: '40px', background: 'transparent' }}>
          <div style={{ fontSize: '11px', color: '#a78bfa', letterSpacing: '3px', fontWeight: 900 }}>MADE BY BIAGIO</div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
