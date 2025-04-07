/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  usuarioSelected: Usuario;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder
  ) {
    this.cargarListaUsuarios();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      activo: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  crearUsuarioModal(modoForm: string) {
    this.titleModal = modoForm == 'C' ? 'Crear Usuario' : 'Editar Usuario';
    this.modoFormulario = modoForm;
    const modalElement = document.getElementById('crearUsuarioModal');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
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
    this.usuarioSelected = null;
  }

  abrirModoEdicion(usuario: Usuario) {
    this.usuarioSelected = usuario;
    this.form.patchValue({
      nombre: this.usuarioSelected.nombre,
      correo: this.usuarioSelected.correo,
      telefono: this.usuarioSelected.telefono,
      activo: !!this.usuarioSelected.activo // asegura que sea booleano
    });
    this.crearUsuarioModal('E');
  }

  guardarActualizarUsuario() {
    console.log(this.form.valid);
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
    }
    console.log(this.form.getRawValue());    
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        this.usuarioService.guardarUsuarioNuevo(this.form.getRawValue()).subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaUsuarios();
            this.cerrarModal();
          },
          error: (error) => {
            console.log(error);
            this.showMessage('Error', error.error.message, 'error');
          }
        });
      } else {
        const idUsuario = this.usuarioSelected.idUsuario;
        // Actualizar solo los campos específicos
        this.usuarioSelected = {
          ...this.usuarioSelected, // Mantener los valores anteriores
          ...this.form.getRawValue() // Sobrescribir con los valores del formulario
        };
        this.usuarioSelected.idUsuario = idUsuario;
        console.log(this.usuarioSelected);
        // Actualizamos el usuario
        this.usuarioService.actualizarUsuario(this.usuarioSelected).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaUsuarios();
            this.cerrarModal();
            console.log(data);
            this.usuarioSelected = null;
          },
          error: (error) => {
            console.log(error.error.message);
            this.showMessage('Error', error.error.message, 'error');
          }
        });
      }
    }
  }

  public showMessage(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'Aceptar',
      customClass: {
        container: 'position-fixed',
        popup: 'swal-overlay'
      },
      didOpen: () => {
        const swalPopup = document.querySelector('.swal2-popup');
        if (swalPopup) {
          (swalPopup as HTMLElement).style.zIndex = '1060';
        }
      }
    });
  }
}
