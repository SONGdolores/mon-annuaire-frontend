import { Component, Input } from '@angular/core';
import { AdministrationModel } from '../../models/administration.model';
import L from 'leaflet';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , HeaderComponent],
  templateUrl: './carte.page.html',
  styleUrls: ['./carte.page.scss'],
})
export class CartePage {


  @Input() administrations: AdministrationModel[] = [];
  filteredAdmins: AdministrationModel[] = [];
  searchQuery = new FormControl('');
  selectedAdministration: AdministrationModel | null = null;

  private map!: L.Map;
  private markers!: any;

  ngAfterViewInit(): void {
    this.filteredAdmins = [...this.administrations];
    this.initMap();
  }

  private initMap(): void {

    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);


    this.markers = (L as any).markerClusterGroup();

    this.administrations.forEach(administration => {
      if (administration.latitude && administration.longitude) {
        const marker = L.marker([administration.latitude, administration.longitude])
          .bindPopup(`
            <b>${administration.nom}</b><br>
            ${administration.ville?.nom || ''}
          `);
        this.markers.addLayer(marker);
      }
    });

    this.map.addLayer(this.markers);


    if (this.administrations.length) {
      const group = L.featureGroup(
        this.administrations
          .filter(a => a.latitude && a.longitude)
          .map(a => L.marker([a.latitude!, a.longitude!]))
      );
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }

  filterAdmins() {
     const query = this.searchQuery.value?.toLowerCase() || '';
    this.filteredAdmins = this.administrations.filter(administration =>
      administration.nom.toLowerCase().includes(query) ||
      (administration.ville?.nom.toLowerCase().includes(query)) ||
      (administration.typeAdministration?.libelle.toLowerCase().includes(query))
    );
  }

  selectAdmin(administration: AdministrationModel) {
    this.selectedAdministration = administration;
    if (this.map && administration.latitude && administration.longitude) {
      this.map.setView([administration.latitude, administration.longitude], 14);
    }
  }
}
