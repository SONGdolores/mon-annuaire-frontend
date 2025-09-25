/*import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { AdministrationModel } from '../../models/administration.model';

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit {


  @Input() administrations: AdministrationModel[] = [];
  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [0, 0],
      zoom: 2
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.administrations.forEach(admin => {
      if (admin.latitude && admin.longitude) {
        L.marker([admin.latitude, admin.longitude])
          .addTo(this.map)
          .bindPopup(`<b>${admin.nom}</b><br>${admin.ville}`);
      }
    });
  }

}
*/