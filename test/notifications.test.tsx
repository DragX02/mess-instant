import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ConversationItem } from "@/lib/types"
import { MessageToasts } from "@/components/chat/message-toasts"
import { ChatSidebar } from "@/components/chat/chat-sidebar"

vi.mock("next-themes", () => ({ useTheme: () => ({ theme: "light", setTheme: vi.fn() }) }))

function conversation(infos: Partial<ConversationItem>): ConversationItem {
  return {
    id: "c1",
    type: "GROUP",
    name: "Projet",
    accepted: true,
    createdById: null,
    memberCount: 2,
    serverId: null,
    nonLus: 0,
    ...infos,
  }
}

function sidebar(conversations: ConversationItem[], selectedId = "") {
  const rien = vi.fn()
  return render(
    <ChatSidebar
      user={{ id: "moi", name: "Moi", isAdmin: false }}
      servers={[]}
      conversations={conversations}
      galaxyId={null}
      selectedId={selectedId}
      showFriends={false}
      open={false}
      theme="classique"
      friendRequestCount={0}
      onClose={rien}
      onSelect={rien}
      onEnterGalaxy={rien}
      onShowFriends={rien}
      onCreateServer={rien}
      onJoinServer={rien}
      onCreateChannel={rien}
      onNewGroup={rien}
      onNewPrivate={rien}
      portefeuille={null}
      onOpenShop={rien}
      onOpenSettings={rien}
      onSignOut={rien}
    />,
  )
}

describe("MessageToasts", () => {
  const toast = { id: "t1", conversationId: "c1", titre: "Alice", texte: "Salut !" }

  it("affiche l'auteur et le message", () => {
    render(<MessageToasts toasts={[toast]} onOpen={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Salut !")).toBeInTheDocument()
  })

  it("ouvre la conversation au clic", async () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    render(<MessageToasts toasts={[toast]} onOpen={onOpen} onClose={onClose} />)

    await userEvent.click(screen.getByText("Salut !"))

    expect(onOpen).toHaveBeenCalledWith("c1")
    expect(onClose).toHaveBeenCalledWith("t1")
  })

  it("se ferme avec le bouton", async () => {
    const onClose = vi.fn()
    render(<MessageToasts toasts={[toast]} onOpen={vi.fn()} onClose={onClose} />)

    await userEvent.click(screen.getByRole("button", { name: "Fermer" }))

    expect(onClose).toHaveBeenCalledWith("t1")
  })
})

describe("ChatSidebar non-lus", () => {
  it("affiche le nombre de messages non lus", () => {
    sidebar([conversation({ nonLus: 3 })])
    expect(screen.getAllByText("3").length).toBeGreaterThan(0)
  })

  it("n'affiche rien pour la conversation ouverte", () => {
    sidebar([conversation({ nonLus: 3 })], "c1")
    expect(screen.queryByText("3")).not.toBeInTheDocument()
  })

  it("additionne les non-lus des messages privés", () => {
    sidebar([
      conversation({ id: "a", type: "PRIVATE", name: "Alice", nonLus: 2 }),
      conversation({ id: "b", type: "PRIVATE", name: "Bob", nonLus: 1 }),
    ])
    expect(screen.getByText("3")).toBeInTheDocument()
  })
})
