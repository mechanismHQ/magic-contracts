export function getSwapAmount(
  amount: bigint,
  feeRate: bigint,
  baseFee: bigint
) {
  const base = baseFee;
  const withFeeRate = (amount * (10000n - feeRate)) / 10000n;
  return withFeeRate - base;
}
