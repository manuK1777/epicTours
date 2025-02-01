import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrewService } from '../../services/crew.service';
import { Crew } from '@shared/models/crew.model';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-create-crew',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MaterialModule],
  templateUrl: './create-crew.component.html',
  styleUrls: ['./create-crew.component.scss'],
})
export class CreateCrewComponent implements OnInit {
  crewForm: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCrewComponent>,
    private crewService: CrewService,
    @Inject(MAT_DIALOG_DATA) public data: { crew?: Crew; artistId: number }
  ) {
    this.crewForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data?.crew) {
      this.crewForm.patchValue(this.data.crew);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.crewForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const crewData: Crew = {
        artist_id: this.data.artistId,
        name: this.crewForm.get('name')?.value,
        role: this.crewForm.get('role')?.value,
        email: this.crewForm.get('email')?.value,
        phone: this.crewForm.get('phone')?.value,
      };

      const formData = new FormData();
      formData.append('artist_id', String(this.data.artistId));

      Object.keys(this.crewForm.value).forEach((key) => {
        const value = this.crewForm.get(key)?.value;
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      const request = this.data.crew
        ? this.crewService.updateCrewMember(this.data.crew.id!, formData)
        : this.crewService.createCrewMember(formData);

      request.subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error:', error);
          this.isSubmitting = false;
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
