import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services';
import { of, throwError } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    let userService: jasmine.SpyObj<UserService>;
    let modalService: jasmine.SpyObj<NzModalService>;

    beforeEach(async () => {
        const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserProfile', 'updateUserProfile']);
        const modalServiceSpy = jasmine.createSpyObj('NzModalService', ['create']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule], // Import any other required modules
            declarations: [UserComponent],
            providers: [
                { provide: UserService, useValue: userServiceSpy },
                { provide: NzModalService, useValue: modalServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
        modalService = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
    });

    beforeEach(() => {
        fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load user profile on init', () => {
        const userProfile = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            profilePicture: 'some/path/to/image.jpg'
        };

        userService.getUserProfile.and.returnValue(of(userProfile)); // Mocking the return value

        component.ngOnInit();

        expect(userService.getUserProfile).toHaveBeenCalled();
        expect(component.profileForm.value).toEqual(userProfile);
        expect(component.profilePicturePreview).toBe(userProfile.profilePicture);
    });

    it('should submit the form if valid', () => {
        component.profileForm.setValue({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            profilePicture: null
        });

        const formData = new FormData();
        formData.append('firstName', 'John');
        formData.append('lastName', 'Doe');
        formData.append('email', 'john.doe@example.com');
        formData.append('phone', '1234567890');

        // Only append profilePicture if it is not null
        const profilePicture = component.profileForm.get('profilePicture')?.value;
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        userService.updateUserProfile.and.returnValue(of({ message: 'Success' }));

        component.onSubmit();

        expect(userService.updateUserProfile).toHaveBeenCalledWith(formData);
        expect(component.loading).toBeFalse();
    });


    it('should not submit the form if invalid', () => {
        component.onSubmit();
        expect(component.loading).toBeFalse();
    });

    it('should handle update errors', () => {
        component.profileForm.setValue({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            profilePicture: null
        });

        userService.updateUserProfile.and.returnValue(throwError('Update failed'));

        component.onSubmit();

        expect(userService.updateUserProfile).toHaveBeenCalled();
        expect(component.loading).toBeFalse();
    });
});
