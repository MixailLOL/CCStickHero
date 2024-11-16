import { _decorator, Component, Node, director, instantiate, Sprite, resources, Prefab, input, Input } from 'cc';

const { ccclass, property } = _decorator;

import { Player } from './Player';
import { UserInt } from './UserInt';
import { Wall } from './Wall';


@ccclass('GameCtrl')
export class GameCtrl extends Component {

    public isOver = true;
    public isPressed = false;
    public wallInst: Node;

    @property({
        type: Player,
        tooltip: "Add Player node",
    })
    public player: Player;

    @property({
        type: Prefab,
        tooltip: "Add Wall prefab",
    })
    public wallPref: prefab;

    @property({
        type: UserInt,
        tooltip: "Add ui node",
    })
    public userInt: UserInt;

    onLoad(){
        this.StateInit();
        this.userInt.btnStart.node.on('click', () => {
            this.isOver = false;
            this.player.startPlayPose();
            this.userInt.startPlayPose();  
        })
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }


    StateInit() {
        //this.wallInst = cc.instantiate(this.wallPref);
        //this.wallInst.parent = this.node.parent;

        this.player.initPos();;
        this.userInt.initPos();
    }

    onTouchStart(event: EventTouch) {
        if(!this.isOver){
            this.isPressed = true;
            console.log("Presssed start");
            console.log(this.isPressed);
        }
    }

    onTouchEnd(event: EventTouch) {
        if(!this.isOver){
            this.isPressed = false;
            console.log("Presssed end");
            console.log(this.isPressed);
        }
    }

    update (deltaTime: number) {
        if(this.isPressed == true){
            console.log(this.isPressed);
        }
    }

}


