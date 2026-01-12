import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js'
import { Fundus } from '../../anchor/target/types/fundus'
import idl from '../../anchor/target/idl/fundus.json'
import { Campaign, ProgramState, Transaction } from '@/utils/interfaces'
import { store } from '@/store'
import { globalActions } from '@/store/globalSlices'
import { getClusterURL } from '@/utils/helper'

const { setCampaign, setDonations, setWithdrawls, setStates } = globalActions
const CLUSTER: string = process.env.NEXT_PUBLIC_CLUSTER || 'localhost'
const RPC_URL: string = getClusterURL(CLUSTER)

/* ---------------- PROVIDERS ---------------- */

export const getProvider = (
  publicKey: PublicKey | null,
  signTransaction: any,
  sendTransaction: any
): Program<Fundus> | null => {
  if (!publicKey || !signTransaction) return null

  const connection = new Connection(RPC_URL, 'confirmed')
  const provider = new AnchorProvider(
    connection,
    { publicKey, signTransaction, sendTransaction } as Wallet,
    { commitment: 'processed' }
  )

  return new Program<Fundus>(idl as any, provider)
}

export const getProviderReadonly = (): Program<Fundus> => {
  const connection = new Connection(RPC_URL, 'confirmed')

  const wallet = {
    publicKey: PublicKey.default,
    signTransaction: async () => {
      throw new Error('Readonly provider')
    },
    signAllTransactions: async () => {
      throw new Error('Readonly provider')
    },
  }

  const provider = new AnchorProvider(connection, wallet as Wallet, {
    commitment: 'processed',
  })

  return new Program<Fundus>(idl as any, provider)
}

/* ---------------- CAMPAIGN ACTIONS ---------------- */

export const createCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  title: string,
  description: string,
  image_url: string,
  goal: number
): Promise<TransactionSignature> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('program_state')],
    program.programId
  )

  const state = await program.account.ProgramState.fetch(programStatePda)
  const cid = state.campaign_count.add(new BN(1))

  const [campaignPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('campaign'), cid.toArrayLike(Buffer, 'le', 8)],
    program.programId
  )

  const goalBN = new BN(goal * 1_000_000_000)

  const tx = await program.methods
    .create_campaign(title, description, image_url, goalBN)
    .accountsPartial({
      program_state: programStatePda,
      campaign: campaignPda,
      creator: publicKey,
      system_program: SystemProgram.programId,
    })
    .rpc()

  await new Connection(program.provider.connection.rpcEndpoint, 'confirmed')
    .confirmTransaction(tx, 'finalized')

  return tx
}

export const updateCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  pda: PublicKey,
  title: string,
  description: string,
  image_url: string,
  goal: number
): Promise<TransactionSignature> => {
  const campaign = await program.account.campaign.fetch(pda)
  const goalBN = new BN(goal * 1_000_000_000)

  const tx = await program.methods
    .update_campaign(campaign.cid, title, description, image_url, goalBN)
    .accountsPartial({
      campaign: pda,
      creator: publicKey,
      system_program: SystemProgram.programId,
    })
    .rpc()

  await new Connection(program.provider.connection.rpcEndpoint, 'confirmed')
    .confirmTransaction(tx, 'finalized')

  return tx
}

export const deleteCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  pda: PublicKey
): Promise<TransactionSignature> => {
  const campaign = await program.account.campaign.fetch(pda)

  const tx = await program.methods
    .delete_campaign(campaign.cid)
    .accountsPartial({
      campaign: pda,
      creator: publicKey,
      system_program: SystemProgram.programId,
    })
    .rpc()

  await new Connection(program.provider.connection.rpcEndpoint, 'confirmed')
    .confirmTransaction(tx, 'finalized')

  return tx
}

/* ---------------- PLATFORM & DONATIONS ---------------- */

export const updatePlatform = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  percent: number
): Promise<TransactionSignature> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('program_state')],
    program.programId
  )

  const tx = await program.methods
    .update_platform_settings(new BN(percent))
    .accountsPartial({
      updater: publicKey,
      program_state: programStatePda,
    })
    .rpc()

  await new Connection(program.provider.connection.rpcEndpoint, 'confirmed')
    .confirmTransaction(tx, 'finalized')

  return tx
}

export const donateToCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  pda: PublicKey,
  amount: number
): Promise<TransactionSignature> => {
  const campaign = await program.account.campaign.fetch(pda)

  const [transactionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('donor'),
      publicKey.toBuffer(),
      campaign.cid.toArrayLike(Buffer, 'le', 8),
      campaign.donors.add(new BN(1)).toArrayLike(Buffer, 'le', 8),
    ],
    program.programId
  )

  const donationAmount = new BN(Math.round(amount * 1_000_000_000))

  const tx = await program.methods
    .donate(campaign.cid, donationAmount)
    .accountsPartial({
      campaign: pda,
      transaction: transactionPda,
      donor: publicKey,
      system_program: SystemProgram.programId,
    })
    .rpc()

  await new Connection(program.provider.connection.rpcEndpoint, 'confirmed')
    .confirmTransaction(tx, 'finalized')

  return tx
}

export const withdrawFromCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  pda: PublicKey,
  amount: number
): Promise<TransactionSignature> => {
  const campaign = await program.account.campaign.fetch(pda)

  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('program_state')],
    program.programId
  )

  const programState = await program.account.ProgramState.fetch(programStatePda)

  const [transactionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('withdraw'),
      publicKey.toBuffer(),
      campaign.cid.toArrayLike(Buffer, 'le', 8),
      campaign.withdrawals.add(new BN(1)).toArrayLike(Buffer, 'le', 8),
    ],
    program.programId
  )

  const withdrawAmount = new BN(Math.round(amount * 1_000_000_000))

  const tx = await program.methods
    .withdraw(campaign.cid, withdrawAmount)
    .accountsPartial({
      program_state: programStatePda,
      campaign: pda,
      transaction: transactionPda,
      creator: publicKey,
      platform_address: programState.platform_address,
      system_program: SystemProgram.programId,
    })
    .rpc()

  await new Connection(program.provider.connection.rpcEndpoint, 'confirmed')
    .confirmTransaction(tx, 'finalized')

  return tx
}

/* ---------------- FETCH HELPERS ---------------- */

export const fetchProgramState = async (
  program: Program<Fundus>
): Promise<ProgramState> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('program_state')],
    program.programId
  )

  const state = await program.account.ProgramState.fetch(programStatePda)

  const serialized: ProgramState = {
    campaign_count: state.campaign_count.toNumber(),
    platformFee: state.platform_fee.toNumber(),
    platformAddress: state.platform_address.toBase58(),
  }

  store.dispatch(setStates(serialized))
  return serialized
}
