// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import mockModules from './index'

/**
 * 将现有 mock handler（vite-plugin-mock 格式）适配为 msw handler。
 * 现有 mock 文件无需任何改动。
 */
function adaptHandlers() {
  return mockModules.map((item) => {
    const { url, method = 'get', response: handler } = item
    const methodLower = method.toLowerCase() as keyof typeof http

    const mswMethod = http[methodLower]
    if (!mswMethod) return null

    return (mswMethod as typeof http.get)(url, async ({ request, params }) => {
      let body: unknown = null
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        try {
          body = await request.json()
        } catch {
          // no body or not JSON
        }
      }

      const headers: Record<string, string> = {}
      request.headers.forEach((value, key) => {
        headers[key] = value
      })

      const query: Record<string, string> = { ...params } as Record<string, string>
      const reqUrl = new URL(request.url)
      reqUrl.searchParams.forEach((value, key) => {
        query[key] = value
      })

      if (typeof handler === 'function') {
        const result = handler({ method: request.method, body, query, headers })
        return HttpResponse.json(result)
      }
      return HttpResponse.json(handler)
    })
  }).filter(Boolean)
}

export async function setupProdMockServer() {
  const handlers = adaptHandlers() as ReturnType<typeof http.get>[]
  const worker = setupWorker(...handlers)
  const base = import.meta.env.BASE_URL ?? '/'
  const swUrl = base.replace(/\/$/, '') + '/mockServiceWorker.js'
  const startOptions = {
    serviceWorker: { url: swUrl },
    quiet: true,
  }

  await worker.start(startOptions)

  const sendKeepAlive = () => {
    const controller = navigator.serviceWorker?.controller
    if (controller) {
      controller.postMessage('KEEPALIVE_REQUEST')
      return
    }

    worker.start(startOptions).catch(() => {})
  }

  let isReloading = false
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (!isReloading) {
      isReloading = true
      window.location.reload()
    }
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      sendKeepAlive()
    }
  })

  window.addEventListener('focus', sendKeepAlive)
  window.addEventListener('pageshow', sendKeepAlive)
  window.addEventListener('online', sendKeepAlive)
  window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      sendKeepAlive()
    }
  }, 30_000)
}
