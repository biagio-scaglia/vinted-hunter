"use client";
import React from 'react';
import { Button, Input, Empty, Typography, Divider } from 'antd';
import { DeleteOutlined, RadarChartOutlined, FilterOutlined } from '@ant-design/icons';
import type { Alert, Filters } from '@/lib/types';

const { Text } = Typography;

interface SidebarProps {
  alerts: Alert[];
  filters: Filters;
  onFilterChange: (f: Filters) => void;
  onAlertClick: (query: string) => void;
  onAlertDelete: (id: number) => void;
}

const LABEL_STYLE: React.CSSProperties = {
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

export default function Sidebar({ alerts, filters, onFilterChange, onAlertClick, onAlertDelete }: SidebarProps) {
  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>

      {/* Filters */}
      <div>
        <div style={LABEL_STYLE}><FilterOutlined /> Filtri Prezzo</div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <Input
            placeholder="Min €"
            type="number"
            min={0}
            size="small"
            style={INPUT_STYLE}
            value={filters.min_price}
            onChange={(e) => onFilterChange({ ...filters, min_price: e.target.value })}
          />
          <Input
            placeholder="Max €"
            type="number"
            min={0}
            size="small"
            style={INPUT_STYLE}
            value={filters.max_price}
            onChange={(e) => onFilterChange({ ...filters, max_price: e.target.value })}
          />
        </div>
      </div>

      <Divider style={{ margin: 0, borderColor: 'rgba(139, 92, 246, 0.1)' }} />

      {/* Active radars */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={LABEL_STYLE}><RadarChartOutlined /> Radar Attivi ({alerts.length})</div>
        <div className="custom-scrollbar" style={{ marginTop: '12px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {alerts.length === 0 ? (
            <Empty
              description={<Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Nessun monitoraggio attivo</Text>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ marginTop: '16px' }}
            />
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
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
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.keyword}</div>
                  <div style={{ color: 'rgba(139, 92, 246, 0.6)', fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{alert.query}</div>
                </div>
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined style={{ fontSize: '11px', color: '#ef4444' }} />}
                  onClick={(e) => { e.stopPropagation(); onAlertDelete(alert.id); }}
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
