import { _decorator, Component, Node, director, instantiate, Sprite, resources, Prefab, input, Input, UITransform, math, Vec2, RigidBody2D, view, Label } from 'cc';

const { ccclass, property } = _decorator;

import { Player } from './Player';
import { UserInt } from './UserInt';
import { Wall } from './Wall';

@ccclass('GameCtrl')
export class GameCtrl extends Component {
    public isOver = false;
    public score = 0;
    public bestScore = 0;
    public isPressed = false;
    public bridgeInst: Node;
    public isRotated = true;
    public leftWallToPlayPos = false;
    public rightWallToPlayPos = false;
    public playerToPlayPos = false;
    public playerToRightBridgeCorner = false;
    public playerOnRightWall = false;
    public badBridge = false;
    public bridgeInst: Node;
    public angleCount = 0;
    public activeWall : [leftWall: Node, rightWall: Node] = [];
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
        this.activeWall.leftWall = cc.instantiate(this.wallPref);
        this.activeWall.leftWall.parent = this.node.parent;
        this.activeWall.rightWall = cc.instantiate(this.wallPref);
        this.activeWall.rightWall.parent = this.node.parent;
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
        this.activeWall.rightWall.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        this.leftWallToPlayPos = true;
        this.rightWallToPlayPos = true;
        this.isOver = false;
        this.userInt.startPlayPose();  
    }

    stateLose(){
        this.activeWall.rightWall.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        this.activeWall.leftWall.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
        this.isOver = false;
        this.userInt.gameOver.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.8);
        this.userInt.btnRetry.node.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.4);
        this.bestScore = this.score > this.bestScore?this.score:this.bestScore;
        this.userInt.bestScore.getComponent(Label).string = this.bestScore;
    }

    StateInit() {
        this.score = 0;
        this.userInt.gameOver.setPosition(view.getVisibleSize().width*2, view.getVisibleSize().height*2);
        this.userInt.btnRetry.node.setPosition(view.getVisibleSize().width*2, view.getVisibleSize().height*2);

        let minRightWWS = (view.getVisibleSize().width)/(this.activeWall.leftWall.width*10);
        let maxRightWWS = (view.getVisibleSize().width)/(this.activeWall.leftWall.width*4);

        let wallAdoptivWidthScale = (view.getVisibleSize().width)/(this.activeWall.leftWall.width*3.5);
        let wallAdoptivHeightScale = (view.getVisibleSize().height)/(this.activeWall.leftWall.height*5);

        let playerAdoptivWidthScale = (view.getVisibleSize().width)/(this.player.node.width*13);
        let playerAdoptivHeightScale = (view.getVisibleSize().height)/(this.player.node.height*13);

        this.activeWall.rightWall.setScale(math.randomRange(minRightWWS, maxRightWWS),wallAdoptivHeightScale,0);
        this.activeWall.rightWall.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);

        this.activeWall.leftWall.setScale(wallAdoptivWidthScale,wallAdoptivHeightScale,0);
        this.activeWall.leftWall.setPosition(0,-(view.getVisibleSize().height/2+(this.activeWall.leftWall.height*wallAdoptivHeightScale*(1/6))));

        this.userInt.score.getComponent(Label).string = this.score;
        this.userInt.score.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.85);     
        this.userInt.bestScore.getComponent(Label).string = this.bestScore;
        this.userInt.bestScore.setPosition(view.getVisibleSize().width*(3/4), view.getVisibleSize().height*0.9);   

        this.player.node.setScale(playerAdoptivWidthScale, playerAdoptivHeightScale);

        let playerInitPosY = this.activeWall.leftWall.getPosition().y+this.activeWall.leftWall.width*this.activeWall.leftWall.getScale().y;
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
        let rightWallCenter = this.activeWall.rightWall.getPosition.x;
        let rightWallCenterLCorner = this.activeWall.rightWall.getPosition().x- this.activeWall.rightWall.width*this.activeWall.rightWall.getScale().x/2;
        let rightWallCenterRCorner = this.activeWall.rightWall.getPosition().x+ this.activeWall.rightWall.width*this.activeWall.rightWall.getScale().x/2;
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
            this.isOver = true;
            this.stateLose();
        }
        if(this.isPressed == true){
            let bridgeScale = this.bridgeInst.getScale();
            this.bridgeInst.setScale(bridgeScale.x, bridgeScale.y+0.01);
        }
        if(!this.isRotated){
            this.bridgeInst.angle -= 5;
            this.angleCount -= 5;
            if(this.angleCount <= -90){
                this.isRotated = true;
                this.angleCount = 0;
            }
        }
        if(this.leftWallToPlayPos){
            let rigidBody = this.activeWall.leftWall.getComponent(RigidBody2D);
            let positionX = -(view.getVisibleSize().width/2 - (this.activeWall.leftWall.width*this.activeWall.leftWall.getScale().x)/2);
            let positionY = -(view.getVisibleSize().height/2 - (this.activeWall.leftWall.height*this.activeWall.leftWall.getScale().y)/2);
            if(this.activeWall.leftWall.getPosition().x >= positionX ||  this.activeWall.leftWall.getPosition().y <= positionY){
                if(this.activeWall.leftWall.getPosition().x > positionX){
                    rigidBody.linearVelocity = new Vec2(-35, rigidBody.linearVelocity.y);     
                }else{
                    rigidBody.linearVelocity = new Vec2(0, rigidBody.linearVelocity.y); 
                }
                if(this.activeWall.leftWall.getPosition().y < positionY){
                    rigidBody.linearVelocity = new Vec2(rigidBody.linearVelocity.x,35);
                }else{
                    rigidBody.linearVelocity = new Vec2(rigidBody.linearVelocity.x,0);
                }
            }
            else{
                this.leftWallToPlayPos = false;
                this.playerToPlayPos = true;
                rigidBody.linearVelocity = new Vec2(0, 0); 
            }  
        }

        if(this.playerToPlayPos){
            let positionX = (this.activeWall.leftWall.getPosition().x + this.activeWall.leftWall.width*this.activeWall.leftWall.getScale().x/2-this.player.node.width*this.player.node.scale.x);
            let rigidBody = this.player.node.getComponent(RigidBody2D);
            if(this.player.node.getPosition().x < positionX ){
                rigidBody.linearVelocity = new Vec2(21, 0);     
            }
            else{
                this.playerToPlayPos = false;
                rigidBody.linearVelocity = new Vec2(0, 0); 
            } 
        }

        if(this.playerToRightBridgeCorner){
            let positionX = 0;
            let bridgeRightCorner = this.bridgeInst.getPosition().x+this.bridgeInst.height/2*this.bridgeInst.getScale().y;
            if(this.badBridge){
                positionX = bridgeRightCorner+this.player.node.width*this.player.node.scale.x;
            }else{
                positionX = (this.activeWall.rightWall.getPosition().x + this.activeWall.rightWall.width*this.activeWall.rightWall.getScale().x/2-this.player.node.width*this.player.node.scale.x);
            }
            
            let rigidBody = this.player.node.getComponent(RigidBody2D);
            if(this.player.node.getPosition().x <= positionX ){
                rigidBody.linearVelocity = new Vec2(21, 0);     
            }
            else{
                this.playerToRightBridgeCorner = false;
                rigidBody.linearVelocity = new Vec2(0, 0);
                this.playerOnRightWall = true; 
                /*if(this.badBridge){
                    this.isRotated = false;
                }*/
            } 
        }

        if(this.playerOnRightWall){
            let bufNode : Node;
            bufNode = this.activeWall.leftWall;
            this.activeWall.leftWall = this.activeWall.rightWall;
            this.activeWall.rightWall = bufNode;
            this.playerOnRightWall = false;
            this.stateStart();
            this.bridgeInst.angle = 0;
            this.bridgeInst.setScale(0,0);
        }

        if(this.rightWallToPlayPos){
            let rigidBody = this.activeWall.rightWall.getComponent(RigidBody2D);
            let leftBorder = -(view.getVisibleSize().width/2 - (this.activeWall.rightWall.width*this.activeWall.rightWall.getScale().x)/2 - (this.activeWall.leftWall.width*this.activeWall.leftWall.getScale().x) - this.player.node.width/2*this.player.node.scale.x);
            let rightBorder = view.getVisibleSize().width/2 - this.activeWall.rightWall.width*this.activeWall.rightWall.getScale().x/2;
            let positionX = math.randomRange(leftBorder, rightBorder);
            let positionY = -(view.getVisibleSize().height/2 - (this.activeWall.rightWall.height*this.activeWall.rightWall.getScale().y)/2);
            if(this.activeWall.rightWall.getPosition().x >= positionX ||  this.activeWall.rightWall.getPosition().y <= positionY){
                if(this.activeWall.rightWall.getPosition().x > positionX){
                    rigidBody.linearVelocity = new Vec2(-35, rigidBody.linearVelocity.y); 
                }else{
                    rigidBody.linearVelocity = new Vec2(0, rigidBody.linearVelocity.y); 
                }
                if(this.activeWall.rightWall.getPosition().y < positionY){
                    rigidBody.linearVelocity = new Vec2(rigidBody.linearVelocity.x,35);
                }else{
                    rigidBody.linearVelocity = new Vec2(rigidBody.linearVelocity.x,0);
                }
            }
            else{
                this.rightWallToPlayPos = false;
                rigidBody.linearVelocity = new Vec2(0, 0); 
            }  
        }
    }

}


