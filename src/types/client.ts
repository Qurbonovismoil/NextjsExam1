export interface Address {
  address: string;
  city: string;
  country: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  address: Address;
  company: string;
  role: string;
  status: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  image: string;
  role: string;
}
