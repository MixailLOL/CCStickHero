import { _decorator, Component, Node, director, instantiate, Sprite, resources, Prefab, input, Input, UITransform, math } from 'cc';

const { ccclass, property } = _decorator;

import { Player } from './Player';
import { UserInt } from './UserInt';
import { Wall } from './Wall';


@ccclass('GameCtrl')
export class GameCtrl extends Component {

    public isOver = true;
    public isPressed = false;
    public bridgeInst: Node;
    public initWallInst: Node;
    public isRotated = true;

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
            this.initWallInst.setPosition(-300,-400,0);
            this.isOver = false;
            this.player.startPlayPose();
            this.userInt.startPlayPose();  
        })
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }


    StateInit() {
        this.initWallInst = cc.instantiate(this.wallPref);
        this.initWallInst.parent = this.node.parent;
        this.initWallInst.setPosition(0,-400,0);
        this.initWallInst.setScale(0.3,0.3,0);

        this.player.initPos();;
        this.userInt.initPos();
    }

    onTouchStart(event: EventTouch) {
        if(!this.isOver){
            this.isPressed = true;
            this.bridgeInst = cc.instantiate(this.wallPref);
            this.bridgeInst.parent = this.node.parent;
            this.bridgeInst.setScale(0.01, 0, 1);
            this.bridgeInst.anchorX = 0;
            this.bridgeInst.anchorY = 0;
            let playerPos = this.player.node.getPosition();
            let playerWidth = this.player.node.width;
            let playerHeight = this.player.node.height;
            let bridgeInstX = playerPos.x + playerWidth*this.player.node.scale.x;
            let bridgeInstY = playerPos.y - playerHeight*this.player.node.scale.y;
            this.bridgeInst.setPosition(bridgeInstX, bridgeInstY, playerPos.z);
            console.log(this.bridgeInst);
            
        }
    }

    onTouchEnd(event: EventTouch) {
        if(!this.isOver){
            this.isPressed = false;
            this.isRotated = false;
        }
    }

    update (deltaTime: number) {
        if(this.isPressed == true){
            let bridgeScale = this.bridgeInst.getScale();
            this.bridgeInst.setScale(bridgeScale.x, bridgeScale.y+0.01, bridgeScale.z);
        }
        if(!this.isRotated){
            this.bridgeInst.angle -= 5;
            if(this.bridgeInst.angle == -90){
                this.isRotated = true;
            }
        }
    }

}


