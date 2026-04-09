/**
 * Topic 23 — formRoot: declarative submit wiring — `[formRoot]` on `<form>` plus
 * `submission.action` on `form()` so the field tree and DOM stay in sync.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, FormRoot, required, email, minLength } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

interface FeedbackData {
  name: string;
  email: string;
  feedback: string;
}

const INITIAL_VALUES: FeedbackData = { name: '', email: '', feedback: '' };

@Component({
  selector: 'df-form-root',
  imports: [
    FormField, FormRoot, JsonPipe,
    MatFormField, MatLabel, MatInput, MatError,
    MatButton, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatIcon, MatProgressSpinner,
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
    .how-it-works { margin-top: 24px; max-width: 720px; display: flex; flex-direction: column; gap: 16px; }
    .how-it-works pre { font-size: 12px; line-height: 1.5; }
    .how-it-works ul { margin: 8px 0 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.5; }
    .how-it-works li { margin-bottom: 4px; }
  `,
  template: `
    <h2>23. formRoot Directive</h2>
    <p class="hint">Declarative submit: bind the DOM <code>&lt;form&gt;</code> to your field tree and put async work in <code>submission.action</code>.</p>
    <p class="topic-remark">
      <strong>Template.</strong> Put <code>[formRoot]="myForm"</code> on the form. The directive wires the native submit event to your signal form:
      it adds <code>novalidate</code> (so browser popups do not fight your schema), calls <code>preventDefault()</code>,
      marks fields touched, runs validation, and only runs <code>submission.action</code> when the tree is valid.
      Use <code>type="submit"</code> on the primary button and read <code>myForm().submitting()</code> for spinners and disabled states.
    </p>
    <p class="topic-remark">
      <strong>Form definition.</strong> Pass a third argument to <code>form()</code> with
      <code>submission: {{ '{' }} action: async (f) => … {{ '}' }}</code>
      (the object whose <code>action</code> runs after a valid submit).
      The callback receives the field tree <code>f</code>; use <code>f().value()</code> for the payload, return server validation errors when needed,
      and call <code>f().reset(initial)</code> after success if you want a clean form. The form stays self-contained: no separate <code>onSubmit</code> handler.
    </p>

    <form [formRoot]="feedbackForm">
      <div class="field-stack">
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput [formField]="feedbackForm.name" />
        </mat-form-field>
        @if (feedbackForm.name().touched() && feedbackForm.name().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of feedbackForm.name().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" [formField]="feedbackForm.email" />
        </mat-form-field>
        @if (feedbackForm.email().touched() && feedbackForm.email().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of feedbackForm.email().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Feedback</mat-label>
          <textarea matInput [formField]="feedbackForm.feedback" rows="3"></textarea>
        </mat-form-field>
        @if (feedbackForm.feedback().touched() && feedbackForm.feedback().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of feedbackForm.feedback().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="actions">
        <button mat-flat-button type="submit" [disabled]="feedbackForm().invalid() || feedbackForm().submitting()">
          @if (feedbackForm().submitting()) {
            <mat-progress-spinner mode="indeterminate" diameter="18" />
          } @else {
            <mat-icon>send</mat-icon>
          }
          Send Feedback
        </button>
        <button mat-stroked-button type="button" (click)="reset()" [disabled]="feedbackForm().submitting()">Reset</button>
      </div>
    </form>

    @if (lastSubmission()) {
      <mat-card class="result" appearance="outlined">
        <mat-card-content>
          <strong>Feedback received — thank you!</strong>
          <pre>{{ lastSubmission() | json }}</pre>
        </mat-card-content>
      </mat-card>
    }

    <div class="how-it-works">
      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>How it works — template</mat-card-title></mat-card-header>
        <mat-card-content>
<pre>&lt;form [formRoot]="myForm"&gt;
  &lt;input [formField]="myForm.email" /&gt;
  &lt;button type="submit" [disabled]="myForm().invalid() || myForm().submitting()"&gt;
    Send
  &lt;/button&gt;
&lt;/form&gt;</pre>
          <ul>
            <li><code>novalidate</code> and <code>preventDefault()</code> are applied for you.</li>
            <li>Submit runs validation first; <code>submission.action</code> runs only when valid.</li>
            <li><code>myForm().submitting()</code> is true while <code>action</code> is in flight.</li>
          </ul>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>How it works — <code>form()</code> options</mat-card-title></mat-card-header>
        <mat-card-content>
<pre>form(model, schema, {{ '{' }}
  submission: {{ '{' }}
    action: async (f) => {{ '{' }}
      const value = f().value();
      await send(value);
      f().reset(INITIAL_VALUES);
      return undefined;
    {{ '}' }}
  {{ '}' }}
{{ '}' }});</pre>
          <ul>
            <li><code>f</code> is the field tree — same shape as <code>myForm</code> in the template.</li>
            <li>Return a list of validation errors from <code>action</code> to surface server-side issues on fields.</li>
            <li><code>reset(initial)</code> clears UI state and, with current Angular, aligns the model signal when you pass values.</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class FormRootTopic {
  feedbackModel = signal<FeedbackData>(INITIAL_VALUES);

  feedbackForm = form(this.feedbackModel, (p) => {
    required(p.name, { message: 'Name is required' });
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email' });
    required(p.feedback, { message: 'Feedback is required' });
    minLength(p.feedback, 10, { message: 'At least 10 characters' });
  }, {
    submission: {
      action: async (f) => {
        const value = f().value();
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.lastSubmission.set(value);
        f().reset(INITIAL_VALUES);
        return undefined;
      },
    },
  });

  lastSubmission = signal<FeedbackData | null>(null);

  reset() {
    this.feedbackModel.set(INITIAL_VALUES);
    this.feedbackForm().reset();
    this.lastSubmission.set(null);
  }
}
