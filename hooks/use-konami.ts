"use client"

import { useEffect } from "react"

const SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

export function useKonami(onUnlock: () => void) {
  useEffect(() => {
    let index = 0

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return
      }
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      const expected = SEQUENCE[index]
      if (key === expected) {
        index += 1
        if (index === SEQUENCE.length) {
          index = 0
          onUnlock()
        }
        return
      }
      index = key === SEQUENCE[0] ? 1 : 0
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onUnlock])
}
