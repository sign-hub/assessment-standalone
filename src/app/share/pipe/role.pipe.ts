import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'role' })
export class RolePipe implements PipeTransform {
    transform(value: string): string {
        let role: string;
        if (value == 'ADMIN') {
            role = 'Adminstrator';
        } else if (role == 'CON_PRO') {
            role = 'Content provider';
        } else {
            role = 'Viewer user';
        }
        return role;
    }
}
