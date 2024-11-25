import { _decorator, Component, Node, instantiate, Prefab, input, Input, view } from 'cc';

const { ccclass, property } = _decorator;

import { Player } from './Player';
import { UserInt } from './UserInt';
import { Wall } from './Wall';
window.Global = {
    playerToPlayPos : false,
    activeWall : {leftWall: Wall, rightWall: Wall},
    bridgeInst : Node,
    playerOnRightWall: false,
    badBridge : false,
    playerToRightBridgeCorner : false,
    score: 0,
    bestScore: 0,
    statePlay: false,
}
@ccclass('GameCtrl')
export class GameCtrl extends Component {
    public isOver = false;
    public isPressed = false;
    public isRotated = true;
    public bridgeInst: Node;
    @property({
        type: Player,
        tooltip: "Add Player node",
    })
    public player: Player;

    @property({
        type: Wall,
        tooltip: "Add Wall1 node",
    })
    public wall1: Wall;

    @property({
        type: Wall,
        tooltip: "Add Wall2 node",
    })
    public wall2: Wall;

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
        Global.activeWall.leftWall = this.wall1;
        Global.activeWall.rightWall = this.wall2;
        Global.bridgeInst = cc.instantiate(this.wallPref);
        Global.bridgeInst.parent = this.node.parent;
        Global.bridgeInst.setScale(0, 0);
        Global.bridgeInst.setPosition(0, 0);
        this.userInt.btnStart.node.on('click', () => {
            this.stateStartF();
        })
        this.userInt.btnRetry.node.on('click', () => {
            this.stateInitF();
        })
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.stateInitF();
    }

    stateStartF(){
        //move objects to it playable positions
        Global.activeWall.rightWall.node.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        Global.activeWall.leftWall.leftWallToPlayPosF();
        Global.activeWall.rightWall.rightWallToPlayPosF();
        this.userInt.startPlayPose();  
    }

    stateLoseF(){
        //move objects to it lose state positions
        Global.activeWall.rightWall.node.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        Global.activeWall.leftWall.node.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        Global.bridgeInst.setScale(0,0);
        Global.bridgeInst.angle = 0;
        this.isOver = false;
        Global.bestScore = Global.score > Global.bestScore?Global.score:Global.bestScore;
        this.userInt.stateLooseF();
    }

    stateInitF() {
        // move objects to iny initial positions
        Global.activeWall.rightWall.stateInitR();
        Global.activeWall.leftWall.stateInitL();
        this.isOver =false;
        Global.score = 0;  
        this.userInt.stateInitF();
        this.player.stateInitF();
    }

    onTouchStart(event: EventTouch) {
        //when is play state and all objects in right places check press ivent; if it ok, spawn brige in right place
        if(Global.statePlay && !Global.playerToPlayPos){
            this.isPressed = true;
            Global.bridgeInst.setScale(0.01, 0, 1);
            let playerPos = this.player.node.getPosition();
            let playerWidth = this.player.node.width;
            let playerHeight = this.player.node.height;
            let bridgeInstX = playerPos.x + playerWidth*this.player.node.scale.x/2+Global.bridgeInst.getScale().x*Global.bridgeInst.width;
            let bridgeInstY = playerPos.y - playerHeight*this.player.node.scale.y/2-Global.bridgeInst.getScale().x*Global.bridgeInst.width/2;
            Global.bridgeInst.setPosition(bridgeInstX, bridgeInstY);
        }
    }

    onTouchEnd(event: EventTouch) {
        //check if it is play state, player in right position and befor it press is reallised, rotate bridge, say player to move
        if(Global.statePlay && !Global.playerToPlayPos &&  this.isPressed){
            this.isPressed = false;
            this.isRotated = false;
            Global.playerToRightBridgeCorner = true;
            Global.score += this.checkWhereBridge();
            this.userInt.updateScore();
            Global.statePlay = false;
        }
    }

    checkWhereBridge(){
        // find where fall a bridge corner, check if it on the wall or miss
        let rightWallCenterLCorner = Global.activeWall.rightWall.node.getPosition().x- Global.activeWall.rightWall.node.width*Global.activeWall.rightWall.node.getScale().x/2;
        let rightWallCenterRCorner = Global.activeWall.rightWall.node.getPosition().x+ Global.activeWall.rightWall.node.width*Global.activeWall.rightWall.node.getScale().x/2;
        let bridgeRightCorner = Global.bridgeInst.getPosition().x+Global.bridgeInst.height/2*Global.bridgeInst.getScale().y;
        if(rightWallCenterLCorner < bridgeRightCorner && bridgeRightCorner < rightWallCenterRCorner){
            Global.badBridge = false;
            return 1;
        }
        else{
            Global.badBridge = true;
            return 0;
        }
    }

    update (deltaTime: number) {
        //check is player fall down 
        if(this.player.node.getPosition().y <= -view.getVisibleSize().height/2){
            this.isOver = true;
            this.stateLoseF();
        }
        //if is Pressed state start lenghter bridge
        if(this.isPressed == true){
            let bridgeScale = Global.bridgeInst.getScale();
            Global.bridgeInst.setScale(bridgeScale.x, bridgeScale.y+0.015);
        }
        //if is no rotated state start rotate bridge
        if(!this.isRotated){
            Global.bridgeInst.angle -= 5;
            if(Global.bridgeInst.angle <= -90){
                this.isRotated = true;
            }
        }
        //if player on right wall, swap wall designations 
        if(Global.playerOnRightWall){
            let bufNode : Node;
            bufNode = Global.activeWall.leftWall;
            Global.activeWall.leftWall = Global.activeWall.rightWall;
            Global.activeWall.rightWall = bufNode;
            Global.playerOnRightWall = false;
            this.stateStartF();
        }
    }

}


