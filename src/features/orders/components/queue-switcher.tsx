'use client'

import { useState } from 'react'

import { QUEUE_LISTS } from '../queue-list'
import { QueueTable } from './queue-table'

import { Button } from '@/components/ui/button'

export function QueueSwitcher() {
  const availableQueues = QUEUE_LISTS.filter(queue => queue.available)
  const [activeKey, setActiveKey] = useState(availableQueues[0]?.key)

  const activeQueue = availableQueues.find(queue => queue.key === activeKey)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {QUEUE_LISTS.map(({ key, label, icon: Icon, available }) => (
          <Button
            key={key}
            variant={key === activeKey ? 'default' : 'outline'}
            disabled={!available}
            onClick={() => setActiveKey(key)}
          >
            <Icon className="size-4" />
            {label}
            {!available && (
              <span className="text-xs text-muted-foreground">
                (Coming soon)
              </span>
            )}
          </Button>
        ))}
      </div>

      {activeQueue && (
        <QueueTable queue={activeQueue.key} label={activeQueue.label} />
      )}
    </div>
  )
}
