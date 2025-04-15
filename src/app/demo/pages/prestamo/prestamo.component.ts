/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageUtils } from 'src/app/utils/message-utils';
import { UsuarioService } from '../usuario/service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { LibroService } from '../libro/service/libro.service';
import { Libro } from 'src/app/models/libro';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {
  titleModal: string = '';
  modoFormulario: string = '';
  modalInstance: any;
  usuarios: Usuario[] = [];
  libros: Libro[] = [];
  fechaDevolucion: string = ''; // ejemplo: '2025-04-07'

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private formBuilder: FormBuilder,
    private messageUtils: MessageUtils,
    private usuarioService: UsuarioService,
    private libroService: LibroService
  ) {
    this.cargarListaUsuarios();
    this.cargarListaLibros();
    this.cargarFormulario();
  }

  cargarListaUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        this.messageUtils.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  cargarListaLibros() {
    this.libroService.getLibros()
    .subscribe({
      next:(data) => {
        this.libros = data;
      },
      error:(error) => {
        console.log(error);
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      activo: ['', [Validators.required]]
    });
  }

  asignarPrestamoModal(modoForm: string) {
    this.titleModal = modoForm == 'C' ? 'Crear nuevo prestamo' : 'Actualizar prestamo';
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearPrestamoModal');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      nombre: '',
      correo: '',
      telefono: '',
      activo: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarPrestamo() {}


  
}
