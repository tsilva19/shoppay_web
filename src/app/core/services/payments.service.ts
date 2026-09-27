import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Boleto,
  BoletoCreate,
  Installment,
  PixCharge,
  PixChargeCreate,
  PixTransfer,
  PixTransferCreate,
  Purchase,
  PurchaseCreate,
} from '../models/payments.model';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  constructor(private http: HttpClient) {}

  // PIX — cobranças
  getPixCharges(): Observable<PixCharge[]> {
    return this.http.get<PixCharge[]>('/api/payments/pix/charges/');
  }

  createPixCharge(payload: PixChargeCreate): Observable<PixCharge> {
    return this.http.post<PixCharge>('/api/payments/pix/charges/', payload);
  }

  payPixCharge(id: number): Observable<PixCharge> {
    return this.http.post<PixCharge>(`/api/payments/pix/charges/${id}/pay/`, {});
  }

  // PIX — transferências
  getPixTransfers(): Observable<PixTransfer[]> {
    return this.http.get<PixTransfer[]>('/api/payments/pix/transfers/');
  }

  createPixTransfer(payload: PixTransferCreate): Observable<PixTransfer> {
    return this.http.post<PixTransfer>('/api/payments/pix/transfers/', payload);
  }

  // Boletos
  getBoletos(): Observable<Boleto[]> {
    return this.http.get<Boleto[]>('/api/payments/boletos/');
  }

  createBoleto(payload: BoletoCreate): Observable<Boleto> {
    return this.http.post<Boleto>('/api/payments/boletos/', payload);
  }

  payBoleto(id: number): Observable<Boleto> {
    return this.http.post<Boleto>(`/api/payments/boletos/${id}/pay/`, {});
  }

  // Compras parceladas (carnê digital)
  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>('/api/payments/purchases/');
  }

  createPurchase(payload: PurchaseCreate): Observable<Purchase> {
    return this.http.post<Purchase>('/api/payments/purchases/', payload);
  }

  payInstallment(id: number): Observable<Installment> {
    return this.http.post<Installment>(`/api/payments/installments/${id}/pay/`, {});
  }
}
