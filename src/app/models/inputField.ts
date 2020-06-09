import { SComponent } from './component';

export class InputField extends SComponent {
    name: string;
    chars: number;
    transition: boolean;
    constructor() {
        super();
        this.name = 'Input field';
        this.chars = 100;
        this.transition = true;
    }
}
