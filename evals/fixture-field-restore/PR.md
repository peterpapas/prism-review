# PR: restore a batch of markers conditionally

The caller wraps `restore` in one database transaction. The earlier version
issued independent updates. The new version sorts marker IDs, checks the
expected state for each write, and aborts on the first conflict so the caller
can roll back. Consider that contract when evaluating a speed suggestion.
