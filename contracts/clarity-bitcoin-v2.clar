;; Reads the next varint from txbuff, and updates the index.
;; Returns (ok { varint: uint, ctx: { txbuff: (buff 1024), index: uint } }) on success
;; Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff.
(define-read-only (read-varint (ctx { txbuff: (buff 1024), index: uint }))
  (let
    (
      (ptr (get index ctx))
      (tx (get txbuff ctx))
    )
    (ok true)
  )
)

