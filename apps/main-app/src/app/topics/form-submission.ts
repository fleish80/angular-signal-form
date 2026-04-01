/**
 * Topic 8 — Form submission: wire the template submit event plus `submit(form, asyncFn)` to mark every field touched,
 * then runs the callback only if the tree is valid—standard pattern for “show all errors on submit”.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, email, submit } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'df-form-submission',
  imports: [FormField, JsonPipe, MatFormField, MatLabel, MatInput, MatError, MatButton, MatCard, MatCardContent, MatIcon],
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
    .actions { display: flex; gap: 8px; margin-top: 8px; }
    .result { margin-top: 16px; }
    pre { margin: 0; white-space: pre-wrap; font-size: 13px; }
  `,
  template: `
    <h2>8. Form Submission</h2>
    <p class="hint"><code>submit()</code> marks all fields touched, then runs your action only if valid.</p>
    <p class="topic-remark">
      Use a real <code>type="submit"</code> button so Enter in a field triggers the same handler. The callback is async-friendly (e.g. POST then navigate); if the form is invalid,
      the callback is skipped and you can still set a form-level banner—here we mirror that with <code>submitError</code> after checking <code>loginForm().invalid()</code>.
      <strong>Reset</strong> clears the model and calls <code>loginForm().reset()</code> to drop touched/dirty state.
    </p>

    <!-- (submit): browser fires this on Enter in a field or click on type="submit"; we handle it in TS. -->
    <!-- novalidate: skip native HTML5 validation; Signal Forms validators own the rules and messages. -->
    <form (submit)="onSubmit($event)" novalidate>
      <div class="field-stack">
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" [formField]="loginForm.email" />
        </mat-form-field>
        <!-- Errors only after interaction: untouched fields stay quiet until submit() marks them touched. -->
        @if (loginForm.email().touched() && loginForm.email().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of loginForm.email().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" [formField]="loginForm.password" />
        </mat-form-field>
        @if (loginForm.password().touched() && loginForm.password().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of loginForm.password().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="actions">
        <!-- type="submit" participates in form submit (unlike type="button"). -->
        <button mat-flat-button type="submit">
          <mat-icon>login</mat-icon>
          Login
        </button>
        <button mat-stroked-button type="button" (click)="reset()">Reset</button>
      </div>
    </form>

    <!-- Shown only when submit() ran the success callback (form was valid). -->
    @if (submittedData()) {
      <mat-card class="result" appearance="outlined">
        <mat-card-content>
          <strong>Submitted successfully:</strong>
          <pre>{{ submittedData() | json }}</pre>
        </mat-card-content>
      </mat-card>
    }

    <!-- Set when the form is still invalid after submit(); complements per-field mat-errors. -->
    @if (submitError()) {
      <mat-card class="result" appearance="outlined">
        <mat-card-content style="color: #c62828;">{{ submitError() }}</mat-card-content>
      </mat-card>
    }
  `,
})
export class FormSubmission {
  /** Writable source of truth for field values; the form reads/writes through this signal. */
  loginModel = signal<LoginData>({ email: '', password: '' });

  /** Field tree + schema: binds inputs via `loginForm.email` / `loginForm.password` and runs validators. */
  loginForm = form(this.loginModel, (p) => {
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email' });
    required(p.password, { message: 'Password is required' });
  });

  /** Last payload “accepted” by submit (demo); in a real app you’d set this after a successful API call inside submit’s callback. */
  submittedData = signal<LoginData | null>(null);

  /** Form-level message when submit finds the tree still invalid (fields are already marked touched). */
  submitError = signal<string | null>(null);

  onSubmit(event: Event) {
    // Avoid full page navigation / GET query string from native form behavior.
    event.preventDefault();
    // Fresh attempt: hide previous success and error banners.
    this.submittedData.set(null);
    this.submitError.set(null);

    // `submit` (from @angular/forms/signals): synchronously marks all fields touched, then invokes
    // the callback only if the form is valid. The callback must return a Promise (e.g. async HTTP).
    submit(this.loginForm, async () => {
      // Demo “success”: persist model snapshot. Replace with `await http.post(...)` and map server errors to fields if needed.
      this.submittedData.set(this.loginModel());
      return undefined;
    });

    // Runs in the same turn after `submit` returns: validity/touched updates from `submit` are already applied.
    // If invalid, the callback above did not run; we surface one summary line in addition to per-field errors.
    if (this.loginForm().invalid()) {
      this.submitError.set('Form is invalid. All fields have been marked as touched.');
    }
  }

  reset() {
    // Clear values at the model layer and reset form meta (touched, dirty, etc.) via the field tree API.
    this.loginModel.set({ email: '', password: '' });
    this.loginForm().reset();
    this.submittedData.set(null);
    this.submitError.set(null);
  }
}
