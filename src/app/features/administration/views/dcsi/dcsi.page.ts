import { Component, inject, signal } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../core/services/api.service';
import { ModalDcsiComponent } from '../../components/modal-dcsi/modal-dcsi.component';
import { ModalDcsiEditComponent } from '../../components/modal-dcsi-edit/modal-dcsi-edit.component';

@Component({
  selector: 'app-dcsi',
  standalone: true,
  imports: [NgbModalModule],
  templateUrl: './dcsi.page.html',
  styleUrls: ['./dcsi.page.scss'],
})
export class DcsiPage {
  private modalService = inject(NgbModal);
  private apiService = inject(ApiService);

  dcsiList = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage: string | null = null;

  ngOnInit() {
    this.getDcsi();
  }

  // Ouvrir la modale d'ajout
  openAdd() {
    const modalRef = this.modalService.open(ModalDcsiComponent);
    modalRef.result.catch((res: any) => {
      if (res === 'OK') {
        this.getDcsi();
      }
    });
  }

  // Ouvrir la modale d'édition
  openEdit(dcsi: any) {
    const modalRef = this.modalService.open(ModalDcsiEditComponent);
    modalRef.componentInstance.dcsi = dcsi;

    modalRef.result.then((res: any) => {
      if (res === 'OK') {
        this.getDcsi();
      }
    });
  }

  // Récupérer la liste des DCSI
  getDcsi() {
    this.isLoading.set(true);
    this.apiService.get('dcsi').subscribe({
      next: (data: any) => {
        this.dcsiList.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage = "Impossible de charger les DCSI";
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  // Supprimer un DCSI
  deleteDcsi(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce DCSI ?')) {
      this.apiService.delete('dcsi', id).subscribe({
        next: () => {
          this.getDcsi();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du DCSI', err);
        }
      });
    }
  }
}
