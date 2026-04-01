import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { form, FormField, debounce } from '@angular/forms/signals';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

/**
 * Topic 12 — Debounce: `debounce(path, ms)` batches rapid keystrokes before committing to the model, reducing work
 * (search, HTTP) while keeping the control responsive. Blur and submit flush pending values so nothing is lost.
 */

/** Two string fields so we can compare immediate vs debounced binding to the same model shape. */
interface SearchData {
  query: string;
  delayedQuery: string;
}

@Component({
  selector: 'df-debounce',
  imports: [FormField, MatFormField, MatLabel, MatInput, MatCard, MatCardContent, MatCardHeader, MatCardTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 { margin: 0 0 4px; }
    .hint { color: #666; font-size: 14px; margin: 0 0 8px; }
    .topic-remark { color: #555; font-size: 14px; line-height: 1.55; margin: 0 0 24px; max-width: 640px; }
    .topic-remark code { font-size: 13px; }
    .demo { display: flex; flex-direction: column; gap: 16px; max-width: 460px; }
    .comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .value { font-family: monospace; font-size: 14px; word-break: break-all; }
    .note { margin-top: 16px; }
    pre { margin: 0; }
  `,
  template: `
    <h2>12. Debounce</h2>
    <p class="hint"><code>debounce()</code> delays model updates. Compare a debounced field vs an immediate one.</p>
    <p class="topic-remark">
      The immediate field updates the signal on every change—fine for short forms. The debounced field keeps the UI typing smooth but only pushes to <code>delayedQuery</code> after quiet time,
      so validators or HTTP keyed off that value fire less often. The counters illustrate how many times each <strong>committed</strong> model value actually changed.
    </p>

    <div class="demo">
      <mat-form-field>
        <mat-label>Immediate (no debounce)</mat-label>
        <input matInput [formField]="searchForm.query" placeholder="Type fast..." />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Debounced (500ms)</mat-label>
        <input matInput [formField]="searchForm.delayedQuery" placeholder="Type fast..." />
      </mat-form-field>

      <div class="comparison">
        <mat-card appearance="outlined">
          <mat-card-header><mat-card-title>Immediate value</mat-card-title></mat-card-header>
          <mat-card-content><div class="value">"{{ searchForm.query().value() }}"</div></mat-card-content>
        </mat-card>
        <mat-card appearance="outlined">
          <mat-card-header><mat-card-title>Debounced value</mat-card-title></mat-card-header>
          <mat-card-content><div class="value">"{{ searchForm.delayedQuery().value() }}"</div></mat-card-content>
        </mat-card>
      </div>

      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Update count</mat-card-title></mat-card-header>
        <mat-card-content><div class="value">Immediate: {{ immediateCount() }} | Debounced: {{ debouncedCount() }}</div></mat-card-content>
      </mat-card>
    </div>

    <mat-card class="note" appearance="outlined">
      <mat-card-content>
        The debounced field only syncs to the model after 500ms of inactivity.
        On blur or form submission, it syncs immediately (no data loss).
      </mat-card-content>
    </mat-card>
  `,
})
export class DebounceTopic {
  /** Source of truth for both inputs; only `delayedQuery` is debounced in the schema below. */
  searchModel = signal<SearchData>({ query: '', delayedQuery: '' });

  /** Call `debounce(field, ms)` inside the schema callback to delay writes from the control to the model. */
  searchForm = form(this.searchModel, (p) => {
    debounce(p.delayedQuery, 500);
  });

  // Demo-only: track how often each field’s model value actually changes (debounced updates are fewer).
  private prevImmediate = '';
  private prevDebounced = '';
  private immCount = 0;
  private debCount = 0;

  /** Increments whenever `query`’s committed value changes (every keystroke once synced). */
  immediateCount = computed(() => {
    const val = this.searchForm.query().value();
    if (val !== this.prevImmediate) { this.prevImmediate = val; this.immCount++; }
    return this.immCount;
  });

  /** Increments only when `delayedQuery` flushes (after quiet period, blur, or submit). */
  debouncedCount = computed(() => {
    const val = this.searchForm.delayedQuery().value();
    if (val !== this.prevDebounced) { this.prevDebounced = val; this.debCount++; }
    return this.debCount;
  });
}
