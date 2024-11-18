import { _decorator, Component, Node, director, instantiate, Sprite, resources, Prefab, input, Input, UITransform, math, Vec2, RigidBody2D, view } from 'cc';

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
    public wallToPlayPos = false;

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
        console.log(view.getCanvasSize())
        this.StateInit();
        this.userInt.btnStart.node.on('click', () => {
            this.wallToPlayPos = true;
            this.isOver = false;
            //this.player.startPlayPose();
            this.userInt.startPlayPose();  
        })
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }


    StateInit() {
        this.initWallInst = cc.instantiate(this.wallPref);
        this.initWallInst.parent = this.node.parent;
        let wallWAdoptivWidthScale = (view.getCanvasSize().width)/(this.initWallInst.width*3);
        let wallWAdoptivHeightScale = (view.getCanvasSize().height)/(this.initWallInst.height*5);
        this.initWallInst.setScale(wallWAdoptivWidthScale,wallWAdoptivHeightScale,0);
        this.initWallInst.setPosition(0,-view.getCanvasSize().height/2-this.initWallInst.height*wallWAdoptivHeightScale/2);
        console.log(this.initWallInst.getPosition(), view.getCanvasSize())
        this.player.initPos();;
        this.userInt.initPos();
    }

    onTouchStart(event: EventTouch) {
        if(!this.isOver){
            this.isPressed = true;
            this.bridgeInst = cc.instantiate(this.wallPref);
            this.bridgeInst.parent = this.node.parent;
            this.bridgeInst.setScale(0.01, 0, 1);
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
            if(this.bridgeInst.angle <= -90){
                this.isRotated = true;
            }
        }
        if(this.wallToPlayPos){
            let rigidBody = this.initWallInst.getComponent(RigidBody2D);
            console.log(this.initWallInst.getPosition()+ " h = "+ this.initWallInst.height*this.initWallInst.getScale().y+ ' H/2='+view.getCanvasSize().height/2+ ' summ ='+(-view.getCanvasSize().height/2 + (this.initWallInst.height*this.initWallInst.getScale().y)));
            let positionX = -view.getCanvasSize().width/2 + (this.initWallInst.width*this.initWallInst.getScale().x)/2 ;
            let positionY = -view.getCanvasSize().height/2 + (this.initWallInst.height*this.initWallInst.getScale().y)/2;
            if(this.initWallInst.getPosition().x >= positionX ||  this.initWallInst.getPosition().y <= positionY){
                if(this.initWallInst.getPosition().x >= positionX){
                    rigidBody.linearVelocity = new Vec2(-1, rigidBody.linearVelocity.y);     
                }else{
                    rigidBody.linearVelocity = new Vec2(0, rigidBody.linearVelocity.y); 
                }
                if(this.initWallInst.getPosition().y <= positionY){
                    rigidBody.linearVelocity = new Vec2(rigidBody.linearVelocity.x,1);
                }else{
                    rigidBody.linearVelocity = new Vec2(rigidBody.linearVelocity.x,0);
                }
            }
            else{
                this.wallToPlayPos = false;
                rigidBody.linearVelocity = new Vec2(0, 0); 
            }
            
        }
    }

}


