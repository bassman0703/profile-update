import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { By } from '@angular/platform-browser';
import {UserComponent} from "./user.component";
import {UserProfileService} from "../../services";

describe('UserProfileEditComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    let userProfileService: jasmine.SpyObj<UserProfileService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const userProfileServiceMock = jasmine.createSpyObj('UserProfileService', [
            'getUserProfile',
            'updateUserProfile'
        ]);
        const routerMock = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [UserComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: UserProfileService, useValue: userProfileServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        userProfileService = TestBed.inject(UserProfileService) as jasmine.SpyObj<UserProfileService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        userProfileService.getUserProfile.and.returnValue(of({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            profileImage: null
        }));

        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with user data', () => {
        const form = component.profileForm;
        expect(form.get('firstName')?.value).toBe('John');
        expect(form.get('lastName')?.value).toBe('Doe');
        expect(form.get('email')?.value).toBe('john.doe@example.com');
        expect(form.get('phone')?.value).toBe('1234567890');
    });

    it('should mark the form invalid if required fields are empty', () => {
        component.profileForm.setValue({
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        });

        expect(component.profileForm.invalid).toBeTrue();
    });

    it('should display error messages for invalid fields', fakeAsync(() => {
        const firstNameInput = fixture.debugElement.query(By.css('#firstName')).nativeElement;
        firstNameInput.value = '';
        firstNameInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick();

        const error = fixture.debugElement.query(By.css('.error')).nativeElement;
        expect(error.textContent).toContain('First Name is required.');
    }));

    it('should handle file input and set the profile image URL', () => {
        const file = new File(['dummy content'], 'profile.png', { type: 'image/png' });
        const event = { target: { files: [file] } } as unknown as Event;

        component.onFileSelected(event);
        expect(component.selectedFile).toBe(file);
    });

    it('should call the updateUserProfile service on form submission', () => {
        userProfileService.updateUserProfile.and.returnValue(of({}));
        component.profileForm.setValue({
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            phone: '9876543210'
        });

        component.onSubmit();

        expect(userProfileService.updateUserProfile).toHaveBeenCalled();
    });

    it('should navigate to the home page after a successful update', fakeAsync(() => {
        userProfileService.updateUserProfile.and.returnValue(of({}));
        component.onSubmit();
        tick();

        expect(router.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should disable the submit button if the form is invalid', () => {
        component.profileForm.get('firstName')?.setValue('');
        fixture.detectChanges();

        const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
        expect(submitButton.disabled).toBeTrue();
    });

    it('should show a loading indicator when submitting', fakeAsync(() => {
        userProfileService.updateUserProfile.and.returnValue(of({}));
        component.onSubmit();
        fixture.detectChanges();
        tick();

        const loading = fixture.debugElement.query(By.css('.loading')).nativeElement;
        expect(loading).toBeTruthy();
    }));
});
