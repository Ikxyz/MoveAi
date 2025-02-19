export const SimpleToken = `# Creating a Token on Movement

## Overview
This guide explains how to create and deploy a token on the Movement blockchain using the Move programming language.

## Source Code

\`\`\`move
module coin {
    use std::signer;
    use std::string;
    use aptos_framework::coin;

    const ENOT_ADMIN: u64 = 0;
    const E_ALREADY_HAS_CAPABILITY: u64 = 1;
    const E_DONT_HAVE_CAPABILITY: u64 = 2;

    struct Coin has key {}

    struct CoinCapabilities has key {
        mint_cap: coin::MintCapability<Coin>,
        burn_cap: coin::BurnCapability<Coin>,
        freeze_cap: coin::FreezeCapability<Coin>
    }

    public fun is_admin(addr: address) {
        assert!(addr == @admin, ENOT_ADMIN);
    }

    public fun have_coin_capabilities(addr: address) {
        assert!(exists<CoinCapabilities>(addr), E_DONT_HAVE_CAPABILITY);
    }

    public fun not_have_coin_capabilities(addr: address) {
        assert!(!exists<CoinCapabilities>(addr), E_ALREADY_HAS_CAPABILITY);
    }

    fun init_module_internal(account: &signer) {
        let account_addr = signer::address_of(account);
        is_admin(account_addr);
        not_have_coin_capabilities(account_addr);

        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<Coin>(
            account,
            string::utf8(b"YourTokenName"),
            string::utf8(b"YTN"),
            8,
            true
        );
        move_to(account, CoinCapabilities {mint_cap, burn_cap, freeze_cap});
    }

    public entry fun initialize(account: &signer) {
        init_module_internal(account);
    }

    public entry fun mint(account: &signer, user: address, amount: u64) acquires CoinCapabilities {
        let account_addr = signer::address_of(account);

        is_admin(account_addr);
        have_coin_capabilities(account_addr);

        let mint_cap = &borrow_global<CoinCapabilities>(account_addr).mint_cap;
        let coins = coin::mint<Coin>(amount, mint_cap);
        coin::deposit<Coin>(user, coins);
    }

    public entry fun register(account: &signer) {
        coin::register<Coin>(account);
    }

    public entry fun burn(account: &signer, amount: u64) acquires CoinCapabilities {
        let coins = coin::withdraw<Coin>(account, amount);
        let burn_cap = &borrow_global<CoinCapabilities>(@admin).burn_cap;
        coin::burn<Coin>(coins, burn_cap);
    }
}
\`\`\`

## Deployment Instructions

1. Compile the Move module:
   \`\`\`sh
   movement move compile
   \`\`\`
2. Publish the module to the Movement blockchain:
   \`\`\`sh
   movement move publish
   \`\`\`
3. Deploy and initialize your token:
   \`\`\`sh
   movement move run --function-id <your-account-address>::<your-module-name>::initialize_token \\
     --args string:"YourTokenName" string:"YTN" u8:8 u64:
   \`\`\`

## Usage

- Call \`initialize\` to set up the token.
- Call \`mint\` to mint new tokens to an address.
- Call \`register\` to register an account to hold the token.
- Call \`burn\` to remove tokens from circulation.
`;