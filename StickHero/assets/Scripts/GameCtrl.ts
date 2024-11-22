import { _decorator, Component, Node, director, instantiate, Sprite, resources, Prefab, input, Input, UITransform, math, Vec2, RigidBody2D, view, Label, BoxCollider2D } from 'cc';

const { ccclass, property } = _decorator;

import { Player } from './Player';
import { UserInt } from './UserInt';
import { Wall } from './Wall';
window.Global = {
    playerToPlayPos : false,
    activeWall : {leftWall: Wall, rightWall: Wall},
}
@ccclass('GameCtrl')
export class GameCtrl extends Component {
    public isOver = false;
    public score = 0;
    public bestScore = 0;
    public isPressed = false;
    public bridgeInst: Node;
    public isRotated = true;
    public playerToRightBridgeCorner = false;
    public playerOnRightWall = false;
    public badBridge = false;
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
        console.log("onload state");
        Global.activeWall.leftWall = this.wall1;
        Global.activeWall.rightWall = this.wall2;
        this.bridgeInst = cc.instantiate(this.wallPref);
        this.bridgeInst.parent = this.node.parent;
        this.bridgeInst.setScale(0, 0);
        this.bridgeInst.setPosition(0, 0);
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
        console.log("state loose");
        Global.activeWall.rightWall.node.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        Global.activeWall.leftWall.node.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        this.isOver = false;
        this.userInt.gameOver.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.8);
        this.userInt.btnRetry.node.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.4);
        this.bestScore = this.score > this.bestScore?this.score:this.bestScore;
        this.userInt.bestScore.getComponent(Label).string = this.bestScore;
    }

    StateInit() {
        console.log("state init");
        Global.activeWall.rightWall.stateInitR();
        Global.activeWall.leftWall.stateInitL();
        this.isOver =false;
        this.score = 0;
        this.userInt.gameOver.setPosition(view.getVisibleSize().width*2, view.getVisibleSize().height*2);
        this.userInt.btnRetry.node.setPosition(view.getVisibleSize().width*2, view.getVisibleSize().height*2);
        let playerAdoptivWidthScale = (view.getVisibleSize().width)/(this.player.node.width*13);
        let playerAdoptivHeightScale = (view.getVisibleSize().height)/(this.player.node.height*13);
        this.userInt.score.getComponent(Label).string = this.score;
        this.userInt.score.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.85);     
        this.userInt.bestScore.getComponent(Label).string = this.bestScore;
        this.userInt.bestScore.setPosition(view.getVisibleSize().width*(3/4), view.getVisibleSize().height*0.9);   
        this.player.node.setScale(playerAdoptivWidthScale, playerAdoptivHeightScale);
        let playerInitPosY = Global.activeWall.leftWall.node.getPosition().y+Global.activeWall.leftWall.node.width*Global.activeWall.leftWall.node.getScale().y;
        this.player.node.setPosition(0,playerInitPosY);
        this.userInt.initPos();
    }

    onTouchStart(event: EventTouch) {
        if(!this.isOver && !this.playerToRightBridgeCorner){
            this.isPressed = true;
            this.bridgeInst.setScale(0.01, 0, 1);
            let playerPos = this.player.node.getPosition();
            let playerWidth = this.player.node.width;
            let playerHeight = this.player.node.height;
            let bridgeInstX = playerPos.x + playerWidth*this.player.node.scale.x/2+this.bridgeInst.getScale().x*this.bridgeInst.width;
            let bridgeInstY = playerPos.y - playerHeight*this.player.node.scale.y/2-this.bridgeInst.getScale().x*this.bridgeInst.width/2;
            this.bridgeInst.setPosition(bridgeInstX, bridgeInstY);
        }
    }

    onTouchEnd(event: EventTouch) {
        if(!this.isOver && !this.playerToRightBridgeCorner){
            this.isPressed = false;
            this.isRotated = false;
            this.playerToRightBridgeCorner = true;
            this.score += this.checkWhereBridge();
            this.userInt.score.getComponent(Label).string = this.score;
        }
    }

    checkWhereBridge(){
        let rightWallCenterLCorner = Global.activeWall.rightWall.node.getPosition().x- Global.activeWall.rightWall.node.width*Global.activeWall.rightWall.node.getScale().x/2;
        let rightWallCenterRCorner = Global.activeWall.rightWall.node.getPosition().x+ Global.activeWall.rightWall.node.width*Global.activeWall.rightWall.node.getScale().x/2;
        let bridgeRightCorner = this.bridgeInst.getPosition().x+this.bridgeInst.height/2*this.bridgeInst.getScale().y;
        if(rightWallCenterLCorner < bridgeRightCorner && bridgeRightCorner < rightWallCenterRCorner){
            this.badBridge = false;
            return 1;
        }
        else{
            this.badBridge = true;
            return 0;
        }
    }

    update (deltaTime: number) {
        if(this.player.node.getPosition().y <= -view.getVisibleSize().height/2){
            console.log("1");
            this.isOver = true;
            this.stateLose();
        }
        if(this.isPressed == true){
            console.log("2");
            let bridgeScale = this.bridgeInst.getScale();
            this.bridgeInst.setScale(bridgeScale.x, bridgeScale.y+0.01);
        }
        if(!this.isRotated){
            console.log("3");
            this.bridgeInst.angle -= 5;
            if(this.bridgeInst.angle <= -90){
                this.isRotated = true;
            }
        }
        if(this.playerToRightBridgeCorner){
            console.log("6");
            let positionX = 0;
            let bridgeRightCorner = this.bridgeInst.getPosition().x+this.bridgeInst.height/2*this.bridgeInst.getScale().y;
            if(this.badBridge){
                positionX = bridgeRightCorner-this.player.node.width*this.player.node.scale.x/2;
            }else{
                positionX = (Global.activeWall.rightWall.node.getPosition().x + Global.activeWall.rightWall.node.width*Global.activeWall.rightWall.node.getScale().x/2-this.player.node.width*this.player.node.scale.x);
            }
            
            let rigidBody = this.player.node.getComponent(RigidBody2D);
            if(this.player.node.getPosition().x <= positionX ){
                rigidBody.linearVelocity = new Vec2(27, 0);     
            }
            else{
                this.playerToRightBridgeCorner = false;
                rigidBody.linearVelocity = new Vec2(0, 0);
                this.bridgeInst.setScale(0,0);
                this.bridgeInst.angle = 0;
                //Global.activeWall.rightWall.getComponent(RigidBody2D). 
                if(!this.badBridge){
                    this.playerOnRightWall = true;
                }else{
                    Global.activeWall.leftWall.getComponent(BoxCollider2D).enabled = false;
                    Global.activeWall.rightWall.getComponent(BoxCollider2D).enabled = false;
                }
            } 
        }

        if(this.playerOnRightWall){
            console.log("7");
            let bufNode : Node;
            bufNode = Global.activeWall.leftWall;
            Global.activeWall.leftWall = Global.activeWall.rightWall;
            Global.activeWall.rightWall = bufNode;
            this.playerOnRightWall = false;
            this.stateStart();
        }
    }

}


