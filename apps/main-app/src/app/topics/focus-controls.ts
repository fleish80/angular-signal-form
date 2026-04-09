/**
 * Topic 22 — Focus Controls: use `focusBoundControl()` on a FieldTree node to move the browser
 * focus to its bound UI element—no ViewChild, ElementRef, or nativeElement needed.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, email, minLength, submit } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

interface SignupData {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'df-focus-controls',
  imports: [
    FormField, JsonPipe,
    MatFormField, MatLabel, MatInput, MatError,
    MatButton, MatCard, MatCardContent, MatIcon,
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
    .focus-buttons { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .actions { display: flex; gap: 8px; margin-top: 8px; }
    .result { margin-top: 16px; }
    pre { margin: 0; white-space: pre-wrap; font-size: 13px; }
  `,
  template: `
    <h2>22. Focus Controls</h2>
    <p class="hint"><code>focusBoundControl()</code> moves browser focus to a field's bound element.</p>
    <p class="topic-remark">
      Previously, focusing a form field programmatically required <code>ViewChild</code> + <code>ElementRef</code> +
      <code>nativeElement.focus()</code>. Signal Forms expose <code>focusBoundControl()</code> on every <code>FieldTree</code>
      node, so you can ask the form to focus a field directly—great for "focus first error on submit" or
      keyboard-shortcut workflows.
    </p>

    <div class="focus-buttons">
      <button mat-stroked-button (click)="focusField('username')">
        <mat-icon>keyboard</mat-icon> Focus Username
      </button>
      <button mat-stroked-button (click)="focusField('email')">
        <mat-icon>keyboard</mat-icon> Focus Email
      </button>
      <button mat-stroked-button (click)="focusField('password')">
        <mat-icon>keyboard</mat-icon> Focus Password
      </button>
      <button mat-flat-button (click)="focusFirstInvalid()">
        <mat-icon>error_outline</mat-icon> Focus First Invalid
      </button>
    </div>

    <form (submit)="onSubmit($event)" novalidate>
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
          <mat-label>Email</mat-label>
          <input matInput type="email" [formField]="signupForm.email" />
        </mat-form-field>
        @if (signupForm.email().touched() && signupForm.email().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of signupForm.email().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" [formField]="signupForm.password" />
        </mat-form-field>
        @if (signupForm.password().touched() && signupForm.password().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of signupForm.password().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="actions">
        <button mat-flat-button type="submit">
          <mat-icon>person_add</mat-icon> Sign Up
        </button>
        <button mat-stroked-button type="button" (click)="reset()">Reset</button>
      </div>
    </form>

    @if (submitted()) {
      <mat-card class="result" appearance="outlined">
        <mat-card-content>
          <strong>Signed up successfully!</strong>
          <pre>{{ signupModel() | json }}</pre>
        </mat-card-content>
      </mat-card>
    }
  `,
})
export class FocusControls {
  signupModel = signal<SignupData>({ username: '', email: '', password: '' });

  signupForm = form(this.signupModel, (p) => {
    required(p.username, { message: 'Username is required' });
    minLength(p.username, 3, { message: 'At least 3 characters' });
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email' });
    required(p.password, { message: 'Password is required' });
    minLength(p.password, 6, { message: 'At least 6 characters' });
  });

  submitted = signal(false);

  focusField(field: keyof SignupData) {
    this.signupForm[field]().focusBoundControl();
  }

  focusFirstInvalid() {
    const fields: (keyof SignupData)[] = ['username', 'email', 'password'];
    for (const field of fields) {
      if (this.signupForm[field]().invalid()) {
        this.signupForm[field]().focusBoundControl();
        return;
      }
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(false);

    submit(this.signupForm, {
      action: async () => {
        this.submitted.set(true);
        return undefined;
      },
      onInvalid: () => {
        this.focusFirstInvalid();
      },
    });
  }

  reset() {
    this.signupModel.set({ username: '', email: '', password: '' });
    this.signupForm().reset();
    this.submitted.set(false);
  }
}
