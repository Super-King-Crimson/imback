import { State, EState, EMovementState } from "./State";
import { Airborne } from "./States/Airborne";
import { Idle } from "./States/Idle";
import { Jumping } from "./States/Jumping";
import { Running } from "./States/Running";
import { Walking } from "./States/Walking";

export default function (
    stateType: EState,
    player: Player,
    character: Model,
    humanoid: Humanoid,
    rootPart: Part,
    animator: Animator,
): State {
    switch (stateType) {
        case EMovementState.Airborne:
            return new Airborne(
                player,
                character,
                humanoid,
                rootPart,
                animator,
            );
        case EMovementState.Idle:
            return new Idle(player, character, humanoid, rootPart, animator);
        case EMovementState.Jumping:
            return new Jumping(player, character, humanoid, rootPart, animator);
        case EMovementState.Running:
            return new Running(player, character, humanoid, rootPart, animator);
        case EMovementState.Walking:
            return new Walking(player, character, humanoid, rootPart, animator);
        default:
            error(`Could not create invalid state ${stateType}`);
    }
}
