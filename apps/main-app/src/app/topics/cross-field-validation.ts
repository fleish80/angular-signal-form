/**
 * Topic 5 — Cross-field validation: inside `validate()`, `valueOf(p.otherField)` reads another path’s value
 * reactively so rules like “confirm password” re-run when either field changes.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, minLength, validate } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'df-cross-field-validation',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatError, MatIcon],
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
    .match-status { display: flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 13px; padding: 8px 12px; border-radius: 6px; }
    .match-status.match { background: #e8f5e9; color: #2e7d32; }
    .match-status.no-match { background: #fbe9e7; color: #c62828; }
  `,
  template: `
    <h2>5. Cross-Field Validation</h2>
    <p class="hint">Use <code>valueOf()</code> inside <code>validate()</code> to access other field values reactively.</p>
    <p class="topic-remark">
      The confirm field’s validator compares its <code>value()</code> to <code>valueOf(p.password)</code>—no manual subscriptions.
      If the user fixes the primary password, the mismatch error clears automatically when values align. This pattern scales to any dependent field (e.g. end date after start date).
    </p>

    <form novalidate>
      <div class="field-stack">
        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" [formField]="pwForm.password" />
        </mat-form-field>
        @if (pwForm.password().touched() && pwForm.password().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of pwForm.password().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Confirm Password</mat-label>
          <input matInput type="password" [formField]="pwForm.confirmPassword" />
        </mat-form-field>
        @if (pwForm.confirmPassword().touched() && pwForm.confirmPassword().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of pwForm.confirmPassword().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      @if (pwForm.confirmPassword().touched() && pwForm.confirmPassword().value()) {
        <div class="match-status" [class.match]="pwForm.confirmPassword().valid()" [class.no-match]="pwForm.confirmPassword().invalid()">
          <mat-icon>{{ pwForm.confirmPassword().valid() ? 'check_circle' : 'cancel' }}</mat-icon>
          {{ pwForm.confirmPassword().valid() ? 'Passwords match' : 'Passwords do not match' }}
        </div>
      }
    </form>
  `,
})
export class CrossFieldValidation {
  pwModel = signal({ password: '', confirmPassword: '' });

  pwForm = form(this.pwModel, (p) => {
    required(p.password, { message: 'Password is required' });
    minLength(p.password, 8, { message: 'Password must be at least 8 characters' });
    required(p.confirmPassword, { message: 'Please confirm your password' });
    validate(p.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(p.password)) {
        return { kind: 'passwordMismatch', message: 'Passwords do not match' };
      }
      return null;
    });
  });
}
