export class Company {
    name: string;
    vat_number: string;
    website_address: string;
    address: {
        name: string;
        first_line: string;
        second_line: string;
        country: string;
        state: string;
        city: string;
        zip: string;
    }
}
