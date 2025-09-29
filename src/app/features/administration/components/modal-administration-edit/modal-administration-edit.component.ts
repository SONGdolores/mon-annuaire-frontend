import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '@/core/services/api.service';

@Component({
  selector: 'app-modal-administration-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './modal-administration-edit.component.html',
  styleUrls: ['./modal-administration-edit.component.scss']
})
export class ModalAdministrationEditComponent implements OnInit {

  activeModal = inject(NgbActiveModal);
  apiService = inject(ApiService);
  fb = inject(FormBuilder);

  @Input() administrationId!: string;

  adminForm!: FormGroup;
  typeAdministrations = signal<any[]>([]);
  villes = signal<any[]>([]);
  contacts = signal<any[]>([]);
  services = signal<any[]>([]);

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoad = signal(true);

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
      nom: new FormControl({ value: '', disabled: true }, [Validators.required]),
      mission: new FormControl('', [Validators.required]),
      ministereDeTutelle: new FormControl(''),
      typeAdministrationId: new FormControl(null),
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
    this.loadAdministration();
  }

  loadDropdowns() {
    this.apiService.get('type-administration').subscribe({ next: (d: any) => this.typeAdministrations.set(d) });
    this.apiService.get('villes').subscribe({ next: (d: any) => this.villes.set(d) });
    this.apiService.get('contacts').subscribe({ next: (d: any) => this.contacts.set(d) });
    this.apiService.get('services').subscribe({ next: (d: any) => this.services.set(d) });
  }

  get horaires(): FormArray {
    return this.adminForm.get('horaires') as FormArray;
  }

  addHoraire(h?: any) {
    this.horaires.push(this.fb.group({
      jour: [h?.jour || '', Validators.required],
      heureOuverture: [h?.heureOuverture || '', Validators.required],
      heureFermeture: [h?.heureFermeture || '', Validators.required],
    }));
  }

  removeHoraire(index: number) {
    this.horaires.removeAt(index);
  }

  loadAdministration() {
    this.apiService.get(`administrations/${this.administrationId}`).subscribe({
      next: (data: any) => {
        this.adminForm.patchValue({
          nom: data.nom,
          mission: data.mission,
          ministereDeTutelle: data.ministereDeTutelle,
          typeAdministrationId: data.typeAdministrationId,
          villeId: data.villeId,
          quartier: data.quartier,
          latitude: data.latitude,
          longitude: data.longitude,
          contacts: data.contacts.map((c: any) => c.id),
          services: data.services.map((s: any) => s.id),
          images: data.images.map((i: any) => i.url)
        });
        this.images = data.images.map((i: any) => i.url);

        // Charger les horaires
        if (data.horaires && data.horaires.length) {
          data.horaires.forEach((h: any) => this.addHoraire({
            jour: h.jour,
            heureOuverture: h.heureOuverture.slice(11, 16),
            heureFermeture: h.heureFermeture.slice(11, 16)
          }));
        }
        this.isLoad.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'administration', err);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        const fakeUrl = URL.createObjectURL(file);
        this.images.push(fakeUrl);
      });
      this.adminForm.patchValue({ images: this.images });
    }
  }

  private transformTimeToDate(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      const formValue = this.adminForm.getRawValue();

      const horairesPayload = formValue.horaires.map((h: any) => ({
        jour: h.jour,
        heureOuverture: this.transformTimeToDate(h.heureOuverture),
        heureFermeture: this.transformTimeToDate(h.heureFermeture)
      }));

      const payload = {
        mission: formValue.mission,
        ministereDeTutelle: formValue.ministereDeTutelle,
        typeAdministrationId: formValue.typeAdministrationId,
        quartier: formValue.quartier,
        villeId: formValue.villeId,
        contacts: { connect: formValue.contacts.map((id: string) => ({ id })) },
        services: { connect: formValue.services.map((id: string) => ({ id })) },
        horaires: { create: horairesPayload },
        images: formValue.images.map((url: string) => ({ url }))
      };

      this.apiService.patch(`administrations/${this.administrationId}`, payload).subscribe({
        next: () => {
          this.successMessage = "Administration mise à jour avec succès";
          this.errorMessage = null;
          console.log('Administration mise à jour avec succès');
          this.activeModal.close('OK');
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);


          if (err.status === 404 || err.error?.message?.includes('introuvable')) {
            this.errorMessage = "Cette administration n'existe pas .";
          } else if (err.status === 409 || err.error?.message?.includes('existe déjà')) {
            this.errorMessage = "Une administration avec ce nom existe déjà.";
          } else if (err.status === 400) {
            this.errorMessage = "Veuillez remplir correctement tous les champs obligatoires.";
          } else {
            this.errorMessage = "Erreur lors de la mise à jour de l’administration.";
          }

          this.successMessage = null;
        }
      });
    } else {
      this.adminForm.markAllAsTouched();
      this.errorMessage = "Veuillez remplir les champs obligatoires.";
    }
  }
}
