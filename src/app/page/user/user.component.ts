import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {UserService} from "../../services";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";




@Component({
    selector: 'app-user',
    standalone: true,
    templateUrl: 'user.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule

    ],
    styleUrl: 'user.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {
    profileForm: FormGroup;
    loading = false;
    profilePicturePreview: string | ArrayBuffer | null = null;

    constructor(private fb: FormBuilder, private userService: UserService) {
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.pattern(/^\d+$/)]],
            profilePicture: ['null'],
        });
        this.profilePicturePreview = 'assets/img/profile-picture.jpg';

    }

    ngOnInit(): void {
        this.userService.getUserProfile().subscribe((userData) => {
            this.profileForm.patchValue(userData);
            this.profilePicturePreview = userData.profilePicture || 'assets/img/profile-picture'; // Use default if not provided
        });
    }
    onProfilePictureChange(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const image = new Image();
                image.src = e.target?.result as string;

                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 150; // Set width to 150
                    canvas.height = 150; // Set height to 150

                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(image, 0, 0, 150, 150); // Resize the image to 150x150
                        const resizedImageDataUrl = canvas.toDataURL('image/jpeg');
                        this.profilePicturePreview = resizedImageDataUrl; // Update preview
                        this.profileForm.get('profilePicture')?.setValue(this.dataURLToBlob(resizedImageDataUrl)); // Update form control
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    }

    dataURLToBlob(dataURL: string): Blob {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    onSubmit(): void {
        if (this.profileForm.invalid) return;

        this.loading = true;
        const formData = new FormData();
        const formValues = this.profileForm.value;

        for (const key in formValues) {
            formData.append(key, formValues[key]);
        }

        this.userService.updateUserProfile(formData).subscribe(
            (response) => {
                console.log(response.message);
                this.loading = false;
                alert('Profile updated successfully!');
            },
            (error) => {
                console.error('Update failed:', error);
                this.loading = false;
            }
        );
    }
}
