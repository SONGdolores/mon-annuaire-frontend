import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-modal-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent {

  activeModal = inject(NgbActiveModal);
  fb = inject(FormBuilder);
  apiService = inject(ApiService);

  //@Input() name: string = '';

  userForm!: FormGroup;
  roles: any[] = [];
  errorMessage: string |null = null;
  successMessage: string |null = null;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      login: ['', Validators.required],
      mot_de_passe: ['', Validators.required],
      roleId: ['', Validators.required]
    });
    this.loadRoles();
  }

  loadRoles(): void {
    this.apiService.get('roles').subscribe({
      next: (data: any) => this.roles = data,
      error: (err) => console.error('Erreur lors du chargement de role', err)
    });
  }


  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      this.apiService.post('utilisateurs', userData).subscribe({
        next: (response: any) => {
          console.log('user créé avec succes', response);
          this.successMessage = "l'utilisateur a été créé avec succès";
          this.activeModal.dismiss('OK');
        },
        error: (err) => {
          console.error('erreur lors de la creation des utilisateurs' , err);

          if(err.error?.message) {
            this.errorMessage = err.error.message; //message back
          } else {
             this.errorMessage = "une erreur est survenu lors de la creation des utilisateurs;" 
          }
          this.successMessage = null
        }
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
