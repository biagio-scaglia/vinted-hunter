"use client";
import React from 'react';
import { Card, Badge, Typography } from 'antd';
import type { Product } from '@/lib/types';

const { Text } = Typography;

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card
      hoverable
      className="product-card-hover"
      styles={{ body: { padding: '16px' } }}
      cover={
        product.image
          ? <img alt={product.title} src={product.image} style={{ height: '180px', objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
          : <div style={{ height: '180px', background: '#312e81', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '12px', letterSpacing: '1px' }}>NESSUNA IMMAGINE</div>
      }
      onClick={() => window.open(product.link, '_blank')}
      style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.12)', background: '#1e1b4b', cursor: 'pointer' }}
    >
      <Card.Meta
        title={<Text style={{ fontSize: '13px', color: '#f8fafc' }} strong ellipsis>{product.title}</Text>}
        description={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <Text style={{ color: '#8b5cf6', fontWeight: 900, fontSize: '15px' }}>{product.price}</Text>
            {product.condition && (
              <Badge
                count={product.condition.toUpperCase()}
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', fontSize: '9px', boxShadow: 'none', border: '1px solid rgba(139, 92, 246, 0.2)' }}
              />
            )}
          </div>
        }
      />
    </Card>
  );
}
