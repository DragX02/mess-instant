import { Hash, Plus, Search, Send, Settings, Smile, Volume2 } from "lucide-react"

const SERVERS = [
  { label: "H", active: true },
  { label: "D", active: false },
  { label: "M", active: false },
]

const CHANNELS = [
  { name: "général", unread: null, active: true },
  { name: "design", unread: null, active: false },
  { name: "annonces", unread: 3, active: false },
  { name: "random", unread: null, active: false },
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground motion-safe:animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground motion-safe:animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground motion-safe:animate-bounce" />
    </div>
  )
}

export function ChatPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-primary/10 blur-3xl"
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl ring-1 ring-foreground/5 -rotate-1 transition-transform duration-300 hover:rotate-0">
        {/* Barre de titre */}
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-secondary/50" />
          <span className="ml-2 font-mono text-[11px] text-muted-foreground">app.helix.chat</span>
        </div>

        <div className="flex h-[420px]">
          {/* Rail de serveurs */}
          <div className="flex w-14 flex-col items-center gap-2 border-r border-border bg-sidebar py-3">
            {SERVERS.map((server) => (
              <div key={server.label} className="relative flex items-center justify-center">
                {server.active && (
                  <span className="absolute -left-3 h-5 w-1 rounded-full bg-sidebar-primary" />
                )}
                <div
                  className={`flex h-9 w-9 items-center justify-center text-sm font-semibold transition-all ${
                    server.active
                      ? "rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"
                      : "rounded-full bg-sidebar-accent text-sidebar-accent-foreground"
                  }`}
                >
                  {server.label}
                </div>
              </div>
            ))}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-sidebar-border text-sidebar-foreground/50">
              <Plus className="h-4 w-4" />
            </div>
          </div>

          {/* Liste des canaux */}
          <div className="hidden w-44 flex-col border-r border-border bg-muted/20 p-3 sm:flex">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-sm font-semibold">Équipe Helix</span>
            </div>
            <div className="mb-3 flex items-center gap-1.5 rounded-md bg-input/60 px-2 py-1.5 text-muted-foreground">
              <Search className="h-3 w-3" />
              <span className="text-[11px]">Rechercher</span>
            </div>

            <div className="mb-1 px-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              Canaux textuels
            </div>
            <div className="flex flex-col gap-0.5">
              {CHANNELS.map((channel) => (
                <div
                  key={channel.name}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] ${
                    channel.active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Hash className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{channel.name}</span>
                  {channel.unread && (
                    <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {channel.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 mb-1 px-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              Canaux vocaux
            </div>
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-muted-foreground">
              <Volume2 className="h-3.5 w-3.5 shrink-0" />
              <span>Général</span>
            </div>

            <div className="mt-auto flex items-center gap-2 rounded-md bg-background/60 px-2 py-1.5">
              <div className="relative">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
                  A
                </div>
                <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              </div>
              <span className="text-[12px] font-medium">Adrien</span>
              <Settings className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          {/* Zone de conversation */}
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">général</span>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-3">
              <p className="text-center text-[11px] text-muted-foreground italic">
                — Léa a rejoint #général —
              </p>

              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  L
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-semibold">Léa</span>
                    <span className="font-mono text-[10px] text-muted-foreground">14:02</span>
                  </div>
                  <p className="text-[13px] text-foreground/90">
                    Le design du nouveau dashboard est prêt 🎉
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
                  T
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-semibold">Tom</span>
                    <span className="font-mono text-[10px] text-muted-foreground">14:03</span>
                  </div>
                  <p className="text-[13px] text-foreground/90">
                    Nickel, je regarde ça tout de suite.
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px]">
                    👍 2
                  </span>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2 text-muted-foreground">
                <TypingDots />
                <span className="text-[11px] italic">Léa est en train d&apos;écrire…</span>
              </div>
            </div>

            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-2 text-muted-foreground">
                <Plus className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate text-[13px]">Écrivez dans #général</span>
                <Smile className="h-4 w-4 shrink-0" />
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Send className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
