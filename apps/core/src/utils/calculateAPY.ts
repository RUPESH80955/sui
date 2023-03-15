// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SuiValidatorSummary } from '@mysten/sui.js';
import { roundFloat } from './roundFloat';

const DEFAULT_APY_DECIMALS = 4;

export function calculateAPY(
    validator: SuiValidatorSummary,
    epoch: number,
    roundDecimals = DEFAULT_APY_DECIMALS
) {
    let apy;
    const {
        stakingPoolSuiBalance,
        stakingPoolActivationEpoch,
        poolTokenBalance,
    } = validator;

    // If the staking pool is active then we calculate its APY.
    if (stakingPoolActivationEpoch) {
        const num_epochs_participated = +epoch - +stakingPoolActivationEpoch;
        apy =
            Math.pow(
                1 +
                    (+stakingPoolSuiBalance - +poolTokenBalance) /
                        +poolTokenBalance,
                365 / num_epochs_participated
            ) - 1;
    } else {
        apy = 0;
    }

    //guard against NaN
    const apyReturn = apy ? roundFloat(apy, roundDecimals) : 0;

    // guard against very large numbers (e.g. 1e+100)
    return apyReturn > 100_000 ? 0 : apyReturn;
}