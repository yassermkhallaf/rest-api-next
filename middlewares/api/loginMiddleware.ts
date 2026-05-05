export function loginMiddleware(req: Request) {
    return { respons: `${req.method} ${req.url}` }
}