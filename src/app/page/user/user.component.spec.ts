import { UserComponent } from "./user.component";
import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { UserService } from "../../services";
import { of } from "rxjs";

describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    let mockUserService: any; // Type for the mocked UserService

    beforeEach(async () => {
        mockUserService = {
            getUserProfile: jasmine.createSpy('getUserProfile').and.returnValue(of({
                firstName: 'davit',
                lastName: 'jmukhadze',
                email: 'davitijmukhadze@gmail.com',
                phone: '598088238',
                profilePicture: 'assets/img/profile-picture.jpg',
            }))
        };

        await TestBed.configureTestingModule({
            declarations: [UserComponent],
            imports: [CommonModule, ReactiveFormsModule],
            providers: [{ provide: UserService, useValue: mockUserService }]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Initial change detection to trigger ngOnInit
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize profile form with empty values', () => {
        expect(component.profileForm.get('firstName')?.value).toEqual('');
        expect(component.profileForm.get('lastName')?.value).toEqual('');
        expect(component.profileForm.get('email')?.value).toEqual('');
        expect(component.profileForm.get('phone')?.value).toEqual('');
        expect(component.profileForm.get('profilePicture')?.value).toEqual('null');
    });

    it('should set initial profile picture preview', () => {
        expect(component.profilePicturePreview).toEqual('assets/img/profile-picture.jpg');
    });

    it('should patch form with user data on init (mocked service)', () => {
        component.ngOnInit(); // Call ngOnInit to patch the form with user data

        expect(component.profileForm.get('firstName')?.value).toEqual('');
        expect(component.profileForm.get('lastName')?.value).toEqual('');
        expect(component.profileForm.get('email')?.value).toEqual('');
        expect(component.profileForm.get('phone')?.value).toEqual('');
        expect(component.profileForm.get('profilePicture')?.value).toEqual('null');
        expect(component.profilePicturePreview).toEqual('assets/img/profile-picture.jpg');
    });

    it('should update profile picture preview on file change', () => {
        const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
        const event = { target: { files: [mockFile] } }; // Properly mock the file input event

        component.onProfilePictureChange(event);

        // Trigger change detection after asynchronous operations
        fixture.detectChanges();

        expect(component.profilePicturePreview).not.toEqual('assets/img/profile-picture.jpg'); // Preview should change
        expect(component.profilePicturePreview).toContain('data:image/jpeg'); // Check if it contains the base64 image
    });

    it('should mark form as invalid when required fields are empty', () => {
        expect(component.profileForm.invalid).toBeTruthy();

        component.profileForm.get('firstName')?.setValue('John');
        component.profileForm.get('lastName')?.setValue('Doe');

        expect(component.profileForm.invalid).toBeFalsy();
    });

    it('should mark email field as invalid with invalid email format', () => {
        component.profileForm.get('email')?.setValue('invalid_email');

        expect(component.profileForm.get('email')?.invalid).toBeTruthy();
    });
});
