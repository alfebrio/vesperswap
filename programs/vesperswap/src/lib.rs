#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, CreateMetadataAccountsV3,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::types::DataV2;

declare_id!("96xYKxDbPLnbE1mZmUXJvksn74QUEx7Evh6WmNt9VeM1");

#[program]
pub mod vesperswap {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>) -> Result<()> {
        msg!("Initializing Vesper Token Mint and Pool...");
        
        let cpi_accounts = CreateMetadataAccountsV3 {
            metadata: ctx.accounts.metadata.to_account_info(),
            mint: ctx.accounts.vesp_mint.to_account_info(),
            mint_authority: ctx.accounts.pool_authority.to_account_info(),
            payer: ctx.accounts.signer.to_account_info(),
            update_authority: ctx.accounts.pool_authority.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_metadata_program.to_account_info();
        
        let bump = ctx.bumps.pool_authority;
        let auth_seeds = &["pool_authority".as_bytes(), &[bump]];
        let signer_seeds = &[&auth_seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        let data_v2 = DataV2 {
            name: "Vesper Token".to_string(),
            symbol: "VESP".to_string(),
            // A generic solana logo for testing
            uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png".to_string(),
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        create_metadata_accounts_v3(cpi_ctx, data_v2, false, true, None)?;
        msg!("VESP Token Created and Metadata Registered!");
        Ok(())
    }

    pub fn swap(ctx: Context<Swap>, sol_amount: u64) -> Result<()> {
        // Rate: 1 SOL = 1000 VESP
        let rate = 1000;
        let vesp_amount = sol_amount.checked_mul(rate).unwrap();

        msg!("Swapping {} SOL for {} VESP...", sol_amount, vesp_amount);

        // 1. Transfer SOL from user to treasury
        let transfer_cpi_accounts = system_program::Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.treasury.to_account_info(),
        };
        let transfer_cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_cpi_accounts,
        );
        system_program::transfer(transfer_cpi_ctx, sol_amount)?;

        // 2. Mint VESP to user
        let bump = ctx.bumps.pool_authority;
        let auth_seeds = &["pool_authority".as_bytes(), &[bump]];
        let signer_seeds = &[&auth_seeds[..]];

        let mint_cpi_accounts = MintTo {
            mint: ctx.accounts.vesp_mint.to_account_info(),
            to: ctx.accounts.user_ata.to_account_info(),
            authority: ctx.accounts.pool_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let mint_cpi_ctx = CpiContext::new_with_signer(cpi_program, mint_cpi_accounts, signer_seeds);
        
        mint_to(mint_cpi_ctx, vesp_amount)?;

        msg!("Swap Success!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: PDA that acts as the global mint authority.
    #[account(
        mut,
        seeds = [b"pool_authority"],
        bump
    )]
    pub pool_authority: UncheckedAccount<'info>,

    #[account(
        init,
        payer = signer,
        mint::decimals = 9,
        mint::authority = pool_authority,
        seeds = [b"vesp_mint"],
        bump
    )]
    pub vesp_mint: Account<'info, Mint>,

    /// CHECK: Metaplex metadata account for VESP
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    /// CHECK: Metaplex Token Metadata Program
    pub token_metadata_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: Target wallet receiving SOL (e.g. Treasury)
    #[account(mut)]
    pub treasury: SystemAccount<'info>,

    /// CHECK: PDA that holds mint authority.
    #[account(
        seeds = [b"pool_authority"],
        bump
    )]
    pub pool_authority: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"vesp_mint"],
        bump,
    )]
    pub vesp_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = vesp_mint,
        associated_token::authority = user,
    )]
    pub user_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
