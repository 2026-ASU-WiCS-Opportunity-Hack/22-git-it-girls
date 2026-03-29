'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

export function ServicesByTypeChart({ data }: { data: { type: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="type"
          tick={{ fontSize: 11, fill: '#64748b' }}
          angle={-40}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 6 }}
          cursor={{ fill: '#f1f5f9' }}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Services" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MonthlyTrendChart({ data }: { data: { month: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4, fill: '#3b82f6' }}
          name="Services"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function LanguageChart({ data }: { data: { language: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
        <YAxis type="category" dataKey="language" tick={{ fontSize: 11, fill: '#64748b' }} width={72} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="count" fill="#10b981" radius={[0, 3, 3, 0]} name="Clients" />
      </BarChart>
    </ResponsiveContainer>
  )
}
