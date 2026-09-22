"use client"

import { useCallback, useRef, useState, type SetStateAction } from "react"
import Link from "next/link"
import { LogIn, Plus, ZoomOut } from "lucide-react"
import { PERSONAL_GALAXY, conversationsIn } from "@/lib/galaxies"
import type { ConversationItem, CurrentUser, MessageItem, ServerItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/ui/notice"
import { MessageForm } from "./message-form"
import { MessageList } from "./message-list"
import { Galaxy, type GalaxyStar } from "./space/galaxy"
import { PlanetOrbit } from "./space/planet-orbit"
import { planetStyle, sunStyle } from "./space/planet-style"
import { Universe } from "./space/universe"
import { DEFAULT_CAMERA, type Camera } from "./space/use-camera"

function placeholderFor(conversation: ConversationItem | undefined) {
  if (!conversation) {
    return "Écrire un message"
  }
  if (conversation.type === "INFO" || conversation.type === "PUBLIC") {
    return "Écrire dans #" + conversation.name
  }
  return "Écrire à " + conversation.name
}

/** Bouton de navigation en haut à gauche de la scène (retour au niveau supérieur). */
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

/**
 * La scène spatiale, sur trois niveaux :
 * - l'univers : chaque serveur est une galaxie ;
 * - une galaxie : soleil (#info), planètes (canaux) et étoiles (membres) ;
 * - une planète ouverte : ses messages et le formulaire d'envoi.
 */
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
  /** null : vue de l'univers. */
  galaxyId: string | null
  conversationId: string
  /** `true` : la planète `conversationId` est ouverte. */
  open: boolean
  messages: MessageItem[]
  canWrite: boolean
  /** Membres (serveur) ou amis (galaxie personnelle) affichés en étoiles. */
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

  // Une caméra (zoom + position) par vue, conservée quand on navigue entre les niveaux.
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

  // Une conversation privée reste « en attente » tant que le destinataire n'a pas accepté.
  const isPending = conversation?.type === "PRIVATE" && !conversation.accepted
  const pendingForMe = isPending && user !== null && conversation.createdById !== user.id
  const pendingByMe = isPending && user !== null && conversation.createdById === user.id

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
        {/* Les autres astres de la galaxie restent visibles sur les côtés pour passer de l'un à l'autre. */}
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
            {/* Voile sombre sur le soleil pour garder les messages lisibles. */}
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
      {pendingForMe && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-accent/40 px-4 py-3 text-sm">
          <span>
            <strong>{conversation.name}</strong> souhaite vous envoyer des messages privés.
          </span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" onClick={onAccept}>
              Accepter
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete("Refuser et supprimer cette conversation ?")}
            >
              Refuser
            </Button>
          </div>
        </div>
      )}

      {pendingByMe && (
        <Notice variant="banner">
          Vous n&apos;êtes pas encore amis : {conversation.name} doit accepter vos messages privés
          pour pouvoir vous répondre.
        </Notice>
      )}

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

      {!user && (
        <Notice>
          Vous êtes visiteur : vous pouvez lire le canal #info de Helix.{" "}
          <Link href="/auth/connexion" className="text-primary hover:underline">
            Connectez-vous
          </Link>{" "}
          pour discuter.
        </Notice>
      )}

      {open && user && !canWrite && conversation?.type === "INFO" && (
        <Notice>Seuls les admins du serveur peuvent écrire dans #info.</Notice>
      )}

      {user && !canWrite && pendingForMe && (
        <Notice>Acceptez la demande pour pouvoir répondre.</Notice>
      )}
    </>
  )
}
