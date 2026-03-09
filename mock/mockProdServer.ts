// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Mock from 'mockjs'
import mockModules from './index'

export function setupProdMockServer() {
  for (const item of mockModules) {
    const { url, method = 'get', response } = item

    Mock.mock(new RegExp(url), method.toLowerCase(), (options) => {
      let body = options.body
      try {
        body = JSON.parse(body)
      } catch {
        // ignore
      }
      if (typeof response === 'function') {
        return response({
          method: options.type,
          body,
          query: paramToObj(options.url),
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
