export interface IChoises {
    color: {id: number, name: string, rgb_code: string}[],
    composition_Outer: {id: number, name: string}[],
    composition_upper_linning_sock: {id: number, name: string}[],
    country: {id: number, name: string}[],
    currency: {id: number, name: string}[],
    gender: {id: number, name: string}[],
    packing_type: {id: number, name: string}[],
    style: {id: number, name: string, admin_order: number}[]
}
