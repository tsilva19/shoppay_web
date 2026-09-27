import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Wallet } from '../models/wallet.model';

const STORAGE_KEY = 'shoppay.credentials';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly username = signal<string | null>(null);
  readonly isAuthenticated = signal(false);

  constructor(private http: HttpClient) {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const decoded = atob(stored.replace('Basic ', ''));
      this.username.set(decoded.split(':')[0]);
      this.isAuthenticated.set(true);
    }
  }

  get authorizationHeader(): string | null {
    return sessionStorage.getItem(STORAGE_KEY);
  }

  async login(username: string, password: string): Promise<void> {
    const header = 'Basic ' + btoa(`${username}:${password}`);
    await firstValueFrom(
      this.http.get<Wallet>('/api/wallet/me/', {
        headers: { Authorization: header },
      })
    );
    sessionStorage.setItem(STORAGE_KEY, header);
    this.username.set(username);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.username.set(null);
    this.isAuthenticated.set(false);
  }
}
