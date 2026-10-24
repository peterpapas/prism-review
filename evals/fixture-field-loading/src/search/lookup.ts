export interface SearchState { loading: boolean; results: string[]; error: string | null }

export async function lookup(run: () => Promise<string[]>, state: SearchState) {
  state.loading = true;
  try {
    state.results = await run();
    state.error = null;
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'Search failed';
    state.results = [];
  } finally {
    state.loading = false;
  }
}
