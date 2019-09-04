export class PaginationChangedEvent {
    
    constructor(
        readonly page: number,
        readonly fetch: number,
        readonly offset: number,
        ) {}
        
}
