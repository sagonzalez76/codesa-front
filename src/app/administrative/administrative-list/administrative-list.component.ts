// src/app/administrativos/administrativo-list/administrativo-list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Administrativo } from '../administrative.model';
import { AdministrativoService } from '../administrative.service';

@Component({
  selector: 'app-administrativo-list',
  standalone: true,
  templateUrl: './administrative-list.component.html',
  styleUrls: ['./administrative-list.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class AdministrativoListComponent implements OnInit {
  administrativos: Administrativo[] = [];
  totalRecords = 0;
  rows = 5;
  loading = false;

  showDialog = false;
  editingAdministrativo: Administrativo | null = null;
  administrativoForm: FormGroup;
  saving = false;

  maxDate: Date = new Date();
  minDate: Date = new Date(1900, 0, 1);

  sortField: string = 'nombre';
  sortOrder: number = 1;

  constructor(
    private fb: FormBuilder,
    private administrativoService: AdministrativoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.administrativoForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      cargo: ['', Validators.required],
      departamento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAdministrativosLazy({
      first: 0,
      rows: this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    });
  }

  loadAdministrativosLazy(event: any) {
    this.loading = true;

    const page = event.first / event.rows;
    const size = event.rows;
    const sortField = event.sortField || 'nombre';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.sortField = sortField;
    this.sortOrder = event.sortOrder;

    this.administrativoService.getAllPaginated(page, size, sortField, sortOrder).subscribe({
      next: res => {
        this.administrativos = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar administrativos'
        });
      }
    });
  }

  createAdministrativo() {
    this.editingAdministrativo = null;
    this.administrativoForm.reset();
    this.showDialog = true;
  }

  editAdministrativo(id: number) {
    this.administrativoService.getById(id).subscribe({
      next: administrativo => {
        this.editingAdministrativo = administrativo;
        this.administrativoForm.patchValue(administrativo);
        this.showDialog = true;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar administrativo'
        });
      }
    });
  }

  saveAdministrativo() {
    if (this.administrativoForm.invalid) return;

    this.saving = true;
    const formValue = this.administrativoForm.value;

    const handleSuccess = (msg: string) => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg });
      this.loadAdministrativosLazy({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
      this.showDialog = false;
      this.saving = false;
    };

    const handleError = (err: any, fallback: string) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.mensaje || fallback
      });
      this.saving = false;
    };

    if (formValue.id) {
      this.administrativoService.update(formValue.id, formValue).subscribe({
        next: () => handleSuccess('Administrativo actualizado correctamente'),
        error: (err) => handleError(err, 'Error al actualizar')
      });
    } else {
      this.administrativoService.create(formValue).subscribe({
        next: () => handleSuccess('Administrativo creado correctamente'),
        error: (err) => handleError(err, 'Error al crear administrativo')
      });
    }
  }

  deleteAdministrativo(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este administrativo?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.administrativoService.delete(id).subscribe(() => {
          this.loadAdministrativosLazy({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
        });
      }
    });
  }
}
