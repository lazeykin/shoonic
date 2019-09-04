import {Photo} from "./photo";

export class Contact {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    photo?: Photo;
    reg_type: string;  // buyer, seller
    user_type: string;  // client, system
    company_name?: string;
}
