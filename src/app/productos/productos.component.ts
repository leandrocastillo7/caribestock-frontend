import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
      error: () => {
        this.loading = false;
      }
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
        alert('Producto creado');
      },
      error: (err) => alert('Error: ' + err.error?.error)
    });
  }

  // INICIAR EDICIÓN
  editarProducto(producto: any): void {
    this.editando = { ...producto };
  }

  // GUARDAR EDICIÓN
  guardarEdicion(): void {
    this.api.updateProducto(this.editando._id, this.editando).subscribe({
      next: () => {
        this.cargarProductos();
        this.editando = null;
        alert('Producto actualizado');
      },
      error: (err) => alert('Error: ' + err.error?.error)
    });
  }

  // CANCELAR EDICIÓN
  cancelarEdicion(): void {
    this.editando = null;
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
  exportarPDF(): void {

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('IDEAS LAB', 14, 20);

  doc.setFontSize(12);
  doc.text('Reporte de Inventario CaribeStock', 14, 30);

  doc.text(
    'Fecha: ' + new Date().toLocaleString(),
    14,
    40
  );

  const datos = this.productos.map(p => [
    p.nombre,
    '$' + p.precio.toLocaleString(),
    p.stock
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Producto', 'Precio', 'Stock']],
    body: datos
  });

  const stockBajo = this.productos.filter(
    p => p.stock < 5
  );

  let posicion =
    (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(14);
  doc.text('Productos con Stock Bajo', 14, posicion);

  posicion += 10;

  stockBajo.forEach(producto => {
    doc.text(
      `⚠ ${producto.nombre} - Stock: ${producto.stock}`,
      14,
      posicion
    );

    posicion += 8;
  });

  doc.save('Inventario-CaribeStock.pdf');
}

}
