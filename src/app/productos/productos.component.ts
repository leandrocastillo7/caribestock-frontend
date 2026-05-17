import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  nuevoProducto = { nombre: '', precio: 0, stock: 0 };
  editando: any = null;
  mostrarModal = false;
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.api.getProductos().subscribe({
      next: (data: any) => {
        this.productos = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  crearProducto(): void {
    if (!this.nuevoProducto.nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    this.api.createProducto(this.nuevoProducto).subscribe({
      next: () => {
        this.cargarProductos();
        this.nuevoProducto = { nombre: '', precio: 0, stock: 0 };
      },
      error: (err) => alert('Error: ' + err.error?.error)
    });
  }

  abrirModal(producto: any): void {
    this.editando = { ...producto };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.editando = null;
  }

  guardarEdicion(): void {
    this.api.updateProducto(this.editando._id, this.editando).subscribe({
      next: () => {
        this.cargarProductos();
        this.cerrarModal();
        alert('Producto actualizado');
      },
      error: (err) => alert('Error: ' + err.error?.error)
    });
  }

  eliminarProducto(id: string): void {
    if (confirm('¿Eliminar este producto?')) {
      this.api.deleteProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
          alert('Producto eliminado');
        },
        error: (err) => alert('Error: ' + err.error?.error)
      });
    }
  }
}