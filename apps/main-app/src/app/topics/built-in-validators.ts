/**
 * Topic 3 — Built-in Validators: the schema callback registers required, email, numeric min/max, string lengths, and pattern.
 * Field and form validity are signals; this demo shows errors after touch to match typical UX.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, email, min, max, minLength, maxLength, pattern } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatChip } from '@angular/material/chips';

interface RegistrationData {
  username: string;
  email: string;
  age: number;
  bio: string;
  phone: string;
}

@Component({
  selector: 'df-built-in-validators',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatError, MatChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    form { display: flex; flex-direction: column; gap: 16px; max-width: 460px; }
    /* Errors live below the outline: mat-form-field only projects mat-error into the subscript
       when MatInput.errorState is already true; with @if + signal forms that can desync and
       drop mat-error into the infix (inside the red outline). */
    .field-stack { display: flex; flex-direction: column; align-items: stretch; }
    .field-stack mat-form-field { width: 100%; }
    .field-stack .field-errors {
      margin-top: 4px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .form-status { margin-top: 16px; }
  `,
  template: `
    <h2>3. Built-in Validators</h2>
    <p class="hint">All built-in validators: required, email, min, max, minLength, maxLength, pattern.</p>
    <p class="topic-remark">
      The second argument to <code>form()</code> is a function that receives schema paths (<code>p.username</code>, …) and attaches rules.
      Each rule pushes structured errors you can list with <code>field.errors()</code>. <code>regForm().valid()</code> aggregates the whole tree—useful for disabling submit.
      We render errors outside <code>mat-form-field</code> so Material’s error state stays consistent with signal-driven messages.
    </p>

    <form novalidate>
      <div class="field-stack">
        <mat-form-field>
          <mat-label>Username</mat-label>
          <input matInput [formField]="regForm.username" />
        </mat-form-field>
        @if (regForm.username().touched() && regForm.username().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of regForm.username().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
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
          <div class="field-errors" role="alert">
            @for (err of regForm.email().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Age</mat-label>
          <input matInput type="number" [formField]="regForm.age" />
        </mat-form-field>
        @if (regForm.age().touched() && regForm.age().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of regForm.age().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Bio (max 200 chars)</mat-label>
          <textarea matInput [formField]="regForm.bio" rows="2"></textarea>
        </mat-form-field>
        @if (regForm.bio().touched() && regForm.bio().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of regForm.bio().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Phone (555-123-4567)</mat-label>
          <input matInput [formField]="regForm.phone" placeholder="555-123-4567" />
        </mat-form-field>
        @if (regForm.phone().touched() && regForm.phone().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of regForm.phone().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>
    </form>

    <div class="form-status">
      <mat-chip [highlighted]="regForm().valid()">
        Form is {{ regForm().valid() ? 'valid' : 'invalid' }}
      </mat-chip>
    </div>
  `,
})
export class BuiltInValidators {
  regModel = signal<RegistrationData>({ username: '', email: '', age: 0, bio: '', phone: '' });

  regForm = form(this.regModel, (p) => {
    required(p.username, { message: 'Username is required' });
    minLength(p.username, 3, { message: 'Username must be at least 3 characters' });
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email address' });
    required(p.age, { message: 'Age is required' });
    min(p.age, 18, { message: 'You must be at least 18' });
    max(p.age, 120, { message: 'Please enter a valid age' });
    maxLength(p.bio, 200, { message: 'Bio cannot exceed 200 characters' });
    pattern(p.phone, /^\d{3}-\d{3}-\d{4}$/, { message: 'Phone must be in format: 555-123-4567' });
  });
}
