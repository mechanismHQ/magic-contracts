;; (define-public (mined-txs))
(define-map mined-txs (buff 32) bool)

;; #[allow(unchecked_data)]
(define-public (set-mined (txid (buff 32)))
  (ok (map-set mined-txs txid true))
)

;; #[allow(unchecked_data)]
(define-public (set-not-mined (txid (buff 32)))
  (ok (map-set mined-txs txid false))
)

(define-read-only (was-mined (txid (buff 32)))
  (map-get? mined-txs txid)
)

(define-map burn-block-headers uint (buff 80))

;; #[allow(unchecked_data)]
(define-public (set-burn-header (height uint) (header (buff 80)))
  (ok (map-set burn-block-headers height header))
)

(define-read-only (burn-block-header (height uint))
  (map-get? burn-block-headers height)
)