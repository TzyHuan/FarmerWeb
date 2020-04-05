import { UserComponent } from './user.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';

export class UserModule { }

// 這邊宣告所有Material的Components
export const UserComponents = [
    UserComponent,
    SignInComponent,
    SignUpComponent,
];
