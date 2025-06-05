export interface PetrolProvider {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  tax_id: string;
  bank_account: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PetrolProviderFormData {
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  tax_id: string;
  bank_account: string;
  notes: string;
}

export interface PetrolProviderFilters {
  searchQuery?: string;
}

export interface PetrolProviderSummary {
  totalProviders: number;
  activeProviders: number;
  recentProviders: number;
}
