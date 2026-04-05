/**
 * Topic 19 — Restore reactive-forms-style `ng-*` status classes on `[formField]` hosts via global config.
 * Pairs with Brian Treese's walkthrough: https://www.youtube.com/watch?v=J6sA2L4Z1xY
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
import { MatCard, MatCardContent } from '@angular/material/card';

const TAKEN = ['admin', 'taken'];

function fakeTakenCheck(name: string): Promise<boolean> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(TAKEN.includes(name.trim().toLowerCase())), 500),
  );
}

@Component({
  selector: 'df-ng-status-classes',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatError, MatCard, MatCardContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 720px; }
    .topic-remark code { font-size: 13px; }
    form { display: flex; flex-direction: column; gap: 16px; max-width: 460px; }
    .devtools-hint {
      margin-top: 8px;
      padding: 12px 14px;
      background: #f5f5f5;
      border-radius: 8px;
      font-size: 13px;
      color: #444;
    }
    /* Highlight ng-* on the actual input (MatInput keeps [formField] on the input element). */
    input.ng-invalid.ng-touched { box-shadow: inset 0 0 0 2px #c62828; border-radius: 4px; }
    input.ng-valid.ng-touched { box-shadow: inset 0 0 0 2px #2e7d32; border-radius: 4px; }
    input.ng-pending { box-shadow: inset 0 0 0 2px #1565c0; border-radius: 4px; }
  `,
  template: `
    <h2>19. NG status classes</h2>
    <p class="hint">
      <code>provideSignalFormsConfig(&#123; classes: NG_STATUS_CLASSES &#125;)</code> — same <code>ng-touched</code> /
      <code>ng-dirty</code> / <code>ng-valid</code> / <code>ng-invalid</code> / <code>ng-pending</code> as reactive forms.
    </p>
    <p class="topic-remark">
      Signal Forms do not add these classes until you opt in (see
      <a href="https://angular.dev/api/forms/signals/provideSignalFormsConfig" target="_blank" rel="noopener">provideSignalFormsConfig</a>).
      This route registers <code>NG_STATUS_CLASSES</code> from <code>&#64;angular/forms/signals/compat</code> via its route
      <code>providers</code> so only this page turns the feature on. Try username <code>admin</code> or <code>taken</code> to see
      <code>ng-pending</code> while the async check runs. Walkthrough:
      <a href="https://www.youtube.com/watch?v=J6sA2L4Z1xY" target="_blank" rel="noopener">Angular signal forms: automatic state classes</a>.
    </p>

    <form novalidate>
      <mat-form-field>
        <mat-label>Username</mat-label>
        <input matInput [formField]="demoForm.username" placeholder="Type, blur, try admin…" />
        @if (demoForm.username().touched() && demoForm.username().invalid() && !demoForm.username().pending()) {
          @for (err of demoForm.username().errors(); track err) {
            <mat-error>{{ err.message }}</mat-error>
          }
        }
      </mat-form-field>
    </form>

    <p class="devtools-hint">
      Inspect the <code>&lt;input&gt;</code>: classes toggle on the host bound with <code>[formField]</code> — no manual
      <code>[class.ng-invalid]</code> bindings in the template.
    </p>

    <mat-card appearance="outlined">
      <mat-card-content>
        <strong>App config pattern</strong> — register once for the whole app in <code>app.config.ts</code>:
        <pre style="margin: 8px 0 0; font-size: 12px; overflow: auto;">providers: [
  ...provideSignalFormsConfig(&#123; classes: NG_STATUS_CLASSES &#125;),
]</pre>
      </mat-card-content>
    </mat-card>
  `,
})
export class NgStatusClassesTopic {
  usernameModel = signal({ username: '' });

  demoForm = form(this.usernameModel, (p) => {
    required(p.username, { message: 'Username is required' });
    minLength(p.username, 2, { message: 'At least 2 characters' });
    debounce(p.username, 300);

    validateAsync<string, string, { taken: boolean }>(p.username, {
      params: (ctx) => ctx.value(),
      factory: (params) =>
        resource({
          params,
          loader: async ({ params: username }) => ({
            taken: await fakeTakenCheck(username ?? ''),
          }),
        }),
      onSuccess: (result, ctx) =>
        result.taken ? { kind: 'taken', message: `"${ctx.value()}" is already taken` } : null,
      onError: () => ({ kind: 'checkFailed', message: 'Could not verify' }),
    });
  });
}
