
export interface BaseRepositoryInterface<T> {
    create(data: T): Promise<T>;
    getById(id: string): Promise<T | null>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    getAll(): Promise<T[]>
}