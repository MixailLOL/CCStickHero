import { _decorator, Component, Node, screen, Vec2, RigidBody2D, BoxCollider2D, view} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    stateInitF() {
        //initial player parameters 
        let adoptivWidthScale = (view.getVisibleSize().width)/(this.node.width*13);
        let adoptivHeightScale = (view.getVisibleSize().height)/(this.node.height*13);
        this.node.setScale(adoptivWidthScale, adoptivHeightScale);
        let initPosY = Global.activeWall.leftWall.node.getPosition().y+Global.activeWall.leftWall.node.width*Global.activeWall.leftWall.node.getScale().y;
        this.node.setPosition(0,initPosY);
   }

   startPlayPose() {
       this.node.setPosition(-230, 0);
   }

   update (deltaTime: number){
        //move player to play position
        if(Global.playerToPlayPos){
            let positionX = (Global.activeWall.leftWall.node.getPosition().x + Global.activeWall.leftWall.node.width*Global.activeWall.leftWall.node.getScale().x/2-this.node.width*this.node.scale.x);
            let rigidBody = this.node.getComponent(RigidBody2D);
            if(this.node.getPosition().x < positionX ){
                rigidBody.linearVelocity = new Vec2(21, 0);     
            }
            else{
                Global.playerToPlayPos = false;
                Global.statePlay = true;
                rigidBody.linearVelocity = new Vec2(0, 0); 
            } 
        }

        //move player to right bridge corner
        if(Global.playerToRightBridgeCorner){
            let positionX = 0;
            let bridgeRightCorner = Global.bridgeInst.getPosition().x+Global.bridgeInst.height/2*Global.bridgeInst.getScale().y;
            if(Global.badBridge){
                positionX = bridgeRightCorner-this.node.width*this.node.scale.x/2;
            }else{
                positionX = (Global.activeWall.rightWall.node.getPosition().x + Global.activeWall.rightWall.node.width*Global.activeWall.rightWall.node.getScale().x/2-this.node.width*this.node.scale.x);
            }
            
            let rigidBody = this.node.getComponent(RigidBody2D);
            if(this.node.getPosition().x <= positionX ){
                rigidBody.linearVelocity = new Vec2(27, 0);     
            }
            else{
                Global.playerToRightBridgeCorner = false;
                rigidBody.linearVelocity = new Vec2(0, 0);
                Global.bridgeInst.setScale(0,0);
                Global.bridgeInst.angle = 0;
                if(!Global.badBridge){
                    Global.playerOnRightWall = true;
                }else{
                    Global.activeWall.leftWall.getComponent(BoxCollider2D).enabled = false;
                    Global.activeWall.rightWall.getComponent(BoxCollider2D).enabled = false;
                }
            } 
        }
    }
}


