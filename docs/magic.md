# magic

[`magic.clar`](../contracts/magic.clar)

**Public functions:**

- [`register-supplier`](#register-supplier)
- [`add-funds`](#add-funds)
- [`remove-funds`](#remove-funds)
- [`update-supplier-fees`](#update-supplier-fees)
- [`update-supplier-public-key`](#update-supplier-public-key)
- [`escrow-swap`](#escrow-swap)
- [`finalize-swap`](#finalize-swap)
- [`revoke-expired-inbound`](#revoke-expired-inbound)
- [`initiate-outbound-swap`](#initiate-outbound-swap)
- [`finalize-outbound-swap`](#finalize-outbound-swap)
- [`revoke-expired-outbound`](#revoke-expired-outbound)

**Read-only functions:**

- [`get-supplier-id-by-controller`](#get-supplier-id-by-controller)
- [`get-supplier-id-by-public-key`](#get-supplier-id-by-public-key)
- [`get-supplier`](#get-supplier)
- [`get-funds`](#get-funds)
- [`get-escrow`](#get-escrow)
- [`get-inbound-swap`](#get-inbound-swap)
- [`get-preimage`](#get-preimage)
- [`get-outbound-swap`](#get-outbound-swap)
- [`get-completed-outbound-swap-txid`](#get-completed-outbound-swap-txid)
- [`get-completed-outbound-swap-by-txid`](#get-completed-outbound-swap-by-txid)
- [`get-next-supplier-id`](#get-next-supplier-id)
- [`get-next-outbound-id`](#get-next-outbound-id)
- [`get-full-supplier`](#get-full-supplier)
- [`get-inbound-meta`](#get-inbound-meta)
- [`get-full-inbound`](#get-full-inbound)
- [`get-user-inbound-volume`](#get-user-inbound-volume)
- [`get-total-inbound-volume`](#get-total-inbound-volume)
- [`get-user-outbound-volume`](#get-user-outbound-volume)
- [`get-total-outbound-volume`](#get-total-outbound-volume)
- [`get-user-total-volume`](#get-user-total-volume)
- [`get-total-volume`](#get-total-volume)
- [`serialize-metadata`](#serialize-metadata)
- [`hash-metadata`](#hash-metadata)
- [`get-swap-amount`](#get-swap-amount)
- [`get-amount-with-fee-rate`](#get-amount-with-fee-rate)
- [`validate-expiration`](#validate-expiration)
- [`validate-fee`](#validate-fee)
- [`validate-outbound-revocable`](#validate-outbound-revocable)
- [`generate-htlc-script`](#generate-htlc-script)
- [`generate-wsh-output`](#generate-wsh-output)
- [`bytes-len`](#bytes-len)
- [`read-varint`](#read-varint)

**Private functions:**

- [`transfer`](#transfer)
- [`update-user-inbound-volume`](#update-user-inbound-volume)
- [`update-user-outbound-volume`](#update-user-outbound-volume)

**Maps**

- [`supplier-by-id`](#supplier-by-id)
- [`supplier-by-public-key`](#supplier-by-public-key)
- [`supplier-by-controller`](#supplier-by-controller)
- [`swapper-by-id`](#swapper-by-id)
- [`swapper-by-principal`](#swapper-by-principal)
- [`supplier-funds`](#supplier-funds)
- [`supplier-escrow`](#supplier-escrow)
- [`inbound-swaps`](#inbound-swaps)
- [`inbound-meta`](#inbound-meta)
- [`inbound-preimages`](#inbound-preimages)
- [`outbound-swaps`](#outbound-swaps)
- [`completed-outbound-swaps`](#completed-outbound-swaps)
- [`completed-outbound-swap-txids`](#completed-outbound-swap-txids)
- [`user-inbound-volume-map`](#user-inbound-volume-map)
- [`user-outbound-volume-map`](#user-outbound-volume-map)

**Variables**

- [`total-inbound-volume-var`](#total-inbound-volume-var)
- [`total-outbound-volume-var`](#total-outbound-volume-var)
- [`next-supplier-id`](#next-supplier-id)
- [`next-swapper-id`](#next-swapper-id)
- [`next-outbound-id`](#next-outbound-id)

**Constants**

- [`MIN_EXPIRATION`](#MIN_EXPIRATION)
- [`ESCROW_EXPIRATION`](#ESCROW_EXPIRATION)
- [`OUTBOUND_EXPIRATION`](#OUTBOUND_EXPIRATION)
- [`MAX_HTLC_EXPIRATION`](#MAX_HTLC_EXPIRATION)
- [`P2PKH_VERSION`](#P2PKH_VERSION)
- [`P2SH_VERSION`](#P2SH_VERSION)
- [`REVOKED_OUTBOUND_TXID`](#REVOKED_OUTBOUND_TXID)
- [`REVOKED_INBOUND_PREIMAGE`](#REVOKED_INBOUND_PREIMAGE)
- [`ERR_SUPPLIER_EXISTS`](#ERR_SUPPLIER_EXISTS)
- [`ERR_UNAUTHORIZED`](#ERR_UNAUTHORIZED)
- [`ERR_ADD_FUNDS`](#ERR_ADD_FUNDS)
- [`ERR_TRANSFER`](#ERR_TRANSFER)
- [`ERR_SUPPLIER_NOT_FOUND`](#ERR_SUPPLIER_NOT_FOUND)
- [`ERR_SWAPPER_NOT_FOUND`](#ERR_SWAPPER_NOT_FOUND)
- [`ERR_FEE_INVALID`](#ERR_FEE_INVALID)
- [`ERR_SWAPPER_EXISTS`](#ERR_SWAPPER_EXISTS)
- [`ERR_INVALID_TX`](#ERR_INVALID_TX)
- [`ERR_INVALID_OUTPUT`](#ERR_INVALID_OUTPUT)
- [`ERR_INVALID_HASH`](#ERR_INVALID_HASH)
- [`ERR_INVALID_SUPPLIER`](#ERR_INVALID_SUPPLIER)
- [`ERR_INSUFFICIENT_FUNDS`](#ERR_INSUFFICIENT_FUNDS)
- [`ERR_INVALID_EXPIRATION`](#ERR_INVALID_EXPIRATION)
- [`ERR_TXID_USED`](#ERR_TXID_USED)
- [`ERR_ALREADY_FINALIZED`](#ERR_ALREADY_FINALIZED)
- [`ERR_INVALID_ESCROW`](#ERR_INVALID_ESCROW)
- [`ERR_INVALID_PREIMAGE`](#ERR_INVALID_PREIMAGE)
- [`ERR_ESCROW_EXPIRED`](#ERR_ESCROW_EXPIRED)
- [`ERR_TX_NOT_MINED`](#ERR_TX_NOT_MINED)
- [`ERR_INVALID_BTC_ADDR`](#ERR_INVALID_BTC_ADDR)
- [`ERR_SWAP_NOT_FOUND`](#ERR_SWAP_NOT_FOUND)
- [`ERR_INSUFFICIENT_AMOUNT`](#ERR_INSUFFICIENT_AMOUNT)
- [`ERR_REVOKE_OUTBOUND_NOT_EXPIRED`](#ERR_REVOKE_OUTBOUND_NOT_EXPIRED)
- [`ERR_REVOKE_OUTBOUND_IS_FINALIZED`](#ERR_REVOKE_OUTBOUND_IS_FINALIZED)
- [`ERR_INCONSISTENT_FEES`](#ERR_INCONSISTENT_FEES)
- [`ERR_REVOKE_INBOUND_NOT_EXPIRED`](#ERR_REVOKE_INBOUND_NOT_EXPIRED)
- [`ERR_REVOKE_INBOUND_IS_FINALIZED`](#ERR_REVOKE_INBOUND_IS_FINALIZED)
- [`ERR_READ_UINT`](#ERR_READ_UINT)
- [`BUFF_TO_BYTE`](#BUFF_TO_BYTE)

## Functions

### register-supplier

[View in file](../contracts/magic.clar#L119)

`(define-public (register-supplier ((public-key (buff 33)) (inbound-fee (optional int)) (outbound-fee (optional int)) (outbound-base-fee int) (inbound-base-fee int) (funds uint)) (response uint uint))`

Register a supplier and add funds. Validates that the public key and
"controller" (STX address) are not in use for another controller.

@returns the newly generated supplier ID.

<details>
  <summary>Source code:</summary>

```clarity
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
    (map-insert supplier-by-id id supplier)
    (map-insert supplier-funds id u0)
    (map-insert supplier-escrow id u0)
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
```

</details>

**Parameters:**

| Name              | Type           | Description                                        |
| ----------------- | -------------- | -------------------------------------------------- |
| public-key        | (buff 33)      | the public key used in HTLCs                       |
| inbound-fee       | (optional int) | optional fee (in basis points) for inbound swaps   |
| outbound-fee      | (optional int) | optional fee (in basis points) for outbound        |
| outbound-base-fee | int            | fixed fee applied to outbound swaps (in xBTC sats) |
| inbound-base-fee  | int            | fixed fee for inbound swaps (in BTC/sats)          |
| funds             | uint           | amount of xBTC (sats) to initially supply          |

### add-funds

[View in file](../contracts/magic.clar#L160)

`(define-public (add-funds ((amount uint)) (response uint uint))`

As a supplier, add funds. The `supplier-id` is automatically looked up from the
`contract-caller` (tx-sender).

@returns the new amount of funds pooled for this supplier

<details>
  <summary>Source code:</summary>

```clarity
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
```

</details>

**Parameters:**

| Name   | Type | Description                               |
| ------ | ---- | ----------------------------------------- |
| amount | uint | the amount of funds to add (in xBTC/sats) |

### remove-funds

[View in file](../contracts/magic.clar#L179)

`(define-public (remove-funds ((amount uint)) (response uint uint))`

As a supplier, remove funds.

@returns the new amount of funds pooled for this supplier.

<details>
  <summary>Source code:</summary>

```clarity
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
```

</details>

**Parameters:**

| Name   | Type | Description                                  |
| ------ | ---- | -------------------------------------------- |
| amount | uint | the amount of funds to remove (in xBTC/sats) |

### update-supplier-fees

[View in file](../contracts/magic.clar#L202)

`(define-public (update-supplier-fees ((inbound-fee (optional int)) (outbound-fee (optional int)) (outbound-base-fee int) (inbound-base-fee int)) (response (tuple (controller principal) (inbound-base-fee int) (inbound-fee (optional int)) (outbound-base-fee int) (outbound-fee (optional int)) (public-key (buff 33))) uint))`

Update fees for a supplier

@returns new metadata for supplier

<details>
  <summary>Source code:</summary>

```clarity
(define-public (update-supplier-fees
    (inbound-fee (optional int))
    (outbound-fee (optional int))
    (outbound-base-fee int)
    (inbound-base-fee int)
  )
  (let
    (
      (supplier-id (unwrap! (get-supplier-id-by-controller contract-caller) ERR_UNAUTHORIZED))
      (existing-supplier (unwrap-panic (get-supplier supplier-id)))
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
```

</details>

**Parameters:**

| Name              | Type           | Description                                        |
| ----------------- | -------------- | -------------------------------------------------- |
| inbound-fee       | (optional int) | optional fee (in basis points) for inbound swaps   |
| outbound-fee      | (optional int) | optional fee (in basis points) for outbound        |
| outbound-base-fee | int            | fixed fee applied to outbound swaps (in xBTC sats) |
| inbound-base-fee  | int            | fixed fee for inbound swaps (in BTC/sats)          |

### update-supplier-public-key

[View in file](../contracts/magic.clar#L231)

`(define-public (update-supplier-public-key ((public-key (buff 33))) (response (tuple (controller principal) (inbound-base-fee int) (inbound-fee (optional int)) (outbound-base-fee int) (outbound-fee (optional int)) (public-key (buff 33))) uint))`

Update the public-key for a supplier

@returns new metadata for the supplier

<details>
  <summary>Source code:</summary>

```clarity
(define-public (update-supplier-public-key (public-key (buff 33)))
  (let
    (
      (supplier-id (unwrap! (get-supplier-id-by-controller contract-caller) ERR_UNAUTHORIZED))
      (existing-supplier (unwrap-panic (get-supplier supplier-id)))
      (new-supplier (merge existing-supplier {
        public-key: public-key,
      }))
    )
    (asserts! (map-insert supplier-by-public-key public-key supplier-id) ERR_SUPPLIER_EXISTS)
    (map-delete supplier-by-public-key (get public-key existing-supplier))
    (map-set supplier-by-id supplier-id new-supplier)
    (ok new-supplier)
  )
)
```

</details>

**Parameters:**

| Name       | Type      | Description                  |
| ---------- | --------- | ---------------------------- |
| public-key | (buff 33) | the public key used in HTLCs |

### escrow-swap

[View in file](../contracts/magic.clar#L276)

`(define-public (escrow-swap ((block (tuple (header (buff 80)) (height uint))) (prev-blocks (list 10 (buff 80))) (tx (buff 1024)) (proof (tuple (hashes (list 12 (buff 32))) (tree-depth uint) (tx-index uint))) (output-index uint) (sender (buff 33)) (recipient (buff 33)) (expiration-buff (buff 4)) (hash (buff 32)) (swapper principal) (supplier-id uint) (max-base-fee int) (max-fee-rate int)) (response (tuple (csv uint) (output-index uint) (redeem-script (buff 148)) (sats uint) (sender-public-key (buff 33))) uint))`

Reserve the funds from a supplier's account after the Bitcoin transaction is
sent during an inbound swap. The function validates the Bitcoin transaction by
reconstructing the HTLC script and comparing it to the Bitcoin transaction. It
also ensures that the HTLC parameters (like expiration) are valid. The
`tx-sender` must be the same as the `swapper` embedded in the HTLC, ensuring
that the `min-to-receive` parameter is provided by the end-user.

@returns metadata regarding the escrowed swap (refer to `inbound-meta` map for
fields)

@throws ERR_TX_NOT_MINED if the transaction was not mined. @throws
ERR_INVALID_TX if the transaction is invalid. @throws ERR_INVALID_SUPPLIER if
the supplier is invalid. @throws ERR_INSUFFICIENT_FUNDS if there are not enough
funds for the swap. @throws ERR_INVALID_OUTPUT if the output script does not
match the HTLC script or if the supplier's public key does not match the
recipient. @throws ERR_INVALID_HASH if the hash length is not 32 bytes. @throws
ERR_TXID_USED if the transaction id has already been used. @throws
ERR_INCONSISTENT_FEES if the base fee or the fee rate are greater than the
maximum allowed values.

<details>
  <summary>Source code:</summary>

```clarity
(define-public (escrow-swap
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
    (max-base-fee int)
    (max-fee-rate int)
  )
  (let
    (
      (was-mined-bool (unwrap! (contract-call? .clarity-bitcoin was-tx-mined-prev? block prev-blocks tx proof) ERR_TX_NOT_MINED))
      (was-mined (asserts! was-mined-bool ERR_TX_NOT_MINED))
      (mined-height (get height block))
      (metadata (hash-metadata swapper max-base-fee max-fee-rate))
      (htlc-redeem (generate-htlc-script sender recipient expiration-buff hash metadata))
      (htlc-output (generate-wsh-output htlc-redeem))
      (parsed-tx (unwrap! (contract-call? .clarity-bitcoin parse-tx tx) ERR_INVALID_TX))
      (output (unwrap! (element-at (get outs parsed-tx) output-index) ERR_INVALID_TX))
      (output-script (get scriptPubKey output))
      (supplier (unwrap! (map-get? supplier-by-id supplier-id) ERR_INVALID_SUPPLIER))
      (sats (get value output))
      (fee-rate (unwrap! (get inbound-fee supplier) ERR_INVALID_SUPPLIER))
      (base-fee (get inbound-base-fee supplier))
      (xbtc (try! (get-swap-amount sats fee-rate base-fee)))
      (funds (get-funds supplier-id))
      (funds-ok (asserts! (>= funds xbtc) ERR_INSUFFICIENT_FUNDS))
      (escrowed (unwrap-panic (map-get? supplier-escrow supplier-id)))
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
    (asserts! (is-eq (get public-key supplier) recipient) ERR_INVALID_OUTPUT)
    ;; #[filter(output-index)]
    (asserts! (is-eq output-script htlc-output) ERR_INVALID_OUTPUT)
    (asserts! (is-eq (len hash) u32) ERR_INVALID_HASH)
    (asserts! (map-insert inbound-swaps txid escrow) ERR_TXID_USED)
    (map-insert inbound-meta txid meta)
    (asserts! (<= base-fee max-base-fee) ERR_INCONSISTENT_FEES)
    (asserts! (<= fee-rate max-fee-rate) ERR_INCONSISTENT_FEES)
    (map-set supplier-funds supplier-id new-funds)
    (map-set supplier-escrow supplier-id new-escrow)
    (print (merge (merge escrow meta) { 
      topic: "escrow",
      txid: txid,
    }))
    (ok meta)
  )
)
```

</details>

**Parameters:**

| Name            | Type                                                                   | Description                                                                                                                                                                                                                                |
| --------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| block           | (tuple (header (buff 80)) (height uint))                               | a tuple containing the `header` (Bitcoin block header) and `height` (Stacks block height) where the Bitcoin transaction was confirmed.                                                                                                     |
| prev-blocks     | (list 10 (buff 80))                                                    | due to the fact that Clarity contracts cannot access Bitcoin headers when there is no Stacks block, this parameter allows users to specify the chain of block headers going back to the block where the Bitcoin transaction was confirmed. |
| tx              | (buff 1024)                                                            | the hex data of the Bitcoin transaction.                                                                                                                                                                                                   |
| proof           | (tuple (hashes (list 12 (buff 32))) (tree-depth uint) (tx-index uint)) | a merkle proof to validate the inclusion of this transaction in the Bitcoin block.                                                                                                                                                         |
| output-index    | uint                                                                   | the index of the HTLC output in the Bitcoin transaction.                                                                                                                                                                                   |
| sender          | (buff 33)                                                              | the swapper's public key used in the HTLC.                                                                                                                                                                                                 |
| recipient       | (buff 33)                                                              | the supplier's public key used in the HTLC.                                                                                                                                                                                                |
| expiration-buff | (buff 4)                                                               | a 4-byte buffer indicating the HTLC expiration.                                                                                                                                                                                            |
| hash            | (buff 32)                                                              | the hash of the `preimage` used in this swap.                                                                                                                                                                                              |
| swapper         | principal                                                              | the Stacks address receiving xBTC from this swap.                                                                                                                                                                                          |
| supplier-id     | uint                                                                   | the ID of the supplier used in this swap.                                                                                                                                                                                                  |
| max-base-fee    | int                                                                    | the maximum base fee that the supplier can charge.                                                                                                                                                                                         |
| max-fee-rate    | int                                                                    | the maximum fee rate that the supplier can charge.                                                                                                                                                                                         |

### finalize-swap

[View in file](../contracts/magic.clar#L362)

`(define-public (finalize-swap ((txid (buff 32)) (preimage (buff 128))) (response (tuple (expiration uint) (hash (buff 32)) (supplier uint) (swapper principal) (xbtc uint)) uint))`

Conclude an inbound swap by revealing the preimage. The function validates that
`sha256(preimage)` is equivalent to the `hash` given when the swap was escrowed.

This function updates the supplier escrow and the user inbound volume. If
successful, the funds are transferred from the contract to the swapper.

@returns metadata associated with the swap (refer to `inbound-swaps` map for
fields)

@throws ERR_ALREADY_FINALIZED if the preimage already exists for the provided
transaction id. @throws ERR_INVALID_ESCROW if there is no swap associated with
the provided transaction id. @throws ERR_INVALID_PREIMAGE if the hash of the
preimage does not match the stored hash. @throws ERR_ESCROW_EXPIRED if the block
height has exceeded the swap's expiration height.

<details>
  <summary>Source code:</summary>

```clarity
(define-public (finalize-swap (txid (buff 32)) (preimage (buff 128)))
  (match (map-get? inbound-preimages txid)
    existing ERR_ALREADY_FINALIZED
    (let
      (
        (swap (unwrap! (map-get? inbound-swaps txid) ERR_INVALID_ESCROW))
        (stored-hash (get hash swap))
        (preimage-ok (asserts! (is-eq (sha256 preimage) stored-hash) ERR_INVALID_PREIMAGE))
        (supplier-id (get supplier swap))
        (xbtc (get xbtc swap))
        (escrowed (unwrap-panic (map-get? supplier-escrow supplier-id)))
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
```

</details>

**Parameters:**

| Name     | Type       | Description                                                                   |
| -------- | ---------- | ----------------------------------------------------------------------------- |
| txid     | (buff 32)  | the transaction ID of the Bitcoin transaction utilized for this inbound swap. |
| preimage | (buff 128) | the preimage that when hashed, results in the swap's `hash`.                  |

### revoke-expired-inbound

[View in file](../contracts/magic.clar#L404)

`(define-public (revoke-expired-inbound ((txid (buff 32))) (response (tuple (expiration uint) (hash (buff 32)) (supplier uint) (swapper principal) (xbtc uint)) uint))`

Revoke an expired inbound swap.

If an inbound swap has expired, and is not finalized, then the `xbtc` amount of
the swap is "stuck" in escrow. Calling this function will:

- Update the supplier's funds and escrow
- Mark the swap as finalized

To finalize the swap, the pre-image stored for the swap is the constant
REVOKED_INBOUND_PREIMAGE (0x00).

@returns the swap's metadata

<details>
  <summary>Source code:</summary>

```clarity
(define-public (revoke-expired-inbound (txid (buff 32)))
  (match (map-get? inbound-preimages txid)
    existing ERR_REVOKE_INBOUND_IS_FINALIZED
    (let
      (
        (swap (unwrap! (map-get? inbound-swaps txid) ERR_INVALID_ESCROW))
        (xbtc (get xbtc swap))
        (supplier-id (get supplier swap))
        (funds (get-funds supplier-id))
        (escrowed (unwrap-panic (get-escrow supplier-id)))
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
```

</details>

**Parameters:**

| Name | Type      | Description                                       |
| ---- | --------- | ------------------------------------------------- |
| txid | (buff 32) | the txid of the BTC tx used for this inbound swap |

### initiate-outbound-swap

[View in file](../contracts/magic.clar#L438)

`(define-public (initiate-outbound-swap ((xbtc uint) (output (buff 128)) (supplier-id uint)) (response uint uint))`

Initiate an outbound swap. Swapper provides the amount of xBTC and their
withdraw address.

@returns the auto-generated swap-id of this swap

<details>
  <summary>Source code:</summary>

```clarity
(define-public (initiate-outbound-swap (xbtc uint) (output (buff 128)) (supplier-id uint))
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
    (map-insert outbound-swaps swap-id swap)
    (var-set next-outbound-id (+ swap-id u1))
    (print (merge swap {
      swap-id: swap-id,
      topic: "initiate-outbound",
    }))
    (ok swap-id)
  )
)
```

</details>

**Parameters:**

| Name        | Type       | Description                                     |
| ----------- | ---------- | ----------------------------------------------- |
| xbtc        | uint       | amount of xBTC (sats) to swap                   |
| output      | (buff 128) | the output script for the swapper's BTC address |
| supplier-id | uint       | the supplier used for this swap                 |

### finalize-outbound-swap

[View in file](../contracts/magic.clar#L480)

`(define-public (finalize-outbound-swap ((block (tuple (header (buff 80)) (height uint))) (prev-blocks (list 10 (buff 80))) (tx (buff 1024)) (proof (tuple (hashes (list 12 (buff 32))) (tree-depth uint) (tx-index uint))) (output-index uint) (swap-id uint)) (response bool uint))`

Finalize an outbound swap. This method is called by the supplier after they've
sent the swapper BTC.

@returns true

<details>
  <summary>Source code:</summary>

```clarity
(define-public (finalize-outbound-swap
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
      (swap (unwrap! (map-get? outbound-swaps swap-id) ERR_SWAP_NOT_FOUND))
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
```

</details>

**Parameters:**

| Name         | Type                                                                   | Description                                                                                                                                                                                              |
| ------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| block        | (tuple (header (buff 80)) (height uint))                               | a tuple containing `header` (the Bitcoin block header) and the `height` (Stacks height) where the BTC tx was confirmed.                                                                                  |
| prev-blocks  | (list 10 (buff 80))                                                    | because Clarity contracts can't get Bitcoin headers when there is no Stacks block, this param allows users to specify the chain of block headers going back to the block where the BTC tx was confirmed. |
| tx           | (buff 1024)                                                            | the hex data of the BTC tx                                                                                                                                                                               |
| proof        | (tuple (hashes (list 12 (buff 32))) (tree-depth uint) (tx-index uint)) | a merkle proof to validate inclusion of this tx in the BTC block                                                                                                                                         |
| output-index | uint                                                                   | the index of the HTLC output in the BTC tx                                                                                                                                                               |
| swap-id      | uint                                                                   | the outbound swap ID they're finalizing                                                                                                                                                                  |

### revoke-expired-outbound

[View in file](../contracts/magic.clar#L524)

`(define-public (revoke-expired-outbound ((swap-id uint)) (response (tuple (created-at uint) (output (buff 128)) (sats uint) (supplier uint) (swapper principal) (xbtc uint)) uint))`

Revoke an expired outbound swap. After an outbound swap has expired without
finalizing, a swapper may call this function to receive the xBTC escrowed.

@returns the metadata regarding the outbound swap

<details>
  <summary>Source code:</summary>

```clarity
(define-public (revoke-expired-outbound (swap-id uint))
  (let
    (
      ;; #[filter(swap-id)]
      (swap (try! (validate-outbound-revocable swap-id)))
      (xbtc (get xbtc swap))
      (swapper (get swapper swap))
    )
    (try! (as-contract (transfer xbtc tx-sender swapper)))
    (map-insert completed-outbound-swaps swap-id REVOKED_OUTBOUND_TXID)
    (print (merge swap {
      topic: "revoke-outbound",
      swap-id: swap-id,
    }))
    (ok swap)
  )
)
```

</details>

**Parameters:**

| Name    | Type | Description                                |
| ------- | ---- | ------------------------------------------ |
| swap-id | uint | the ID of the outbound swap being revoked. |

### get-supplier-id-by-controller

[View in file](../contracts/magic.clar#L544)

`(define-read-only (get-supplier-id-by-controller ((controller principal)) (optional uint))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-supplier-id-by-controller (controller principal))
  (map-get? supplier-by-controller controller)
)
```

</details>

**Parameters:**

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| controller | principal |             |

### get-supplier-id-by-public-key

[View in file](../contracts/magic.clar#L548)

`(define-read-only (get-supplier-id-by-public-key ((public-key (buff 33))) (optional uint))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-supplier-id-by-public-key (public-key (buff 33)))
  (map-get? supplier-by-public-key public-key)
)
```

</details>

**Parameters:**

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| public-key | (buff 33) |             |

### get-supplier

[View in file](../contracts/magic.clar#L552)

`(define-read-only (get-supplier ((id uint)) (optional (tuple (controller principal) (inbound-base-fee int) (inbound-fee (optional int)) (outbound-base-fee int) (outbound-fee (optional int)) (public-key (buff 33)))))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-supplier (id uint))
  (map-get? supplier-by-id id)
)
```

</details>

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | uint |             |

### get-funds

[View in file](../contracts/magic.clar#L556)

`(define-read-only (get-funds ((id uint)) uint)`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-funds (id uint))
  (default-to u0 (map-get? supplier-funds id))
)
```

</details>

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | uint |             |

### get-escrow

[View in file](../contracts/magic.clar#L560)

`(define-read-only (get-escrow ((id uint)) (optional uint))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-escrow (id uint))
  (map-get? supplier-escrow id)
)
```

</details>

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | uint |             |

### get-inbound-swap

[View in file](../contracts/magic.clar#L564)

`(define-read-only (get-inbound-swap ((txid (buff 32))) (optional (tuple (expiration uint) (hash (buff 32)) (supplier uint) (swapper principal) (xbtc uint))))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-inbound-swap (txid (buff 32)))
  (map-get? inbound-swaps txid)
)
```

</details>

**Parameters:**

| Name | Type      | Description |
| ---- | --------- | ----------- |
| txid | (buff 32) |             |

### get-preimage

[View in file](../contracts/magic.clar#L568)

`(define-read-only (get-preimage ((txid (buff 32))) (optional (buff 128)))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-preimage (txid (buff 32)))
  (map-get? inbound-preimages txid)
)
```

</details>

**Parameters:**

| Name | Type      | Description |
| ---- | --------- | ----------- |
| txid | (buff 32) |             |

### get-outbound-swap

[View in file](../contracts/magic.clar#L572)

`(define-read-only (get-outbound-swap ((id uint)) (optional (tuple (created-at uint) (output (buff 128)) (sats uint) (supplier uint) (swapper principal) (xbtc uint))))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-outbound-swap (id uint))
  (map-get? outbound-swaps id)
)
```

</details>

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | uint |             |

### get-completed-outbound-swap-txid

[View in file](../contracts/magic.clar#L576)

`(define-read-only (get-completed-outbound-swap-txid ((id uint)) (optional (buff 32)))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-completed-outbound-swap-txid (id uint))
  (map-get? completed-outbound-swaps id)
)
```

</details>

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | uint |             |

### get-completed-outbound-swap-by-txid

[View in file](../contracts/magic.clar#L580)

`(define-read-only (get-completed-outbound-swap-by-txid ((txid (buff 32))) (optional uint))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-completed-outbound-swap-by-txid (txid (buff 32)))
  (map-get? completed-outbound-swap-txids txid)
)
```

</details>

**Parameters:**

| Name | Type      | Description |
| ---- | --------- | ----------- |
| txid | (buff 32) |             |

### get-next-supplier-id

[View in file](../contracts/magic.clar#L584)

`(define-read-only (get-next-supplier-id () uint)`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-next-supplier-id) (var-get next-supplier-id))
```

</details>

### get-next-outbound-id

[View in file](../contracts/magic.clar#L585)

`(define-read-only (get-next-outbound-id () uint)`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-next-outbound-id) (var-get next-outbound-id))
```

</details>

### get-full-supplier

[View in file](../contracts/magic.clar#L587)

`(define-read-only (get-full-supplier ((id uint)) (response (tuple (controller principal) (escrow uint) (funds uint) (inbound-base-fee int) (inbound-fee (optional int)) (outbound-base-fee int) (outbound-fee (optional int)) (public-key (buff 33))) uint))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-full-supplier (id uint))
  (let
    (
      (supplier (unwrap! (get-supplier id) ERR_INVALID_SUPPLIER))
      (funds (get-funds id))
      (escrow (unwrap-panic (get-escrow id)))
    )
    (ok (merge supplier { funds: funds, escrow: escrow }))
  )
)
```

</details>

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | uint |             |

### get-inbound-meta

[View in file](../contracts/magic.clar#L598)

`(define-read-only (get-inbound-meta ((txid (buff 32))) (optional (tuple (csv uint) (output-index uint) (redeem-script (buff 148)) (sats uint) (sender-public-key (buff 33)))))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-inbound-meta (txid (buff 32)))
  (map-get? inbound-meta txid)
)
```

</details>

**Parameters:**

| Name | Type      | Description |
| ---- | --------- | ----------- |
| txid | (buff 32) |             |

### get-full-inbound

[View in file](../contracts/magic.clar#L602)

`(define-read-only (get-full-inbound ((txid (buff 32))) (response (tuple (csv uint) (expiration uint) (hash (buff 32)) (output-index uint) (redeem-script (buff 148)) (sats uint) (sender-public-key (buff 33)) (supplier uint) (swapper principal) (xbtc uint)) uint))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-full-inbound (txid (buff 32)))
  (let
    (
      (swap (unwrap! (get-inbound-swap txid) ERR_INVALID_ESCROW))
      (meta (unwrap! (get-inbound-meta txid) ERR_INVALID_ESCROW))
    )
    (ok (merge swap meta))
  )
)
```

</details>

**Parameters:**

| Name | Type      | Description |
| ---- | --------- | ----------- |
| txid | (buff 32) |             |

### get-user-inbound-volume

[View in file](../contracts/magic.clar#L612)

`(define-read-only (get-user-inbound-volume ((user principal)) uint)`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-user-inbound-volume (user principal))
  (match (map-get? user-inbound-volume-map user)
    vol vol
    u0
  )
)
```

</details>

**Parameters:**

| Name | Type      | Description |
| ---- | --------- | ----------- |
| user | principal |             |

### get-total-inbound-volume

[View in file](../contracts/magic.clar#L619)

`(define-read-only (get-total-inbound-volume () uint)`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-total-inbound-volume) (var-get total-inbound-volume-var))
```

</details>

### get-user-outbound-volume

[View in file](../contracts/magic.clar#L621)

`(define-read-only (get-user-outbound-volume ((user principal)) uint)`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-user-outbound-volume (user principal))
  (match (map-get? user-outbound-volume-map user)
    vol vol
    u0
  )
)
```

</details>

**Parameters:**

| Name | Type      | Description |
| ---- | --------- | ----------- |
| user | principal |             |

### get-total-outbound-volume

[View in file](../contracts/magic.clar#L628)

`(define-read-only (get-total-outbound-volume () uint)`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-total-outbound-volume) (var-get total-outbound-volume-var))
```

</details>

### get-user-total-volume

[View in file](../contracts/magic.clar#L630)

`(define-read-only (get-user-total-volume ((user principal)) uint)`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-user-total-volume (user principal))
  (+ (get-user-inbound-volume user) (get-user-outbound-volume user))
)
```

</details>

**Parameters:**

| Name | Type      | Description |
| ---- | --------- | ----------- |
| user | principal |             |

### get-total-volume

[View in file](../contracts/magic.clar#L634)

`(define-read-only (get-total-volume () uint)`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-total-volume)
  (+ (get-total-inbound-volume) (get-total-outbound-volume))
)
```

</details>

### transfer

[View in file](../contracts/magic.clar#L640)

`(define-private (transfer ((amount uint) (sender principal) (recipient principal)) (response bool uint))`

<details>
  <summary>Source code:</summary>

```clarity
(define-private (transfer (amount uint) (sender principal) (recipient principal))
  (match (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin transfer amount sender recipient none)
    success (ok success)
    error (begin
      (print { transfer-error: error })
      ERR_TRANSFER
    )
  )
)
```

</details>

**Parameters:**

| Name      | Type      | Description |
| --------- | --------- | ----------- |
| amount    | uint      |             |
| sender    | principal |             |
| recipient | principal |             |

### serialize-metadata

[View in file](../contracts/magic.clar#L658)

`(define-read-only (serialize-metadata ((swapper principal) (base-fee int) (fee-rate int)) (buff 216))`

Serialize the metadata for a transaction involving a swapper, base-fee, and a
fee-rate. This function calls to the underlying `to-consensus-muff` function to
serialize the data.

@returns the serialized buffer representing the metadata

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (serialize-metadata (swapper principal) (base-fee int) (fee-rate int))
  (unwrap-panic (to-consensus-buff? {
    swapper: swapper,
    base-fee: base-fee,
    fee-rate: fee-rate,
  }))
)
```

</details>

**Parameters:**

| Name     | Type      | Description                               |
| -------- | --------- | ----------------------------------------- |
| swapper  | principal | the principal involved in the transaction |
| base-fee | int       | the base fee for the transaction          |
| fee-rate | int       | the fee rate for the transaction          |

### hash-metadata

[View in file](../contracts/magic.clar#L671)

`(define-read-only (hash-metadata ((swapper principal) (base-fee int) (fee-rate int)) (buff 32))`

Generate a metadata hash, which is embedded in an inbound HTLC.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (hash-metadata (swapper principal) (base-fee int) (fee-rate int))
  (sha256 (serialize-metadata swapper base-fee fee-rate))
)
```

</details>

**Parameters:**

| Name     | Type      | Description                                              |
| -------- | --------- | -------------------------------------------------------- |
| swapper  | principal | the STX address of the recipient of the swap             |
| base-fee | int       | the maximum base fee that can be charged by the supplier |
| fee-rate | int       | the maximum fee rate that can be charged by the supplier |

### get-swap-amount

[View in file](../contracts/magic.clar#L686)

`(define-read-only (get-swap-amount ((amount uint) (fee-rate int) (base-fee int)) (response uint uint))`

Compute the swap amount by applying a fee rate and deducting a base fee from the
initial amount. If the base-fee is greater than or equal to the amount after the
fee rate deduction, an error is thrown indicating insufficient amount.

@returns the final amount after applying the fee rate and deducting the base
fee, or an error

@throws ERR_INSUFFICIENT_AMOUNT if the base-fee is greater than or equal to the
amount after applying the fee rate

<details>
  <summary>Source code:</summary>

```clarity
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
```

</details>

**Parameters:**

| Name     | Type | Description                                             |
| -------- | ---- | ------------------------------------------------------- |
| amount   | uint | the original amount to be swapped                       |
| fee-rate | int  | the fee rate to be deducted from the original amount    |
| base-fee | int  | the base fee to be deducted after applying the fee rate |

### get-amount-with-fee-rate

[View in file](../contracts/magic.clar#L706)

`(define-read-only (get-amount-with-fee-rate ((amount uint) (fee-rate int)) int)`

Calculate the transaction amount with a fee rate applied. This function computes
a new amount by subtracting the fee-rate from the amount, treating the result as
a percentage of the original amount.

@returns the calculated amount after applying the fee rate

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-amount-with-fee-rate (amount uint) (fee-rate int))
  (let
    (
      (numerator (* (to-int amount) (- 10000 fee-rate)))
      (final (/ numerator 10000))
    )
    final
  )
)
```

</details>

**Parameters:**

| Name     | Type | Description                                          |
| -------- | ---- | ---------------------------------------------------- |
| amount   | uint | the original amount of the transaction               |
| fee-rate | int  | the fee rate to be deducted from the original amount |

### update-user-inbound-volume

[View in file](../contracts/magic.clar#L716)

`(define-private (update-user-inbound-volume ((user principal) (amount uint)) bool)`

<details>
  <summary>Source code:</summary>

```clarity
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
```

</details>

**Parameters:**

| Name   | Type      | Description |
| ------ | --------- | ----------- |
| user   | principal |             |
| amount | uint      |             |

### update-user-outbound-volume

[View in file](../contracts/magic.clar#L728)

`(define-private (update-user-outbound-volume ((user principal) (amount uint)) bool)`

<details>
  <summary>Source code:</summary>

```clarity
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
```

</details>

**Parameters:**

| Name   | Type      | Description |
| ------ | --------- | ----------- |
| user   | principal |             |
| amount | uint      |             |

### validate-expiration

[View in file](../contracts/magic.clar#L756)

`(define-read-only (validate-expiration ((expiration uint) (mined-height uint)) (response bool uint))`

Validate the expiration for an inbound swap.

There are two validations used here:

- Expiration isn't too soon. To ensure that the swapper and supplier have
  sufficient time to finalize, a swap must be escrowed with **at least** 250
  blocks remaining.
- Expiration isn't too far. The HTLC must have a `CHECKSEQUENCEVERIFY` of less
  than 550. This ensures that a supplier's xBTC isn't escrowed for unnecessarily
  long times.

  <details>
  <summary>Source code:</summary>

```clarity
(define-read-only (validate-expiration (expiration uint) (mined-height uint))
  (if (> expiration (+ (- block-height mined-height) MIN_EXPIRATION))
    (if (< expiration MAX_HTLC_EXPIRATION) (ok true) ERR_INVALID_EXPIRATION)
    ERR_INVALID_EXPIRATION
  )
)
```

</details>

**Parameters:**

| Name         | Type | Description                                                                                                                                            |
| ------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| expiration   | uint | the amount of blocks that need to pass before the sender can recover their HTLC. This is the value used with `CHECKSEQUENCEVERIFY` in the HTLC script. |
| mined-height | uint | the nearest stacks block after (or including) the Bitcoin block where the HTLC was confirmed.                                                          |

### validate-fee

[View in file](../contracts/magic.clar#L773)

`(define-read-only (validate-fee ((fee-opt (optional int))) (response bool uint))`

Validate a fee by checking if it falls within an acceptable range. The
acceptable range is between -10000 and 10000 (exclusive). If the fee does not
fall within this range, an error is thrown indicating an invalid fee. If no fee
is provided, it defaults to true without performing any validation.

@returns true if the fee is within the acceptable range, or an error

@throws ERR_FEE_INVALID if the fee does not fall within the acceptable range

<details>
  <summary>Source code:</summary>

```clarity
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
```

</details>

**Parameters:**

| Name    | Type           | Description                      |
| ------- | -------------- | -------------------------------- |
| fee-opt | (optional int) | the optional fee to be validated |

### validate-outbound-revocable

[View in file](../contracts/magic.clar#L802)

`(define-read-only (validate-outbound-revocable ((swap-id uint)) (response (tuple (created-at uint) (output (buff 128)) (sats uint) (supplier uint) (swapper principal) (xbtc uint)) uint))`

<details>
  <summary>Source code:</summary>

```clarity
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
```

</details>

**Parameters:**

| Name    | Type | Description |
| ------- | ---- | ----------- |
| swap-id | uint |             |

### generate-htlc-script

[View in file](../contracts/magic.clar#L831)

`(define-read-only (generate-htlc-script ((sender (buff 33)) (recipient (buff 33)) (expiration (buff 4)) (hash (buff 32)) (metadata (buff 32))) (buff 148))`

Generate a hashed timelock contract (HTLC) script. The function concatenates
various components including sender, recipient, expiration, hash, and metadata
to form the HTLC script. These scripts allow locked transactions to be spent if
certain conditions are met.

@returns the HTLC script

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (generate-htlc-script
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
```

</details>

**Parameters:**

| Name       | Type      | Description                                                                                             |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------- |
| sender     | (buff 33) | a 33-byte public key of the sender                                                                      |
| recipient  | (buff 33) | a 33-byte public key of the recipient                                                                   |
| expiration | (buff 4)  | a 4-byte expiration time buffer                                                                         |
| hash       | (buff 32) | a 32-byte hash of the secret                                                                            |
| metadata   | (buff 32) | a 32-byte buffer containing hashed metadata for the transaction - see [`hash-metadata`](#hash-metadata) |

### generate-wsh-output

[View in file](../contracts/magic.clar#L859)

`(define-read-only (generate-wsh-output ((script (buff 148))) (buff 34))`

Generate a SegWit script hash (wsh) output. The function computes a SHA256 hash
of the provided script and prepends it with `0x0020`. The output can be used as
a Pay-to-Witness-Script-Hash (P2WSH) output script.

@returns a P2WSH output script

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (generate-wsh-output (script (buff 148)))
  (concat 0x0020 (sha256 script))
)
```

</details>

**Parameters:**

| Name   | Type       | Description                                                               |
| ------ | ---------- | ------------------------------------------------------------------------- |
| script | (buff 148) | a 148-byte buffer containing the script from which to generate the output |

### bytes-len

[View in file](../contracts/magic.clar#L863)

`(define-read-only (bytes-len ((bytes (buff 4))) (buff 1))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (bytes-len (bytes (buff 4)))
  (unwrap-panic (element-at BUFF_TO_BYTE (len bytes)))
)
```

</details>

**Parameters:**

| Name  | Type     | Description |
| ----- | -------- | ----------- |
| bytes | (buff 4) |             |

### read-varint

[View in file](../contracts/magic.clar#L869)

`(define-read-only (read-varint ((num (buff 4))) (response uint uint))`

<details>
  <summary>Source code:</summary>

```clarity
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
```

</details>

**Parameters:**

| Name | Type     | Description |
| ---- | -------- | ----------- |
| num  | (buff 4) |             |

## Maps

### supplier-by-id

```clarity
(define-map supplier-by-id uint {
  public-key: (buff 33),
  controller: principal,
  inbound-fee: (optional int),
  outbound-fee: (optional int),
  outbound-base-fee: int,
  inbound-base-fee: int,
})
```

[View in file](../contracts/magic.clar#L1)

### supplier-by-public-key

```clarity
(define-map supplier-by-public-key (buff 33) uint)
```

[View in file](../contracts/magic.clar#L9)

### supplier-by-controller

```clarity
(define-map supplier-by-controller principal uint)
```

[View in file](../contracts/magic.clar#L10)

### swapper-by-id

```clarity
(define-map swapper-by-id uint principal)
```

[View in file](../contracts/magic.clar#L12)

### swapper-by-principal

```clarity
(define-map swapper-by-principal principal uint)
```

[View in file](../contracts/magic.clar#L13)

### supplier-funds

amount of xBTC funds per supplier supplier-id -> xBTC (sats)

```clarity
(define-map supplier-funds uint uint)
```

[View in file](../contracts/magic.clar#L17)

### supplier-escrow

amount of xBTC funds in escrow per supplier supplier-id -> xBTC

```clarity
(define-map supplier-escrow uint uint)
```

[View in file](../contracts/magic.clar#L20)

### inbound-swaps

```clarity
(define-map inbound-swaps (buff 32) {
  swapper: principal,
  xbtc: uint,
  supplier: uint,
  expiration: uint,
  hash: (buff 32),
})
```

[View in file](../contracts/magic.clar#L22)

### inbound-meta

extra info for inbound swaps - not needed for the `finalize` step

```clarity
(define-map inbound-meta (buff 32) {
  sender-public-key: (buff 33),
  output-index: uint,
  csv: uint,
  sats: uint,
  redeem-script: (buff 148),
})
```

[View in file](../contracts/magic.clar#L31)

### inbound-preimages

mapping of txid -> preimage

```clarity
(define-map inbound-preimages (buff 32) (buff 128))
```

[View in file](../contracts/magic.clar#L39)

### outbound-swaps

```clarity
(define-map outbound-swaps uint {
  swapper: principal,
  sats: uint,
  xbtc: uint,
  supplier: uint,
  output: (buff 128),
  created-at: uint,
})
```

[View in file](../contracts/magic.clar#L41)

### completed-outbound-swaps

mapping of swap -> txid

```clarity
(define-map completed-outbound-swaps uint (buff 32))
```

[View in file](../contracts/magic.clar#L50)

### completed-outbound-swap-txids

```clarity
(define-map completed-outbound-swap-txids (buff 32) uint)
```

[View in file](../contracts/magic.clar#L51)

### user-inbound-volume-map

tracking of total volume

```clarity
(define-map user-inbound-volume-map principal uint)
```

[View in file](../contracts/magic.clar#L54)

### user-outbound-volume-map

```clarity
(define-map user-outbound-volume-map principal uint)
```

[View in file](../contracts/magic.clar#L57)

## Variables

### total-inbound-volume-var

uint

```clarity
(define-data-var total-inbound-volume-var uint u0)
```

[View in file](../contracts/magic.clar#L55)

### total-outbound-volume-var

uint

```clarity
(define-data-var total-outbound-volume-var uint u0)
```

[View in file](../contracts/magic.clar#L58)

### next-supplier-id

uint

```clarity
(define-data-var next-supplier-id uint u0)
```

[View in file](../contracts/magic.clar#L60)

### next-swapper-id

uint

```clarity
(define-data-var next-swapper-id uint u0)
```

[View in file](../contracts/magic.clar#L61)

### next-outbound-id

uint

```clarity
(define-data-var next-outbound-id uint u0)
```

[View in file](../contracts/magic.clar#L62)

## Constants

### MIN_EXPIRATION

```clarity
(define-constant MIN_EXPIRATION u250)
```

[View in file](../contracts/magic.clar#L64)

### ESCROW_EXPIRATION

```clarity
(define-constant ESCROW_EXPIRATION u200)
```

[View in file](../contracts/magic.clar#L65)

### OUTBOUND_EXPIRATION

```clarity
(define-constant OUTBOUND_EXPIRATION u200)
```

[View in file](../contracts/magic.clar#L66)

### MAX_HTLC_EXPIRATION

```clarity
(define-constant MAX_HTLC_EXPIRATION u550)
```

[View in file](../contracts/magic.clar#L67)

### P2PKH_VERSION

```clarity
(define-constant P2PKH_VERSION 0x00)
```

[View in file](../contracts/magic.clar#L69)

### P2SH_VERSION

```clarity
(define-constant P2SH_VERSION 0x05)
```

[View in file](../contracts/magic.clar#L70)

### REVOKED_OUTBOUND_TXID

use a placeholder txid to mark as "finalized"

```clarity
(define-constant REVOKED_OUTBOUND_TXID 0x00)
```

[View in file](../contracts/magic.clar#L73)

### REVOKED_INBOUND_PREIMAGE

placeholder to mark inbound swap as revoked

```clarity
(define-constant REVOKED_INBOUND_PREIMAGE 0x00)
```

[View in file](../contracts/magic.clar#L75)

### ERR_SUPPLIER_EXISTS

```clarity
(define-constant ERR_SUPPLIER_EXISTS (err u2))
```

[View in file](../contracts/magic.clar#L77)

### ERR_UNAUTHORIZED

```clarity
(define-constant ERR_UNAUTHORIZED (err u3))
```

[View in file](../contracts/magic.clar#L78)

### ERR_ADD_FUNDS

```clarity
(define-constant ERR_ADD_FUNDS (err u4))
```

[View in file](../contracts/magic.clar#L79)

### ERR_TRANSFER

```clarity
(define-constant ERR_TRANSFER (err u5))
```

[View in file](../contracts/magic.clar#L80)

### ERR_SUPPLIER_NOT_FOUND

```clarity
(define-constant ERR_SUPPLIER_NOT_FOUND (err u6))
```

[View in file](../contracts/magic.clar#L81)

### ERR_SWAPPER_NOT_FOUND

```clarity
(define-constant ERR_SWAPPER_NOT_FOUND (err u7))
```

[View in file](../contracts/magic.clar#L82)

### ERR_FEE_INVALID

```clarity
(define-constant ERR_FEE_INVALID (err u8))
```

[View in file](../contracts/magic.clar#L83)

### ERR_SWAPPER_EXISTS

```clarity
(define-constant ERR_SWAPPER_EXISTS (err u9))
```

[View in file](../contracts/magic.clar#L84)

### ERR_INVALID_TX

```clarity
(define-constant ERR_INVALID_TX (err u10))
```

[View in file](../contracts/magic.clar#L85)

### ERR_INVALID_OUTPUT

```clarity
(define-constant ERR_INVALID_OUTPUT (err u11))
```

[View in file](../contracts/magic.clar#L86)

### ERR_INVALID_HASH

```clarity
(define-constant ERR_INVALID_HASH (err u12))
```

[View in file](../contracts/magic.clar#L87)

### ERR_INVALID_SUPPLIER

```clarity
(define-constant ERR_INVALID_SUPPLIER (err u13))
```

[View in file](../contracts/magic.clar#L88)

### ERR_INSUFFICIENT_FUNDS

```clarity
(define-constant ERR_INSUFFICIENT_FUNDS (err u14))
```

[View in file](../contracts/magic.clar#L89)

### ERR_INVALID_EXPIRATION

```clarity
(define-constant ERR_INVALID_EXPIRATION (err u15))
```

[View in file](../contracts/magic.clar#L90)

### ERR_TXID_USED

```clarity
(define-constant ERR_TXID_USED (err u16))
```

[View in file](../contracts/magic.clar#L91)

### ERR_ALREADY_FINALIZED

```clarity
(define-constant ERR_ALREADY_FINALIZED (err u17))
```

[View in file](../contracts/magic.clar#L92)

### ERR_INVALID_ESCROW

```clarity
(define-constant ERR_INVALID_ESCROW (err u18))
```

[View in file](../contracts/magic.clar#L93)

### ERR_INVALID_PREIMAGE

```clarity
(define-constant ERR_INVALID_PREIMAGE (err u19))
```

[View in file](../contracts/magic.clar#L94)

### ERR_ESCROW_EXPIRED

```clarity
(define-constant ERR_ESCROW_EXPIRED (err u20))
```

[View in file](../contracts/magic.clar#L95)

### ERR_TX_NOT_MINED

```clarity
(define-constant ERR_TX_NOT_MINED (err u21))
```

[View in file](../contracts/magic.clar#L96)

### ERR_INVALID_BTC_ADDR

```clarity
(define-constant ERR_INVALID_BTC_ADDR (err u22))
```

[View in file](../contracts/magic.clar#L97)

### ERR_SWAP_NOT_FOUND

```clarity
(define-constant ERR_SWAP_NOT_FOUND (err u23))
```

[View in file](../contracts/magic.clar#L98)

### ERR_INSUFFICIENT_AMOUNT

```clarity
(define-constant ERR_INSUFFICIENT_AMOUNT (err u24))
```

[View in file](../contracts/magic.clar#L99)

### ERR_REVOKE_OUTBOUND_NOT_EXPIRED

```clarity
(define-constant ERR_REVOKE_OUTBOUND_NOT_EXPIRED (err u25))
```

[View in file](../contracts/magic.clar#L100)

### ERR_REVOKE_OUTBOUND_IS_FINALIZED

```clarity
(define-constant ERR_REVOKE_OUTBOUND_IS_FINALIZED (err u26))
```

[View in file](../contracts/magic.clar#L101)

### ERR_INCONSISTENT_FEES

```clarity
(define-constant ERR_INCONSISTENT_FEES (err u27))
```

[View in file](../contracts/magic.clar#L102)

### ERR_REVOKE_INBOUND_NOT_EXPIRED

```clarity
(define-constant ERR_REVOKE_INBOUND_NOT_EXPIRED (err u28))
```

[View in file](../contracts/magic.clar#L103)

### ERR_REVOKE_INBOUND_IS_FINALIZED

```clarity
(define-constant ERR_REVOKE_INBOUND_IS_FINALIZED (err u29))
```

[View in file](../contracts/magic.clar#L104)

### ERR_READ_UINT

```clarity
(define-constant ERR_READ_UINT (err u100))
```

[View in file](../contracts/magic.clar#L867)

### BUFF_TO_BYTE

```clarity
(define-constant BUFF_TO_BYTE (list 0x00 0x01 0x02 0x03 0x04))
```

[View in file](../contracts/magic.clar#L890)
