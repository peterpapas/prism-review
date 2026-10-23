# PR: close the order idempotency race

The first revision used a read then insert with a non-unique index. A later push adds
the database constraint and duplicate-key recovery. The draft predates that push.
