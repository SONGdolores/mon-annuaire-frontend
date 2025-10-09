import { TypeStructurePage } from '../../administration/views/typestructure/typeStructure.page';
export interface AdministrationModel {
  id: string;
  nom: string;
  ministereDeTutelle: string | null;
  mission: string;
  quartier: string;
  ville:  { id: string; nom: string } | null;
  cover?: string;
  typeAdministration:  { id: string; libelle: string } | null;
  services:  { id: string; description: string }[]
   horaires: {
    id: string;
    jour: string; 
    heureOuverture: string;
    heureFermeture: string;
  }[];

  contacts: {
    id: string;
    libelle: string;
    type: 'Telephone' | 'Email' | 'Fax' | 'Autre';
  }[];

  images: { id: string; url: string }[];
  latitude?: number;
  longitude?: number;
}

 // imageUrl?: string;

