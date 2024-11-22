import { _decorator, Component, Node, screen, view, BoxCollider2D, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Wall')
export class Wall extends Component {
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
    
}
