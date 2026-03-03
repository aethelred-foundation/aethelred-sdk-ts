import { A as AethelredClient, C as ComputeJob, D as DigitalSeal, V as VerifySealResponse } from '../client-BEbvK8WF.mjs';

type AsyncQueryStatus = 'idle' | 'loading' | 'success' | 'error';
interface AethelredQueryState<T> {
    status: AsyncQueryStatus;
    data: T | null;
    error: Error | null;
    loading: boolean;
    refresh: () => Promise<void>;
}
interface AethelredQueryOptions {
    enabled?: boolean;
    pollIntervalMs?: number;
    immediate?: boolean;
}
declare function useAethelredQuery<T>(fetcher: (() => Promise<T>) | undefined, deps: ReadonlyArray<unknown>, options?: AethelredQueryOptions): AethelredQueryState<T>;
declare function useSeal(client: AethelredClient | null | undefined, sealId: string | null | undefined, options?: AethelredQueryOptions): AethelredQueryState<DigitalSeal>;
declare function useSealVerification(client: AethelredClient | null | undefined, sealId: string | null | undefined, options?: AethelredQueryOptions): AethelredQueryState<VerifySealResponse>;
interface UseJobOptions extends AethelredQueryOptions {
    stopOnTerminal?: boolean;
}
declare function useJob(client: AethelredClient | null | undefined, jobId: string | null | undefined, options?: UseJobOptions): AethelredQueryState<ComputeJob>;

export { type AethelredQueryOptions, type AethelredQueryState, type AsyncQueryStatus, type UseJobOptions, useAethelredQuery, useJob, useSeal, useSealVerification };
