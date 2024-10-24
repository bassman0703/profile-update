import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { UserService } from '../../services';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';

class MockUserService {
    getUserProfile = jasmine.createSpy('getUserProfile').and.returnValue(
        of({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            profilePicture: null,
        })
    );

    updateUserProfile = jasmine.createSpy().and.returnValue(of({ message: 'Profile updated!' }));
}

describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    let userService: MockUserService;
    let el: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserComponent, ReactiveFormsModule],
            providers: [{ provide: UserService, useClass: MockUserService }]
        }).compileComponents();

        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        userService = TestBed.inject(UserService) as  unknown as MockUserService;
        el = fixture.debugElement;
        fixture.detectChanges(); // Trigger initial data binding
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with user data on ngOnInit', () => {
        component.ngOnInit();
        expect(userService.getUserProfile).toHaveBeenCalled();
        expect(component.profileForm.value).toEqual({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            profilePicture: null // Form control default value
        });
        expect(component.profilePicturePreview()).toBeNull();
    });

    it('should mark the form invalid when required fields are empty', () => {
        component.profileForm.reset();
        expect(component.profileForm.invalid).toBeTrue();
    });


    it('should call updateUserProfile on valid form submission', () => {
        component.profileForm.setValue({
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            phone: '0987654321',
            profilePicture: null
        });

        component.onSubmit();
        expect(userService.updateUserProfile).toHaveBeenCalled();
        expect(component.loading()).toBeTrue();
    });

    it('should not submit if the form is invalid', () => {
        component.profileForm.controls['firstName'].setValue('');
        component.onSubmit();
        expect(userService.updateUserProfile).not.toHaveBeenCalled();
    });

    it('should clean up subscriptions on ngOnDestroy', () => {
        const subNextSpy = spyOn(component.sub$, 'next');
        const subCompleteSpy = spyOn(component.sub$, 'complete');
        component.ngOnDestroy();
        expect(subNextSpy).toHaveBeenCalledWith(null);
        expect(subCompleteSpy).toHaveBeenCalled();
    });
});
