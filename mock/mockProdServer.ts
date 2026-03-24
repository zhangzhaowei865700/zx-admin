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

      // 收集 headers 为普通对象，与现有 mock handler 的接口一致
      const headers: Record<string, string> = {}
      request.headers.forEach((value, key) => {
        headers[key] = value
      })

      // URL query params
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
  // 兼容子路径部署（如 GitHub Pages /ZX-Admin/），动态拼接 serviceWorker 路径
  const base = import.meta.env.BASE_URL ?? '/'
  const swUrl = base.replace(/\/$/, '') + '/mockServiceWorker.js'
  const startOptions = {
    serviceWorker: { url: swUrl },
    // 导航请求（页面跳转）直接跳过，避免 service worker 内部 fetch navigate 模式报错
    onUnhandledRequest(request: Request) {
      if (request.mode === 'navigate') return
    },
    quiet: true,
  }
  await worker.start(startOptions)

  // 新部署后浏览器安装新 SW 并接管页面时，重新激活 mock handlers
  // 否则新 SW 接管后没有 handlers，请求会穿透到真实服务器
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    worker.start(startOptions)
  })
}
