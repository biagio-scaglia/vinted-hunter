"use client";
import React from 'react';
import { Card, Typography } from 'antd';
import type { Product } from '@/lib/types';

const { Text } = Typography;

const SOURCE_COLORS: Record<string, string> = {
  vinted: '#8b5cf6',
  subito: '#f97316',
};

const SOURCE_LABELS: Record<string, string> = {
  vinted: 'VINTED',
  subito: 'SUBITO',
};

export default function ProductCard({ product }: { product: Product }) {
  const srcColor = SOURCE_COLORS[product.source] ?? '#64748b';
  const srcLabel = SOURCE_LABELS[product.source] ?? product.source.toUpperCase();

  const openLink = () => window.open(product.link, '_blank', 'noopener,noreferrer');

  return (
    <Card
      hoverable
      className="product-card-hover"
      styles={{ body: { padding: '14px' } }}
      cover={
        product.image
          ? (
            <img
              alt={product.title}
              src={product.image}
              style={{ height: '170px', objectFit: 'cover', borderRadius: '18px 18px 0 0' }}
            />
          )
          : (
            <div aria-hidden="true" style={{ height: '170px', background: '#312e81', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '11px', letterSpacing: '1px', borderRadius: '18px 18px 0 0' }}>
              NESSUNA IMMAGINE
            </div>
          )
      }
      role="button"
      tabIndex={0}
      aria-label={`${product.title} — ${product.price} su ${srcLabel}. Apri annuncio`}
      onClick={openLink}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLink(); } }}
      style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(139,92,246,0.12)', background: '#1e1b4b', cursor: 'pointer' }}
    >
      {/* Source badge (decorative, info already in aria-label) */}
      <div style={{ marginBottom: '8px' }} aria-hidden="true">
        <span style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '6px',
          fontSize: '9px',
          fontWeight: 800,
          letterSpacing: '1px',
          background: `${srcColor}18`,
          color: srcColor,
          border: `1px solid ${srcColor}40`,
        }}>
          {srcLabel}
        </span>
      </div>

      <Text style={{ fontSize: '12px', color: '#f8fafc', fontWeight: 700, display: 'block', marginBottom: '8px' }} ellipsis>
        {product.title}
      </Text>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: srcColor, fontWeight: 900, fontSize: '15px' }}>{product.price}</Text>
        {product.condition && (
          <span style={{
            padding: '2px 7px',
            borderRadius: '6px',
            fontSize: '9px',
            fontWeight: 700,
            background: 'rgba(139,92,246,0.08)',
            color: '#a78bfa',
            border: '1px solid rgba(139,92,246,0.2)',
          }}>
            {product.condition.toUpperCase()}
          </span>
        )}
      </div>
    </Card>
  );
}
