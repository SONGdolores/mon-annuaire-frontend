import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';
import { ApiService } from '../../../../core/services/api.service';
import { ModalUserEditComponent } from '../../components/modal-user-edit/modal-user-edit.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgbModalModule],
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage {
  private modalService = inject(NgbModal);
  private apiService = inject(ApiService);



  users = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage: string | null = null;

  ngOnInit() {
    this.getUsers()
  }

  open() {
    const modal = this.modalService.open(ModalUserComponent);
    modal.result.catch((res: any) => {
      if (res === 'OK') {
        this.getUsers()
      }
    });
  }

  openEdit(user: any) {
  const modalRef = this.modalService.open(ModalUserEditComponent);
  modalRef.componentInstance.user = user;

  modalRef.result.then((res: any) => {
    if (res === 'OK') {
      this.getUsers();
    }
  });
}


  getUsers() {
    this.isLoading.set(true)
    this.apiService.get('utilisateurs').subscribe({
      next: (data: any) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage = "Impossible de charger les utilisateurs";
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  deleteUser(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.apiService.delete('utilisateurs', id).subscribe({
        next: () => {
          this.getUsers()
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l’utilisateur', err);
        }
      });
    }
  }

}

