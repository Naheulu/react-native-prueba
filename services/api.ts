// Conexión a l'API de backend
export const API_URL = 'https://backend-production-1b45.up.railway.app';

export type Plato = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  imagenUrl: string;
};

export async function getPlatos(): Promise<Plato[]> {
  const res = await fetch(`${API_URL}/api/platos`);

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  return res.json();
}