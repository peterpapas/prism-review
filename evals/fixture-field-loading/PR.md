# PR: refresh search results and errors

The change clears stale results on failure and clears stale errors on success.
The request and its loading cleanup existed before this change. Check both
outcomes before accepting a draft about a stuck loading indicator.
