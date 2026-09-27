export interface CashbackRule {
  id: number;
  name: string;
  percentage: string;
  min_purchase_amount: string;
  active: boolean;
}

export interface CashbackCredit {
  id: number;
  purchase: number;
  merchant: string;
  amount: string;
  created_at: string;
}
