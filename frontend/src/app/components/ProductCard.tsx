"use client";
import React from 'react';
import { Card, Badge, Typography } from 'antd';

const { Text: AntText } = Typography;

export interface Product {
  id: string;
  title: string;
  price: string;
  link: string;
  image?: string;
  condition?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card
      hoverable
      className="product-card-hover"
      styles={{ body: { padding: '16px' } }}
      cover={
        product.image
          ? <img alt={product.title} src={product.image} style={{ height: '180px', objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
          : <div style={{ height: '180px', background: '#312e81', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Nessuna immagine</div>
      }
      onClick={() => window.open(product.link, '_blank')}
      style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.1)', background: '#1e1b4b', cursor: 'pointer' }}
    >
      <Card.Meta
        title={<AntText style={{ fontSize: '14px', color: '#f8fafc' }} strong ellipsis>{product.title}</AntText>}
        description={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <AntText style={{ color: '#8b5cf6', fontWeight: 900, fontSize: '16px', textShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}>
                {product.price}
              </AntText>
              {product.condition && (
                <Badge
                  count={product.condition.toUpperCase()}
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
            <AntText style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>VINTED</AntText>
          </div>
        }
      />
    </Card>
  );
}
