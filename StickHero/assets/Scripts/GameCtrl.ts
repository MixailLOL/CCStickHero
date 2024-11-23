import { _decorator, Component, Node, director, instantiate, Sprite, resources, Prefab, input, Input, UITransform, math, Vec2, RigidBody2D, view, Label, BoxCollider2D } from 'cc';

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
}
@ccclass('GameCtrl')
export class GameCtrl extends Component {
    public isOver = false;
    public score = 0;
    public bestScore = 0;
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
        this.StateInit();
        this.userInt.btnStart.node.on('click', () => {
            this.stateStart();
        })
        this.userInt.btnRetry.node.on('click', () => {
            this.StateInit();
        })
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    stateStart(){
        Global.activeWall.rightWall.node.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        Global.activeWall.leftWall.leftWallToPlayPosF();
        Global.activeWall.rightWall.rightWallToPlayPosF();
        this.userInt.startPlayPose();  
    }

    stateLose(){
        Global.activeWall.rightWall.node.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        Global.activeWall.leftWall.node.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        this.isOver = false;
        this.userInt.gameOver.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.8);
        this.userInt.btnRetry.node.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.4);
        this.bestScore = this.score > this.bestScore?this.score:this.bestScore;
        this.userInt.bestScore.getComponent(Label).string = this.bestScore;
    }

    StateInit() {
        Global.activeWall.rightWall.stateInitR();
        Global.activeWall.leftWall.stateInitL();
        this.isOver =false;
        this.score = 0;
        this.userInt.score.getComponent(Label).string = this.score;
        this.userInt.score.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.85);     
        this.userInt.bestScore.getComponent(Label).string = this.bestScore;   
        this.userInt.stateInitF();
        this.player.stateInitF();
    }

    onTouchStart(event: EventTouch) {
        if(!this.isOver && !Global.playerToRightBridgeCorner){
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
        if(!this.isOver && !Global.playerToRightBridgeCorner){
            this.isPressed = false;
            this.isRotated = false;
            Global.playerToRightBridgeCorner = true;
            this.score += this.checkWhereBridge();
            this.userInt.score.getComponent(Label).string = this.score;
        }
    }

    checkWhereBridge(){
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
        if(this.player.node.getPosition().y <= -view.getVisibleSize().height/2){
            this.isOver = true;
            this.stateLose();
        }
        if(this.isPressed == true){
            let bridgeScale = Global.bridgeInst.getScale();
            Global.bridgeInst.setScale(bridgeScale.x, bridgeScale.y+0.01);
        }
        if(!this.isRotated){
            Global.bridgeInst.angle -= 5;
            if(Global.bridgeInst.angle <= -90){
                this.isRotated = true;
            }
        }

        if(Global.playerOnRightWall){
            let bufNode : Node;
            bufNode = Global.activeWall.leftWall;
            Global.activeWall.leftWall = Global.activeWall.rightWall;
            Global.activeWall.rightWall = bufNode;
            Global.playerOnRightWall = false;
            this.stateStart();
        }
    }

}


