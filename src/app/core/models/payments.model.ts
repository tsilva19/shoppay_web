export type PixChargeStatus = 'PENDING' | 'PAID' | 'EXPIRED';

export interface PixCharge {
  id: number;
  amount: string;
  description: string;
  e2e_id: string;
  payload: string;
  status: PixChargeStatus;
  created_at: string;
  expires_at: string;
  paid_at: string | null;
}

export interface PixChargeCreate {
  amount: string;
  description?: string;
}

export type PixTransferStatus = 'COMPLETED' | 'FAILED';

export interface PixTransfer {
  id: number;
  from_wallet: number;
  to_wallet: number;
  amount: string;
  description: string;
  status: PixTransferStatus;
  e2e_id: string;
  created_at: string;
}

export interface PixTransferCreate {
  to_pix_key: string;
  amount: string;
  description?: string;
}

export type BoletoStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface Boleto {
  id: number;
  description: string;
  amount: string;
  barcode: string;
  due_date: string;
  status: BoletoStatus;
  created_at: string;
  paid_at: string | null;
}

export interface BoletoCreate {
  description: string;
  amount: string;
  due_date: string;
}

export type InstallmentStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface Installment {
  id: number;
  number: number;
  amount: string;
  due_date: string;
  status: InstallmentStatus;
  paid_at: string | null;
}

export interface Purchase {
  id: number;
  merchant: string;
  total_amount: string;
  installments_count: number;
  created_at: string;
  installments: Installment[];
}

export interface PurchaseCreate {
  merchant: string;
  total_amount: string;
  installments_count: number;
}
