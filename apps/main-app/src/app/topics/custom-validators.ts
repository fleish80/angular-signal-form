/**
 * Topic 4 — Custom Validators: `validate(path, fn)` runs your logic; return an error object or null.
 * Extract helpers that take `SchemaPath<T>` to reuse rules across forms like built-in validators.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, validate, type SchemaPath } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';

function noSpaces(path: SchemaPath<string>, options?: { message?: string }) {
  validate(path, ({ value }) => {
    if (value().includes(' ')) {
      return { kind: 'noSpaces', message: options?.message ?? 'Value cannot contain spaces' };
    }
    return null;
  });
}

function httpsUrl(path: SchemaPath<string>, options?: { message?: string }) {
  validate(path, ({ value }) => {
    const v = value();
    if (v && !v.startsWith('https://')) {
      return { kind: 'https', message: options?.message ?? 'URL must start with https://' };
    }
    return null;
  });
}

@Component({
  selector: 'df-custom-validators',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatError, MatCard, MatCardContent],
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
    .note { margin-top: 24px; }
  `,
  template: `
    <h2>4. Custom Validators</h2>
    <p class="hint">Use <code>validate()</code> for inline custom logic, or extract reusable validator functions.</p>
    <p class="topic-remark">
      The callback receives a small context (e.g. <code>value()</code> as a signal). Use a stable <code>kind</code> on returned errors if you branch in the UI.
      <code>noSpaces</code> and <code>httpsUrl</code> show how to package the same pattern as <code>required()</code>: one function, one path, optional messages.
    </p>

    <form novalidate>
      <div class="field-stack">
        <mat-form-field>
          <mat-label>Username</mat-label>
          <input matInput [formField]="signupForm.username" />
        </mat-form-field>
        @if (signupForm.username().touched() && signupForm.username().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of signupForm.username().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Website URL</mat-label>
          <input matInput [formField]="signupForm.website" placeholder="https://example.com" />
        </mat-form-field>
        @if (signupForm.website().touched() && signupForm.website().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of signupForm.website().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>
    </form>

    <mat-card class="note" appearance="outlined">
      <mat-card-content>
        <strong>Reusable validators:</strong> <code>noSpaces()</code> and <code>httpsUrl()</code> are
        extracted functions that can be used across any form. They follow the same pattern as built-in validators.
      </mat-card-content>
    </mat-card>
  `,
})
export class CustomValidators {
  signupModel = signal({ username: '', website: '' });

  signupForm = form(this.signupModel, (p) => {
    required(p.username, { message: 'Username is required' });
    noSpaces(p.username, { message: 'Username cannot contain spaces' });
    validate(p.username, ({ value }) => {
      if (value().startsWith('admin')) {
        return { kind: 'reserved', message: 'Username cannot start with "admin"' };
      }
      return null;
    });
    httpsUrl(p.website, { message: 'Website must use HTTPS' });
  });
}
