/**
 * Profile form shape, default model factories, and per-section schema builders — same layering as
 * brianmtreese/signal-forms-composition-example-after (NG-DE “large forms” talk).
 */
import { required, pattern, type SchemaPathTree } from '@angular/forms/signals';

export interface Account {
  firstName: string;
  lastName: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Preferences {
  marketingOptIn: boolean;
}

export interface Profile {
  account: Account;
  shippingAddress: Address;
  preferences: Preferences;
}

export function createAccountModel(): Account {
  return { firstName: '', lastName: '' };
}

export function createAddressModel(): Address {
  return { street: '', city: '', state: '', zip: '' };
}

export function createPreferencesModel(): Preferences {
  return { marketingOptIn: false };
}

export function createProfileModel(): Profile {
  return {
    account: createAccountModel(),
    shippingAddress: createAddressModel(),
    preferences: createPreferencesModel(),
  };
}

export function buildAccountSection(a: SchemaPathTree<Account>) {
  required(a.firstName, { message: 'First name is required' });
  required(a.lastName, { message: 'Last name is required' });
}

export function buildAddressSection(a: SchemaPathTree<Address>) {
  required(a.street, { message: 'Street is required' });
  required(a.city, { message: 'City is required' });
  required(a.state, { message: 'State is required' });
  required(a.zip, { message: 'ZIP code is required' });
  pattern(a.zip, /^\d{5}$/, { message: 'ZIP code must be 5 digits' });
}

/** Preferences have no validators in the reference example — hook is here for team rules. */
export function buildPreferencesSection(_p: SchemaPathTree<Preferences>) {
  void _p;
}
