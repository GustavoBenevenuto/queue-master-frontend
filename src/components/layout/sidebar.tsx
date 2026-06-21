import { SidebarNav } from './sidebar-nav'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-background md:flex md:flex-col">
      <div className="flex h-14 items-center border-b border-border px-4">
        <span className="font-mono text-sm font-bold">Queue master</span>
      </div>

      <SidebarNav />
    </aside>
  )
}
