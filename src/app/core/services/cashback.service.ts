import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CashbackCredit, CashbackRule } from '../models/cashback.model';

@Injectable({ providedIn: 'root' })
export class CashbackService {
  constructor(private http: HttpClient) {}

  getRules(): Observable<CashbackRule[]> {
    return this.http.get<CashbackRule[]>('/api/cashback/rules/');
  }

  getCredits(): Observable<CashbackCredit[]> {
    return this.http.get<CashbackCredit[]>('/api/cashback/credits/');
  }
}
