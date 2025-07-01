import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { TeacherService } from '../teacher.service';
import { Teacher } from '../teacher.model';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    KeyFilterModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  totalRecords = 0;
  rows = 5;
  loading = false;

  sortField = 'nombre';
  sortOrder = 1;

  showDialog = false;
  editingTeacher: Teacher | null = null;
  teacherForm: FormGroup;
  saving = false;

  maxDate: Date = new Date();
  minDate: Date = new Date(1950, 0, 1);

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.teacherForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      especialidad: ['', Validators.required],
      fechaContratacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTeachersLazy({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
  }

  loadTeachersLazy(event: any) {
    this.loading = true;

    const page = event.first / event.rows;
    const size = event.rows;
    const sortField = event.sortField || 'nombre';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.sortField = sortField;
    this.sortOrder = event.sortOrder;

    this.teacherService.getAllPaginated(page, size, sortField, sortOrder).subscribe({
      next: res => {
        this.teachers = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  createTeacher() {
    this.editingTeacher = null;
    this.teacherForm.reset();
    this.showDialog = true;
  }

  editTeacher(id: number) {
    this.teacherService.getById(id).subscribe({
      next: teacher => {
        this.editingTeacher = teacher;
        this.teacherForm.patchValue(teacher);
        this.showDialog = true;
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.mensaje || 'Error al cargar el profesor',
          life: 3000
        });
      }
    });
  }

  saveTeacher() {
    if (this.teacherForm.invalid) return;

    this.saving = true;
    const formValue = this.teacherForm.value;

    const handleSuccess = (msg: string) => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg, life: 3000 });
      this.loadTeachersLazy({ first: 0, rows: this.rows });
      this.showDialog = false;
      this.saving = false;
    };

    const handleError = (err: any, fallback: string) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.mensaje || fallback,
        life: 3000
      });
      this.saving = false;
    };

    if (formValue.id) {
      this.teacherService.update(formValue.id, formValue).subscribe({
        next: () => handleSuccess('Profesor actualizado correctamente'),
        error: err => handleError(err, 'Error al actualizar el profesor')
      });
    } else {
      this.teacherService.create(formValue).subscribe({
        next: () => handleSuccess('Profesor creado correctamente'),
        error: err => handleError(err, 'Error al crear el profesor')
      });
    }
  }

  deleteTeacher(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este profesor?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.teacherService.delete(id).subscribe(() => {
          this.loadTeachersLazy({ first: 0, rows: this.rows, sortField: this.sortField, sortOrder: this.sortOrder });
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Profesor eliminado', life: 3000 });

        });
      }
      
    });
  }
}
