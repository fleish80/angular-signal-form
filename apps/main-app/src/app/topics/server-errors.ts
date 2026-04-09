/**
 * Topic 21 — Server errors on submit: the `submit()` action returns field-targeted errors
 * that Angular maps onto the correct sub-fields automatically.
 * Also demonstrates `submitting()` for loading state and `onInvalid` for the invalid-form path.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, email, minLength, submit } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

const TAKEN_USERNAMES = ['admin', 'root', 'angular', 'god'];
const TAKEN_EMAILS = ['admin@example.com', 'test@test.com'];

function mockRegisterUser(data: RegistrationData): Promise<
  | { ok: true }
  | { ok: false; errors: Array<{ field: 'username' | 'email'; message: string }> }
> {
  return new Promise((resolve) =>
    setTimeout(() => {
      const errors: Array<{ field: 'username' | 'email'; message: string }> = [];
      if (TAKEN_USERNAMES.includes(data.username.toLowerCase())) {
        errors.push({ field: 'username', message: `"${data.username}" is already taken` });
      }
      if (TAKEN_EMAILS.includes(data.email.toLowerCase())) {
        errors.push({ field: 'email', message: 'An account with this email already exists' });
      }
      resolve(errors.length ? { ok: false, errors } : { ok: true });
    }, 1200),
  );
}

@Component({
  selector: 'df-server-errors',
  imports: [
    FormField, JsonPipe,
    MatFormField, MatLabel, MatInput, MatError,
    MatButton, MatCard, MatCardContent, MatIcon, MatProgressSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    form { display: flex; flex-direction: column; gap: 16px; max-width: 460px; }
    .field-stack { display: flex; flex-direction: column; align-items: stretch; }
    .field-stack mat-form-field { width: 100%; }
    .field-stack .field-errors {
      margin-top: 4px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .actions { display: flex; gap: 8px; margin-top: 8px; align-items: center; }
    .result { margin-top: 16px; }
    pre { margin: 0; white-space: pre-wrap; font-size: 13px; }
    .server-error mat-error { font-weight: 500; }
  `,
  template: `
    <h2>21. Server Errors on Submit</h2>
    <p class="hint">Try: admin / root / angular / god for username; admin&#64;example.com for email.</p>
    <p class="topic-remark">
      The <code>submit()</code> action returns a <code>Promise&lt;TreeValidationResult&gt;</code>.
      When the server rejects data, return an array of <code>{{ '{' }} fieldTree, kind, message {{ '}' }}</code> objects—Angular
      maps each error onto the matching sub-field automatically.
      The <code>submitting()</code> signal is <code>true</code> while the action runs, ideal for disabling the button
      or showing a spinner. The <code>onInvalid</code> callback fires when client validation fails before the action runs.
    </p>

    <form (submit)="onSubmit($event)" novalidate>
      <div class="field-stack">
        <mat-form-field>
          <mat-label>Username</mat-label>
          <input matInput [formField]="regForm.username" />
        </mat-form-field>
        @if (regForm.username().touched() && regForm.username().invalid()) {
          <div class="field-errors server-error" role="alert">
            @for (err of regForm.username().errors(); track err) {
              <mat-error>
                @if (err.kind === 'server') { <mat-icon inline>cloud_off</mat-icon> }
                {{ err.message }}
              </mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" [formField]="regForm.email" />
        </mat-form-field>
        @if (regForm.email().touched() && regForm.email().invalid()) {
          <div class="field-errors server-error" role="alert">
            @for (err of regForm.email().errors(); track err) {
              <mat-error>
                @if (err.kind === 'server') { <mat-icon inline>cloud_off</mat-icon> }
                {{ err.message }}
              </mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" [formField]="regForm.password" />
        </mat-form-field>
        @if (regForm.password().touched() && regForm.password().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of regForm.password().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="actions">
        <button mat-flat-button type="submit" [disabled]="regForm().submitting()">
          @if (regForm().submitting()) {
            <mat-progress-spinner mode="indeterminate" diameter="18" />
          } @else {
            <mat-icon>person_add</mat-icon>
          }
          Register
        </button>
        <button mat-stroked-button type="button" (click)="reset()" [disabled]="regForm().submitting()">Reset</button>
      </div>
    </form>

    @if (submittedData()) {
      <mat-card class="result" appearance="outlined">
        <mat-card-content>
          <strong>Registered successfully:</strong>
          <pre>{{ submittedData() | json }}</pre>
        </mat-card-content>
      </mat-card>
    }

    @if (submitError()) {
      <mat-card class="result" appearance="outlined">
        <mat-card-content style="color: #c62828;">{{ submitError() }}</mat-card-content>
      </mat-card>
    }
  `,
})
export class ServerErrors {
  regModel = signal<RegistrationData>({ username: '', email: '', password: '' });

  regForm = form(this.regModel, (p) => {
    required(p.username, { message: 'Username is required' });
    minLength(p.username, 3, { message: 'At least 3 characters' });
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email' });
    required(p.password, { message: 'Password is required' });
    minLength(p.password, 6, { message: 'At least 6 characters' });
  });

  submittedData = signal<RegistrationData | null>(null);
  submitError = signal<string | null>(null);

  onSubmit(event: Event) {
    event.preventDefault();
    this.submittedData.set(null);
    this.submitError.set(null);

    submit(this.regForm, {
      action: async (f) => {
        const result = await mockRegisterUser(f().value());
        if (!result.ok) {
          return result.errors.map((err) => ({
            fieldTree: f[err.field],
            kind: 'server',
            message: err.message,
          }));
        }
        this.submittedData.set(f().value());
        return undefined;
      },
      onInvalid: () => {
        this.submitError.set('Please fix the errors above before submitting.');
      },
    });
  }

  reset() {
    this.regModel.set({ username: '', email: '', password: '' });
    this.regForm().reset();
    this.submittedData.set(null);
    this.submitError.set(null);
  }
}
