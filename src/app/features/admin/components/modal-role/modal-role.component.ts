import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../core/services/api.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-modal-role',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './modal-role.component.html',
  styleUrls: ['./modal-role.component.scss']
})
export class ModalRoleComponent implements OnInit {

  activeModal = inject(NgbActiveModal);
  apiService = inject(ApiService);
  fd = inject(FormBuilder);

  roleForm!: FormGroup;
  permissions = signal<any[]>([]);
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoad = signal(true)

  ngOnInit(): void {
    this.roleForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      permissions: new FormControl([], [Validators.required]),
    });
    this.loadPermissions();
  }

  loadPermissions() {
    this.apiService.get('permissions').subscribe({
      next: (data: any) => { this.permissions.set(data); this.isLoad.set(false) },
      error: (err) => console.error('Erreur lors du chargement des permissions', err)
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const roleData = this.roleForm.value;

      this.apiService.post('roles', roleData).subscribe({
        next: (response) => {
          console.log('Rôle créé avec succès', response);

          // Affiche le message de succès
          this.successMessage = "le role a été créé avec succès";
        },
        error: (err) => {
          console.error('Erreur lors de la création du rôle', err);

          this.errorMessage = "Ce role existe deja";

          this.successMessage = null;

        }
      });
    } else {
      this.roleForm.markAllAsTouched();

      // Message formulaire invalide
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
    }
  }
}

