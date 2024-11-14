import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

import { Player } from './Player';
import { Wall } from './Wall';

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


    onLoad(){
        this.StateStart();
        this.isOver = true;
    }

    StateStart() {
        this.player.initPos();
        this.wall.initPos();   
    }
}


