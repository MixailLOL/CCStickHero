import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

import { Player } from './Player';
import { Wall } from './Wall';
import { UserInt } from './UserInt';

@ccclass('GameCtrl')
export class GameCtrl extends Component {

    public isOver: boolean;

    @property({
        type: Player,
        tooltip: "Add Player node",
    })
    public player: Player;

    @property({
        type: Wall,
        tooltip: "Add Wall node",
    })
    public wall: Wall;

    @property({
        type: UserInt,
        tooltip: "Add ui node",
    })
    public userInt: UserInt;

    onLoad(){
        this.StateStart();
        this.isOver = true;

        this.userInt.btnStart.node.on('click', () => {
            this.player.startPlayPose();
            this.wall.startPlayPose();
            this.userInt.startPlayPose();  
        })
    }

    StateStart() {
        this.player.initPos();
        this.wall.initPos();
        this.userInt.initPos();
    }

}


