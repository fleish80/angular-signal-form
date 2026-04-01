/**
 * Topic 11 — Custom controls: components implement `FormValueControl<T>` (value model) or `FormCheckboxControl` (checked model)
 * so `[formField]` can bind without ControlValueAccessor—ideal for stars, toggles, and design-system widgets.
 */
import { ChangeDetectionStrategy, Component, computed, model, input, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, min, max, type FormValueControl, type FormCheckboxControl } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'df-star-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
  styles: `
    :host { display: inline-flex; gap: 2px; }
    .star { cursor: pointer; transition: color 0.1s; user-select: none; }
    .star.filled { color: #ffc107; }
    .star:not(.filled) { color: #ccc; }
    .star.disabled { cursor: not-allowed; opacity: 0.5; }
  `,
  template: `
    @for (star of stars(); track $index) {
      <mat-icon
        class="star"
        [class.filled]="star.filled"
        [class.disabled]="disabled()"
        (click)="!disabled() && setValue(star.value)"
      >{{ star.filled ? 'star' : 'star_border' }}</mat-icon>
    }
  `,
})
export class StarRating implements FormValueControl<number> {
  value = model(0);
  disabled = input(false);

  stars = computed(() => {
    const current = this.value();
    return Array.from({ length: 5 }, (_, i) => ({ value: i + 1, filled: i < current }));
  });

  setValue(val: number) { this.value.set(val); }
}

@Component({
  selector: 'df-toggle-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: inline-block; }
    .toggle { width: 44px; height: 24px; border-radius: 12px; background: #ccc; position: relative; cursor: pointer; transition: background 0.2s; }
    .toggle.active { background: var(--mat-sys-primary); }
    .toggle.disabled { opacity: 0.5; cursor: not-allowed; }
    .knob { width: 20px; height: 20px; border-radius: 50%; background: white; position: absolute; top: 2px; left: 2px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .toggle.active .knob { left: 22px; }
  `,
  template: `
    <div class="toggle" [class.active]="checked()" [class.disabled]="disabled()" (click)="!disabled() && toggle()">
      <div class="knob"></div>
    </div>
  `,
})
export class ToggleSwitch implements FormCheckboxControl {
  checked = model(false);
  disabled = input(false);
  toggle() { this.checked.update((v) => !v); }
}

interface ReviewData { rating: number; comment: string; recommend: boolean; }

@Component({
  selector: 'df-custom-controls',
  imports: [
    FormField,
    StarRating,
    ToggleSwitch,
    JsonPipe,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    form { display: flex; flex-direction: column; gap: 16px; max-width: 460px; }
    .field-label { font-weight: 500; font-size: 14px; margin-bottom: 4px; }
    .inline { display: flex; align-items: center; gap: 12px; }
    .field-stack { display: flex; flex-direction: column; align-items: stretch; }
    .field-stack mat-form-field { width: 100%; }
    .field-stack .field-errors {
      margin-top: 4px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .errors { color: #d32f2f; font-size: 13px; margin-top: 4px; }
    .model-output { margin-top: 24px; }
    .note { margin-top: 16px; }
    pre { margin: 0; white-space: pre-wrap; font-size: 13px; }
  `,
  template: `
    <h2>11. Custom Controls</h2>
    <p class="hint">Implement <code>FormValueControl</code> or <code>FormCheckboxControl</code> -- no ControlValueAccessor needed.</p>
    <p class="topic-remark">
      Signal Forms looks for model signals named <code>value</code> or <code>checked</code> and optional <code>disabled</code> input—match the interface and the directive wires validation and state like a native input.
      Star rating is a numeric value control; the toggle is boolean checkbox semantics. You still use the same schema rules (<code>min</code>/<code>max</code>, <code>required</code>) as on text fields.
    </p>

    <form novalidate>
      <div>
        <div class="field-label">Rating</div>
        <df-star-rating [formField]="reviewForm.rating" />
        @if (reviewForm.rating().touched() && reviewForm.rating().invalid()) {
          <div class="errors">
            @for (err of reviewForm.rating().errors(); track err) {
              <div>{{ err.message }}</div>
            }
          </div>
        }
      </div>

      <div class="field-stack">
        <mat-form-field>
          <mat-label>Comment</mat-label>
          <textarea matInput [formField]="reviewForm.comment" rows="3"></textarea>
        </mat-form-field>
        @if (reviewForm.comment().touched() && reviewForm.comment().invalid()) {
          <div class="field-errors" role="alert">
            @for (err of reviewForm.comment().errors(); track err) {
              <mat-error>{{ err.message }}</mat-error>
            }
          </div>
        }
      </div>

      <div class="inline">
        <span class="field-label">Would you recommend?</span>
        <df-toggle-switch [formField]="reviewForm.recommend" />
      </div>
    </form>

    <mat-card class="note" appearance="outlined">
      <mat-card-content>
        <code>StarRating</code> implements <code>FormValueControl&lt;number&gt;</code> with a <code>value</code> model signal.
        <code>ToggleSwitch</code> implements <code>FormCheckboxControl</code> with a <code>checked</code> model signal.
        Both work with <code>[formField]</code> automatically.
      </mat-card-content>
    </mat-card>

    <mat-card class="model-output" appearance="outlined">
      <mat-card-header><mat-card-title>Model value (live)</mat-card-title></mat-card-header>
      <mat-card-content><pre>{{ reviewModel() | json }}</pre></mat-card-content>
    </mat-card>
  `,
})
export class CustomControls {
  reviewModel = signal<ReviewData>({ rating: 0, comment: '', recommend: false });

  reviewForm = form(this.reviewModel, (p) => {
    min(p.rating, 1, { message: 'Please select a rating' });
    max(p.rating, 5, { message: 'Rating cannot exceed 5' });
    required(p.comment, { message: 'Please leave a comment' });
  });
}
