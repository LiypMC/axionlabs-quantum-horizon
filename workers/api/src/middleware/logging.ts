export function loggingMiddleware() {
  return async (request: Request, env: any, ctx: ExecutionContext, next: () => Promise<Response>) => {
    const start = Date.now();
    const url = new URL(request.url);
    
    console.log(`[${new Date().toISOString()}] ${request.method} ${url.pathname}`);
    
    const response = await next();
    
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${request.method} ${url.pathname} - ${response.status} (${duration}ms)`);
    
    return response;
  };
}