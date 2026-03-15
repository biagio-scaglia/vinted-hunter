"use client";
import React from 'react';
import { Button, Input, Empty, Typography, Badge } from 'antd';
import { DeleteOutlined, HistoryOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export interface Alert {
  id: number;
  query: string;
  keyword: string;
}

interface SidebarProps {
  alerts: Alert[];
  filters: { min_price: string; max_price: string };
  onFilterChange: (filters: { min_price: string; max_price: string }) => void;
  onAlertClick: (query: string) => void;
  onAlertDelete: (id: number) => void;
  onClearChat: () => void;
}

export default function Sidebar({ alerts, filters, onFilterChange, onAlertClick, onAlertDelete, onClearChat }: SidebarProps) {
  return (
    <div style={{ padding: '24px', background: '#0a0a1f', minHeight: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Filters */}
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
              onChange={(e) => onFilterChange({ ...filters, min_price: e.target.value })}
            />
            <Input
              placeholder="Max €"
              variant="filled"
              type="number"
              min={0}
              style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}
              value={filters.max_price}
              onChange={(e) => onFilterChange({ ...filters, max_price: e.target.value })}
            />
          </div>
        </div>

        {/* Active radars */}
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
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px', background: 'rgba(139, 92, 246, 0.05)',
                    borderRadius: '16px', marginBottom: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                    cursor: 'pointer', transition: 'all 0.3s'
                  }}
                  className="radar-item-hover"
                  onClick={() => onAlertClick(alert.query)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{alert.keyword}</div>
                    <div style={{ color: '#8b5cf6', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '4px' }}>{alert.query}</div>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined style={{ color: '#ef4444' }} />}
                    onClick={(e) => { e.stopPropagation(); onAlertDelete(alert.id); }}
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
            color: '#fff', borderRadius: '16px', height: '50px', fontWeight: 700
          }}
          onClick={onClearChat}
        >
          PULISCI CHAT
        </Button>
      </div>
    </div>
  );
}
