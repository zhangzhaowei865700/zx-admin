// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Mock from 'mockjs'
import mockModules from './index'

/**
 * Convert Express-style path pattern to RegExp and extract param names.
 * e.g. '/api/product/:id/specs' → { regex: /\/api\/product\/([^/]+)\/specs(\?.*)?$/, paramNames: ['id'] }
 */
function pathToRegex(url: string) {
  const paramNames: string[] = []
  const regexStr = url.replace(/:([^/]+)/g, (_, name) => {
    paramNames.push(name)
    return '([^/]+)'
  })
  return { regex: new RegExp(regexStr + '(\\?.*)?$'), paramNames }
}

/**
 * Extract path params from a URL using the original pattern.
 */
function extractPathParams(url: string, pattern: RegExp, paramNames: string[]) {
  const pathname = url.split('?')[0]
  const match = pathname.match(pattern)
  if (!match) return {}
  const params: Record<string, string> = {}
  paramNames.forEach((name, i) => {
    params[name] = match[i + 1]
  })
  return params
}

export function setupProdMockServer() {
  for (const item of mockModules) {
    const { url, method = 'get', response } = item
    const { regex, paramNames } = pathToRegex(url)

    Mock.mock(regex, method.toLowerCase(), (options) => {
      let body = options.body
      try {
        body = JSON.parse(body)
      } catch {
        // ignore
      }
      const query = {
        ...extractPathParams(options.url, regex, paramNames),
        ...paramToObj(options.url),
      }
      if (typeof response === 'function') {
        return response({
          method: options.type,
          body,
          query,
          headers: {},
        })
      }
      return response
    })
  }
}

function paramToObj(url: string) {
  const search = url.split('?')[1]
  if (!search) return {}
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
