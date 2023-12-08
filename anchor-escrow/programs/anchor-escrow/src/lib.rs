use anchor_lang::prelude::*;

declare_id!("8LfvCPX67gZ8hfz93BqG4T6PmGrADjCKixTxtUXG2QmF");

#[program]
pub mod anchor_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
