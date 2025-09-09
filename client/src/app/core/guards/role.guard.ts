import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlSegment, Route, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';

export function roleGuard(expectedRoles: string[]): CanMatchFn {
    return (route: Route, segments: UrlSegment[]): boolean | UrlTree => {
        const auth = inject(AuthService);
        const router = inject(Router);

        const user = auth.currentUser();

        if (!user) {
            return router.parseUrl('/login'); // 👈 No logueado
        }

        if (expectedRoles.includes(user.role)) {
            return true; // ✅ tiene permiso
        }

        // 🚫 No tiene rol adecuado → redirigimos al dashboard por defecto
        return router.parseUrl('/patient');
    };
}
