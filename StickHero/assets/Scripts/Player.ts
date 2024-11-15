import { _decorator, Component, Node, screen } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    initPos() {
       this.node.setPosition(0, 0);
   }

   startPlayPose() {
       this.node.setPosition(-290, 0);
   }
}


