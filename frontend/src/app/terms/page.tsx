"use client";
import React from 'react';
import { Layout, Typography, ConfigProvider, theme, Button } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function TermsOfService() {
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
          <Title level={5} style={{ margin: '0 0 0 16px', color: '#fff', letterSpacing: '2px', fontWeight: 900, fontSize: '12px' }}>TERMS OF SERVICE</Title>
        </Header>
        
        <Content style={{ padding: '60px 24px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <FileTextOutlined style={{ fontSize: '48px', color: '#8b5cf6', marginBottom: '24px' }} />
            <Title style={{ color: '#fff' }}>Termini di Utilizzo</Title>
            <Text style={{ color: '#a78bfa', fontSize: '16px' }}>Configurazione d'Uso per Hunters Research Center</Text>
          </div>

          <Title level={3} style={{ color: '#fff' }}>1. Scopo del Software</Title>
          <Paragraph style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.8' }}>
            Vinted Hunter Pro è uno strumento di ricerca progettato per aggregare e monitorare dati pubblici. 
            L'utente è responsabile dell'utilizzo del software in conformità con i termini di servizio dei marketplace consultati.
          </Paragraph>

          <Title level={3} style={{ color: '#fff' }}>2. Limitazione di Responsabilità</Title>
          <Paragraph style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.8' }}>
            Il software viene fornito "così com'è". Non siamo responsabili per l'accuratezza dei dati restituiti dai 
            marketplace o per eventuali azioni intraprese dall'utente basate sulle informazioni fornite dai Radar.
          </Paragraph>

          <Title level={3} style={{ color: '#fff' }}>3. Proprietà Intellettuale</Title>
          <Paragraph style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.8' }}>
            Il design "Cyber-Violet" e l'architettura del software sono proprietà intellettuale di Biagio. È vietata 
            la ridistribuzione non autorizzata del codice sorgente.
          </Paragraph>
        </Content>

        <Footer style={{ textAlign: 'center', padding: '40px', background: 'transparent' }}>
          <div style={{ fontSize: '11px', color: '#a78bfa', letterSpacing: '3px', fontWeight: 900 }}>MADE BY BIAGIO</div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
