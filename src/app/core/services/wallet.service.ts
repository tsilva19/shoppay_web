import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Transaction, Wallet } from '../models/wallet.model';

@Injectable({ providedIn: 'root' })
export class WalletService {
  constructor(private http: HttpClient) {}

  getMyWallet(): Observable<Wallet> {
    return this.http.get<Wallet>('/api/wallet/me/');
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/api/wallet/transactions/');
  }
}
