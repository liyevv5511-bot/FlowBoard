import { nanoid } from 'nanoid';

/** Yeni forma / obyekt üçün qısa, toqquşmayan identifikator yaradır. */
export const createId = (): string => nanoid(10);
