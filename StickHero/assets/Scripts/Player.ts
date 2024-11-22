import { _decorator, Component, Node, screen, Vec2, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    initPos() {
       this.node.setPosition(0, 0);
   }

   startPlayPose() {
       this.node.setPosition(-230, 0);
   }

   update (deltaTime: number){
        if(Global.playerToPlayPos){
            let positionX = (Global.activeWall.leftWall.node.getPosition().x + Global.activeWall.leftWall.node.width*Global.activeWall.leftWall.node.getScale().x/2-this.node.width*this.node.scale.x);
            let rigidBody = this.node.getComponent(RigidBody2D);
            if(this.node.getPosition().x < positionX ){
                rigidBody.linearVelocity = new Vec2(21, 0);     
            }
            else{
                Global.playerToPlayPos = false;
                rigidBody.linearVelocity = new Vec2(0, 0); 
            } 
        }
    }
}


