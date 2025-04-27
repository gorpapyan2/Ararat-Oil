import { supabase } from "@/integrations/supabase/client";

export interface PetrolProvider {
  id: string;
  name: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
}

export async function fetchPetrolProviders() {
  const { data, error } = await supabase
    .from("petrol_providers")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as PetrolProvider[];
}

export async function createPetrolProvider(
  provider: Omit<PetrolProvider, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("petrol_providers")
    .insert(provider)
    .select()
    .single();

  if (error) throw error;
  return data as PetrolProvider;
}

export async function updatePetrolProvider(
  id: string,
  provider: Partial<PetrolProvider>,
) {
  const { data, error } = await supabase
    .from("petrol_providers")
    .update(provider)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PetrolProvider;
}

export async function deletePetrolProvider(id: string) {
  const { error } = await supabase
    .from("petrol_providers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
