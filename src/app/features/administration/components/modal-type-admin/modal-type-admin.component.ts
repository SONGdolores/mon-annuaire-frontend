import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-modal-type-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-type-admin.component.html',
  styleUrls: ['./modal-type-admin.component.scss']
})
export class ModalTypeAdminComponent implements OnInit {

  activeModal = inject(NgbActiveModal);
  apiService = inject(ApiService);
  fd = inject(FormBuilder);

  typeAdminForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoad = signal(true)

  ngOnInit(): void {
    this.typeAdminForm = new FormGroup({
      libelle: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.typeAdminForm.valid) {
      const typeAdminData = this.typeAdminForm.value;

      this.apiService.post('type-administration', typeAdminData).subscribe({
        next: (response) => {
          console.log('Type d’administration créé avec succès', response);

          // Affiche le message de succès
          this.successMessage = "Le type d’administration a été créé avec succès";
          this.errorMessage = null;

          this.activeModal.close('OK');
        },
        error: (err) => {
          console.error('Erreur lors de la création du type d’administration ', err);

          this.errorMessage = "Ce type d’administration existe deja";

          this.successMessage = null;

        }
      });
    } else {
      this.typeAdminForm.markAllAsTouched();

      // Message formulaire invalide
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
    }
  }
}


