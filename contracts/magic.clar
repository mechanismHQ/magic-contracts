(define-map supplier-by-id uint {
  public-key: (buff 33),
  controller: principal,
  inbound-fee: (optional int),
  outbound-fee: (optional int),
  outbound-base-fee: int,
  inbound-base-fee: int,
})
(define-map supplier-by-public-key (buff 33) uint)
(define-map supplier-by-controller principal uint)

(define-map swapper-by-id uint principal)
(define-map swapper-by-principal principal uint)

;; amount of xBTC funds per supplier
;; supplier-id -> xBTC (sats)
(define-map supplier-funds uint uint)
;; amount of xBTC funds in escrow per supplier
;; supplier-id -> xBTC
(define-map supplier-escrow uint uint)

;; info for inbound swaps
(define-map inbound-swaps (buff 32) {
  swapper: uint,
  xbtc: uint,
  supplier: uint,
  expiration: uint,
  hash: (buff 32),
})
(define-map inbound-swaps-v2 (buff 32) {
  swapper: principal,
  xbtc: uint,
  supplier: uint,
  expiration: uint,
  hash: (buff 32),
})

;; extra info for inbound swaps - not needed for the `finalize` step
(define-map inbound-meta (buff 32) {
  sender-public-key: (buff 33),
  output-index: uint,
  csv: uint,
  sats: uint,
  redeem-script: (buff 148),
})
;; mapping of txid -> preimage
(define-map inbound-preimages (buff 32) (buff 128))

(define-map outbound-swaps uint {
  swapper: principal,
  sats: uint,
  xbtc: uint,
  supplier: uint,
  version: (buff 1),
  hash: (buff 20),
  created-at: uint,
})
(define-map outbound-swaps-v2 uint {
  swapper: principal,
  sats: uint,
  xbtc: uint,
  supplier: uint,
  output: (buff 128),
  created-at: uint,
})
;; mapping of swap -> txid
(define-map completed-outbound-swaps uint (buff 32))
(define-map completed-outbound-swap-txids (buff 32) uint)

;; tracking of total volume
(define-map user-inbound-volume-map principal uint)
(define-data-var total-inbound-volume-var uint u0)

(define-map user-outbound-volume-map principal uint)
(define-data-var total-outbound-volume-var uint u0)

(define-data-var next-supplier-id uint u0)
(define-data-var next-swapper-id uint u0)
(define-data-var next-outbound-id uint u0)

(define-constant MIN_EXPIRATION u250)
(define-constant ESCROW_EXPIRATION u200)
(define-constant OUTBOUND_EXPIRATION u200)
(define-constant MAX_HTLC_EXPIRATION u550)

(define-constant P2PKH_VERSION 0x00)
(define-constant P2SH_VERSION 0x05)

;; use a placeholder txid to mark as "finalized"
(define-constant REVOKED_OUTBOUND_TXID 0x00)
;; placeholder to mark inbound swap as revoked
(define-constant REVOKED_INBOUND_PREIMAGE 0x00)

(define-constant ERR_PANIC (err u1)) ;; should never be thrown
(define-constant ERR_SUPPLIER_EXISTS (err u2))
(define-constant ERR_UNAUTHORIZED (err u3))
(define-constant ERR_ADD_FUNDS (err u4))
(define-constant ERR_TRANSFER (err u5))
(define-constant ERR_SUPPLIER_NOT_FOUND (err u6))
(define-constant ERR_SWAPPER_NOT_FOUND (err u7))
(define-constant ERR_FEE_INVALID (err u8))
(define-constant ERR_SWAPPER_EXISTS (err u9))
(define-constant ERR_INVALID_TX (err u10))
(define-constant ERR_INVALID_OUTPUT (err u11))
(define-constant ERR_INVALID_HASH (err u12))
(define-constant ERR_INVALID_SUPPLIER (err u13))
(define-constant ERR_INSUFFICIENT_FUNDS (err u14))
(define-constant ERR_INVALID_EXPIRATION (err u15))
(define-constant ERR_TXID_USED (err u16))
(define-constant ERR_ALREADY_FINALIZED (err u17))
(define-constant ERR_INVALID_ESCROW (err u18))
(define-constant ERR_INVALID_PREIMAGE (err u19))
(define-constant ERR_ESCROW_EXPIRED (err u20))
(define-constant ERR_TX_NOT_MINED (err u21))
(define-constant ERR_INVALID_BTC_ADDR (err u22))
(define-constant ERR_SWAP_NOT_FOUND (err u23))
(define-constant ERR_INSUFFICIENT_AMOUNT (err u24))
(define-constant ERR_REVOKE_OUTBOUND_NOT_EXPIRED (err u25))
(define-constant ERR_REVOKE_OUTBOUND_IS_FINALIZED (err u26))
(define-constant ERR_INCONSISTENT_FEES (err u27))
(define-constant ERR_REVOKE_INBOUND_NOT_EXPIRED (err u28))
(define-constant ERR_REVOKE_INBOUND_IS_FINALIZED (err u29))


;; Register a supplier and add funds.
;; Validates that the public key and "controller" (STX address) are not
;; in use for another controller.
;;
;; @returns the newly generated supplier ID.
;; 
;; @param public-key; the public key used in HTLCs
;; @param inbound-fee; optional fee (in basis points) for inbound swaps
;; @param outbound-fee; optional fee (in basis points) for outbound
;; @param outbound-base-fee; fixed fee applied to outbound swaps (in xBTC sats)
;; @param inbound-base-fee; fixed fee for inbound swaps (in BTC/sats)
;; @param funds; amount of xBTC (sats) to initially supply
(define-public (register-supplier
    (public-key (buff 33))
    (inbound-fee (optional int))
    (outbound-fee (optional int))
    (outbound-base-fee int)
    (inbound-base-fee int)
    (funds uint)
  )
  (let
    (
      (id (var-get next-supplier-id))
      (supplier { 
        inbound-fee: inbound-fee, 
        outbound-fee: outbound-fee, 
        public-key: public-key, 
        controller: tx-sender, 
        outbound-base-fee: outbound-base-fee,
        inbound-base-fee: inbound-base-fee,
      })
    )
    (asserts! (map-insert supplier-by-id id supplier) ERR_PANIC)
    (asserts! (map-insert supplier-funds id u0) ERR_PANIC)
    (asserts! (map-insert supplier-escrow id u0) ERR_PANIC)
    (try! (validate-fee inbound-fee))
    (try! (validate-fee outbound-fee))

    ;; validate that the public key and controller do not exist
    (asserts! (map-insert supplier-by-public-key public-key id) ERR_SUPPLIER_EXISTS)
    (asserts! (map-insert supplier-by-controller tx-sender id) ERR_SUPPLIER_EXISTS)
    (var-set next-supplier-id (+ id u1))
    (try! (add-funds funds))
    (ok id)
  )
)

;; As a supplier, add funds.
;; The `supplier-id` is automatically looked up from the `contract-caller` (tx-sender).
;;
;; @returns the new amount of funds pooled for this supplier
;;
;; @param amount; the amount of funds to add (in xBTC/sats)
(define-public (add-funds (amount uint))
  (let
    (
      ;; #[filter(amount, new-funds)]
      (supplier-id (unwrap! (get-supplier-id-by-controller contract-caller) ERR_UNAUTHORIZED))
      (existing-funds (get-funds supplier-id))
      (new-funds (+ amount existing-funds))
    )
    (try! (transfer amount tx-sender (as-contract tx-sender)))
    (map-set supplier-funds supplier-id new-funds)
    (ok new-funds)
  )
)

;; As a supplier, remove funds.
;;
;; @returns the new amount of funds pooled for this supplier.
;;
;; @param amount; the amount of funds to remove (in xBTC/sats)
(define-public (remove-funds (amount uint))
  (let
    (
      (supplier-id (unwrap! (get-supplier-id-by-controller contract-caller) ERR_UNAUTHORIZED))
      (existing-funds (get-funds supplier-id))
      (amount-ok (asserts! (>= existing-funds amount) ERR_INSUFFICIENT_FUNDS))
      (new-funds (- existing-funds amount))
      (controller contract-caller)
    )
    (try! (as-contract (transfer amount tx-sender controller)))
    (map-set supplier-funds supplier-id new-funds)
    (ok new-funds)
  )
)

;; Update fees for a supplier
;;
;; @returns new metadata for supplier
;;
;; @param inbound-fee; optional fee (in basis points) for inbound swaps
;; @param outbound-fee; optional fee (in basis points) for outbound
;; @param outbound-base-fee; fixed fee applied to outbound swaps (in xBTC sats)
;; @param inbound-base-fee; fixed fee for inbound swaps (in BTC/sats)
(define-public (update-supplier-fees
    (inbound-fee (optional int))
    (outbound-fee (optional int))
    (outbound-base-fee int)
    (inbound-base-fee int)
  )
  (let
    (
      (supplier-id (unwrap! (get-supplier-id-by-controller contract-caller) ERR_UNAUTHORIZED))
      (existing-supplier (unwrap! (get-supplier supplier-id) ERR_PANIC))
      (new-supplier (merge existing-supplier {
        inbound-fee: inbound-fee, 
        outbound-fee: outbound-fee, 
        outbound-base-fee: outbound-base-fee,
        inbound-base-fee: inbound-base-fee,
      }))
    )
    (try! (validate-fee inbound-fee))
    (try! (validate-fee outbound-fee))
    (map-set supplier-by-id supplier-id new-supplier)
    (ok new-supplier)
  )
)

;; Update the public-key for a supplier
;;
;; @returns new metadata for the supplier
;;
;; @param public-key; the public key used in HTLCs
(define-public (update-supplier-public-key (public-key (buff 33)))
  (let
    (
      (supplier-id (unwrap! (get-supplier-id-by-controller contract-caller) ERR_UNAUTHORIZED))
      (existing-supplier (unwrap! (get-supplier supplier-id) ERR_PANIC))
      (new-supplier (merge existing-supplier {
        public-key: public-key,
      }))
    )
    (asserts! (map-insert supplier-by-public-key public-key supplier-id) ERR_SUPPLIER_EXISTS)
    (asserts! (map-delete supplier-by-public-key (get public-key existing-supplier)) ERR_PANIC)
    (map-set supplier-by-id supplier-id new-supplier)
    (ok new-supplier)
  )
)

;; Escrow funds for a supplier after sending BTC during an inbound swap.
;; Validates that the BTC tx is valid by re-constructing the HTLC script
;; and comparing it to the BTC tx.
;; Validates that the HTLC data (like expiration) is valid.
;; 
;; `tx-sender` must be equal to the swapper embedded in the HTLC. This ensures
;; that the `min-to-receive` parameter is provided by the end-user.
;;
;; @returns metadata regarding this inbound swap (see `inbound-meta` map)
;;
;; @param block; a tuple containing `header` (the Bitcoin block header) and the `height` (Stacks height)
;; where the BTC tx was confirmed.
;; @param prev-blocks; because Clarity contracts can't get Bitcoin headers when there is no Stacks block,
;; this param allows users to specify the chain of block headers going back to the block where the
;; BTC tx was confirmed.
;; @param tx; the hex data of the BTC tx
;; @param proof; a merkle proof to validate inclusion of this tx in the BTC block
;; @param output-index; the index of the HTLC output in the BTC tx
;; @param sender; The swapper's public key used in the HTLC
;; @param recipient; The supplier's public key used in the HTLC
;; @param expiration-buff; A 4-byte integer the indicated the expiration of the HTLC
;; @param hash; a hash of the `preimage` used in this swap
;; @param swapper-buff; a 4-byte integer that indicates the `swapper-id`
;; @param supplier-id; the supplier used in this swap
;; @param min-to-receive; minimum receivable calculated off-chain to avoid the supplier front-run the swap by adjusting fees
(define-public (escrow-swap-v2
    (block { header: (buff 80), height: uint })
    (prev-blocks (list 10 (buff 80)))
    (tx (buff 1024))
    (proof { tx-index: uint, hashes: (list 12 (buff 32)), tree-depth: uint })
    (output-index uint)
    (sender (buff 33))
    (recipient (buff 33))
    (expiration-buff (buff 4))
    (hash (buff 32))
    (swapper principal)
    (supplier-id uint)
    (min-to-receive uint)
  )
  (let
    (
      (was-mined-bool (unwrap! (contract-call? .clarity-bitcoin was-tx-mined-prev? block prev-blocks tx proof) ERR_TX_NOT_MINED))
      (was-mined (asserts! was-mined-bool ERR_TX_NOT_MINED))
      (mined-height (get height block))
      (metadata (hash-metadata swapper min-to-receive))
      (htlc-redeem (generate-htlc-script-v2 sender recipient expiration-buff hash metadata))
      (htlc-output (generate-script-hash htlc-redeem))
      (parsed-tx (unwrap! (contract-call? .clarity-bitcoin parse-tx tx) ERR_INVALID_TX))
      (output (unwrap! (element-at (get outs parsed-tx) output-index) ERR_INVALID_TX))
      (output-script (get scriptPubKey output))
      (supplier (unwrap! (map-get? supplier-by-id supplier-id) ERR_INVALID_SUPPLIER))
      (sats (get value output))
      (fee-rate (unwrap! (get inbound-fee supplier) ERR_INVALID_SUPPLIER))
      (xbtc (try! (get-swap-amount sats fee-rate (get inbound-base-fee supplier))))
      (funds (get-funds supplier-id))
      (funds-ok (asserts! (>= funds xbtc) ERR_INSUFFICIENT_FUNDS))
      (escrowed (unwrap! (map-get? supplier-escrow supplier-id) ERR_PANIC))
      (new-funds (- funds xbtc))
      (new-escrow (+ escrowed xbtc))
      (expiration (try! (read-varint expiration-buff)))
      (txid (contract-call? .clarity-bitcoin get-txid tx))
      (expiration-ok (try! (validate-expiration expiration mined-height)))
      (escrow {
        swapper: swapper,
        supplier: supplier-id,
        xbtc: xbtc,
        expiration: (+ mined-height (- expiration ESCROW_EXPIRATION)),
        hash: hash,
      })
      (meta {
        sender-public-key: sender,
        output-index: output-index,
        csv: expiration,
        redeem-script: htlc-redeem,
        sats: sats,
      })
    )
    ;; assert tx-sender is swapper
    ;; (asserts! (is-eq tx-sender (unwrap! (map-get? swapper-by-id swapper-id) ERR_SWAPPER_NOT_FOUND)) ERR_UNAUTHORIZED)
    (asserts! (is-eq (get public-key supplier) recipient) ERR_INVALID_OUTPUT)
    (asserts! (is-eq output-script htlc-output) ERR_INVALID_OUTPUT)
    (asserts! (is-eq (len hash) u32) ERR_INVALID_HASH)
    (asserts! (map-insert inbound-swaps-v2 txid escrow) ERR_TXID_USED)
    (asserts! (map-insert inbound-meta txid meta) ERR_PANIC)
    (asserts! (>= xbtc min-to-receive) ERR_INCONSISTENT_FEES)
    (map-set supplier-funds supplier-id new-funds)
    (map-set supplier-escrow supplier-id new-escrow)
    (print (merge (merge escrow meta) { 
      topic: "escrow",
      txid: txid,
    }))
    (ok meta)
  )
)

;; Finalize an inbound swap by revealing the preimage.
;; Validates that `sha256(preimage)` is equal to the `hash` provided when
;; escrowing the swap.
;;
;; @returns metadata relating to the swap (see `inbound-swaps` map)
;;
;; @param txid; the txid of the BTC tx used for this inbound swap
;; @param preimage; the preimage that hashes to the swap's `hash`
(define-public (finalize-swap-v2 (txid (buff 32)) (preimage (buff 128)))
  (match (map-get? inbound-preimages txid)
    existing ERR_ALREADY_FINALIZED
    (let
      (
        (swap (unwrap! (map-get? inbound-swaps-v2 txid) ERR_INVALID_ESCROW))
        (stored-hash (get hash swap))
        (preimage-ok (asserts! (is-eq (sha256 preimage) stored-hash) ERR_INVALID_PREIMAGE))
        (supplier-id (get supplier swap))
        (xbtc (get xbtc swap))
        (escrowed (unwrap! (map-get? supplier-escrow supplier-id) ERR_PANIC))
        (swapper (get swapper swap))
      )
      (map-insert inbound-preimages txid preimage)
      (try! (as-contract (transfer xbtc tx-sender swapper)))
      (asserts! (>= (get expiration swap) block-height) ERR_ESCROW_EXPIRED)
      (map-set supplier-escrow supplier-id (- escrowed xbtc))
      (update-user-inbound-volume swapper xbtc)
      (print (merge swap {
        preimage: preimage,
        topic: "finalize-inbound",
        txid: txid,
      }))
      (ok swap)
    )
  )
)

;; Revoke an expired inbound swap.
;; 
;; If an inbound swap has expired, and is not finalized, then the `xbtc`
;; amount of the swap is "stuck" in escrow. Calling this function will:
;; 
;; - Update the supplier's funds and escrow
;; - Mark the swap as finalized
;; 
;; To finalize the swap, the pre-image stored for the swap is the constant
;; REVOKED_INBOUND_PREIMAGE (0x00).
;; 
;; @returns the swap's metadata
;; 
;; @param txid; the txid of the BTC tx used for this inbound swap
(define-public (revoke-expired-inbound (txid (buff 32)))
  (match (map-get? inbound-preimages txid)
    existing ERR_REVOKE_INBOUND_IS_FINALIZED
    (let
      (
        (swap (unwrap! (map-get? inbound-swaps txid) ERR_INVALID_ESCROW))
        (xbtc (get xbtc swap))
        (supplier-id (get supplier swap))
        (funds (get-funds supplier-id))
        (escrowed (unwrap! (get-escrow supplier-id) ERR_PANIC))
        (new-funds (+ funds xbtc))
        (new-escrow (- escrowed xbtc))
      )
      (asserts! (<= (get expiration swap) block-height) ERR_REVOKE_INBOUND_NOT_EXPIRED)
      (map-insert inbound-preimages txid REVOKED_INBOUND_PREIMAGE)
      (map-set supplier-escrow supplier-id new-escrow)
      (map-set supplier-funds supplier-id new-funds)
      (print (merge swap {
        topic: "revoke-inbound",
        txid: txid,
      }))
      (ok swap)
    )
  )
)

;; Initiate an outbound swap.
;; Swapper provides the amount of xBTC and their withdraw address.
;;
;; @returns the auto-generated swap-id of this swap
;;
;; @param xbtc; amount of xBTC (sats) to swap
;; @param btc-version; the address version for the swapper's BTC address
;; @param btc-hash; the hash for the swapper's BTC address
;; @param supplier-id; the supplier used for this swap
(define-public (initiate-outbound-swap-v2 (xbtc uint) (output (buff 128)) (supplier-id uint))
  (let
    (
      (supplier (unwrap! (map-get? supplier-by-id supplier-id) ERR_INVALID_SUPPLIER))
      (fee-rate (unwrap! (get outbound-fee supplier) ERR_INVALID_SUPPLIER))
      (sats (try! (get-swap-amount xbtc fee-rate (get outbound-base-fee supplier))))
      (swap {
        sats: sats,
        xbtc: xbtc,
        supplier: supplier-id,
        output: output,
        created-at: burn-block-height,
        swapper: tx-sender,
      })
      (swap-id (var-get next-outbound-id))
    )
    ;; #[filter(xbtc)]
    (try! (transfer xbtc tx-sender (as-contract tx-sender)))
    (asserts! (map-insert outbound-swaps-v2 swap-id swap) ERR_PANIC)
    (var-set next-outbound-id (+ swap-id u1))
    (print (merge swap {
      swap-id: swap-id,
      topic: "initiate-outbound",
    }))
    (ok swap-id)
  )
)

;; Finalize an outbound swap.
;; This method is called by the supplier after they've sent the swapper BTC.
;;
;; @returns true
;;
;; @param block; a tuple containing `header` (the Bitcoin block header) and the `height` (Stacks height)
;; where the BTC tx was confirmed.
;; @param prev-blocks; because Clarity contracts can't get Bitcoin headers when there is no Stacks block,
;; this param allows users to specify the chain of block headers going back to the block where the
;; BTC tx was confirmed.
;; @param tx; the hex data of the BTC tx
;; @param proof; a merkle proof to validate inclusion of this tx in the BTC block
;; @param output-index; the index of the HTLC output in the BTC tx
;; @param swap-id; the outbound swap ID they're finalizing
(define-public (finalize-outbound-swap-v2
    (block { header: (buff 80), height: uint })
    (prev-blocks (list 10 (buff 80)))
    (tx (buff 1024))
    (proof { tx-index: uint, hashes: (list 12 (buff 32)), tree-depth: uint })
    (output-index uint)
    (swap-id uint)
  )
  (let
    (
      (was-mined-bool (unwrap! (contract-call? .clarity-bitcoin was-tx-mined-prev? block prev-blocks tx proof) ERR_TX_NOT_MINED))
      (was-mined (asserts! was-mined-bool ERR_TX_NOT_MINED))
      (swap (unwrap! (map-get? outbound-swaps-v2 swap-id) ERR_SWAP_NOT_FOUND))
      (parsed-tx (unwrap! (contract-call? .clarity-bitcoin parse-tx tx) ERR_INVALID_TX))
      (output (unwrap! (element-at (get outs parsed-tx) output-index) ERR_INVALID_TX))
      (output-script (get scriptPubKey output))
      (txid (contract-call? .clarity-bitcoin get-txid tx))
      (output-sats (get value output))
      (xbtc (get xbtc swap))
      (supplier (get supplier swap))
      (funds-before (get-funds supplier))
    )
    (map-set supplier-funds supplier (+ funds-before xbtc))
    (asserts! (is-eq output-script (get output swap)) ERR_INVALID_OUTPUT)
    (asserts! (map-insert completed-outbound-swaps swap-id txid) ERR_ALREADY_FINALIZED)
    (asserts! (map-insert completed-outbound-swap-txids txid swap-id) ERR_TXID_USED)
    (asserts! (>= output-sats (get sats swap)) ERR_INSUFFICIENT_AMOUNT)
    (update-user-outbound-volume (get swapper swap) xbtc)
    (print (merge swap {
      topic: "finalize-outbound",
      txid: txid,
      swap-id: swap-id,
    }))
    (ok true)
  )
)

;; Revoke an expired outbound swap.
;; After an outbound swap has expired without finalizing, a swapper may call this function
;; to receive the xBTC escrowed.
;;
;; @returns the metadata regarding the outbound swap
;;
;; @param swap-id; the ID of the outbound swap being revoked.
(define-public (revoke-expired-outbound (swap-id uint))
  (let
    (
      (swap (try! (validate-outbound-revocable swap-id)))
      (xbtc (get xbtc swap))
      (swapper (get swapper swap))
    )
    (try! (as-contract (transfer xbtc tx-sender swapper)))
    (asserts! (map-insert completed-outbound-swaps swap-id REVOKED_OUTBOUND_TXID) ERR_PANIC)
    (print (merge swap {
      topic: "revoke-outbound",
      swap-id: swap-id,
    }))
    (ok swap)
  )
)

;; getters

(define-read-only (get-supplier-id-by-controller (controller principal))
  (map-get? supplier-by-controller controller)
)

(define-read-only (get-supplier-id-by-public-key (public-key (buff 33)))
  (map-get? supplier-by-public-key public-key)
)

(define-read-only (get-supplier (id uint))
  (map-get? supplier-by-id id)
)

(define-read-only (get-funds (id uint))
  (default-to u0 (map-get? supplier-funds id))
)

(define-read-only (get-escrow (id uint))
  (map-get? supplier-escrow id)
)

(define-read-only (get-inbound-swap (txid (buff 32)))
  (map-get? inbound-swaps-v2 txid)
)

(define-read-only (get-preimage (txid (buff 32)))
  (map-get? inbound-preimages txid)
)

(define-read-only (get-outbound-swap (id uint))
  (map-get? outbound-swaps-v2 id)
)

(define-read-only (get-completed-outbound-swap-txid (id uint))
  (map-get? completed-outbound-swaps id)
)

(define-read-only (get-completed-outbound-swap-by-txid (txid (buff 32)))
  (map-get? completed-outbound-swap-txids txid)
)

(define-read-only (get-next-supplier-id) (var-get next-supplier-id))
(define-read-only (get-next-outbound-id) (var-get next-outbound-id))

(define-read-only (get-full-supplier (id uint))
  (let
    (
      (supplier (unwrap! (get-supplier id) ERR_INVALID_SUPPLIER))
      (funds (get-funds id))
      (escrow (unwrap! (get-escrow id) ERR_PANIC))
    )
    (ok (merge supplier { funds: funds, escrow: escrow }))
  )
)

(define-read-only (get-inbound-meta (txid (buff 32)))
  (map-get? inbound-meta txid)
)

(define-read-only (get-full-inbound (txid (buff 32)))
  (let
    (
      (swap (unwrap! (get-inbound-swap txid) ERR_INVALID_ESCROW))
      (meta (unwrap! (get-inbound-meta txid) ERR_INVALID_ESCROW))
    )
    (ok (merge swap meta))
  )
)

(define-read-only (get-user-inbound-volume (user principal))
  (match (map-get? user-inbound-volume-map user)
    vol vol
    u0
  )
)

(define-read-only (get-total-inbound-volume) (var-get total-inbound-volume-var))

(define-read-only (get-user-outbound-volume (user principal))
  (match (map-get? user-outbound-volume-map user)
    vol vol
    u0
  )
)

(define-read-only (get-total-outbound-volume) (var-get total-outbound-volume-var))

(define-read-only (get-user-total-volume (user principal))
  (+ (get-user-inbound-volume user) (get-user-outbound-volume user))
)

(define-read-only (get-total-volume)
  (+ (get-total-inbound-volume) (get-total-outbound-volume))
)

;; helpers

(define-private (transfer (amount uint) (sender principal) (recipient principal))
  (match (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin transfer amount sender recipient none)
    success (ok success)
    error (begin
      (print { transfer-error: error })
      ERR_TRANSFER
    )
  )
)

(define-read-only (serialize-metadata (swapper principal) (min-amount uint))
  (unwrap-panic (to-consensus-buff? {
    swapper: swapper,
    min-amount: min-amount
  }))
)

(define-read-only (hash-metadata (swapper principal) (min-amount uint))
  (sha256 (serialize-metadata swapper min-amount))
)

(define-read-only (get-swap-amount (amount uint) (fee-rate int) (base-fee int))
  (let
    (
      (with-bps-fee (get-amount-with-fee-rate amount fee-rate))
    )
    (if (>= base-fee with-bps-fee)
      ERR_INSUFFICIENT_AMOUNT
      (ok (to-uint (- with-bps-fee base-fee)))
    )
  )
)

(define-read-only (get-amount-with-fee-rate (amount uint) (fee-rate int))
  (let
    (
      (numerator (* (to-int amount) (- 10000 fee-rate)))
      (final (/ numerator 10000))
    )
    final
  )
)

(define-private (update-user-inbound-volume (user principal) (amount uint))
  (let
    (
      (user-total (get-user-inbound-volume user))
      (total (get-total-inbound-volume))
    )
    (map-set user-inbound-volume-map user (+ user-total amount))
    (var-set total-inbound-volume-var (+ total amount))
    true
  )
)

(define-private (update-user-outbound-volume (user principal) (amount uint))
  (let
    (
      (user-total (get-user-outbound-volume user))
      (total (get-total-outbound-volume))
    )
    (map-set user-outbound-volume-map user (+ user-total amount))
    (var-set total-outbound-volume-var (+ total amount))
    true
  )
)

;; validators

;; Validate the expiration for an inbound swap.
;; 
;; There are two validations used here:
;; 
;; - Expiration isn't too soon. To ensure that the swapper and supplier have sufficient
;; time to finalize, a swap must be escrowed with **at least** 250 blocks remaining.
;; - Expiration isn't too far. The HTLC must have a `CHECKSEQUENCEVERIFY` of less
;; than 550. This ensures that a supplier's xBTC isn't escrowed for unnecessarily long times.
;; 
;; @param expiration; the amount of blocks that need to pass before
;; the sender can recover their HTLC. This is the value used with `CHECKSEQUENCEVERIFY`
;; in the HTLC script.
;; @param mined-height; the nearest stacks block after (or including) the Bitcoin
;; block where the HTLC was confirmed.
(define-read-only (validate-expiration (expiration uint) (mined-height uint))
  (if (> expiration (+ (- block-height mined-height) MIN_EXPIRATION))
    (if (< expiration MAX_HTLC_EXPIRATION) (ok true) ERR_INVALID_EXPIRATION)
    ERR_INVALID_EXPIRATION
  )
)

(define-read-only (validate-fee (fee-opt (optional int)))
  (match fee-opt
    fee (let
      (
        (max-fee 10000)
        (within-upper (< fee max-fee))
        (within-lower (> fee (* -1 max-fee)))
      )
      (asserts! (and within-upper within-lower) ERR_FEE_INVALID)
      (ok true)
    )
    (ok true)
  )
)

(define-read-only (validate-btc-addr (version (buff 1)) (hash (buff 20)))
  (let
    (
      (valid-hash (is-eq (len hash) u20))
      (valid-version (or (is-eq version P2PKH_VERSION) (is-eq version P2SH_VERSION)))
    )
    (asserts! (and valid-hash valid-version) ERR_INVALID_BTC_ADDR)
    (ok true)
  )
)

;; lookup an outbound swap and validate that it is revocable.
;; to be revoked, it must be expired and not finalized
(define-read-only (validate-outbound-revocable (swap-id uint))
  (let
    (
      (swap (unwrap! (get-outbound-swap swap-id) ERR_SWAP_NOT_FOUND))
      (finalize-txid (get-completed-outbound-swap-txid swap-id))
      (swap-expiration (+ (get created-at swap) OUTBOUND_EXPIRATION))
      (is-expired (>= burn-block-height swap-expiration))
      (is-not-finalized (is-none finalize-txid))
    )
    (asserts! is-expired ERR_REVOKE_OUTBOUND_NOT_EXPIRED)
    (asserts! is-not-finalized ERR_REVOKE_OUTBOUND_IS_FINALIZED)
    (ok swap)
  )
)

;; htlc

(define-read-only (generate-htlc-script-v2
    (sender (buff 33))
    (recipient (buff 33))
    (expiration (buff 4))
    (hash (buff 32))
    (metadata (buff 32))
  )
  (concat 0x20
  (concat metadata
  (concat 0x7563a820 ;; DROP; IF; PUSH32
  (concat hash
  (concat 0x8821 ;; EQUALVERIFY; PUSH33
  (concat recipient
  (concat 0x67 ;; ELSE
  (concat (bytes-len expiration)
  (concat expiration
  (concat 0xb27521 ;; CHECKSEQUENCEVERIFY; DROP; PUSH33
  (concat sender 0x68ac) ;; ENDIF; CHECKSIG;
  ))))))))))
)

(define-read-only (generate-script-hash (script (buff 148)))
  (concat (concat 0xa914 (hash160 script)) 0x87)
)

(define-read-only (bytes-len (bytes (buff 4)))
  (unwrap-panic (element-at BUFF_TO_BYTE (len bytes)))
)

(define-constant ERR_READ_UINT (err u100))

(define-read-only (read-varint (num (buff 4)))
  (let
    (
      (length (len num))
    )
    (if (> length u1)
      (let
        (
          (first-byte (unwrap-panic (slice? num u0 u1)))
        )
        (asserts! (or 
          (and (is-eq first-byte 0xfd) (is-eq length u3))
          (and (is-eq first-byte 0xfe) (is-eq length u4))
        ) ERR_READ_UINT)
        (ok (buff-to-uint-le (unwrap-panic (slice? num u1 length))))
      )
      (ok (buff-to-uint-le num))
    )
  )
)

(define-read-only (test-serialize-uint (num uint))
  (let
    (
      (serialized (unwrap-panic (to-consensus-buff? num)))

    )
    {
      buff: serialized,
      unwrapped: (buff-to-uint-be (unwrap-panic (as-max-len?
        (unwrap-panic (slice? serialized u1 u17))
        u16
      )))
    }
  )
)


(define-constant BUFF_TO_BYTE (list 0x00 0x01 0x02 0x03 0x04))
