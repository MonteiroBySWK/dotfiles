export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: "active" | "inactive" | "prospect";
  projects?: string[];
  contacts?: ClientContact[];
  address?: Address;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  isPrimary: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}
