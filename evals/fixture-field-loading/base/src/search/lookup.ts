export interface SearchState { loading: boolean; results: string[]; error: string | null }

export async function lookup(run: () => Promise<string[]>, state: SearchState) {
  state.loading = true;
  try {
    state.results = await run();
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'Search failed';
  } finally {
    state.loading = false;
  }
}
