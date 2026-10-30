"use client"

import { useCallback, useRef, useState, type SetStateAction } from "react"
import { LogIn, Plus, ZoomOut } from "lucide-react"
import { PERSONAL_GALAXY, conversationsIn } from "@/lib/galaxies"
import { placeholderFor } from "@/lib/conversations"
import type { ConversationItem, CurrentUser, MessageItem, ServerItem } from "@/lib/types"
import { ChatNotices, PendingBanners } from "./conversation-notices"
import { MessageForm } from "./message-form"
import { MessageList } from "./message-list"
import { Galaxy, type GalaxyStar } from "./space/galaxy"
import { PlanetOrbit } from "./space/planet-orbit"
import { planetStyle, sunStyle } from "./space/planet-style"
import { Universe } from "./space/universe"
import { DEFAULT_CAMERA, type Camera } from "./space/use-camera"

function SceneButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-md hover:bg-white/20"
    >
      {children}
    </button>
  )
}

export function ConversationView({
  user,
  servers,
  conversations,
  galaxyId,
  conversationId,
  open,
  messages,
  canWrite,
  stars,
  onChange,
  onAccept,
  onDelete,
  onSelect,
  onBack,
  onEnterGalaxy,
  onUniverse,
  onCreateServer,
  onJoinServer,
}: {
  user: CurrentUser | null
  servers: ServerItem[]
  conversations: ConversationItem[]
  galaxyId: string | null
  conversationId: string
  open: boolean
  messages: MessageItem[]
  canWrite: boolean
  stars: GalaxyStar[]
  onChange: () => void
  onAccept: () => void
  onDelete: (question: string) => void
  onSelect: (id: string) => void
  onBack: () => void
  onEnterGalaxy: (id: string) => void
  onUniverse: () => void
  onCreateServer: () => void
  onJoinServer: () => void
}) {
  const planetRef = useRef<HTMLDivElement>(null)

  const [cameras, setCameras] = useState<Record<string, Camera>>({})
  const cameraKey = galaxyId ?? "univers"
  const camera = cameras[cameraKey] ?? DEFAULT_CAMERA
  const setCamera = useCallback(
    (action: SetStateAction<Camera>) =>
      setCameras((all) => {
        const current = all[cameraKey] ?? DEFAULT_CAMERA
        return { ...all, [cameraKey]: typeof action === "function" ? action(current) : action }
      }),
    [cameraKey],
  )

  const server = servers.find((item) => item.id === galaxyId)
  const galaxyName = galaxyId === PERSONAL_GALAXY ? "Messages privés" : server?.name || "Galaxie"
  const inGalaxy = galaxyId ? conversationsIn(conversations, galaxyId) : []
  const sun = inGalaxy.find((item) => item.type === "INFO")
  const conversation = open ? inGalaxy.find((item) => item.id === conversationId) : undefined

  const universeGalaxies = [
    ...servers.map((item) => ({
      id: item.id,
      name: item.name,
      detail: item.role
        ? item.memberCount + (item.memberCount > 1 ? " membres" : " membre")
        : "Serveur public",
    })),
    ...(user
      ? [
          {
            id: PERSONAL_GALAXY,
            name: "Messages privés",
            detail: "Groupes et conversations privées",
          },
        ]
      : []),
  ]

  function scene() {
    if (!galaxyId) {
      return (
        <>
          <Universe
            galaxies={universeGalaxies}
            camera={camera}
            onCameraChange={setCamera}
            onEnter={onEnterGalaxy}
          />
          {user && (
            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
              <SceneButton onClick={onCreateServer}>
                <Plus className="h-4 w-4" />
                Créer un serveur
              </SceneButton>
              <SceneButton onClick={onJoinServer}>
                <LogIn className="h-4 w-4" />
                Rejoindre
              </SceneButton>
            </div>
          )}
        </>
      )
    }

    if (!open) {
      return (
        <>
          <Galaxy
            user={user}
            sun={sun}
            planets={inGalaxy.filter((item) => item.type !== "INFO")}
            stars={stars}
            camera={camera}
            onCameraChange={setCamera}
            onSelect={onSelect}
          />
          <div className="absolute top-3 left-3 z-10">
            <SceneButton onClick={onUniverse}>
              <ZoomOut className="h-4 w-4" />
              Univers
            </SceneButton>
          </div>
        </>
      )
    }

    return (
      <>
        <PlanetOrbit
          conversations={inGalaxy.filter((item) => item.id !== conversationId)}
          onSelect={onSelect}
        />

        <div className="absolute top-1/2 left-1/2 size-[min(94cqh,94cqw)] -translate-x-1/2 -translate-y-1/2 md:size-[min(92cqh,62cqw)]">
          <div className="absolute -inset-[4%] animate-spin-slow rounded-full border border-dashed border-white/10" />
          <div
            key={conversationId}
            ref={planetRef}
            style={
              conversation?.type === "INFO"
                ? sunStyle()
                : planetStyle(conversationId, conversation?.type ?? "PUBLIC")
            }
            className="relative h-full w-full animate-planet-open overflow-hidden rounded-full"
          >
            {conversation?.type === "INFO" && (
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(40,15,0,0.55)_0%,rgba(40,15,0,0.35)_60%,transparent_75%)]" />
            )}
            <div className="absolute inset-x-[14%] inset-y-[12%]">
              <MessageList
                messages={messages}
                user={user}
                canModerate={Boolean(user?.isAdmin || server?.canManage)}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <div className="absolute top-3 left-3 z-10">
          <SceneButton onClick={onBack}>
            <ZoomOut className="h-4 w-4" />
            {galaxyName}
          </SceneButton>
        </div>
      </>
    )
  }

  return (
    <>
      <PendingBanners
        conversation={conversation}
        user={user}
        onAccept={onAccept}
        onDelete={onDelete}
      />

      <div className="space-bg relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="space-stars-far" />
        <div className="space-stars animate-twinkle" />

        <div className="relative min-h-0 flex-1 [container-type:size]">{scene()}</div>

        {open && user && canWrite && (
          <MessageForm
            key={conversationId}
            conversationId={conversationId}
            placeholder={placeholderFor(conversation)}
            userName={user.name}
            planetRef={planetRef}
            onSent={onChange}
          />
        )}
      </div>

      <ChatNotices user={user} conversation={conversation} open={open} canWrite={canWrite} />
    </>
  )
}
