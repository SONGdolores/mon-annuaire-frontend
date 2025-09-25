import { ApiService } from '@/core/services/api.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detailspage',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './detailsPage.page.html',
  styleUrls: ['./detailsPage.page.scss'],
})
export class DetailsPagePage implements OnInit {

  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private router = inject(Router);

  administration = signal<any | null>(null);

  quartier = '';
  latitude: number | null = null;
  longitude: number | null = null;

  nouveauContactLibelle = '';
  nouveauContactType = 'Telephone';

  nouveauServiceDescription = '';

  joursSemaine = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  nouveauHoraireJour = 'LUNDI';
  nouveauHoraireOuverture = '';
  nouveauHoraireFermeture = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAdministration(id);
    }
  }

  private loadAdministration(id: string) {
    this.api.get(`administrations/${id}`).subscribe({
      next: (data: any) => {
        console.log('Administration récupérée : ', data);

      data.contacts = data.contacts || [];
      data.services = data.services || [];
      data.horaires = data.horaires || [];

        this.administration.set(data);
        this.quartier = data.quartier || '';
        this.latitude = data.latitude || null;
        this.longitude = data.longitude || null;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l’administration:', err);
      }
    });
  }

  annuler() {
    this.router.navigate(['/administration']);
  }


  //methodes pour ajouter les ervices horaires ets

  updateAdresse() {
    const currentAdmin = this.administration();
    if (!currentAdmin) return;

    const payload = {
      quartier: this.quartier,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.api.patch(`administrations/${currentAdmin.id}`, payload).subscribe({
      next: (updated: any) => {
        console.log('Adresse mise à jour');
        this.administration.set({ ...currentAdmin, ...updated });
      },
      error: err => console.error('Erreur mise à jour adresse', err)
    });
  }


ajouterContact() {
  if (!this.nouveauContactLibelle) return;

  const currentAdmin = this.administration();
  if (!currentAdmin) return;

    const newContact = {
    libelle: this.nouveauContactLibelle,
    type: this.nouveauContactType,
    administrationId: currentAdmin.id
  };


  const updatedAdmin = {
    ...currentAdmin,
    contacts: [...(currentAdmin.contacts || []), newContact]
  };
  this.administration.set(updatedAdmin);

  this.nouveauContactLibelle = '';
  this.nouveauContactType = 'Telephone';

  this.api.post(`contacts`, newContact).subscribe({
    next: () => console.log('Contact ajouté'),
    error: err => {
      console.error('Erreur ajout contact', err);

    }
  });
}


  ajouterService() {
  if (!this.nouveauServiceDescription) return;


  const currentAdmin = this.administration();
  if (!currentAdmin) return;

  const newService = {
    description: this.nouveauServiceDescription,
    administrationId: currentAdmin.id
  };

  const updatedAdmin = {
    ...currentAdmin,
    services: [...(currentAdmin.services || []), newService]
  };
  this.administration.set(updatedAdmin);

  this.nouveauServiceDescription = '';

  this.api.post(`services`, newService).subscribe({
    next: () => console.log('Service ajouté'),
    error: err => {
      console.error('Erreur ajout service', err);
    }
  });
}


  ajouterHoraire() {
  if (!this.nouveauHoraireJour || !this.nouveauHoraireOuverture || !this.nouveauHoraireFermeture) return;

   const currentAdmin = this.administration();
  if (!currentAdmin) return;


  const newHoraire = {
    jour: this.nouveauHoraireJour,
    heureOuverture: this.nouveauHoraireOuverture,
    heureFermeture: this.nouveauHoraireFermeture,
    administrationId: currentAdmin.id
  };

  const updatedAdmin = {
    ...currentAdmin,
    horaires: [...(currentAdmin.horaires || []), newHoraire]
  };
  this.administration.set(updatedAdmin);

  // vider les champs
  this.nouveauHoraireJour = 'LUNDI';
  this.nouveauHoraireOuverture = '';
  this.nouveauHoraireFermeture = '';

  this.api.post(`horaires`, newHoraire).subscribe({
    next: () => console.log('Horaire ajouté'),
    error: err => {
      console.error('Erreur ajout horaire', err);
    }
  });
}

}

