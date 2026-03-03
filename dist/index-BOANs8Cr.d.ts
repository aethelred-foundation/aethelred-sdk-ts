interface VerificationEnvelope {
    traceId: string;
    framework: string;
    operation: string;
    inputHash: string;
    outputHash: string;
    timestampMs: number;
    metadata: Record<string, unknown>;
}
type VerificationHook = (envelope: VerificationEnvelope) => void | Promise<void>;
interface VerificationOptions {
    onRecord?: VerificationHook;
    headerPrefix?: string;
    service?: string;
    component?: string;
}
interface NextApiRequestLike {
    method?: string;
    url?: string;
    query?: unknown;
    body?: unknown;
    headers?: Record<string, string | string[] | undefined>;
}
interface NextApiResponseLike {
    statusCode?: number;
    setHeader(name: string, value: string): unknown;
    json?: (body: unknown) => unknown;
    send?: (body: unknown) => unknown;
    end?: (chunk?: unknown) => unknown;
}
type NextApiHandlerLike<Req extends NextApiRequestLike = NextApiRequestLike, Res extends NextApiResponseLike = NextApiResponseLike> = (req: Req, res: Res) => unknown | Promise<unknown>;
declare function stableNormalize$1(value: unknown): unknown;
declare function hashPayload$1(value: unknown): string;
declare function withAethelredApiRoute<Req extends NextApiRequestLike, Res extends NextApiResponseLike>(handler: NextApiHandlerLike<Req, Res>, options?: VerificationOptions): NextApiHandlerLike<Req, Res>;
type AppRouteHandler<Ctx = unknown> = (request: Request, context: Ctx) => Response | Promise<Response>;
declare function withAethelredRouteHandler<Ctx = unknown>(handler: AppRouteHandler<Ctx>, options?: VerificationOptions): AppRouteHandler<Ctx>;
declare const __internal$1: {
    hashPayload: typeof hashPayload$1;
    stableNormalize: typeof stableNormalize$1;
};

interface NextMiddlewareRequestLike {
    method?: string;
    url?: string;
    nextUrl?: {
        href?: string;
        pathname?: string;
        search?: string;
    };
    headers?: Headers;
}
type NextMiddlewareHandler<Req extends NextMiddlewareRequestLike = NextMiddlewareRequestLike, Evt = unknown> = (request: Req, event: Evt) => Response | Promise<Response>;
interface NextMiddlewareVerificationOptions extends VerificationOptions {
    matcherId?: string;
}
declare function stableNormalize(value: unknown): unknown;
declare function hashPayload(value: unknown): string;
declare function requestMetadata(request: NextMiddlewareRequestLike): Record<string, unknown>;
declare function withAethelredMiddleware<Req extends NextMiddlewareRequestLike = NextMiddlewareRequestLike, Evt = unknown>(handler: NextMiddlewareHandler<Req, Evt>, options?: NextMiddlewareVerificationOptions): NextMiddlewareHandler<Req, Evt>;
declare const __internal: {
    hashPayload: typeof hashPayload;
    stableNormalize: typeof stableNormalize;
    requestMetadata: typeof requestMetadata;
};

export { type AppRouteHandler as A, type NextMiddlewareHandler as N, type VerificationEnvelope as V, __internal as _, withAethelredMiddleware as a, withAethelredRouteHandler as b, type NextMiddlewareRequestLike as c, type NextMiddlewareVerificationOptions as d, type NextApiHandlerLike as e, type NextApiRequestLike as f, type NextApiResponseLike as g, type VerificationHook as h, type VerificationOptions as i, __internal$1 as j, withAethelredApiRoute as w };
