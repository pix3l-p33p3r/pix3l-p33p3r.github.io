import { Children, isValidElement, type ReactNode } from "react"

export function nodeToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join("")
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return nodeToText(node.props.children)
  }
  return ""
}

/** Prefer an explicit source prop; fall back to MDX children. */
export function diagramSource(explicit: string | undefined, children?: ReactNode): string {
  const fromProp = typeof explicit === "string" ? explicit : ""
  const fromChildren = Children.toArray(children)
    .map((child) => nodeToText(child))
    .join("\n")
  return (fromProp || fromChildren).replace(/^\uFEFF/, "").trim()
}
