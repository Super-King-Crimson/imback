export enum EMovementState {
    Airborne = "airborne",
    Idle = "idle",
    Jumping = "jumping",
    Running = "running",
    Walking = "walking",
}

export type EState = EMovementState;

export abstract class State {
    public name?: string;

    public constructor(name: string) {
        this.name = name;
    }

    public abstract Link(states: State[]): void;

    public abstract Enter(prevState: State): Maybe<State>;
    public abstract Exit(nextState: State): void;
    public abstract OnInputBegan(input: InputObject): Maybe<State>;
    public abstract OnInputEnded(input: InputObject): Maybe<State>;
    public abstract OnStepped(delta: number): Maybe<State>;
}
