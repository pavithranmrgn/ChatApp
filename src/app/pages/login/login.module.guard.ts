import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Store } from 'src/app/service/store.service';

@Injectable()
export class LoginModuleGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly store: Store
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        var uid = this.store.userUID;
        if (uid) {
            this.router.navigate(['/home']);
            return false
        }
        return true;
    }
}
