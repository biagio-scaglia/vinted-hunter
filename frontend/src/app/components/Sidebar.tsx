"use client";
import React from 'react';
import { Button, Input, Empty, Typography, Divider, Checkbox } from 'antd';
import { DeleteOutlined, RadarChartOutlined, FilterOutlined, ShopOutlined, SearchOutlined } from '@ant-design/icons';
import type { Alert, Filters, MarketplaceInfo } from '@/lib/types';

const { Text } = Typography;

const LABEL: React.CSSProperties = {
  color: 'rgba(139, 92, 246, 0.7)',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(139, 92, 246, 0.15)',
  color: '#fff',
  borderRadius: '10px',
};

interface SidebarProps {
  alerts: Alert[];
  filters: Filters;
  sources: MarketplaceInfo[];
  onFilterChange: (f: Filters) => void;
  onApplyFilters: () => void;
  onAlertClick: (query: string) => void;
  onAlertDelete: (id: number) => void;
}

export default function Sidebar({
  alerts,
  filters,
  sources,
  onFilterChange,
  onApplyFilters,
  onAlertClick,
  onAlertDelete,
}: SidebarProps) {
  const hasActiveFilters = !!filters.min_price || !!filters.max_price;

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>

      {/* ── Source selector ─────────────────────────────────────────────── */}
      <div>
        <div style={LABEL}><ShopOutlined /> Store</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          {sources.length === 0 ? (
            <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>Caricamento...</Text>
          ) : (
            sources.map(src => (
              <label
                key={src.name}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px 12px', borderRadius: '10px', background: filters.sources.includes(src.name) ? 'rgba(139,92,246,0.08)' : 'transparent', border: `1px solid ${filters.sources.includes(src.name) ? 'rgba(139,92,246,0.2)' : 'transparent'}`, transition: 'all 0.2s' }}
              >
                <Checkbox
                  checked={filters.sources.includes(src.name)}
                  onChange={e => {
                    const next = e.target.checked
                      ? [...filters.sources, src.name]
                      : filters.sources.filter(s => s !== src.name);
                    // Always keep at least one source selected
                    onFilterChange({ ...filters, sources: next.length ? next : [src.name] });
                  }}
                  style={{ flexShrink: 0 }}
                />
                <span
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: src.color, flexShrink: 0, boxShadow: `0 0 6px ${src.color}80` }}
                />
                <Text style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>{src.display_name}</Text>
              </label>
            ))
          )}
        </div>
      </div>

      <Divider style={{ margin: 0, borderColor: 'rgba(139, 92, 246, 0.1)' }} />

      {/* ── Price filters ────────────────────────────────────────────────── */}
      <div>
        <div style={LABEL}><FilterOutlined /> Filtri Prezzo</div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <Input
            placeholder="Min €"
            type="number"
            min={0}
            size="small"
            style={INPUT_STYLE}
            value={filters.min_price}
            onChange={e => onFilterChange({ ...filters, min_price: e.target.value })}
            onPressEnter={onApplyFilters}
          />
          <Input
            placeholder="Max €"
            type="number"
            min={0}
            size="small"
            style={INPUT_STYLE}
            value={filters.max_price}
            onChange={e => onFilterChange({ ...filters, max_price: e.target.value })}
            onPressEnter={onApplyFilters}
          />
        </div>
        <Button
          block
          size="small"
          icon={<SearchOutlined />}
          onClick={onApplyFilters}
          style={{
            marginTop: '10px',
            background: hasActiveFilters ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${hasActiveFilters ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.15)'}`,
            color: hasActiveFilters ? '#a78bfa' : 'rgba(255,255,255,0.5)',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
          }}
        >
          APPLICA FILTRI
        </Button>
      </div>

      <Divider style={{ margin: 0, borderColor: 'rgba(139, 92, 246, 0.1)' }} />

      {/* ── Active radars ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={LABEL}><RadarChartOutlined /> Radar Attivi ({alerts.length})</div>
        <div
          className="custom-scrollbar"
          style={{ marginTop: '12px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          {alerts.length === 0 ? (
            <Empty
              description={<Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Nessun monitoraggio attivo</Text>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ marginTop: '16px' }}
            />
          ) : (
            alerts.map(alert => (
              <div
                key={alert.id}
                role="button"
                tabIndex={0}
                aria-label={`Cerca ${alert.keyword}`}
                className="radar-item-hover"
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px',
                  background: 'rgba(139, 92, 246, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(139, 92, 246, 0.1)',
                  cursor: 'pointer',
                }}
                onClick={() => onAlertClick(alert.query)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAlertClick(alert.query); } }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {alert.keyword}
                  </div>
                  <div style={{ color: 'rgba(139, 92, 246, 0.6)', fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                    {alert.query}
                  </div>
                </div>
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined style={{ fontSize: '11px', color: '#ef4444' }} aria-hidden="true" />}
                  onClick={e => { e.stopPropagation(); onAlertDelete(alert.id); }}
                  aria-label={`Elimina radar ${alert.keyword}`}
                  style={{ flexShrink: 0, opacity: 0.7 }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
