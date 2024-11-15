import { _decorator, Component, Node, director, instantiate, Sprite, resources, Prefab } from 'cc';

const { ccclass, property } = _decorator;

import { Player } from './Player';
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
        type: Prefab,
        tooltip: "Add Wall prefab",
    })
    public wall: prefab;

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
            this.createWall();
        })
    }

    createWall(){
        
    }

    StateStart() {

        let wall = cc.instantiate(this.wall);
        wall.parent = this.node.parent;
        //console.log(wall.children[0]);
        //console.log(wall);
        this.player.initPos();;
        this.userInt.initPos();
    }

}


