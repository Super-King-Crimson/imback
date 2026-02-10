import CreateState from "./CreateState";
import { EState, State } from "./State";

export class StateMachine {
    public state?: State;

    private static LinkStates(unlinkedStates: State[]) {
        for (const state of unlinkedStates) {
            print(`Attempting to link ${state.name}`);
            state.Link(unlinkedStates);
            print(`Successfully linked ${state.name}`);
        }
    }

    public constructor(
        player: Player,
        character: Model,
        humanoid: Humanoid,
        rootPart: Part,
        animator: Animator,
        firstStateType: EState,
        otherStateTypes: Set<EState>, // set so no duplicate states
    ) {
        const unlinkedStates: State[] = [];

        const firstState = CreateState(
            firstStateType,
            player,
            character,
            humanoid,
            rootPart,
            animator,
        );

        unlinkedStates.push(firstState);

        for (const state of otherStateTypes) {
            unlinkedStates.push(
                CreateState(
                    state,
                    player,
                    character,
                    humanoid,
                    rootPart,
                    animator,
                ),
            );
        }

        StateMachine.LinkStates(unlinkedStates);
        this.ChangeState(firstState);
    }

    public ChangeState(state: State) {
        if (state === undefined) error("Cannot change state to undefined");

        let newState: Maybe<State> = state;

        while (newState) {
            if (this.state !== undefined) {
                this.state.Exit(state);
            }

            const oldState: Maybe<State> = this.state;

            this.state = newState;

            print(
                `Transitioning from ${oldState?.name || "nothing"} to ${newState.name}`,
            );

            // HACK: don't make default state something that
            // does something unique when it transitions into itself
            newState = newState.Enter(oldState || newState);
        }
    }

    public OnHeartbeat(delta: number) {
        if (this.state === undefined)
            error("Cannot use state machine without setting initial state");

        let newState = this.state.OnHeartbeat(delta);
        if (newState) this.ChangeState(newState);
    }

    public OnInputBegan(input: InputObject) {
        if (this.state === undefined)
            error("Cannot use state machine without setting initial state");

        let newState = this.state.OnInputBegan(input);
        if (newState) this.ChangeState(newState);
    }

    public OnInputEnded(input: InputObject) {
        if (this.state === undefined)
            error("Cannot use state machine without setting initial state");

        let newState = this.state.OnInputEnded(input);
        if (newState) this.ChangeState(newState);
    }
}
