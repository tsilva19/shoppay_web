export interface Wallet {
  id: number;
  username: string;
  pix_key: string;
  balance: string;
  created_at: string;
}

export type TransactionKind = 'CREDIT' | 'DEBIT';

export interface Transaction {
  id: number;
  kind: TransactionKind;
  amount: string;
  balance_after: string;
  description: string;
  source_type: string | null;
  created_at: string;
}
