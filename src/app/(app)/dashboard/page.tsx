import { Activity, DollarSign, Users as UsersIcon } from 'lucide-react'
import type { Metadata } from 'next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const SUMMARY_CARDS = [
  { title: 'Usuários ativos', value: '1.204', icon: UsersIcon },
  { title: 'Receita mensal', value: 'R$ 48.290', icon: DollarSign },
  { title: 'Sessões hoje', value: '342', icon: Activity },
] as const

/**
 * -----------------------------------------------------------------------
 * Página de Dashboard - SERVER COMPONENT
 * -----------------------------------------------------------------------
 * Exemplo de página que poderia buscar dados reais via:
 *  - Server Component direto (fetch no servidor, ideal para dados
 *    que não mudam por interação do usuário, ótimo para SEO/performance).
 *  - Ou TanStack Query (se os dados precisarem de refetch, polling,
 *    cache client-side compartilhado entre componentes).
 *
 * Aqui usamos dados estáticos como exemplo, mas a estrutura de grid
 * já demonstra a responsividade exigida:
 *  - 1 coluna no mobile (`grid-cols-1`)
 *  - 2 colunas no tablet (`sm:grid-cols-2`)
 *  - 3 colunas no desktop (`lg:grid-cols-3`)
 * -----------------------------------------------------------------------
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral da sua aplicação
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUMMARY_CARDS.map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
