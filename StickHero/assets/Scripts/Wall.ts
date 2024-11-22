import { _decorator, Component, Node, screen, view, BoxCollider2D, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Wall')
export class Wall extends Component {

    public leftWallToPlayPos = false;

    stateInitR(){
        let minRightWWS = (view.getVisibleSize().width)/(this.node.width*10);
        let maxRightWWS = (view.getVisibleSize().width)/(this.node.width*4);
        let wallAdoptivWidthScale = (view.getVisibleSize().width)/(this.node.width*3.5);
        let wallAdoptivHeightScale = (view.getVisibleSize().height)/(this.node.height*5);

        this.getComponent(BoxCollider2D).enabled = true;
        this.node.setScale(math.randomRange(minRightWWS, maxRightWWS),wallAdoptivHeightScale);
        this.node.setPosition(view.getVisibleSize().width,-view.getVisibleSize().height);
    }

    stateInitL(){
        let wallAdoptivWidthScale = (view.getVisibleSize().width)/(this.node.width*3.5);
        let wallAdoptivHeightScale = (view.getVisibleSize().height)/(this.node.height*5);
        this.getComponent(BoxCollider2D).enabled = true;
        this.node.setScale(wallAdoptivWidthScale,wallAdoptivHeightScale);
        this.node.setPosition(0,-(view.getVisibleSize().height/2+(this.node.height*wallAdoptivHeightScale*(1/6))));
    }

    leftWallToPlayPos(){
        this.leftWallToPlayPos = true;
    }

    update (deltaTime: number){
        if(this.leftWallToPlayPos){
            let rigidBody = this.getComponent(RigidBody2D);
            let positionX = -(view.getVisibleSize().width/2 - (this.node.width*this.node.getScale().x)/2);
            let positionY = -(view.getVisibleSize().height/2 - (this.node.height*this.leftWall.node.getScale().y)/2);
            if(this.node.getPosition().x >= positionX ||  this.node.getPosition().y <= positionY){
                if(this.node.getPosition().x > positionX){
                    rigidBody.linearVelocity = new Vec2(-35, rigidBody.linearVelocity.y);     
                }else{
                    rigidBody.linearVelocity = new Vec2(0, rigidBody.linearVelocity.y); 
                }
                if(this.node.getPosition().y < positionY){
                    rigidBody.linearVelocity = new Vec2(rigidBody.linearVelocity.x,35);
                }else{
                    rigidBody.linearVelocity = new Vec2(rigidBody.linearVelocity.x,0);
                }
            }
            else{
                this.leftWallToPlayPos = false;
                Global.playerToPlayPos = true;
                rigidBody.linearVelocity = new Vec2(0, 0); 
            }  
        }
    }
    
}
