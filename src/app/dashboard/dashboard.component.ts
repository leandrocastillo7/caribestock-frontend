import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h1 style="color: #006994;">Dashboard</h1>
      
      <div *ngIf="loading" style="text-align: center;">Cargando...</div>
      
      <div *ngIf="!loading">
        <div style="display: flex; gap: 20px; margin-bottom: 30px;">
          <div style="background: white; padding: 20px; border-radius: 12px; flex: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3>Total Productos</h3>
            <p style="font-size: 32px; font-weight: bold;">{{ totalProductos }}</p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 12px; flex: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3>Stock Bajo</h3>
            <p style="font-size: 32px; font-weight: bold; color: #f59e0b;">{{ stockBajo }}</p>
          </div>
        </div>
        <div
  *ngIf="productosStockBajo.length > 0"
  style="
    background:#fee2e2;
    border:2px solid #ef4444;
    color:#b91c1c;
    border-radius:12px;
    padding:20px;
    margin-bottom:20px;
  ">

  <h2>⚠ Productos con Stock Bajo</h2>

  <div
    *ngFor="let producto of productosStockBajo"
    style="padding:8px 0;">

    📦 <strong>{{ producto.nombre }}</strong>
    → Stock actual:
    <strong>{{ producto.stock }}</strong>

  </div>

</div>
        <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2>Últimos Movimientos</h2>
          <div *ngFor="let m of ultimosMovimientos" style="border-bottom: 1px solid #ddd; padding: 12px;">
            <strong>{{ m.nombreProducto }}</strong> - {{ m.tipo === 'entrada' ? '➕ Entrada' : '➖ Salida' }} - {{ m.cantidad }} unidades - {{ m.fecha | date:'short' }}
          </div>
          <div *ngIf="ultimosMovimientos.length === 0" style="text-align: center; padding: 20px;">
            No hay movimientos
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  totalProductos = 0;
  stockBajo = 0;
  productosStockBajo: any[] = [];
  ultimosMovimientos: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    
    this.api.getProductos().subscribe({
      next: (productos: any) => {
        this.totalProductos = productos.length;
      this.productosStockBajo = productos.filter(
  (p: any) => p.stock < 5
);

this.stockBajo = this.productosStockBajo.length;
        
        this.api.getMovimientos().subscribe({
          next: (movimientos: any) => {
           this.ultimosMovimientos = movimientos.slice(0, 5).map((mov: any) => {
  return {
    ...mov,
    nombreProducto: mov.productoId?.nombre || 'Producto desconocido'
  };
});
            this.loading = false;
            console.log('Dashboard actualizado:', this.ultimosMovimientos);
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }
} 
