window.pixelUmamiBeforeSend = function pixelUmamiBeforeSend(type, payload) {
  try {
    if (!payload || !payload.url) return payload
    var raw = String(payload.url)
    var path =
      raw.charAt(0) === "/"
        ? raw.split("?")[0].split("#")[0]
        : new URL(raw, location.origin).pathname
    if (path === "/admin" || path.indexOf("/admin/") === 0) return false
    return payload
  } catch (error) {
    return payload
  }
}
