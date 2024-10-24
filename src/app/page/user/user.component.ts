import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from "@angular/core";
import {UserService} from "../../services";
import {CommonModule} from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {catchError, Subject, takeUntil, throwError} from "rxjs";


@Component({
    selector: 'app-user',
    standalone: true,
    templateUrl: './user.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule

    ],
    styleUrl: './user.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnDestroy, OnInit {
    private userService: UserService = inject(UserService)

    profileForm: FormGroup = new FormGroup<any>({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', [Validators.pattern(/^\d+$/)]),
        profilePicture: new FormControl(null),
    })

    sub$ = new Subject()

    loading = signal(false);
    profilePictureUploading = signal(false);
    profilePicturePreview = signal('assets/img/user.png');



    ngOnInit(): void {
        this.userService.getUserProfile()
            .pipe(takeUntil(this.sub$))
            .subscribe((userData) => {
            this.profileForm.patchValue(userData);
            this.profilePicturePreview.set(userData.profilePicture)
        });
    }

    onProfilePictureChange(event: any): void {
        this.profilePictureUploading.set(true)
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
                        this.profilePicturePreview.set(resizedImageDataUrl)
                        this.profileForm.get('profilePicture')?.setValue(this.dataURLToBlob(resizedImageDataUrl)); // Update form control

                    }
                };

                setTimeout(() => {
                    this.profilePictureUploading.set(false)
                }, 1000)
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
        return new Blob([ab], {type: mimeString});
    }

    onSubmit(): void {
        console.log(this.profileForm)
        if (this.profileForm.invalid) return;

        this.loading.set(true)
        const formData = new FormData();
        const formValues = this.profileForm.value;

        for (const key in formValues) {
            formData.append(key, formValues[key]);
        }

        this.userService.updateUserProfile(formData)
            .pipe(
                catchError((error) => {
                    this.loading.set(false)
                    return throwError(() => error)
                })
            )
            .subscribe(
            (response) => {
                console.log(response.message);
                setTimeout(() => {
                    this.loading.set(false)
                }, 1000)
                alert('Profile updated successfully!');
            },

        );
    }

    ngOnDestroy() {
        this.sub$.next(null)
        this.sub$.complete()
    }
}
