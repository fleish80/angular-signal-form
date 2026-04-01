/**
 * Topic 10 — Schema composition: extract a function that accepts `SchemaPathTree<SomeShape>` and call it for
 * nested objects and inside `applyEach` for arrays—one definition of “contact” reused everywhere.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, email, minLength, applyEach, type SchemaPathTree } from '@angular/forms/signals';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

/** One person’s name + email — reused as a nested object and as array items. */
interface Contact {
  firstName: string;
  lastName: string;
  email: string;
}

/** Form model: one “owner” contact plus a list of additional contacts. */
interface AddressBook {
  owner: Contact;
  contacts: Contact[];
}

/**
 * Reusable schema for any subtree shaped like `Contact`.
 *
 * `SchemaPathTree<Contact>` is not the runtime value; it is the typed tree of *paths*
 * into the model (e.g. `owner.firstName`, `contacts[2].email`). Validators registered
 * here attach to those paths and line up with `[formField]="..."` in the template.
 *
 * Call this once per place a `Contact` appears: e.g. `contactSchema(p.owner)` and
 * `applyEach(p.contacts, contactSchema)` for each array element.
 */
function contactSchema(contact: SchemaPathTree<Contact>) {
  required(contact.firstName, { message: 'First name is required' });
  required(contact.lastName, { message: 'Last name is required' });
  required(contact.email, { message: 'Email is required' });
  email(contact.email, { message: 'Enter a valid email' });
}

/** Default row value when adding a new contact (schema + template bind to these fields). */
const emptyContact: Contact = { firstName: '', lastName: '', email: '' };

@Component({
  selector: 'df-schema-composition',
  imports: [
    FormField,
    JsonPipe,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIcon,
    MatCard,
    MatCardActions,
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
    form { display: flex; flex-direction: column; gap: 12px; max-width: 540px; }
    .contact-card { display: flex; flex-direction: column; gap: 4px; }
    .contact-card mat-card-actions { padding: 0 16px 16px; }
    .model-output { margin-top: 24px; }
    pre { margin: 0; white-space: pre-wrap; font-size: 13px; }
    .note { margin-top: 16px; }
  `,
  template: `
    <h2>10. Schema Composition</h2>
    <p class="hint">Extract reusable schema functions and apply them with <code>applyEach()</code>.</p>
    <p class="topic-remark">
      <code>contactSchema(p.owner)</code> and <code>applyEach(p.contacts, contactSchema)</code> attach the same rules at different paths—DRY without losing type-safe paths.
      Array-level constraints (here <code>minLength(p.contacts, 1)</code>) complement per-row validation. When you add a card, the new row automatically picks up <code>contactSchema</code>.
    </p>

    <!--
      [formField] binds each input to the path object from bookForm (same paths validated in contactSchema).
      Owner: bookForm.owner.* — validated by contactSchema(p.owner).
      @for: c is one contact’s path tree — same shape as owner; validated by applyEach(p.contacts, contactSchema).
    -->
    <form novalidate>
      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Owner (uses contactSchema)</mat-card-title></mat-card-header>
        <mat-card-content class="contact-card">
          <mat-form-field>
            <mat-label>First Name</mat-label>
            <input matInput [formField]="bookForm.owner.firstName" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Last Name</mat-label>
            <input matInput [formField]="bookForm.owner.lastName" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput type="email" [formField]="bookForm.owner.email" />
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      @for (c of bookForm.contacts; track $index; let i = $index) {
        <mat-card appearance="outlined">
          <mat-card-header><mat-card-title>Contact {{ i + 1 }} (same schema)</mat-card-title></mat-card-header>
          <mat-card-content class="contact-card">
            <mat-form-field>
              <mat-label>First Name</mat-label>
              <input matInput [formField]="c.firstName" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>Last Name</mat-label>
              <input matInput [formField]="c.lastName" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput type="email" [formField]="c.email" />
            </mat-form-field>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="warn" type="button" (click)="removeContact(i)">
              <mat-icon>delete</mat-icon> Remove
            </button>
          </mat-card-actions>
        </mat-card>
      }

      <button mat-stroked-button type="button" (click)="addContact()">
        <mat-icon>add</mat-icon> Add Contact
      </button>
    </form>

    <mat-card class="note" appearance="outlined">
      <mat-card-content>
        The same <code>contactSchema()</code> function validates both the owner and each contact in the array.
      </mat-card-content>
    </mat-card>

    <mat-card class="model-output" appearance="outlined">
      <mat-card-header><mat-card-title>Model value (live)</mat-card-title></mat-card-header>
      <mat-card-content><pre>{{ bookModel() | json }}</pre></mat-card-content>
    </mat-card>
  `,
})
export class SchemaComposition {
  /**
   * Single source of truth for the form. `form()` reads/writes through this signal;
   * inputs use `bookForm.*` paths derived from the same shape.
   */
  bookModel = signal<AddressBook>({ owner: { ...emptyContact }, contacts: [{ ...emptyContact }] });

  /**
   * `form(model, schemaFn)` builds field state from `model` and runs `schemaFn` once to
   * register validators. The callback receives `p`: a `SchemaPathTree<AddressBook>` — the
   * same nesting as the model (`owner`, `contacts`, leaf fields) but as bindable paths.
   */
  bookForm = form(this.bookModel, (p) => {
    // One-off application: validate the nested `owner` object with the shared contact rules.
    contactSchema(p.owner);

    // Array-level rule: at least one contact row (separate from per-row field validation).
    minLength(p.contacts, 1, { message: 'Add at least one contact' });

    // For each `contacts[i]`, run `contactSchema` with that element’s path tree — same rules as `p.owner`.
    applyEach(p.contacts, contactSchema);
  });

  /** Pushes a new row into `contacts`; `bookForm` and `applyEach` pick it up from the updated model. */
  addContact() {
    this.bookModel.update((m) => ({ ...m, contacts: [...m.contacts, { ...emptyContact }] }));
  }

  /** Removes a row by index; remaining indices stay validated via `applyEach`. */
  removeContact(index: number) {
    this.bookModel.update((m) => ({ ...m, contacts: m.contacts.filter((_, i) => i !== index) }));
  }
}
