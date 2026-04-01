/**
 * Topic 13 — Async validation: `validateAsync()` wires a `resource()` to a field.
 * Sync rules must pass first; then `pending()` reflects loading state.
 */
import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';
import {
  debounce,
  form,
  FormField,
  minLength,
  required,
  validateAsync,
} from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';

const TAKEN_USERNAMES = ['admin', 'root', 'angular', 'test', 'user'];

function fakeServerCheck(username: string): Promise<boolean> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(TAKEN_USERNAMES.includes(username.trim().toLowerCase())), 600),
  );
}

@Component({
  selector: 'df-async-validation',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatError, MatProgressSpinner, MatIcon, MatCard, MatCardContent],
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
    .status { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-top: 4px; }
    .status.checking { color: #1565c0; }
    .status.available { color: #2e7d32; }
    .note { margin-top: 24px; }
  `,
  template: `
    <h2>13. Async Validation</h2>
    <p class="hint">Debounced username check (try: admin, root, angular, test, user).</p>
    <p class="topic-remark">
      Sync rules (<code>required</code>, <code>minLength</code>) run first—async validation only fires when the field is sync-valid.
      <code>validateAsync()</code> creates a <code>resource()</code> whose <code>pending()</code> state drives the spinner.
      <code>debounce()</code> limits how often the resource reloads during typing.
    </p>

    <form novalidate>
      <div class="field-stack">
        <mat-form-field>
          <mat-label>Username</mat-label>
          <input matInput [formField]="usernameForm.username" placeholder="Pick a username..." />
        </mat-form-field>
        @if (usernameForm.username().touched() && usernameForm.username().invalid() && !usernameForm.username().pending()) {
          <div class="field-errors" role="alert">
            @for (err of usernameForm.username().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      @if (usernameForm.username().pending()) {
        <div class="status checking">
          <mat-progress-spinner mode="indeterminate" diameter="16" />
          Checking availability...
        </div>
      }

      @if (usernameForm.username().touched() && usernameForm.username().valid() && !usernameForm.username().pending() && usernameForm.username().value()) {
        <div class="status available">
          <mat-icon>check_circle</mat-icon>
          Username is available!
        </div>
      }
    </form>

    <mat-card class="note" appearance="outlined">
      <mat-card-content>
        Replace <code>fakeServerCheck()</code> with a real <code>fetch</code> or <code>httpResource</code> call.
        For a simple GET-by-URL check, use <code>validateHttp()</code> instead.
      </mat-card-content>
    </mat-card>
  `,
})
export class AsyncValidation {
  usernameModel = signal({ username: '' });

  usernameForm = form(this.usernameModel, (p) => {
    required(p.username, { message: 'Username is required' });
    minLength(p.username, 3, { message: 'At least 3 characters' });
    debounce(p.username, 400);

    validateAsync<string, string, { taken: boolean }>(p.username, {
      params: (ctx) => ctx.value(),
      factory: (params) =>
        resource({
          params,
          loader: async ({ params: username }) => ({
            taken: await fakeServerCheck(username ?? ''),
          }),
        }),
      onSuccess: (result, ctx) =>
        result.taken ? { kind: 'usernameTaken', message: `"${ctx.value()}" is already taken` } : null,
      onError: () => ({ kind: 'checkFailed', message: 'Could not verify availability' }),
    });
  });
}
