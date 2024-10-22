import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {Router, RouterModule} from "@angular/router";
import { CommonModule, DatePipe} from "@angular/common";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {UserProfileService} from "../../services";


@Component({
    selector: 'app-user',
    standalone: true,
    templateUrl: 'user.component.html',
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatFormField,
        MatProgressSpinner,
        MatCard,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
    ],
    providers: [NzModalService, DatePipe],
    styleUrl: 'user.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {



    profileForm: FormGroup;
    isSubmitting = false;
    profileImageUrl: string | ArrayBuffer | null = null;  // Initialized with null
    selectedFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private userProfileService: UserProfileService,
        private router: Router
    ) {
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.pattern('^[0-9]*$')]
        });
    }

    ngOnInit() {
        this.userProfileService.getUserProfile().subscribe((data) => {
            this.profileForm.patchValue(data);
            if (data.profileImage) {
                this.profileImageUrl = data.profileImage || null;  // Ensure it’s not undefined
            }
        });
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.profileImageUrl = e.target?.result ?? null;  // Handle undefined gracefully
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    onSubmit() {
        if (this.profileForm.invalid) return;

        this.isSubmitting = true;
        const formData = new FormData();
        formData.append('profileData', JSON.stringify(this.profileForm.value));

        if (this.selectedFile) {
            formData.append('profileImage', this.selectedFile);
        }

        this.userProfileService.updateUserProfile(formData).subscribe({
            next: () => {
                alert('Profile updated successfully!');
                this.router.navigate(['/']);
            },
            error: () => alert('Failed to update profile.'),
            complete: () => (this.isSubmitting = false)
        });
    }

    onCancel() {
        this.router.navigate(['/']);
    }
}
