export interface IObserver {
    update(...args: any[]): void;
}

export interface IObservable {
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(...args: any[]): void;
}
