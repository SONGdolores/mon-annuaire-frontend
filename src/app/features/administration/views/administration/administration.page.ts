import { Component, inject, OnInit, signal } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '@/core/services/api.service';
import { ModalAdministrationComponent } from '../../components/modal-administration/modal-administration.component';
import { ModalAdministrationEditComponent } from '../../components/modal-administration-edit/modal-administration-edit.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [NgbModalModule, RouterLink],
  templateUrl: './administration.page.html',
  styleUrls: ['./administration.page.scss'],
})
export class AdministrationPage implements OnInit {
  private modalService = inject(NgbModal);
  private apiService = inject(ApiService);

  administrations = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage: string | null = null;

  ngOnInit() {
    this.getAdministrations();
  }


  open() {
    const modal = this.modalService.open(ModalAdministrationComponent);
    modal.result.catch((res: any) => {
      if (res === 'OK') {
        this.getAdministrations();
      }
    });
  }



  openEdit(administration: any) {
    const modalRef = this.modalService.open(ModalAdministrationEditComponent);
    modalRef.componentInstance.administrationId = administration.id;

    modalRef.result.catch((res: any) => {
      if (res === 'OK') {
        this.getAdministrations();
      }
    });
  }
     

  // Charger administrations
  getAdministrations() {
    this.isLoading.set(true);
    this.apiService.get('administrations').subscribe({
      next: (data: any) => {
        console.log(data);
        this.administrations.set(data.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage = 'Erreur de chargement des administrations';
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }


  deleteAdministration(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette administration ?')) {
      this.apiService.delete('administrations', id).subscribe({
        next: () => {
          this.getAdministrations();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
        }
      });
    }
  }

}
