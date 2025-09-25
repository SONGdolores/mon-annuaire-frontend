import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '@/core/services/api.service';

@Component({
  selector: 'app-modal-administration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './modal-administration.component.html',
  styleUrls: ['./modal-administration.component.scss']
})
export class ModalAdministrationComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  apiService = inject(ApiService);
  fb = inject(FormBuilder);

  adminForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoad = signal(true);

  // signaux pour dropdowns
  typeAdministrations = signal<any[]>([]);
  villes = signal<any[]>([]);
  contacts = signal<any[]>([]);
  services = signal<any[]>([]);

  images: string[] = [];

  joursSemaine = [
    { value: 'LUNDI', label: 'Lundi' },
    { value: 'MARDI', label: 'Mardi' },
    { value: 'MERCREDI', label: 'Mercredi' },
    { value: 'JEUDI', label: 'Jeudi' },
    { value: 'VENDREDI', label: 'Vendredi' },
    { value: 'SAMEDI', label: 'Samedi' },
  ];

  ngOnInit(): void {
    this.adminForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      mission: new FormControl('', [Validators.required]),
      ministereDeTutelle: new FormControl(''),
      typeAdministrationId: new FormControl(null, [Validators.required]),
      quartier: new FormControl('', [Validators.required]),
      latitude: new FormControl(null, [Validators.required]),
      longitude: new FormControl(null, [Validators.required]),
      villeId: new FormControl(null),
      contacts: new FormControl([]),
      services: new FormControl([]),
      horaires: this.fb.array([]),
      images: new FormControl([]),
    });

    this.loadDropdowns();
  }

  loadDropdowns() {
    this.apiService.get('type-administration').subscribe({
      next: (d: any) => this.typeAdministrations.set(Array.isArray(d) ? d : Object.values(d))
    });
    this.apiService.get('villes').subscribe({
      next: (d: any) => this.villes.set(Array.isArray(d) ? d : Object.values(d))
    });
    this.apiService.get('contacts').subscribe({
      next: (d: any) => this.contacts.set(Array.isArray(d) ? d : Object.values(d))
    });
    this.apiService.get('services').subscribe({
      next: (d: any) => this.services.set(Array.isArray(d) ? d : Object.values(d))
    });

    this.isLoad.set(false);
  }

  horaires(): FormArray {
    return this.adminForm.get('horaires') as FormArray;
  }

  addHoraire() {
    this.horaires().push(this.fb.group({
      jour: ['', Validators.required],
      heureOuverture: ['', Validators.required],
      heureFermeture: ['', Validators.required],
    }));
  }

  removeHoraire(index: number) {
    this.horaires().removeAt(index);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        // Ici tu peux uploader vers ton backend ou juste stocker un chemin simulé
        const fakeUrl = URL.createObjectURL(file);
        this.images.push(fakeUrl);
      });
      this.adminForm.patchValue({ images: this.images });
    }
  }

  // transforme "08:00" => Date ISO
  private transformTimeToDate(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      const formValue = this.adminForm.value;

      // transformer horaires en DateTime
      const horairesPayload = formValue.horaires.map((h: any) => ({
        jour: h.jour,
        heureOuverture: this.transformTimeToDate(h.heureOuverture),
        heureFermeture: this.transformTimeToDate(h.heureFermeture)
      }));

      const payload = {
        nom: formValue.nom,
        ministereDeTutelle: formValue.ministereDeTutelle,
        mission: formValue.mission,
        typeAdministrationId: formValue.typeAdministrationId,
        quartier: formValue.quartier,
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        villeId: formValue.villeId,
        contacts: formValue.contacts,
        services: formValue.services,
        horaires: horairesPayload,
        images: formValue.images.map((url: string) => ({ url }))
      };
      console.log('Payload envoyé :', payload);

      this.apiService.post('administrations', payload).subscribe({
        next: () => {
          this.successMessage = "Administration créée avec succès";
          this.errorMessage = null;
          console.log('Administration créé avec succès');
          this.activeModal.close('OK')
        },
        error: (err) => {
          console.error('Erreur lors de la création', err);

          if (err.status === 409 || err.error?.message?.includes('existe déjà')) {
            this.errorMessage = "Cette administration existe déjà.";
          } else if (err.status === 400) {

            this.errorMessage = "Veuillez remplir correctement tous les champs obligatoires.";
          } else {
            this.errorMessage = "Erreur lors de la création de l’administration.";
          }

          this.successMessage = null;
        }
      })
    }
  }
};
