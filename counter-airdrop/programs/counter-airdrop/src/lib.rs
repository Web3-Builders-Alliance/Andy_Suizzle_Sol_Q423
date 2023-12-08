use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;

declare_id!("7pmvFUXLvHyDb37LGJbBDsQgUCvarj3cx4qxM49Gdxfq");

#[program]
pub mod counter_airdrop {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _username: String) -> Result<()> {
        ctx.accounts.count.score = 0;
        ctx.accounts.count.bump = ctx.bumps.count;
        Ok(())
    }

    pub fn increment(ctx: Context<Count>, _username: String) -> Result<()> {
        ctx.accounts.count.score += 1;
        Ok(())
    }

    pub fn decrement(ctx: Context<Count>, _username: String) -> Result<()> {
        ctx.accounts.count.score -= 1;
        Ok(())
    }        
}

#[derive(Accounts)]
#[instruction(_username: String)]
pub struct Initialize<'info>{
    #[account(mut)]
    signer: Signer<'info>,
    #[account(
        init, 
        payer = signer,
        space = CounterState::INIT_SPACE,
        seeds = [hash(_username.as_bytes()).to_bytes().as_ref()],
        bump
    )]
    count: Account<'info, CounterState>,
    system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(_username: String)]
pub struct Count<'info>{
    #[account(mut)]
    signer: Signer<'info>,
    #[account(
        mut,
        seeds = [hash(_username.as_bytes()).to_bytes().as_ref()],
        bump = count.bump
    )]
    count: Account<'info, CounterState>,
    system_program: Program<'info, System>
}

#[account]
pub struct CounterState {
    score: i64,
    bump: u8
}

impl Space for CounterState {
    const INIT_SPACE: usize = 8 + 8 + 1;
}