import { PhoneNumber } from 'libphonenumber-js';
export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    ext: string | null;
  }
