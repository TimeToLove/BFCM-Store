import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { SignInUserDto } from "@superstore/libs";
import { Router } from "@angular/router";

@Component({
    selector: 'superstore-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {

    formSignIn = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    constructor(
        private readonly authService: AuthService,
        private router: Router
    ) {
    }

    signIn() {
        const {
            email,
            password,
        } = this.formSignIn.value;

        const user: SignInUserDto = {
            email,
            password,
        }
        this.authService.signIn(user)
            .subscribe({
                next: () => this.router.navigateByUrl('/'),
                error: (err) => {
                    this.formSignIn.setErrors({ error: err.error.message });
                }
            });
    }
}
