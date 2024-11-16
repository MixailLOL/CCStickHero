import { _decorator, Component, Node, screen } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Wall')
export class Wall extends Component {
    initPos() {
       this.node.setPosition(0, -400);
       this.node.setScale(0.1,0.1,1);
   }

   startPlayPose() {
       this.node.setPosition(-300, -400);
   }
}
