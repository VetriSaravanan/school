import server from '../dist/server/server.js'

export default async function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers.host
  const url = proto + '://' + host + req.url

  const chunks = []
  for await (const chunk of req) chunks.push(Buffer.from(chunk))
  const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined

  const webReq = new Request(url, {
    method: req.method,
    headers: Object.fromEntries(Object.entries(req.headers).filter(([,v])=>v!=null)),
    body: ['GET','HEAD'].includes(req.method) ? undefined : body
  })

  const webRes = await server.fetch(webReq)
  res.status(webRes.status)
  webRes.headers.forEach((val,key)=>res.setHeader(key,val))
  const buf = await webRes.arrayBuffer()
  res.end(Buffer.from(buf))
}