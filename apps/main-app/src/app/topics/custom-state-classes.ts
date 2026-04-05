/**
 * Topic 20 — Branded or conditional CSS classes: map any class name to a predicate on the FormField directive.
 * Continues the global config idea from https://www.youtube.com/watch?v=J6sA2L4Z1xY
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, provideSignalFormsConfig, required } from '@angular/forms/signals';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';

/** Same states as NG_STATUS_CLASSES, but `app-*` prefix and stricter invalid styling. */
const APP_STATE_CLASSES: Record<string, (field: FormField<unknown>) => boolean> = {
  'app-touched': (f) => f.state().touched(),
  'app-untouched': (f) => !f.state().touched(),
  'app-dirty': (f) => f.state().dirty(),
  'app-pristine': (f) => !f.state().dirty(),
  'app-valid': (f) => f.state().valid(),
  /** Only flag invalid after touch — avoids red outlines on pristine empty fields. */
  'app-invalid': (f) => f.state().invalid() && f.state().touched(),
  'app-pending': (f) => f.state().pending(),
};

@Component({
  selector: 'df-custom-state-classes',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatError, MatCard, MatCardContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [...provideSignalFormsConfig({ classes: APP_STATE_CLASSES })],
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 720px; }
    .topic-remark code { font-size: 13px; }
    form { display: flex; flex-direction: column; gap: 16px; max-width: 460px; }
    input.app-invalid { box-shadow: inset 0 0 0 2px #c62828; border-radius: 4px; }
    input.app-valid.app-touched { box-shadow: inset 0 0 0 2px #2e7d32; border-radius: 4px; }
  `,
  template: `
    <h2>20. Custom state classes</h2>
    <p class="hint">Replace <code>NG_STATUS_CLASSES</code> with your own map: class names → predicates receiving the <code>FormField</code> directive.</p>
    <p class="topic-remark">
      Predicates can combine signals — here <code>app-invalid</code> applies only when the field is both invalid and touched, which is a common UX tweak
      you would previously duplicate in every template. Same global mechanism as topic 19; this component uses <code>providers</code> on the component for a
      self-contained demo. See
      <a href="https://angular.dev/api/forms/signals/SignalFormsConfig" target="_blank" rel="noopener">SignalFormsConfig</a>.
    </p>

    <form novalidate>
      <mat-form-field>
        <mat-label>Work email</mat-label>
        <input matInput type="email" [formField]="contactForm.email" placeholder="you@company.com" />
        @if (contactForm.email().touched() && contactForm.email().invalid()) {
          @for (err of contactForm.email().errors(); track err) {
            <mat-error>{{ err.message }}</mat-error>
          }
        }
      </mat-form-field>
    </form>

    <mat-card appearance="outlined">
      <mat-card-content>
        <strong>Predicate shape</strong> (Angular passes the <code>FormField</code> instance):
        <pre style="margin: 8px 0 0; font-size: 12px; overflow: auto;">'app-invalid': (field) => field.state().invalid() && field.state().touched(),</pre>
      </mat-card-content>
    </mat-card>
  `,
})
export class CustomStateClassesTopic {
  contactModel = signal({ email: '' });

  contactForm = form(this.contactModel, (p) => {
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email' });
  });
}
