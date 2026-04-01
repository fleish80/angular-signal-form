/**
 * Topic 1 — Basic Form: introduces `form(signal)` and `[formField]` so the UI reads and writes the same
 * WritableSignal that holds your DTO. No validators yet; focus on binding and live model preview.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField } from '@angular/forms/signals';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

interface FeedbackData {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'df-basic-form',
  imports: [FormField, JsonPipe, MatFormField, MatLabel, MatInput, MatCard, MatCardHeader, MatCardTitle, MatCardContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    form { display: flex; flex-direction: column; gap: 4px; max-width: 460px; }
    .model-output { margin-top: 24px; }
    pre { margin: 0; white-space: pre-wrap; font-size: 13px; }
  `,
  template: `
    <h2>1. Basic Form</h2>
    <p class="hint">The simplest signal form: a signal model + <code>form()</code> + <code>[formField]</code> directive.</p>
    <p class="topic-remark">
      <code>feedbackModel</code> is the single source of truth. Calling <code>form(this.feedbackModel)</code> builds a field tree
      (<code>feedbackForm.name</code>, etc.) that two-way binds through <code>[formField]</code>: typing updates the signal, and
      <code>feedbackModel.set(...)</code> elsewhere would update the inputs. This is the foundation for every later topic (validators, submit, arrays).
    </p>

    <form>
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput [formField]="feedbackForm.name" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput type="email" [formField]="feedbackForm.email" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Message</mat-label>
        <textarea matInput [formField]="feedbackForm.message" rows="3"></textarea>
      </mat-form-field>
    </form>

    <mat-card class="model-output" appearance="outlined">
      <mat-card-header><mat-card-title>Model value (live)</mat-card-title></mat-card-header>
      <mat-card-content><pre>{{ feedbackModel() | json }}</pre></mat-card-content>
    </mat-card>
  `,
})
export class BasicForm {
  feedbackModel = signal<FeedbackData>({ name: '', email: '', message: '' });
  feedbackForm = form(this.feedbackModel);
}
