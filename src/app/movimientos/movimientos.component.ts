import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  productos: any[] = [];
  movimientos: any[] = [];
  nuevoMovimiento = { productoId: '', tipo: 'entrada', cantidad: 1 };
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarMovimientos();
  }

  cargarProductos(): void {
    this.api.getProductos().subscribe({
      next: (data: any) => this.productos = data
    });
  }

  cargarMovimientos(): void {
    this.api.getMovimientos().subscribe({
      next: (data: any) => {
        this.movimientos = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  registrarMovimiento(): void {
    if (!this.nuevoMovimiento.productoId) {
      alert('Selecciona un producto');
      return;
    }
    if (this.nuevoMovimiento.cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    this.api.createMovimiento(this.nuevoMovimiento).subscribe({
      next: (res: any) => {
        alert(`Movimiento registrado. Stock actual: ${res.stockActual}`);
        this.cargarMovimientos();
        this.cargarProductos();
        this.nuevoMovimiento = { productoId: '', tipo: 'entrada', cantidad: 1 };
      },
      error: (err) => alert('Error: ' + err.error?.error)
    });
  }

  obtenerNombreProducto(id: string): string {
    const producto = this.productos.find(p => p._id === id);
    return producto ? producto.nombre : 'Producto eliminado';
  }
}