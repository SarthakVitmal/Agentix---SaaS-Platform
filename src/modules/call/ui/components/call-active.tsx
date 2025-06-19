import Link from "next/link"
import Image from "next/image"
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk"

interface Props {
  onLeave: () => void
  meetingName: string
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
  return (
    <div className="relative flex h-full flex-col bg-gradient-to-br from-sidebar-accent via-sidebar to-sidebar text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center justify-center p-2 bg-white/15 hover:bg-white/25 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/10"
              >
                <Image src="/logo.svg" alt="Agentix Logo" width={28} height={28} className="h-7 w-7" />
              </Link>
              <div>
                <h4 className="text-lg font-semibold text-white/95">{meetingName}</h4>
                <p className="text-sm text-white/60">Active call</p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/70">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Layout */}
      <div className="relative px-6 pb-6">
        <div className="mx-auto max-w-6xl h-full">
          <div className="relative h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20 backdrop-blur-sm">
            <SpeakerLayout />

            {/* Subtle overlay for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 pb-8 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl">
            <CallControls onLeave={onLeave} />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sidebar/80 to-transparent pointer-events-none" />
    </div>
  )
}

export default CallActive
