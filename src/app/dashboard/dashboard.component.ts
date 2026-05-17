import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalProductos = 0;
  stockBajo = 0;
  ultimosMovimientos: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.api.getProductos().subscribe({
      next: (productos: any) => {
        this.totalProductos = productos.length;
        this.stockBajo = productos.filter((p: any) => p.stock < 5).length;
        this.loading = false;
      },
      error: () => this.loading = false
    });

    this.api.getMovimientos().subscribe({
      next: (movimientos: any) => {
        this.ultimosMovimientos = movimientos.slice(0, 5);
      }
    });
  }
}