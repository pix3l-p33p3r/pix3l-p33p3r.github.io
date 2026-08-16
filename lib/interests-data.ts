export type InterestChannel = {
  id: string
  callsign: string
  freq: string
  band: string
  title: string
  teaser: string
  log: string[]
  tags: string[]
}

export const interestChannels: InterestChannel[] = [
  {
    id: "zk",
    callsign: "ZK",
    freq: "14.42",
    band: "HF",
    title: "Zero-knowledge",
    teaser: "Proofs without dumping the tape.",
    log: [
      "A verifier that learns nothing except that the statement holds.",
      "I want systems that can show they know — auth, audit, membership — without shipping the secret across the wire.",
      "Still a craft more than a checkbox. The interesting part is making it boring enough to ship.",
    ],
    tags: ["crypto", "proofs", "privacy"],
  },
  {
    id: "pqc",
    callsign: "PQC",
    freq: "1.337",
    band: "SHF",
    title: "Post-quantum crypto",
    teaser: "Algorithms that outlive the harvest.",
    log: [
      "Store-now-decrypt-later is not a thought experiment. It is a calendar.",
      "Lattice / hash / code-based primitives, hybrid TLS, and the ugly migration: dual-stack certs, HSM firmware, leftover RSA in a drawer.",
      "I care about the operational mess more than the tweet-length slogan.",
    ],
    tags: ["crypto", "pki", "migration"],
  },
  {
    id: "osint",
    callsign: "OSINT",
    freq: "7.02",
    band: "HF",
    title: "Open-source intel",
    teaser: "Signal vs noise. Mostly noise.",
    log: [
      "Public crumbs: DNS, certs, commit metadata, leaked configs, the photo that still has a GPS tag.",
      "The job is not collecting. The job is deciding what is actually true, and what is just loud.",
      "OPSEC is the other side of the same coin. If I can peep it, so can someone less polite.",
    ],
    tags: ["recon", "opsec", "signal"],
  },
  {
    id: "side",
    callsign: "SIDE",
    freq: "432",
    band: "UHF",
    title: "Side-channels",
    teaser: "The metal always talks.",
    log: [
      "Timing, power, EM, cache. The algorithm is correct and the chip still whispers the key.",
      "I like the moment a clean spec meets a messy physical world — oscilloscope, jitter, a loop that should have been constant-time.",
      "Firmware, secure boot, and the warranty I already voided.",
    ],
    tags: ["hardware", "firmware", "sre-of-physics"],
  },
]

export const interests = interestChannels.map((channel) => channel.callsign)
