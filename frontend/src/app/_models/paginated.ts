export class Paginated<T> {
    count: number;
    results: Array<T>;
    fetch: number;
    offset: number;
}
