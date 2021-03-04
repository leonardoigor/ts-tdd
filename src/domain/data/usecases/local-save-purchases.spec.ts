import { promises } from "fs";

class LocalSavePurchase {
    constructor(private readonly cacheStore: CacheStore) { }

    async save(): Promise<void> {
        this.cacheStore.delete('purchases');
    }
}
interface CacheStore {
    delete: (key: string) => void;
}
class CacheStoreSpy implements CacheStore {
    deleteCallCount = 0;
    key: string = ''
    delete(key: string) {
        this.deleteCallCount++
        this.key = key;
    };
}
type SutTypes = {
    sut: LocalSavePurchase
    cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchase(cacheStore);

    return {
        sut, cacheStore,
    }
}
describe('localSavePurchases', () => {
    test('should not delete cache on sut.init', () => {
        const { cacheStore } = makeSut();

        expect(cacheStore.deleteCallCount).toBe(0);
    })
    test('should not delete old cache on sut.save', async () => {
        const { cacheStore, sut } = makeSut();
        await sut.save();
        expect(cacheStore.deleteCallCount).toBe(1);
    })
    test('should call delete if correct key', async () => {
        const { cacheStore, sut } = makeSut();
        await sut.save();
        expect(cacheStore.key).toBe('purchases');
    })

})
