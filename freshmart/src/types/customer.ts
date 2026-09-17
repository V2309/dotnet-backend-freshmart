// ============================================================================
// Types cho Khách hàng & Tích điểm VIP (Khớp với Backend DTOs)
// ============================================================================

export type LoyaltyTier = 'Deal' | 'Silver' | 'Gold' | 'Diamond' | 'Thân thiết' | 'Bạc' | 'Vàng' | 'Kim Cương';

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  points: number;
  totalSpent: number;
  tier: LoyaltyTier;
  lastVisit?: string;
  isActive?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerRequest {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  tier?: LoyaltyTier;
  initialPoints?: number;
  notes?: string;
}

export interface UpdateCustomerRequest {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  tier?: LoyaltyTier;
  isActive?: boolean;
  notes?: string;
}

export interface CustomerFilterParams {
  search?: string;
  tier?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
