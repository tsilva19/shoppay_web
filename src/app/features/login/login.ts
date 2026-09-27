import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { Logo } from '../../shared/logo/logo';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, Logo],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  async submit(): Promise<void> {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    const { username, password } = this.form.getRawValue();

    try {
      await this.auth.login(username, password);
      this.router.navigate(['/dashboard']);
    } catch {
      this.errorMessage.set('Usuário ou senha inválidos.');
    } finally {
      this.loading.set(false);
    }
  }
}
