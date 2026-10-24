# PR: support section tracking without IntersectionObserver

The existing observer branch now sits next to a scroll-listener fallback.
Both branches return cleanup functions; the caller invokes the returned
function when the component stops tracking.
